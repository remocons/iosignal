# AGENTS.md

## Project

IOSignal JavaScript library: Node.js server/client, browser client, and the
package entry points consumed by the documentation site and examples.

- Version: see `package.json`.
- Interactive CLI examples in the README require Node.js 22.16.0 or later.
- Node.js entry: `import { IO, Server } from 'iosignal'`
- Browser entry: `import IO from 'iosignal/io'` (bundler) or `dist/browser/iife/io.js` (CDN)
- AI documentation: https://iosignal.net/docs/ai
- AI quick reference: https://iosignal.net/docs/ai/quick-reference
- English AI guide: https://iosignal.net/en/docs/ai

Do not copy the full guides into this repository. Keep API behavior, defaults,
and tests here; link to the documentation site for explanations and examples.

## Repository boundaries

- This is the public distribution repository. Maintainers develop shared product
  source and tests in the separate private development repository.
- Maintain this `AGENTS.md` independently in the public repository. Never copy
  the private repository's agent instructions or internal work records here.
- Public entry points, package metadata, dependencies, lockfile, README files,
  build configuration and release versions are maintained separately here.
- `scripts/public-files.json` lists exact source/test and artifact paths.
  `scripts/public-policy.mjs` lists public control files, including this document.
  Review public scope explicitly before adding or deleting an allowed path;
  never replace exact paths with directory globs.
- Never copy private services, credentials, internal documentation, dependencies,
  entry points, package files, built bundles or Git history into this repository.

## Maintainer workflow

1. Change and test shared source in the private development repository.
2. Run `npm run public:check` there to build and verify the approved public subset
   in isolation, using this repository's public controls and dependencies.
3. Review and commit private changes and public configuration changes; ensure
   both working trees are clean before running `npm run public:apply` there.
4. Review the complete resulting public diff, including comments and fixtures,
   for confidential content, then run `npm run verify` here. Automated checks
   cannot establish that arbitrary content is safe to publish.
5. Do not push, tag or publish without an explicit user request.

For a public-only documentation or policy change, edit the public files here
and run the applicable checks; source promotion is not needed. Promotion commands
exist only in the private development repository.

## Commands

- Install: `npm ci`
- Test: `npm test`
- Integration tests: `npm run test:integration`
- Verify: `npm run verify`
- Build: `npm run build`

## Rules

- Do not describe quota values as universal defaults. The server operator
  configures quota; clients read `io.quota` after `ready`.
- Keep `dist/` artifacts in sync with source when a release requires it.
- When public behavior changes, update this repository's tests and the
  documentation site together through their respective development workflows.
