# BUILDUP Security Baseline

## Current State
- 인증 없음
- 권한(role) 모델 없음
- DB 없음
- 파일 업로드 없음
- 관리자 페이지 없음
- 사용자 입력 경로는 두 가지: 추천 화면의 `searchParams`/활동 상세 `id`, 그리고 `POST /api/contact` 본문
- 사용자 입력을 HTML로 렌더링하지 않으며 `dangerouslySetInnerHTML`은 금지
- 변경성 엔드포인트는 `POST /api/contact` 하나이며, abuse control이 적용된 상태다 (아래 `Contact Endpoint Controls` 참고)
- 서버 로그는 `lib/server-log.ts`의 구조화 JSON 로깅을 사용하며, 문의 본문은 로그에 남기지 않는다

## Contact Endpoint Controls

`POST /api/contact`에 현재 적용된 방어는 다음과 같다.

| 순서 | 검사 | 실패 응답 |
| --- | --- | --- |
| 1 | `Content-Type: application/json` 확인 | `415` |
| 2 | `Origin`과 요청 host 일치 확인 | `403` |
| 3 | payload 크기 `8KB` 상한 | `413` |
| 4 | IP 기준 rate limit `10분당 3회` | `429` |
| 5 | 본문 스키마 검증 (메시지 `10~3000자`) | `400` |
| 6 | 허니팟 필드 감지 시 무해 흡수 | `202` |

- 발송 실패는 원인별로 상태를 분리한다: 타임아웃 `504`, 업스트림 실패 `502`, 설정 누락 `503`.
- 모든 응답에 `X-Request-Id`를 부여하고, 실패 분기마다 이벤트명 기반 구조화 로그를 남긴다.
- 재시도는 네트워크 실패 / 타임아웃 / 업스트림 `5xx`에만 적용하고, `4xx`에는 재시도하지 않는다 (중복 발송 방지).

### 알려진 한계

- rate limit 저장소가 프로세스 인메모리(`globalThis`)라 서버리스 다중 인스턴스에서는 인스턴스별로 집계된다.
  실질 상한은 `3 × 인스턴스 수`이며, 트래픽이 늘면 외부 저장소 기반으로 교체한다.
- `Origin` 헤더가 없는 요청은 통과시킨다. 브라우저 외 클라이언트 호환을 위한 의도된 선택이며,
  인증이나 상태 변경이 걸린 엔드포인트가 추가되면 이 정책을 재검토한다.
- 클라이언트 식별자는 `x-forwarded-for` / `x-real-ip`에 의존하므로, 신뢰 가능한 프록시 뒤에서만 유효하다.

## CSP Policy
- 현재 CSP는 strict CSP가 아니라 `baseline CSP`다.
- 현재 `script-src 'unsafe-inline'`를 유지하는 이유는 Next.js 런타임과 현재 앱 구조를 깨지 않고 기본 보안 레벨을 올리기 위해서다.
- 개발 환경에서는 로컬 디버깅 때문에 `unsafe-eval`이 추가될 수 있다.
- `upgrade-insecure-requests`는 HTTPS가 기본인 preview/production 경로에만 적용하고, local development에는 적용하지 않는다.
- 추후 inline script 의존성을 제거할 수 있으면 nonce 또는 hash 기반 CSP로 승격한다.
- 현재 CSP는 외부 `http/https` origin을 명시적으로 허용하지 않는다.

## Environment Policy
- local development:
  - `unsafe-eval` 허용
  - `upgrade-insecure-requests` 미적용
- preview / production:
  - `unsafe-eval` 금지
  - `upgrade-insecure-requests` 적용
  - HTTPS 전제 응답 헤더 검증 대상

## Baseline Rules
- 로그인 여부와 권한 여부는 항상 별개의 서버 검증으로 다룬다.
- 클라이언트 입력 검증은 편의용일 뿐이며, API와 서버 액션은 서버에서 스키마 검증을 다시 수행한다.
- 비밀정보는 `.env*` 또는 배포 플랫폼의 secret store에만 둔다.
- 코드 저장소에는 API 키, 토큰, DB 비밀번호, private key를 커밋하지 않는다.
- `dangerouslySetInnerHTML`, `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`는 예외 승인 없이는 금지한다.
- 보안 스캔 예외가 필요하면 `security-scan: allow <reason>` 형식으로 이유를 남긴다.
- 외부 링크는 `http/https`만 허용하고 `javascript:` 같은 scheme은 차단한다.
- 클라이언트로 전달되는 환경변수는 `NEXT_PUBLIC_` 접두사만 사용한다.
- `.env.example`를 만들 때는 실제 비밀값이 아닌 fake placeholder만 넣는다.

## Scan Policy
- `security:scan:secrets`는 `.github/`, `app/`, `components/`, `docs/`, `lib/`, `scripts/`와 주요 루트 설정 파일만 검사한다.
- `security:scan:render`는 `app/`, `components/`, `lib/` 안의 TS/JS 렌더링 코드만 검사한다.
- `package-lock.json`, 스캔 구현 파일 자체, 생성 산출물은 검사 대상에서 제외한다.
- 시크릿 스캔은 `fail`과 `warn`을 분리한다.
- 실제 비밀값, private key, access token literal은 `fail`이다.
- 문서나 설정 안내에 등장하는 민감 식별자 이름은 `warn`이다.
- `security:check`는 로컬과 CI에서 동일한 진입점으로 사용한다.
- 의존성 취약점 점검은 `security:audit`와 CI audit workflow로 분리 운영한다.

## Merge Gates For Future Features
### Auth / Authorization
- 인증과 인가는 분리한다.
- 로그인 사용자라도 서버에서 역할과 리소스 접근 권한을 별도로 확인한다.
- 관리자 기능은 UI 숨김만으로 보호하지 않고 서버에서 차단한다.
- 세션 쿠키를 도입하면 `HttpOnly`, `Secure`, `SameSite`를 기본값으로 검토한다.
- 인증 상태에 따라 달라지는 민감 응답은 `Cache-Control`을 재검토하고 필요 시 `no-store`를 사용한다.

### API / Server Actions
- 변경성 요청은 서버에서 입력 스키마 검증을 수행한다.
- 클라이언트에서 계산한 권한, 가격, 상태값은 신뢰하지 않는다.
- POST/PUT/PATCH/DELETE가 생기면 CSRF와 rate limit를 즉시 2차 범위에 포함한다.
  (`/api/contact`에 origin 검증과 rate limit로 적용 완료. 이후 추가되는 변경성 엔드포인트도 동일 기준을 따른다.)
- request body 전체를 로그로 남기지 않는다.
- token, cookie, password, authorization header는 로그 금지 또는 redaction 대상이다.

### Database
- 문자열 연결 SQL은 금지한다.
- 파라미터 바인딩 또는 ORM의 안전한 parameterized query만 허용한다.
- 관리자/운영용 쿼리는 일반 사용자 경로와 분리한다.
- migration / seed에도 테스트용 비밀정보나 실제 운영 키를 넣지 않는다.

### Uploads
- 파일 업로드가 생기면 확장자, MIME, 크기, 매직바이트를 모두 검증한다.
- 실행형 파일과 HTML/SVG 업로드는 명시적 허용 없이는 금지한다.
- 업로드 파일은 공개 경로에 바로 노출하지 않는다.
- 공개 URL을 발급할 때 만료 정책과 접근 범위를 명시한다.

### Headers / Transport
- 운영 환경은 HTTPS를 기본으로 한다.
- 보안 헤더는 앱 레벨 기본값을 유지하고, 예외가 필요하면 변경 이유를 PR에 남긴다.

### Abuse Controls
- 로그인/회원가입/risky API가 생기면 rate limit를 즉시 적용한다.
- 외부 API 프록시를 추가하면 호출 횟수와 payload size 제한을 함께 둔다.
- 문의/메일 endpoint를 추가하면 bot abuse 제한과 반복 요청 탐지를 포함한다.
  (`/api/contact`에 허니팟과 IP 기준 rate limit로 적용 완료.)

### Dependencies / Deployment
- lockfile은 항상 커밋 상태로 유지한다.
- dependency 취약점 점검 루틴을 주기적으로 실행한다.
- preview/prod 환경 차이는 문서화하고 보안 헤더/캐시 정책 차이를 PR에 남긴다.

## Review Checklist
- 새로운 비밀정보가 코드에 하드코딩되지 않았는가
- 서버 입력 검증이 추가되었는가
- 권한 검사가 클라이언트가 아니라 서버에 있는가
- 새로운 외부 스크립트/리소스가 CSP와 충돌하지 않는가
- 관리자/운영 기능이 일반 사용자 경로와 분리되어 있는가
- 새로운 위험 렌더링 패턴이 도입되지 않았는가
- `security:check`가 로컬과 CI 모두에서 통과하는가
- 위험 문자열이 UI에서 HTML이 아니라 일반 텍스트로 렌더되는가
- 새로운 외부 링크가 `javascript:` 같은 위험 scheme을 허용하지 않는가
