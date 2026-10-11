# Building and verification

[README](https://github.com/remocons/iosignal/blob/main/README.md) | [English](https://github.com/remocons/iosignal/blob/main/docs/development.md) | [한국어](https://github.com/remocons/iosignal/blob/main/docs/development.ko.md)

This repository uses Node.js 22 and npm 10 for development and verification.

```bash
npm ci
npm run verify
```

`verify` checks the public-file policy, removes `dist` and rebuilds bundles and
type declarations. It then runs automated tests and checks the npm package file
list.

Use `npm run build` to build only, or `npm test` to test an existing build.

## Automated communication tests

```bash
npm run build
npm run test:integration
```

`test/integration/` tests actual WebSocket communication for both public ESM and
CommonJS builds. It uses temporary ports on local loopback (`127.0.0.1`), so it
requires no external server, Redis instance or real authentication credentials.

- Connections, RPC responses, unknown commands and permission denial
- String, object and binary publish/subscribe between two clients, including unsubscribe
- Successful authentication and encrypted RPC responses, plus rejection of invalid authentication
- Client reuse and server resource cleanup after disconnection

These communication checks are included in `npm test` and `npm run verify`.
Individual tests and test files have time limits, and connections and servers
are cleaned up on completion. Actual browsers, TLS, TCP transport and Redis
integration are outside their scope.

Existing `test/attach-services/`, `test/auth_server_client/`,
`test/pubsub-counter/` and `test/subscribe-signal/` are manual examples. They are
not run automatically, and some require a separate server or Redis.
