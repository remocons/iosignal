# Repository workflow

- This is the public distribution repository. Develop product code in `../_iosignal`.
- Never copy private entry points, package metadata, dependencies, docs or built bundles here.
- Run promotion commands only in `../_iosignal`: `npm run public:check` then `npm run public:apply`. Promotion implementation lives there; this repository owns public build and release verification.
- `scripts/public-files.json` is an exact file allowlist. New files and deletions require an explicit public-scope review and a separate allowlist change. Never replace it with directory globs.
- Keep public `index.js`, package metadata/lockfile and build configuration separate. Review public API/dependency/version changes explicitly.
- Run `npm run verify` before release. Review the complete Git diff, including comments and fixtures, for confidential content; automated patterns cannot establish that arbitrary code is safe to publish.
- Do not merge private Git history into this repository. Do not push or publish unless explicitly requested.
