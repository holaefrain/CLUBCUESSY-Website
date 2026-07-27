# Known bugs / workarounds — rebuild

## shadcn CLI writes generated files to a literal `@/` folder instead of resolving the alias

**Where:** `apps/web`, discovered during Phase 1 shadcn init.

**Versions:** `shadcn@4.15.0`, `typescript@~6.0.2` (no `baseUrl` in `tsconfig.app.json`, only `paths: { "@/*": ["./src/*"] }` — `baseUrl` is deprecated in TS 6 and slated for removal in TS 7, so it was left out).

**What happens:** `pnpm dlx shadcn@latest init` (and presumably `shadcn add`) reported creating `@/components/ui/button.tsx` and `@/lib/utils.ts`, but it actually wrote them to a literal directory named `@` at the project root (`apps/web/@/lib/utils.ts`, `apps/web/@/components/ui/button.tsx`) instead of resolving `@/*` to `./src/*` and writing to `apps/web/src/...`.

**Root cause (likely):** shadcn's CLI appears to resolve the `@/*` alias assuming `baseUrl` is present in `tsconfig.app.json`. Without it, its own resolution falls back to treating the alias as a literal path segment rather than using TypeScript's default-to-tsconfig-directory behavior for `paths` without `baseUrl`.

**Confirmed NOT broken:** actual module resolution (both `tsc -b` and `vite build`) resolves `@/*` → `src/*` correctly with no `baseUrl` set — only the shadcn CLI's file-placement step is affected.

**Workaround:** after running any `shadcn init` or `shadcn add <component>`, check whether it created a literal `@/` directory at the project root. If so, manually move the contents into the correct `src/...` path and delete the stray `@` folder before committing.

**Possible real fix to try later:** add `baseUrl: "."` back to `tsconfig.app.json` (with `"ignoreDeprecations": "6.0"` to silence the TS deprecation warning) if this keeps recurring on every `shadcn add`, trading the deprecation warning for CLI compatibility. Not done yet since it only needs a manual fixup once per `add` command so far.
