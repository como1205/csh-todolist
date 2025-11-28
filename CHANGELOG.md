# Changelog

프로젝트의 모든 주요 변경 사항이 이 파일에 문서화됩니다.

---

## [Unreleased]

### 추가됨 (Added)
- E2E 테스트 가이드 문서 추가 (`docs/E2E-TEST-GUIDE.md`)
- E2E 테스트 결과 및 버그 리스트 문서 추가 (`docs/E2E-TEST-RESULTS.md`)

### 수정됨 (Fixed)

#### BUG-001: 회원가입 후 리다이렉트 로직 충돌
- **파일**: `frontend/src/pages/RegisterPage.tsx`
- **문제**: 회원가입 성공 시 `isAuthenticated`와 `registerSuccess` 상태가 동시에 true가 되어 리다이렉트 경로가 불명확함
- **수정**: useEffect 조건을 개선하여 회원가입 성공 메시지 표시 중에는 메인 페이지로 리다이렉트하지 않도록 변경
- **영향**: 회원가입 플로우가 일관되게 동작 (회원가입 → 성공 메시지 → 로그인 페이지)

#### BUG-002: 모바일에서 하단 네비게이션이 콘텐츠를 가림
- **파일**: `frontend/src/components/Layout.tsx`
- **문제**: 모바일 화면에서 고정된 하단 네비게이션 바가 콘텐츠 하단을 가림
- **수정**: 모바일에서 `pb-20` (80px) padding-bottom 추가, 데스크톱에서는 `lg:pb-8`로 유지
- **영향**: 모바일에서 모든 콘텐츠가 정상적으로 보이며, 스크롤 시 하단 네비게이션에 가려지지 않음

#### BUG-003: 휴지통에서 할일 복원 후 목록에 남아있음
- **파일**: `frontend/src/stores/todoStore.ts`
- **문제**: 복원된 할일이 휴지통 목록에서 사라지지 않음 (상태만 업데이트하고 제거하지 않음)
- **수정**: `restoreTodo` 함수에서 `map` 대신 `filter`를 사용하여 복원된 할일을 목록에서 제거
- **영향**: 휴지통에서 할일 복원 시 즉시 목록에서 사라지며, 페이지 새로고침 없이 정상 동작

---

## [0.1.0] - 2025-11-27

### 초기 MVP 기능 구현

#### 백엔드
- Express.js 기반 REST API 서버 구축
- PostgreSQL (Supabase) 데이터베이스 연동
- JWT 기반 인증 시스템 (Access Token + Refresh Token)
- 사용자 관리 API (회원가입, 로그인, 로그아웃, 토큰 재발급)
- 할일 관리 API (CRUD, 완료 상태 토글, 삭제, 복원, 영구 삭제)
- 국경일 관리 API (CRUD)
- Swagger API 문서 자동 생성
- CORS 설정 및 보안 미들웨어

#### 프론트엔드
- React 19 + TypeScript + Vite 프로젝트 구조
- Tailwind CSS를 사용한 반응형 UI 구현
- Zustand 상태 관리 (authStore, todoStore, holidayStore)
- React Hook Form + Zod를 사용한 폼 검증
- Axios 기반 API 클라이언트 (자동 토큰 관리 및 재발급)
- 반응형 레이아웃 (데스크톱 사이드바, 모바일 하단 네비게이션)
- 회원가입 및 로그인 페이지
- 할일 목록 페이지 (CRUD, 완료 상태 토글)
- 휴지통 페이지 (복원, 영구 삭제)
- 국경일 페이지
- 프로필 페이지
- 재사용 가능한 UI 컴포넌트 (Button, Input, Textarea, Modal, Checkbox, Badge, TodoCard, TrashCard)

#### 기능
- **회원가입/로그인**: 이메일 기반 인증, JWT 토큰 관리
- **할일 관리**:
  - 생성, 조회, 수정, 삭제
  - 완료 상태 토글
  - 제목, 내용, 시작일, 만료일 관리
  - 만료 임박 및 기한 초과 표시
- **휴지통**:
  - 삭제된 할일 보관
  - 복원 기능
  - 영구 삭제 기능
- **국경일**: 조회 기능
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 지원
- **접근성**: ARIA 속성, 키보드 네비게이션, 포커스 트랩
- **에러 처리**: 사용자 친화적인 에러 메시지 표시
- **로딩 상태**: 모든 비동기 작업에 로딩 인디케이터

#### 기술 스택
**백엔드**:
- Node.js
- Express.js
- TypeScript
- PostgreSQL (Supabase)
- JWT (jsonwebtoken)
- Bcrypt
- Swagger (swagger-ui-express, swagger-jsdoc)

**프론트엔드**:
- React 19
- TypeScript
- Vite
- Zustand (상태 관리)
- React Router v7 (라우팅)
- React Hook Form (폼 관리)
- Zod (스키마 검증)
- Axios (HTTP 클라이언트)
- Tailwind CSS (스타일링)

#### 개발 환경
- ESLint (코드 린팅)
- TypeScript (타입 체킹)
- Git (버전 관리)

---

## 버전 관리 규칙

이 프로젝트는 [Semantic Versioning](https://semver.org/)을 따릅니다.

### 버전 형식: MAJOR.MINOR.PATCH

- **MAJOR**: 호환되지 않는 API 변경
- **MINOR**: 하위 호환되는 기능 추가
- **PATCH**: 하위 호환되는 버그 수정

### 변경 사항 분류

- **Added**: 새로운 기능
- **Changed**: 기존 기능의 변경
- **Deprecated**: 곧 제거될 기능
- **Removed**: 제거된 기능
- **Fixed**: 버그 수정
- **Security**: 보안 관련 수정

---

## 링크
- [E2E 테스트 가이드](./docs/E2E-TEST-GUIDE.md)
- [E2E 테스트 결과](./docs/E2E-TEST-RESULTS.md)
- [프로젝트 README](./README.md)
