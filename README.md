# 승품단 심사 결과 안내

금색, 검정, 월계관 분위기의 승품단 심사 결과 안내 웹앱입니다. 아이 이름, 승품단, 사진, 합격 여부를 입력하면 결과 조회 화면을 거쳐 축하 메시지 화면으로 전환됩니다.

## 배포 URL

https://taekwondo-promotion-result.vercel.app

## 기능

- 아이 이름 입력
- 1품, 2품, 3품, 4품 선택
- 사진 등록 및 미리보기
- 합격, 불합격 선택
- 조회중 화면 전환 연출
- 결과 안내 메시지 표시
- 서버 API를 통한 Supabase `promotion_reviews` 테이블 저장 연동

## Supabase 설정

현재 Supabase 프로젝트:

- Project ref: `yokxfuuporzjctrgxvlp`
- Table: `promotion_reviews`

1. Supabase SQL Editor에서 `supabase/schema.sql` 내용을 실행합니다.
2. Vercel 환경 변수에 아래 값을 등록합니다.

```text
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
```

## 개발 기록

- 2026-09-04: 승품단 심사 결과 안내 앱 초기 제작, 사진 입력/결과 전환/Supabase 저장 연동 추가.
- 2026-09-04: Supabase 저장 방식을 서버 API로 변경해 서비스 키가 브라우저에 노출되지 않도록 개선.
- 2026-09-04: Supabase 프로젝트 생성 및 `promotion_reviews` 테이블 반영 완료.
- 2026-09-04: Vercel 프로덕션 배포 및 Supabase 저장 API 검증 완료.
- 2026-09-04: 배포 화면 공백 현상을 수정하기 위해 React 런타임 import를 명시화.
