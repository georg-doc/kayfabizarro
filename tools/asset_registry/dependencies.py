"""AR2 model dependency resolver.

Parses explicit references only. No rendering, mesh semantics, or filename-based donor guesses.
"""
from __future__ import annotations

import json
import posixpath
import shlex
import struct
from collections import defaultdict
from pathlib import Path, PurePosixPath
from urllib.parse import unquote, urlparse

SUPPORTED_PARSE = {"gltf", "glb", "obj"}
UNRESOLVED_FORMATS = {"fbx", "blend", "dae", "3ds"}
MTL_MAP_DIRECTIVES = {
    "map_ka": "ambient",
    "map_kd": "baseColor",
    "map_ks": "specular",
    "map_ke": "emissive",
    "map_d": "opacity",
    "bump": "normal",
    "map_bump": "normal",
    "norm": "normal",
    "disp": "displacement",
    "decal": "decal",
    "map_pr": "roughness",
    "map_pm": "metallic",
}


def read_glb_json(data: bytes) -> dict:
    if len(data) < 20 or data[:4] != b"glTF":
        raise ValueError("invalid GLB header")
    version, total_length = struct.unpack_from("<II", data, 4)
    if version != 2:
        raise ValueError(f"unsupported GLB version {version}")
    if total_length > len(data):
        raise ValueError("truncated GLB")
    offset = 12
    while offset + 8 <= total_length:
        chunk_len, chunk_type = struct.unpack_from("<II", data, offset)
        offset += 8
        chunk = data[offset:offset + chunk_len]
        offset += chunk_len
        if chunk_type == 0x4E4F534A:
            return json.loads(chunk.decode("utf-8").rstrip(" \t\r\n\x00"))
    raise ValueError("GLB JSON chunk not found")


def _uri_kind(uri: str) -> str:
    if uri.startswith("data:"):
        return "embedded"
    parsed = urlparse(uri)
    if parsed.scheme or uri.startswith("//"):
        return "remote"
    return "relative"


def _gltf_refs(doc: dict, *, is_glb: bool) -> tuple[list[dict], bool]:
    refs: list[dict] = []
    embedded = False
    for i, buf in enumerate(doc.get("buffers", [])):
        uri = buf.get("uri")
        if uri is None:
            if is_glb:
                embedded = True
            continue
        kind = _uri_kind(uri)
        if kind == "embedded":
            embedded = True
        elif kind == "remote":
            refs.append({"role": "buffer", "uri": uri, "reference": f"buffers[{i}].uri", "remote": True})
        else:
            refs.append({"role": "buffer", "uri": uri, "reference": f"buffers[{i}].uri"})
    for i, image in enumerate(doc.get("images", [])):
        uri = image.get("uri")
        if uri is None:
            if "bufferView" in image:
                embedded = True
            continue
        kind = _uri_kind(uri)
        if kind == "embedded":
            embedded = True
        elif kind == "remote":
            refs.append({"role": "image", "uri": uri, "reference": f"images[{i}].uri", "remote": True})
        else:
            refs.append({"role": "image", "uri": uri, "reference": f"images[{i}].uri"})
    return refs, embedded


def _obj_mtllibs(text: str) -> list[str]:
    out: list[str] = []
    for line in text.splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("#"):
            continue
        parts = stripped.split(None, 1)
        if len(parts) == 2 and parts[0].casefold() == "mtllib":
            try:
                libs = shlex.split(parts[1])
            except ValueError:
                libs = [parts[1].strip()]
            out.extend(libs)
    return out


def _mtl_texture_refs(text: str) -> list[dict]:
    refs: list[dict] = []
    for line_no, line in enumerate(text.splitlines(), 1):
        stripped = line.strip()
        if not stripped or stripped.startswith("#"):
            continue
        parts = stripped.split(None, 1)
        if len(parts) != 2:
            continue
        directive = parts[0].casefold()
        role = MTL_MAP_DIRECTIVES.get(directive)
        if not role:
            continue
        rest = parts[1].strip()
        try:
            tokens = shlex.split(rest)
        except ValueError:
            tokens = [rest]
        if not tokens:
            continue
        uri = tokens[-1]
        refs.append({"role": role, "uri": uri, "reference": f"mtl:{line_no}:{parts[0]}"})
    return refs


def _normalize_repo_path(parent: str, uri: str) -> str | None:
    decoded = unquote(uri).replace("\\", "/")
    if decoded.startswith("/"):
        return None
    resolved = posixpath.normpath(posixpath.join(parent, decoded))
    if resolved == ".." or resolved.startswith("../"):
        return None
    return resolved


def _inside_pack(path: str, pack_root: str) -> bool:
    return path == pack_root or path.startswith(pack_root.rstrip("/") + "/")


def _problem(problem_type: str, asset_path: str, *, target: str | None = None, detail: str | None = None) -> dict:
    suffix = target or detail or ""
    return {
        "problemId": f"{problem_type}:{asset_path}:{suffix}",
        "type": problem_type,
        "assetPath": asset_path,
        **({"target": target} if target is not None else {}),
        **({"detail": detail} if detail is not None else {}),
    }


def _resolve_ref(
    *,
    asset_path: str,
    pack_root: str,
    model_parent: str,
    ref: dict,
    tracked_paths: set[str],
    case_map: dict[str, list[str]],
) -> tuple[dict, list[dict]]:
    problems: list[dict] = []
    uri = ref["uri"]
    dep = {
        "role": ref["role"],
        "uri": uri,
        "reference": ref.get("reference"),
        "provenance": "file-explicit",
    }
    if ref.get("remote"):
        dep.update({"status": "remote", "exists": None})
        problems.append(_problem("REMOTE_REFERENCE_UNVERIFIED", asset_path, target=uri))
        return dep, problems

    resolved = _normalize_repo_path(model_parent, uri)
    if resolved is None:
        dep.update({"status": "outside-repo", "exists": False})
        problems.append(_problem("OUTSIDE_REPO_REFERENCE", asset_path, target=uri))
        return dep, problems

    dep["path"] = resolved
    if resolved in tracked_paths:
        dep.update({"status": "ok", "exists": True})
    else:
        matches = case_map.get(resolved.casefold(), [])
        if len(matches) == 1:
            actual = matches[0]
            dep.update({"status": "case-mismatch", "exists": True, "resolvedPath": actual})
            problems.append(_problem("CASE_MISMATCH", asset_path, target=f"{resolved} -> {actual}"))
            resolved = actual
        else:
            dep.update({"status": "missing", "exists": False})
            problems.append(_problem("MISSING_REFERENCED_FILE", asset_path, target=resolved))
            return dep, problems

    if not _inside_pack(resolved, pack_root):
        problems.append(_problem("OUTSIDE_PACK_REFERENCE", asset_path, target=resolved))
    return dep, problems


def _load_override(asset_path: str, overrides: dict) -> dict | None:
    value = overrides.get("assets", {}).get(asset_path)
    if value is None:
        return None
    if isinstance(value, list):
        return {"mode": "replace", "dependencies": value}
    return value


def resolve_model_dependencies(
    repo_root: Path,
    record: dict,
    *,
    tracked_paths: set[str],
    case_map: dict[str, list[str]],
    overrides: dict | None = None,
) -> tuple[dict, list[dict]]:
    rec = dict(record)
    rec["relations"] = dict(record.get("relations", {}))
    asset_path = rec["path"]
    fmt = rec["format"]
    pack_root = rec["packRoot"]
    problems: list[dict] = []
    deps: list[dict] = []
    embedded = False
    override = _load_override(asset_path, overrides or {})

    if override and override.get("mode", "replace") == "replace":
        raw_refs = [dict(item, reference=item.get("reference", "override")) for item in override.get("dependencies", [])]
        for ref in raw_refs:
            uri = ref.get("uri") or ref.get("path")
            if not uri:
                continue
            ref["uri"] = uri
            dep, ps = _resolve_ref(
                asset_path=asset_path,
                pack_root=pack_root,
                model_parent=str(PurePosixPath(asset_path).parent),
                ref=ref,
                tracked_paths=tracked_paths,
                case_map=case_map,
            )
            dep["provenance"] = "reviewed-override"
            deps.append(dep)
            problems.extend(ps)
    elif fmt in UNRESOLVED_FORMATS:
        rec["dependencyStatus"] = "unresolved"
        rec["relations"]["dependencies"] = []
        ptype = "UNRESOLVED_FBX_DEPENDENCY" if fmt == "fbx" else "UNRESOLVED_MODEL_DEPENDENCY"
        problems.append(_problem(ptype, asset_path, detail=f"dependency parsing not implemented for .{fmt}"))
        return rec, problems
    elif fmt in {"gltf", "glb"}:
        try:
            full = repo_root / asset_path
            if fmt == "gltf":
                doc = json.loads(full.read_text(encoding="utf-8-sig"))
                refs, embedded = _gltf_refs(doc, is_glb=False)
            else:
                doc = read_glb_json(full.read_bytes())
                refs, embedded = _gltf_refs(doc, is_glb=True)
            for ref in refs:
                dep, ps = _resolve_ref(
                    asset_path=asset_path,
                    pack_root=pack_root,
                    model_parent=str(PurePosixPath(asset_path).parent),
                    ref=ref,
                    tracked_paths=tracked_paths,
                    case_map=case_map,
                )
                deps.append(dep)
                problems.extend(ps)
        except Exception as exc:
            rec["dependencyStatus"] = "unresolved"
            rec["relations"]["dependencies"] = []
            problems.append(_problem("DEPENDENCY_PARSE_ERROR", asset_path, detail=f"{type(exc).__name__}: {exc}"))
            return rec, problems
    elif fmt == "obj":
        try:
            full = repo_root / asset_path
            obj_text = full.read_text(encoding="utf-8", errors="replace")
            parent = str(PurePosixPath(asset_path).parent)
            for lib in _obj_mtllibs(obj_text):
                mtl_ref = {"role": "material", "uri": lib, "reference": "obj:mtllib"}
                dep, ps = _resolve_ref(
                    asset_path=asset_path,
                    pack_root=pack_root,
                    model_parent=parent,
                    ref=mtl_ref,
                    tracked_paths=tracked_paths,
                    case_map=case_map,
                )
                deps.append(dep)
                problems.extend(ps)
                mtl_path = dep.get("resolvedPath") or dep.get("path")
                if dep.get("exists") and mtl_path:
                    mtl_full = repo_root / mtl_path
                    for tex_ref in _mtl_texture_refs(mtl_full.read_text(encoding="utf-8", errors="replace")):
                        tdep, tps = _resolve_ref(
                            asset_path=asset_path,
                            pack_root=pack_root,
                            model_parent=str(PurePosixPath(mtl_path).parent),
                            ref=tex_ref,
                            tracked_paths=tracked_paths,
                            case_map=case_map,
                        )
                        tdep["via"] = mtl_path
                        deps.append(tdep)
                        problems.extend(tps)
        except Exception as exc:
            rec["dependencyStatus"] = "unresolved"
            rec["relations"]["dependencies"] = []
            problems.append(_problem("DEPENDENCY_PARSE_ERROR", asset_path, detail=f"{type(exc).__name__}: {exc}"))
            return rec, problems
    else:
        rec["dependencyStatus"] = "unresolved"
        rec["relations"]["dependencies"] = []
        problems.append(_problem("UNRESOLVED_MODEL_DEPENDENCY", asset_path, detail=f"unsupported model format .{fmt}"))
        return rec, problems

    deps.sort(key=lambda d: (d.get("path", d.get("uri", "")), d.get("role", ""), d.get("reference") or ""))
    rec["relations"]["dependencies"] = deps
    if any(dep.get("exists") is False for dep in deps if dep.get("status") != "remote"):
        status = "missing"
    elif any(dep.get("status") == "remote" for dep in deps):
        status = "unresolved"
    elif deps:
        status = "complete"
    elif embedded:
        status = "embedded"
    else:
        status = "complete"
    rec["dependencyStatus"] = status
    return rec, problems


def resolve_all_models(
    repo_root: Path,
    records: list[dict],
    *,
    tracked_paths: set[str],
    overrides: dict | None = None,
) -> tuple[list[dict], list[dict]]:
    case_map: dict[str, list[str]] = defaultdict(list)
    for path in sorted(tracked_paths):
        case_map[path.casefold()].append(path)

    enriched: list[dict] = []
    problems: list[dict] = []
    for rec in records:
        if rec["kind"] == "model-3d":
            out, ps = resolve_model_dependencies(
                repo_root,
                rec,
                tracked_paths=tracked_paths,
                case_map=case_map,
                overrides=overrides,
            )
            enriched.append(out)
            problems.extend(ps)
        else:
            enriched.append(rec)
    problems.sort(key=lambda p: (p["type"], p["assetPath"], p.get("target", ""), p.get("detail", "")))
    return enriched, problems


def duplicate_name_problems(records: list[dict]) -> list[dict]:
    groups: dict[tuple[str, str, str, str, str], list[str]] = defaultdict(list)
    for rec in records:
        key = (rec.get("packId", ""), rec.get("collectionPath", ""), rec["kind"], rec["format"], rec["name"].casefold())
        groups[key].append(rec["path"])
    problems: list[dict] = []
    for (pack_id, collection, kind, fmt, name), paths in sorted(groups.items()):
        if len(paths) < 2:
            continue
        problems.append({
            "problemId": f"DUPLICATE_NAME:{pack_id}:{collection}:{kind}:{fmt}:{name}",
            "type": "DUPLICATE_NAME",
            "packId": pack_id,
            "collectionPath": collection or None,
            "kind": kind,
            "format": fmt,
            "name": name,
            "paths": sorted(paths),
        })
    return problems
