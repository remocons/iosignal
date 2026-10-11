# 소스 빌드 및 검증

[README](https://github.com/remocons/iosignal/blob/main/README.ko.md) | [English](https://github.com/remocons/iosignal/blob/main/docs/development.md) | [한국어](https://github.com/remocons/iosignal/blob/main/docs/development.ko.md)

이 저장소의 개발·검증 환경은 Node.js 22와 npm 10을 사용합니다.

```bash
npm ci
npm run verify
```

`verify`는 공개 파일 정책을 검사하고, `dist`를 삭제한 뒤 번들과 타입 선언을
재생성합니다. 이어서 자동 테스트와 npm 패키지 포함 파일 검사를 수행합니다.

빌드만 실행하려면 `npm run build`, 이미 빌드된 결과의 자동 테스트만 실행하려면
`npm test`를 사용합니다.

## 통신 자동 테스트

```bash
npm run build
npm run test:integration
```

`test/integration/`은 공개 ESM·CommonJS 빌드 각각에 대해 실제 WebSocket 통신을 검사합니다.
로컬 루프백(`127.0.0.1`)의 임시 포트를 사용하므로 외부 서버, Redis, 실제 인증키가 필요하지 않습니다.

- 연결과 RPC 응답, 없는 명령 및 권한 거부
- 두 클라이언트 간 문자열·객체·바이너리 발행/구독과 구독 해제
- 인증 성공 및 암호화된 RPC 응답, 잘못된 인증 거부
- 연결 종료 후 클라이언트 재사용과 서버 자원 정리

`npm test`와 `npm run verify`에도 통신 검사가 포함됩니다. 테스트별 시간 제한과
전체 테스트 파일 시간 제한을 두며, 종료 시 서버와 클라이언트를 정리합니다.
실제 브라우저, TLS, TCP 전송 및 Redis 연동 검증은 이 통신 테스트 범위에 포함되지 않습니다.

기존 `test/attach-services/`, `test/auth_server_client/`, `test/pubsub-counter/`,
`test/subscribe-signal/`은 수동 예제입니다. 자동 실행하지 않으며, 일부는 별도 서버나 Redis가 필요합니다.
