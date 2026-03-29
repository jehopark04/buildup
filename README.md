# Career MVP

학생의 직무 관심사, 학년, 현재 상태를 바탕으로 교내외 활동을 추천하는 Next.js MVP입니다.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4

## Routes

- `/` 랜딩 페이지
- `/onboarding` 직무/학년/상태 입력
- `/recommendations` 입력값 기반 추천 결과
- `/activities/[id]` 활동 상세

## Commands

```bash
npm run dev
npm run lint
npm run typecheck
```

## Structure

```text
app/
  layout.tsx
  globals.css
  page.tsx
  onboarding/page.tsx
  recommendations/page.tsx
  activities/[id]/page.tsx
components/
  onboarding-form.tsx
  recommendation-card.tsx
lib/
  profile.ts
  recommendations.ts
  activities.ts
```

## Notes

- 실제 인증은 아직 붙이지 않았고, 이후 별도 라우트나 provider 로 추가할 수 있게 유지했습니다.
- 현재는 `lib/activities.ts` 의 목데이터와 `lib/recommendations.ts` 의 가중치 매칭으로 추천합니다.
