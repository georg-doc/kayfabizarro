import handler from "vinext/server/fetch-handler";
import { runWithConnectorBinding } from "../lib/connector-context";
import type { ConnectorBinding } from "../lib/connector-contract.mjs";
import { protectedFetch, mime, assetRange } from "../lib/mvp-delivery.mjs";
import gamePackage from "../lib/game-package.json";
import { canonicalEntry, fetchPackageAsset } from "../lib/game-entry-routing.mjs";

const packagePaths = new Set(gamePackage.files.map(file => '/' + file.path));
const packageSizes = new Map(gamePackage.files.map(file => ['/' + file.path, file.bytes]));
// Original GLB references this texture by its unhashed basename. Serve the
// exact delivered texture, without rewriting the verified model or bundle.
const aliases = new Map([['/assets/actionfigure_texture.png','/assets/actionfigure_texture-DpFtTJ_3.png']]);
packagePaths.add('/SHA256SUMS.txt');

export default {
  fetch(request: Request, env: Cloudflare.Env, ctx: ExecutionContext<{ CONNECTORS?: ConnectorBinding }>) {
    let binding = ctx.props?.CONNECTORS;
    // Local preview emulates the same request-scoped capability. This branch and
    // the auxiliary service binding are absent from production builds.
    if (import.meta.env.DEV && !binding && env.CONNECTORS) {
      const preview = env.CONNECTORS;
      const expiresAt = Date.now() + 60_000;
      binding = {
        async getContext() {
          if (Date.now() >= expiresAt) return { status: "request_context_expired" };
          return preview.getContext?.() ?? { status: "binding_unavailable" };
        },
        async invoke(connectorId, actionName, args) {
          if (Date.now() >= expiresAt) {
            return { status: "request_context_expired", message: "This request has expired. Please try again." };
          }
          return preview.invoke(connectorId, actionName, args);
        },
      };
    }
    return protectedFetch(request, env, {
      immutableAsset: (path: string) => packagePaths.has(path) && path.startsWith('/assets/'),
      asset: async (req: Request) => {
        const url = new URL(req.url);
        const canonical = canonicalEntry(req);
        if(canonical)return canonical;
        if (url.pathname === '/kfb-qa-fps.js') return env.ASSETS.fetch(req);
        const path = url.pathname === '/' ? '/index.html' : (aliases.get(url.pathname) || url.pathname);
        // Resolve only the verified delivery; no old snapshot/raw importer.
        if (packagePaths.has(path)) {
          let response: Response;
          try { response = await fetchPackageAsset(req, env.ASSETS, path); }
          catch { return new Response('Package routing unavailable', {status:502}); }
          const headers = new Headers(response.headers);
          headers.set('Content-Type', mime(path));
          headers.set('X-KFB-Package-Revision', gamePackage.revision);
          const served = assetRange(req, new Response(response.body, { status: response.status, headers }), packageSizes.get(path));
          if(path === '/index.html' && url.searchParams.get('kfbqa') === '1' && served.status === 200) {
            return new HTMLRewriter().on('body', {element(el) {el.append('<script src="/kfb-qa-fps.js"></script>', {html:true});}}).transform(served);
          }
          return served;
        }
        // Internal package paths must never expose unlisted or historical files.
        if (url.pathname.startsWith('/game-package/') || url.pathname.startsWith('/assets/')) {
          return new Response('Not found', { status: 404 });
        }
        return runWithConnectorBinding(binding, () => handler.fetch(req, env, ctx));
      },
    });
  },
};
