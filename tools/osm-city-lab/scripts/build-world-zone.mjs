#!/usr/bin/env node
import path from 'node:path';
import { compileWorldZone } from '../src/world-zone/compiler.js';

const args=process.argv.slice(2);
const cityId=args[0]||'dom-zentrum-v0';
const revision=args[1]||'2026-09-24.1';
const outAt=args.indexOf('--out-root');
const outRoot=outAt>=0?path.resolve(args[outAt+1]):null;
const result=await compileWorldZone({repoRoot:process.cwd(),cityId,revision,outRoot,sourceCommit:process.env.KFB_SOURCE_COMMIT||process.env.GITHUB_SHA||'UNPINNED'});
console.log(JSON.stringify({target:result.target,zoneId:result.manifest.id,revision:result.manifest.revision,counts:result.manifest.counts,visual:result.manifest.visual,gates:result.report.gates},null,2));
