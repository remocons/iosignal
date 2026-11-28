# boho를 이용한 인증과 암호통신

[README](https://github.com/remocons/iosignal/blob/main/README.ko.md) | [English](https://github.com/remocons/iosignal/blob/main/docs/boho.md) | [한국어](https://github.com/remocons/iosignal/blob/main/docs/boho.ko.md)

IOSignal은 공유 키 인증과 메시지 암호화에 [boho](https://github.com/remocons/boho)를 씁니다.
IOSignal 10.0.0(boho 3.0.0)부터 boho는 예전의 SHA-256 자체 구성 대신 표준 **Ascon**(NIST SP 800-232)을
씁니다. Arduino 구현은 [IOSignal Arduino](https://github.com/remocons/iosignal-arduino) 10.0.0에 들어 있고,
JavaScript 구현은 Node.js와 브라우저에서 동작하므로 직접 만든 장치와 웹앱이 같은 방식을 씁니다.
IOSignal 9.x 클라이언트는 10.0.0 서버에 로그인할 수 없으며, 9.x 서버에 등록한 키는 다시 등록해야 합니다.

## 왜 공유 키 기반의 boho인가요?

Arduino 장치와 직접 개발한 웹앱, 관리 주체가 같은 서버에서는 양쪽 코드와
최초 키 설정을 직접 관리할 수 있습니다. 제작 시 USB·직렬 연결로 장치별 키를
기록하거나, 웹앱 사용자가 별도 경로로 받은 키를 입력하거나, 서버 사이에서
기존 SSH·TLS 연결로 키를 배포할 수 있습니다.

이처럼 안전한 키 설정 경로가 이미 있다면 사전 공유 대칭키로도 인증과 암호통신을
설계할 수 있습니다. 인증기관 없이 통신할 상대를 정할 수 있으며, 이때 신뢰의
기반은 키 설정 경로와 양쪽 프로그램입니다. 장치별 키, 안전한 보관과 교체·폐기
방법은 여전히 필요합니다. 웹앱의 공개 JavaScript 번들에 공통 비밀 키를 넣는
것은 안전한 키 배포가 아닙니다.

boho는 이 환경을 위해 공유 키 인증과 바이너리 패킷을 표준 Ascon 위에 구성합니다. 특징은 새로운 암호가 아니라
**IOSignal 연결·메시지 전달과 통합된, 서로 호환되는 Arduino·JavaScript·Kotlin·Python 구현**입니다.

## Ascon 위의 boho

| 용도 | 알고리즘 |
| --- | --- |
| 메시지 암호화와 변조 검사 | Ascon-AEAD128, 태그 8바이트 |
| 키 문자열 → 16바이트 키 | Ascon-CXOF128 (`boho/v2/key`) |
| 로그인 → 세션 키와 양쪽 증명 | Ascon-CXOF128 (`boho/v2/session`) |

서버는 키 문자열이 아니라 그것으로 만든 16바이트 키(`Boho.deriveKey`)만 저장합니다. 로그인
(`SERVER_TIME_NONCE` 13B → `AUTH_REQ` 33B → `AUTH_RES` 17B)마다 새 세션 키를 만들고, 로그인한 메시지는
`ENC`(헤더 21바이트: 타입, 길이, 시계, 태그), E2E 라우팅 헤더는 `ENC_E2E`, 독립 데이터와 E2E 본문은
`ENC_PACK`(헤더 29바이트)입니다. 자세한 내용은 [프로토콜 문서](https://github.com/remocons/boho/blob/main/docs/PROTOCOL.md)를 보세요.

## TLS와 함께 이해하기

일반적인 인증서 기반 TLS는 사전에 비밀을 공유하지 않은 상대와 인증·키 합의를
수행하고 실제 데이터에는 대칭키를 사용합니다. 로그인하지 않은 웹 사용자도
서버를 인증하고 암호화 연결을 만들 수 있지만, 네트워크 익명성을 제공하는 것은
아닙니다. 임베디드 환경에서는 인증서·신뢰 루트·시각·갱신 관리와 핸드셰이크
연산 및 버퍼가 부담이 될 수 있습니다. 키 설정 경로가 이미 있는 작은 시스템은
이런 구성 중 일부를 줄일 수 있습니다.

다만 TLS도 **PSK-only와 PSK+(EC)DHE**를 지원하므로 항상 제3자 인증서나 공개키
교환이 필요한 것은 아닙니다.
[TLS 1.3의 PSK 방식](https://www.rfc-editor.org/rfc/rfc8446.html#section-2.2)
boho가 모든 환경에서 TLS나 표준 대칭키 구현보다 빠르거나 메모리를 덜 사용한다는
뜻은 아니며 실제 비교에는 측정이 필요합니다.

## 연결 암호화와 E2E 데이터 키

```text
Arduino 장치 ←→ IOSignal 서버 ←→ 브라우저 웹앱
     └──────── 별도 E2E 데이터 키 ────────┘
```

연결 인증용 키는 각 클라이언트의 서버 접속 자격을 확인하는 데 사용합니다.
중계 서버가 메시지 본문을 읽지 못하게 하려면 최종 송수신자만 공유하는 별도
데이터 키로 `signal_e2e`를 사용하고, 수신 측에서 `decrypt_e2e`로 검증·복호화합니다.
일반 연결 암호화만으로 종단간 암호화가 되는 것은 아닙니다. 서버는 E2E 메시지의
전달에 필요한 라우팅 정보를 처리하며 트래픽 크기 등의 메타데이터도 남습니다.

현재 JavaScript 구현의 `AUTO` 모드는 TLS를 사용하지 않고 boho 인증이 완료된
경우 boho 연결 암호화를 사용합니다. E2E 본문 암호화는 연결 보호 여부와 별도입니다.
[README 빠른 시작](https://github.com/remocons/iosignal/blob/main/README.ko.md#빠른-시작)의 인증 없는 로컬 예제는 boho 인증·암호화를 활성화한 예제가 아닙니다.

일반 웹 배포에서는 HTTPS로 웹앱을 제공하고 WSS로 연결하면서 본문에 E2E를
적용할 수 있습니다. 앱 코드가 변조되면 키와 평문도 노출될 수 있어 E2E에서도
웹앱 코드 제공자에 대한 신뢰가 필요합니다. boho는 브라우저의 mixed content
정책을 우회하지 않습니다.

## 7.0.0 세션 시간·재사용 검증

서버는 허용 시간 차이를 벗어나거나 이미 허용한 시간·카운터 조합을 다시
사용한 암호 패킷을 거부하고, 명령 실행·중계 전에 연결을 종료합니다.
`ENC`(10.0.0 전에는 `ENC_488`)와 `ENC_E2E` 라우팅 암호 헤더에 같은 정책을 적용합니다.

```js
const server = new Server({
  port: 8080,
  security: {
    maxClockSkewMs: 60000,
    authChallengeMaxAgeMs: 60000,
    maxReplayEntries: 65536
  }
}, authManager);
```

기본값은 절대 시간 차이 60초, 인증 challenge 유효기간 60초, 연결별 저장 한도
65,536개입니다. 설정은 양의 안전 정수여야 합니다. 저장 한도 초과도 연결을
종료하며 아직 유효한 재사용 기록을 임의로 지우지 않습니다.
`security:mismatch(remote, reason)` 이벤트와 `remote.securityFailure`로 사유를 확인합니다.

정상 검증된 인증 증명은 challenge를 소진합니다. 재인증 또는 challenge 만료 후
수동 로그인은 재연결해야 합니다. 인증된 연결에서 다시 `login()`하면 연결이
종료됩니다. AUTH_REQ에는 현재 장치 시각이 없으므로 초기에는 challenge 경과시간을,
이후 암호 패킷에서는 장치 시각과 서버 시각의 차이를 검사합니다.
평문·TLS 전송 정책은 변경하지 않습니다.

JS 클라이언트 시계는 허용 범위 안에 있어야 합니다. Boho Arduino 1.0.0은 검증된
서버 암호 헤더로 시계를 점진 보정하며 평문 PING/PONG은 시간 보정에 사용하지 않습니다.
내부 E2E 본문의 재사용 방지는 연결 암호 헤더 검증과 별도로 응용 계층에서 처리합니다.

## 로컬 테스트 로그인 (localAuth)

8.1.0부터 지원합니다. `localAuth`는 `LocalKeyProvider`로 `BohoAuth`를
만들어, 키를 등록하지 않고도 장치가 로그인하게 합니다. 비어 있지 않은 모든 ID가
로그인하며 그 ID가 CID가 됩니다.

| 옵션 | 로그인 조건 | 예 |
| --- | --- | --- |
| `'idKey'` 또는 `{ mode: 'idKey' }` | 키가 ID와 같음 | `io.auth('dev1', 'dev1')` |
| `{ mode: 'sharedKey', key }` | 아무 ID + 공통 키 | `io.auth('dev1', 'lab2026')` |

```js
const server = new Server({
  port: 7777,
  congPort: 8888,
  localAuth: { mode: 'sharedKey', key: 'lab2026' },
  membersOnly: true
});
```

- `role`(기본 `'device'`)과 `quota`(`quotas`에 정의한 프로필 이름, 기본은 없음 = 제한 없음)가
  모든 로그인에 적용됩니다. 9.0부터 `level`을 대신합니다.
- 익명 연결도 계속 받습니다. `membersOnly: true`를 주면 익명 연결의 시그널을 막습니다.
- `duplicateLogin`, `onAuthEvent`는 일반 `BohoAuth`와 같이 동작합니다. `localAuth`와
  `authManager` 인자를 함께 주면 `TypeError`가 발생합니다.
- 직접 구성하려면 `new BohoAuth(new LocalKeyProvider('idKey'))`를 사용합니다.
- 규칙을 아는 누구나 임의 ID로 로그인해 그 CID를 가져갈 수 있습니다(`keepNew`는
  접속 중인 연결을 교체). 공통 키를 쓰면 모든 장치가 같은 키를 가지므로
  연결 암호화가 장치 사이를 서로 구분해 보호하지 않습니다.
  신뢰하는 네트워크의 로컬 테스트에만 사용하세요.

## 현재 구현의 적용 조건

- 충분히 무작위인 키를 사용하세요. 키 유도(Ascon-CXOF128)는 비밀번호용 느린 KDF가 아닙니다.
- JavaScript는 `crypto.getRandomValues()`, ESP32·ESP8266은 칩의 난수를 씁니다. 하드웨어 난수가 없는 보드(Arduino Uno)는 모은 타이밍과 `setNonceSeed()` 값으로 로그인 nonce를 만들므로, 부팅마다 달라지는 값을 넣어 주세요.
- boho 자체는 재전송 거부나 challenge 만료를 강제하지 않으며 IOSignal 서버가 합니다. 유효한 태그만으로 명령 실행 권한이 생기지는 않으니 응용에서 수신 정책을 확인하세요.
- 순방향 비밀성이 없습니다. 장기 키가 유출되면 그 키로 보호한 통신이 드러납니다.
