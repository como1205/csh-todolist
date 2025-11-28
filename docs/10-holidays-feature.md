# 10. 국경일 관리 기능

## 개요

이 문서는 csh-TodoList 애플리케이션에 추가된 국경일 관리 기능에 대한 상세한 설명을 제공합니다. 이 기능은 사용자가 연도별 국경일을 조회할 수 있도록 하며, 관리자 권한을 가진 사용자만 국경일을 관리할 수 있습니다.

## 기능 요구사항

### 핵심 기능
1. **국경일 조회**
   - 모든 사용자는 연도별로 국경일 목록을 조회할 수 있음
   - 반복 여부에 따라 매년 반복되는 국경일 표시

2. **국경일 관리 (관리자 전용)**
   - 새 국경일 추가
   - 기존 국경일 수정
   - 국경일 삭제

### 비기능 요구사항
- 인증된 사용자만 API 접근 가능
- 관리자 권한이 있는 사용자만 수정/삭제 가능
- 반응형 UI 구현

## 아키텍처 설계

### 백엔드 구조
```
backend/
├── src/
│   ├── controllers/
│   │   └── holiday.controller.ts
│   ├── services/
│   │   └── holiday.service.ts
│   ├── routes/
│   │   └── holiday.route.ts
│   └── types/
│       └── holiday.types.ts
```

### 프론트엔드 구조
```
frontend/
├── src/
│   ├── services/
│   │   └── holidays.ts
│   ├── stores/
│   │   └── holidayStore.ts
│   ├── pages/
│   │   └── HolidaysPage.tsx
│   └── types/
│       └── index.ts (Holiday interface 추가)
```

## API 명세

### GET /api/holidays
- **설명**: 국경일 목록 조회
- **인증**: 필요 없음
- **쿼리 파라미터**:
  - `year` (optional): 특정 연도 국경일 조회
- **응답**:
```json
{
  "success": true,
  "data": [
    {
      "holidayId": "uuid",
      "title": "국경일 이름",
      "date": "YYYY-MM-DD",
      "description": "국경일 설명",
      "isRecurring": true,
      "createdAt": "ISO date string",
      "updatedAt": "ISO date string"
    }
  ]
}
```

### GET /api/holidays/:id
- **설명**: 특정 국경일 조회
- **인증**: 필요 없음
- **응답**:
```json
{
  "success": true,
  "data": {
    "holidayId": "uuid",
    "title": "국경일 이름",
    "date": "YYYY-MM-DD",
    "description": "국경일 설명",
    "isRecurring": true,
    "createdAt": "ISO date string",
    "updatedAt": "ISO date string"
  }
}
```

### POST /api/holidays
- **설명**: 새 국경일 생성 (관리자 전용)
- **인증**: JWT 필요
- **권한**: 관리자만 가능
- **요청 본문**:
```json
{
  "title": "국경일 이름",
  "date": "YYYY-MM-DD",
  "description": "국경일 설명",
  "isRecurring": true
}
```
- **응답**:
```json
{
  "success": true,
  "data": {
    "holidayId": "uuid",
    "title": "국경일 이름",
    "date": "YYYY-MM-DD",
    "description": "국경일 설명",
    "isRecurring": true,
    "createdAt": "ISO date string",
    "updatedAt": "ISO date string"
  }
}
```

### PUT /api/holidays/:id
- **설명**: 국경일 수정 (관리자 전용)
- **인증**: JWT 필요
- **권한**: 관리자만 가능
- **요청 본문**:
```json
{
  "title": "국경일 이름",
  "date": "YYYY-MM-DD",
  "description": "국경일 설명",
  "isRecurring": true
}
```
- **응답**:
```json
{
  "success": true,
  "data": {
    "holidayId": "uuid",
    "title": "국경일 이름",
    "date": "YYYY-MM-DD",
    "description": "국경일 설명",
    "isRecurring": true,
    "createdAt": "ISO date string",
    "updatedAt": "ISO date string"
  }
}
```

### DELETE /api/holidays/:id
- **설명**: 국경일 삭제 (관리자 전용)
- **인증**: JWT 필요
- **권한**: 관리자만 가능
- **응답**:
```json
{
  "success": true,
  "message": "국경일이 삭제되었습니다"
}
```

## 데이터베이스 스키마

### holidays 테이블
```sql
CREATE TABLE holidays (
  "holidayId"   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "title"       VARCHAR(100) NOT NULL,
  "date"        DATE NOT NULL,
  "description" TEXT,
  "isRecurring" BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt"   TIMESTAMP(6) NOT NULL DEFAULT NOW(),
  "updatedAt"   TIMESTAMP(6) NOT NULL DEFAULT NOW()
);
```

## 프론트엔드 컴포넌트

### HolidaysPage.tsx
- **기능**: 
  - 연도 선택 드롭다운
  - 국경일 목록 표시
  - 반복 여부 표시
  - 로딩/에러 상태 처리
- **의존성**: `useHolidayStore`, `Button`, `Input` 컴포넌트

### holidayStore.ts
- **상태**:
  - `holidays`: 국경일 목록
  - `isLoading`: 로딩 상태
  - `error`: 에러 메시지
- **액션**:
  - `fetchHolidays(year?)`: 국경일 목록 조회
  - `addHoliday(holiday)`: 국경일 추가
  - `updateHoliday(id, updates)`: 국경일 수정
  - `deleteHoliday(id)`: 국경일 삭제
  - `clearError()`: 에러 초기화

## 권한 관리

- **일반 사용자**: 국경일 조회만 가능
- **관리자**: 국경일 추가/수정/삭제 가능
- **JWT 인증**: 모든 API 엔드포인트에 인증 필요 (조회 제외)
- **역할 기반 권한 체크**: `req.user?.role !== 'ADMIN'` 조건으로 관리자 확인

## 초기 데이터

데이터베이스 스키마 파일(`database/schema.sql`)에 이미 2025년 주요 국경일에 대한 초기 데이터가 포함되어 있습니다.

## 향후 개선 방향

1. **캘린더 뷰**: 시각적으로 국경일을 표시할 수 있는 캘린더 컴포넌트
2. **국가별 설정**: 사용자가 특정 국가의 국경일만 표시할 수 있도록 설정
3. **API 연동**: 외부 국경일 API를 통해 자동 업데이트 기능
4. **알림 기능**: 국경일 전날 알림 기능
5. **다국어 지원**: 다양한 언어로 된 국경일 이름 표시

## 테스트 전략

1. **유닛 테스트**: 
   - 서비스 계층의 비즈니스 로직 테스트
   - 컨트롤러의 요청/응답 처리 테스트

2. **통합 테스트**:
   - API 엔드포인트 기능 테스트
   - 권한 확인 로직 테스트

3. **UI 테스트**:
   - 컴포넌트 렌더링 테스트
   - 사용자 상호작용 테스트

## 보안 고려사항

- **SQL 인젝션 방어**: 파라미터화된 쿼리 사용
- **인증/권한 검사**: JWT 인증 및 역할 기반 접근 제어
- **입력 검증**: 요청 데이터에 대한 유효성 검사
- **RLS (Row Level Security)**: 데이터베이스 수준에서의 접근 제어