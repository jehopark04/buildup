# BUILDUP

대학생 IT/개발 계열 학생을 위한 **직무 기반 활동 추천 웹서비스**입니다.
희망 직무와 현재 상태를 입력하면, 직무 관련 활동을 먼저 모은 뒤 학년/수준 기준으로 추천 우선순위를 나눠 보여줍니다.

추천 결과는 등급만 보여주지 않고 **왜 그 등급이 되었는지**를 함께 제시합니다.

**Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Vitest**

---

## 1. 프로젝트 목적

많은 학생들이 "무슨 활동을 해야 하는지"는 알지만,
정작 **내 직무에 맞는 활동이 무엇인지**, **지금 시점에 해도 되는지**, **우선순위가 어떤지**를 구조적으로 판단하기 어렵고 해당 활동들을 찾기가 힘듭니다.

이 서비스는 아래 질문에 답하려고 합니다.

- 내가 희망하는 직무와 관련된 활동은 무엇인가?
- 내 학년과 현재 수준에서 지금 해도 되는가?
- 지금 바로 추천인지, 조건부 추천인지, 지금은 비추천인지?
- 공식 링크 기준으로 실제 지원 가능한 활동은 무엇인가?

---

## 2. 빠른 시작

Node.js `20.9.0` 이상이 필요합니다.

```bash
npm install
npm run dev
```

`http://localhost:3000`에서 실행됩니다.
활동 추천 기능은 환경변수 없이 그대로 동작하며, 문의 기능만 아래 설정이 필요합니다.

```bash
cp .env.example .env.local
```

| 환경변수 | 용도 |
| --- | --- |
| `RESEND_API_KEY` | 문의 메일 발송용 Resend API 키 |
| `CONTACT_TO_EMAIL` | 문의를 수신할 주소 |
| `CONTACT_FROM_EMAIL` | 발신자 표기 (`BUILDUP <...>` 형식) |

설정이 없으면 문의 API는 `503`으로 명시적 실패하며, 나머지 화면은 정상 동작합니다.

### 주요 스크립트

| 명령 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 |
| `npm run build` | 배포 빌드 |
| `npm run lint` | ESLint |
| `npm run typecheck` | 라우트 타입 생성 + `tsc --noEmit` |
| `npm run test:run` | Vitest 1회 실행 |
| `npm run security:scan` | 시크릿 + 위험 렌더링 스캔 |
| `npm run security:audit` | 의존성 취약점 점검 |
| `npm run security:check` | 위 전체를 순서대로 실행 (CI와 동일 진입점) |

---

## 3. 화면과 엔드포인트

| 경로 | 설명 |
| --- | --- |
| `/` | 서비스 소개 랜딩 |
| `/onboarding` | 직무 / 학년 / 수준 입력 |
| `/recommendations` | 등급별 추천 결과 |
| `/activities/[id]` | 활동 상세와 출처 링크 |
| `/kau-hub` | 항공대 내부 채널 모음 |
| `/contact` | 문의 폼 |
| `/api/contact` | 문의 접수 (POST) |
| `/api/health` | 헬스체크 (GET / HEAD) |

사용자 입력은 DB가 아니라 **URL 쿼리 파라미터**로 유지됩니다. 로그인 없이 결과 링크를 그대로 공유할 수 있습니다.

---

## 4. 현재 서비스 방향

현재 버전은 다음 원칙을 따릅니다.

- 로그인, DB, 관리자, 결제 기능은 제외
- AI 생성 추천이 아니라 **수동 큐레이션 기반 추천**
- 공식 사이트 / 학교 공지 / 검증 가능한 링크 중심 데이터 관리
- 추천 구조는 **직무 선필터 -> 학년/수준 기반 분류**
- UI 기준 입력 정책은 **희망 직무 필수, 학년/수준 선택**
- 시간 여유, 성향 같은 요소는 핵심 필터가 아니라 보조 정보로만 활용
- 추천 결과는 사용자에게 **설명 가능한 방식**으로 제시

즉, 이 프로젝트의 핵심은 "복잡한 알고리즘"보다
**납득 가능한 추천 기준과 유지보수 가능한 구조**에 있습니다.

---

## 5. 추천 구조

추천은 아래 순서로 이루어집니다.

### 1) 직무 기준으로 먼저 후보를 좁힘

사용자가 선택한 희망 직무(track)에 맞는 활동만 먼저 모읍니다.

현재 지원하는 직무는 다음 5개입니다.

- 프론트엔드 (`frontend`)
- 백엔드 (`backend`)
- 기획 / PM (`product`)
- 디자인 (`design`)
- AI / 데이터 (`ai`)

### 2) 학년 / 수준 기준으로 적합도를 판단

직무 관련 활동들 중에서 사용자의 현재 상태와 얼마나 맞는지 평가합니다.

주요 기준:

- 학년(grade): 1학년 / 2학년 / 3학년 / 4학년 이상
- 수준(level): 탐색 중 / 기초 학습 중 / 프로젝트 경험 있음 / 실전 지원 직전

각 활동은 추천 가능한 학년 범위와 수준 범위를 가집니다.
추천 엔진은 이를 바탕으로 적합도를 계산합니다.

입력 정책은 현재 다음처럼 동작합니다.

- `track`은 필수
- `grade`, `level`은 선택
- `track`만 있으면 기본 추천 가능
- `grade`, `level`까지 있으면 더 정밀한 추천 가능
- 정보가 부족하면 추천은 유지하되 `confidence`를 낮춰 보수적으로 보여줌

### 3) 추천 우선순위를 분류

최종적으로 활동은 아래 세 그룹으로 나뉩니다.

- **가장 추천** (`best`)
- **조건부 추천** (`conditional`)
- **지금은 비추천** (`notNow`)

이 분류는 단순 문자열이 아니라,
적합도 / 제한 조건 / 입력 정보 신뢰도 등을 반영한 결과입니다.

### 4) 이유를 함께 제공

각 활동 카드에는 왜 그렇게 분류되었는지 설명이 붙습니다.

예:

- 현재 학년에 잘 맞는 활동인지
- 수준상 바로 도전 가능한지
- 입력 정보가 부족해 보수적으로 분류된 것인지
- 현재 모집 중인지 / 차기 모집 예정인지

---

## 6. 추천 엔진 설계 원칙

이 프로젝트의 추천 엔진은 아래 원칙을 따릅니다.

### Single source of truth

최종 추천 등급(`best / conditional / notNow`)은 엔진에서 한 번만 결정합니다.
설명 계층은 이 결과를 다시 판단하지 않고, **이미 계산된 결과를 해설만** 합니다.

현재 엔진은 대략 아래 흐름으로 동작합니다.

- `fit` 계산
- `score` 계산
- `rawTier` 계산
- `confidence` 반영
- `eligibility / constraint` 반영
- 최종 `finalTier` 결정
- 그 결과를 바탕으로 설명 생성

### 등급 판정 흐름이 추적 가능

등급은 한 번에 정해지지 않고 3단계로 좁혀지며, 각 단계가 결과에 남습니다.

```text
rawTier          점수만으로 계산한 원래 등급
  ↓ confidence   입력 정보가 부족하면 상한을 건다
confidenceTier
  ↓ eligibility  학년/수준 하드 제한을 건다
finalTier        화면에 나가는 최종 등급
```

무엇이 등급을 낮췄는지는 `limitedBy: ("confidence" | "maxAllowedTier" | "blocked")[]`로 남기기 때문에,
"왜 이 활동이 비추천이 되었는가"를 코드를 읽지 않고도 데이터로 확인할 수 있습니다.

### 분류와 정렬의 분리

- **tier**: 어떤 그룹에 들어가는지
- **score**: 같은 그룹 안에서 어떤 순서로 보여줄지

즉, "추천/조건부/비추천"과 "그 안에서의 우선순위"는 역할을 분리합니다.

### 판단과 설명의 분리

- 판단: 엔진
- 설명: reasons 계층

설명 로직은 더 이상 추천 결과를 다시 계산하지 않습니다.

### 부분 입력 대응 가능

현재 UI는 부분 입력도 실제로 허용합니다.

- 희망 직무만 입력하면 기본 추천
- 학년/수준 일부만 입력하면 부분 입력 추천
- 학년/수준까지 모두 입력하면 정밀 추천

입력 정보가 부족할수록 추천 `confidence`를 낮추고,
결과 화면과 상세 화면에서 그 상태를 함께 안내합니다.

### 설명 출력 계약

설명은 단순 `string[]`를 바로 만드는 대신, 먼저 아래 구조로 나뉩니다.

- `constraintReason`: 추천을 낮춘 직접 이유
- `primaryReason`: 현재 단계 적합도 요약
- `supportingReasons`: 신뢰도, 모집 상태, 관심 활동 유형 등 보조 이유

최종 카드 문구는 엔진에서 아래 순서로 조립합니다.

1. `constraintReason`이 있으면 항상 먼저 포함
2. `primaryReason` 포함
3. 남는 자리에만 `supportingReasons` 추가

이 구조로 인해, 실제로 tier를 낮춘 핵심 이유가 화면에서 잘리지 않도록 유지합니다.

---

## 7. 폴더 구조

```text
app/
  layout.tsx
  page.tsx
  globals.css
  onboarding/page.tsx
  recommendations/page.tsx
  activities/[id]/page.tsx
  kau-hub/page.tsx
  contact/page.tsx
  api/
    contact/route.ts
    health/route.ts

components/
  brand-mark.tsx
  layout-shell.tsx
  onboarding-form.tsx
  recommendation-card.tsx
  contact-form.tsx

lib/
  activities.ts              수동 큐레이션 활동 데이터
  activities.validation.ts   로드 시점 데이터 검증
  profile.ts                 사용자 입력 모델과 파라미터 처리
  kau-links.ts
  server-log.ts              구조화 JSON 로깅
  contact.ts                 문의 입력 검증과 메일 본문 조립
  contact-delivery.ts        메일 발송과 재시도 정책
  contact-rate-limit.ts      문의 rate limit
  recommendations/
    constants/
      fit.ts
      score.ts
      tier.ts
    eligibility.ts           하드 제한 조건 판단
    fit.ts                   학년/수준 적합도 계산
    score.ts                 점수 계산과 tier 내부 정렬
    tier.ts                  raw/final tier 및 decision 계산
    engine.ts                전체 추천 판단 orchestration
    reasons.ts               계산된 결과 기반 설명 생성
    presentation.ts          화면 표시용 변환
    sections.ts              화면 섹션 구성
    types.ts
    index.ts                 공개 API
  security/
    headers.ts               보안 응답 헤더 정의
    url.ts                   외부 링크 scheme 검증
    secret-scan.mjs
    render-scan.mjs
    scan-utils.mjs

scripts/
  check-secrets.mjs
  check-dangerous-rendering.mjs

tests/                       추천 엔진 / 활동 데이터 / 문의 / 보안
docs/
  security-baseline.md
  operations-monitoring.md
.github/workflows/
  security.yml
  dependency-audit.yml
```

---

## 8. 활동 데이터 운영 규칙

활동 데이터는 타입만 맞는다고 끝나지 않고, 로드 시점에 한 번 더 검증됩니다.
잘못된 값이나 누락이 있으면 개발 서버와 빌드에서 바로 실패하도록 유지합니다.

현재 운영 규칙은 아래와 같습니다.

- 모든 활동은 고유한 `id`를 가져야 함
- `sourceUrl`은 실제 절대 URL이어야 함
- `tracks`, `grades`, `levels`, `activityTypes`는 비어 있으면 안 됨
- `lastVerifiedAt`은 각 활동별 수동 검증일이어야 함
- 날짜 형식은 반드시 `YYYY-MM-DD`

### `lastVerifiedAt` 갱신 기준

- 외부 링크를 실제로 다시 확인했을 때만 갱신
- 모집 상태, 일정, 마감, 출처 링크, 안내 내용 이해에 영향을 주는 변경을 확인했을 때 갱신
- 단순 문장 다듬기만 한 경우에는 갱신하지 않음
- 오래됐다는 이유만으로 빌드를 실패시키지는 않지만, 화면에는 그대로 표시됨

---

## 9. 문의 기능

`/api/contact`는 단순 폼 전송이 아니라 아래 순서로 방어합니다.

1. `Content-Type`이 `application/json`인지 확인 (아니면 `415`)
2. `Origin`이 요청 호스트와 일치하는지 확인 (아니면 `403`)
3. 페이로드 크기가 `8KB` 이하인지 확인 (아니면 `413`)
4. IP 기준 rate limit — `10분당 3회` (초과 시 `429`)
5. 본문 스키마 검증 — 메시지 `10~3000자` (아니면 `400`)
6. 허니팟 필드가 채워졌으면 봇으로 보고 `202`로 조용히 흡수

발송 정책은 타임아웃 `5초`, 최대 `2회` 시도이며 재시도는 네트워크 실패 / 타임아웃 /
업스트림 `5xx`에만 적용합니다. 자세한 내용은 `docs/operations-monitoring.md`에 있습니다.

모든 응답에는 `X-Request-Id`가 붙고, 실패 분기마다 구조화 로그가 남습니다.
문의 본문 자체는 로그로 남기지 않습니다.

---

## 10. 품질 가드레일

### 로컬

- `npm run test:run`: 추천 엔진, 활동 데이터, 문의, 보안 테스트 (**17개 파일 / 61개 테스트**)
- `npm run lint`: 정적 코드 규칙 확인
- `npm run typecheck`: Next 타입 생성과 TypeScript 검사
- `npm run build`: 실제 배포 빌드 기준 최종 검증
- `npm run security:scan`: 시크릿 하드코딩과 위험 렌더링 패턴 검사

### CI

- `.github/workflows/security.yml` — PR과 `main` push마다 `security:check` 전체 실행
- `.github/workflows/dependency-audit.yml` — 매주 월요일 의존성 취약점 점검

보안 기준과 리뷰 체크리스트는 `docs/security-baseline.md`를 따릅니다.

추천 엔진에서 `관심 활동 유형`은 추천 등급 자체를 바꾸지 않습니다.
이 정보는 **같은 tier 안에서만 정렬 우선순위에 약하게 반영**됩니다.

---

## 11. 알려진 한계

의도적으로 범위 밖에 둔 것과, 실제 제약을 구분해 기록합니다.

**범위 밖 (의도된 선택)**

- 로그인 / 사용자 계정 / 개인화 이력 없음
- DB 없음 — 활동 데이터는 `lib/activities.ts`에 커밋되며, 추가는 배포를 동반함
- 관리자 페이지 없음

**실제 제약**

- 문의 rate limit이 인메모리 저장소 기반이라 서버리스 다중 인스턴스에서는 인스턴스별로 집계됨.
  트래픽이 늘면 외부 저장소 기반으로 옮겨야 함
- `Origin` 헤더가 없는 요청은 통과시킴 (브라우저 외 클라이언트 호환 목적)
- 테스트는 로직과 API 계층 중심이며, 컴포넌트 렌더링 테스트는 아직 없음
- 활동 데이터는 수동 검증이라 `lastVerifiedAt` 이후의 외부 변경은 반영되지 않을 수 있음
