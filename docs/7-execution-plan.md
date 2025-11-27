## csh-TodoList 상세 실행 계획 (React + Express 버전)

사용자님의 피드백을 반영하여, `PRD` 및 `아키텍처 다이어그램`에 명시된 **React(Vite) 프론트엔드**와 **Express.js 백엔드**의 분리된 아키텍처를 기반으로 실행 계획을 재수립했습니다. 각 전문가의 역할을 명확히 하여 병렬 개발을 극대화하는 데 초점을 맞춥니다.

### 🚀 전체 전략

1.  **분리된 개발 (Decoupled Development)**: 프론트엔드(React)와 백엔드(Express)를 독립적인 프로젝트로 구성하여 개발합니다. 이를 통해 각 팀(담당자)은 서로의 작업에 미치는 영향을 최소화하고 전문 영역에 집중할 수 있습니다.
2.  **API 계약 기반 병렬 수행**: 데이터베이스와 API 명세서(`PRD 9장`)가 확정되면, 백엔드 API 구현과 프론트엔드 UI 개발을 동시에 진행합니다. API 명세서가 두 팀 간의 '계약' 역할을 합니다.
3.  **의존성 관리**: 각 Task는 명시된 의존성 완료 후 진행하여 작업 충돌 및 병목 현상을 방지합니다.

---

### Phase 1: ⚙️ 프로젝트 및 데이터베이스 설정 (Foundation)

> 백엔드와 프론트엔드 프로젝트를 각각 설정하고, 공통으로 사용할 데이터베이스의 기반을 다집니다.

**Task 1.1: 백엔드 프로젝트 초기화**

- **담당**: `backend-developer`
- **설명**: Express.js, pg, TypeScript 기반의 백엔드 프로젝트를 설정합니다.
- ✅ **완료 조건**:
  - [x] `npm init` 및 `package.json` 설정 완료
  - [x] Express, pg, @types/pg, TypeScript, ts-node 등 핵심 라이브러리 설치 완료
  - [x] `tsconfig.json` 파일 설정 완료
  - [x] pg Pool 연결 설정을 위한 `.env` 파일 준비
- 🔗 **의존성**: 없음

**Task 1.2: 프론트엔드 프로젝트 초기화**

- **담당**: `frontend-developer`
- **설명**: Vite와 React, TypeScript를 사용하여 프론트엔드 SPA 프로젝트를 생성합니다.
- ✅ **완료 조건**:
  - [x] `npm create vite@latest` 명령어로 React + TypeScript 프로젝트 생성 완료
  - [x] `react-router-dom`, `axios`, `zustand`, `tailwindcss` 등 PRD 기반 라이브러리 설치 완료
  - [x] Tailwind CSS 설정 (`tailwind.config.js`, `postcss.config.js`) 완료
- 🔗 **의존성**: 없음 (Task 1.1과 병렬 진행 가능)

**Task 1.3: 데이터베이스(Supabase) 설정**

- **담당**: `architect-reviewer`
- **설명**: Supabase에서 신규 프로젝트를 생성하고, PostgreSQL 데이터베이스 접속 정보를 확보합니다.
- **사용파일**: `@database/schema.sql` 파일을 활용하여 만들도록 하자
- ✅ **완료 조건**:
  - [ ] Supabase 프로젝트 생성 완료
  - [ ] 데이터베이스 Connection String (URL) 확보
  - [ ] 확보된 URL을 백엔드 프로젝트의 `.env` 파일에 `DATABASE_URL`로 저장
- 🔗 **의존성**: 없음 (Task 1.1, 1.2와 병렬 진행 가능)

**Task 1.4: 데이터베이스 스키마 생성 및 마이그레이션**

- **담당**: `backend-developer`
- **설명**: `PRD 8장`의 데이터 모델을 SQL 스크립트로 작성하고, Supabase SQL Editor 또는 psql을 통해 DB에 적용합니다.
- ✅ **완료 조건**:
  - [x] `database/schema.sql` 파일에 `users`, `todos`, `holidays` 테이블 DDL 작성 완료
  - [x] SQL 스크립트에 테이블 간 외래 키 관계(Foreign Key) 정의 완료
  - [x] Supabase SQL Editor 또는 psql을 사용하여 스크립트 실행 완료
  - [x] Supabase DB에 테이블, 컬럼, 인덱스, 제약조건 생성 확인
- 🔗 **의존성**: **Task 1.1**, **Task 1.3**

---

### Phase 2: 🔌 백엔드 API 개발 (Backend Development)

> **Task 1.4 완료 후**, Express.js 서버에 `PRD 9장`의 API를 구현합니다.

**Task 2.1: Express 서버 기본 구조 및 미들웨어 설정**

- **담당**: `backend-developer`
- **설명**: Express 앱 기본 구조(라우팅, 컨트롤러, 서비스)를 설정하고, `cors`, `helmet`, `express-rate-limit` 등 필수 미들웨어를 적용합니다.
- ✅ **완료 조건**:
  - [ ] 기본 Express 서버 실행 및 "Hello World" 응답 확인
  - [ ] `/api` 경로 설정 및 라우터 분리 구조 마련
  - [ ] CORS, Helmet 등 보안 및 유틸리티 미들웨어 적용 완료
- 🔗 **의존성**: **Task 1.1**

**Task 2.2: 사용자 인증(Auth) API 구현**

- **담당**: `backend-developer`
- **설명**: 회원가입, 로그인, 토큰 갱신 API를 구현합니다.
- ✅ **완료 조건**:
  - [ ] `POST /api/auth/register`: pg Pool을 사용한 INSERT 쿼리로 사용자 생성 및 `bcrypt` 해싱 처리
  - [ ] `POST /api/auth/login`: SELECT 쿼리로 사용자 검증 및 JWT(Access/Refresh Token) 발급
  - [ ] `POST /api/auth/refresh`: Refresh Token 검증 및 새 Access Token 발급
  - [ ] Prepared Statement 사용하여 SQL Injection 방지
- 🔗 **의존성**: **Task 1.4**, **Task 2.1**

**Task 2.3: API 인증 미들웨어 구현**

- **담당**: `backend-developer`
- **설명**: API 요청 헤더의 JWT를 검증하여 보호된 라우트에 대한 접근을 제어하는 Express 미들웨어를 작성합니다.
- ✅ **완료 조건**:
  - [ ] Access Token의 유효성을 검증하는 미들웨어 작성 완료
  - [ ] 유효한 토큰일 경우 `req` 객체에 사용자 정보 주입 후 다음 핸들러로 전달
  - [ ] 유효하지 않을 경우 401 Unauthorized 에러 응답
- 🔗 **의존성**: **Task 2.2**

**Task 2.4: 할일(Todo) 관련 API 전체 구현**

- **담당**: `backend-developer`
- **설명**: 할일의 CRUD, 상태 변경(완료, 복원, 삭제) API를 모두 구현합니다.
- ✅ **완료 조건**:
  - [ ] `GET /api/todos`: SELECT 쿼리로 할일 목록 조회 구현
  - [ ] `POST /api/todos`: INSERT 쿼리로 할일 생성 구현
  - [ ] `GET /api/todos/:id`: SELECT 쿼리로 특정 할일 조회 구현
  - [ ] `PUT /api/todos/:id`: UPDATE 쿼리로 할일 수정 구현
  - [ ] `PATCH /api/todos/:id/complete`: UPDATE 쿼리로 완료 상태 변경 구현
  - [ ] `DELETE /api/todos/:id`: UPDATE 쿼리로 논리 삭제(deleted_at 설정) 구현
  - [ ] `PATCH /api/todos/:id/restore`: UPDATE 쿼리로 복원(deleted_at NULL) 구현
  - [ ] 모든 쿼리에 Prepared Statement 사용하여 SQL Injection 방지
  - [ ] 모든 API에 **Task 2.3**의 인증 미들웨어를 적용하여 '자신의 할일'만 접근하도록 처리
- 🔗 **의존성**: **Task 1.4**, **Task 2.3**

**Task 2.5: 휴지통(Trash) 및 국경일(Holiday) API 구현**

- **담당**: `backend-developer`
- **설명**: 휴지통 조회/영구삭제 및 국경일 조회/관리 API를 구현합니다.
- ✅ **완료 조건**:
  - [ ] `GET /api/trash`: SELECT 쿼리로 deleted_at이 NULL이 아닌 할일 조회 구현
  - [ ] `DELETE /api/trash/:id`: DELETE 쿼리로 물리 삭제(영구삭제) 구현
  - [ ] `GET /api/holidays`: SELECT 쿼리로 국경일 목록 조회 구현 (전체 사용자용)
  - [ ] `POST /api/holidays`: INSERT 쿼리로 국경일 생성 구현 (관리자용)
  - [ ] `PUT /api/holidays/:id`: UPDATE 쿼리로 국경일 수정 구현 (관리자용)
  - [ ] 모든 쿼리에 Prepared Statement 사용하여 SQL Injection 방지
  - [ ] 국경일 관리 API에 관리자(`role='admin'`) 권한 확인 로직 적용
- 🔗 **의존성**: **Task 1.4**, **Task 2.3**

**Task 2.6: API 기능 테스트**

- **담당**: `test-automator`
- **설명**: API 테스트 도구(Postman, Thunder Client)를 사용하여 모든 API 엔드포인트가 명세서대로 동작하는지 확인합니다.
- ✅ **완료 조건**:
  - [ ] 모든 API에 대한 테스트 케이스 실행 및 통과 확인
  - [ ] 인증, 권한, 유효성 검사 등 예외 케이스 테스트 완료
- 🔗 **의존성**: **Task 2.2, 2.4, 2.5**

---

### Phase 3: 🎨 프론트엔드 개발 (Frontend Development)

> **Task 1.2 완료 후**, 백엔드 개발과 **병렬로 진행**합니다. 백엔드 API가 완성되기 전에는 Mock 데이터를 사용합니다.

**Task 3.1: 라우팅 및 페이지 레이아웃 설정**

- **담당**: `frontend-developer`
- **설명**: `react-router-dom`을 사용하여 페이지 라우팅을 설정하고, 공통 `Header`와 페이지 구조를 위한 `Layout` 컴포넌트를 구현합니다.
- ✅ **완료 조건**:
  - [ ] `react-router-dom`의 `createBrowserRouter`를 사용하여 라우팅 설정 완료
  - [ ] 공통 `Layout` 컴포넌트(Header 포함) 구현 및 각 페이지에 적용
  - [ ] 로그인 여부에 따라 접근을 제어하는 `PrivateRoute` 컴포넌트 구현
- 🔗 **의존성**: **Task 1.2**

**Task 3.2: 공통 UI 컴포넌트 개발**

- **담당**: `ui-designer`
- **설명**: `PRD 10.3`에 명시된 재사용 가능한 UI 컴포넌트를 Tailwind CSS를 사용하여 개발합니다.
- ✅ **완료 조건**:
  - [ ] `Button`, `Input`, `Modal`, `TodoCard` 등 공통 컴포넌트 구현 완료
  - [ ] (선택) Storybook을 사용하여 컴포넌트 독립적 테스트 및 문서화
- 🔗 **의존성**: **Task 1.2**

**Task 3.3: 전역 상태(Zustand) 및 API 클라이언트(Axios) 설정**

- **담당**: `react-specialist`
- **설명**: Zustand Store와 Axios 인스턴스를 설정합니다.
- ✅ **완료 조건**:
  - [ ] `authStore` (로그인 상태, 토큰), `todoStore` (할일 목록) 구현 완료
  - [ ] `axios` 인스턴스에 `baseURL` 설정 (`.env` 파일 활용)
  - [ ] API 요청 시 토큰을 헤더에 추가하고, 401 에러 시 토큰을 재발급하는 인터셉터 구현
- 🔗 **의존성**: **Task 1.2**

**Task 3.4: 회원가입 및 로그인 페이지 구현**

- **담당**: `frontend-developer`
- **설명**: `/register`, `/login` 페이지 UI와 폼 로직, API 연동을 구현합니다.
- ✅ **완료 조건**:
  - [ ] `react-hook-form`과 `zod`를 사용한 폼 및 유효성 검사 구현
  - [ ] 로그인/회원가입 API 연동 및 성공/실패 처리 완료
- 🔗 **의존성**: **Task 3.1, 3.2, 3.3** / (API 연동) **Task 2.2**

**Task 3.5: 할일 목록 페이지 및 모달 구현**

- **담당**: `javascript-pro`
- **설명**: 메인 페이지에서 할일 목록 조회, 추가, 수정, 삭제, 완료 기능을 구현합니다.
- ✅ **완료 조건**:
  - [ ] 페이지 진입 시 할일 목록 API 호출 및 `TodoCard` 컴포넌트로 렌더링
  - [ ] 할일 추가/수정 모달 기능 및 관련 API 연동 완료
  - [ ] 할일 완료/삭제 기능 및 관련 API 연동 완료
- 🔗 **의존성**: **Task 3.1, 3.2, 3.3** / (API 연동) **Task 2.4**

**Task 3.6: 휴지통 페이지 구현**

- **담당**: `frontend-developer`
- **설명**: `/trash` 페이지에서 삭제된 할일 목록 조회, 복원, 영구 삭제 기능을 구현합니다.
- ✅ **완료 조건**:
  - [ ] 페이지 진입 시 휴지통 목록 API 호출 및 렌더링
  - [ ] 복원, 영구 삭제 기능 및 관련 API 연동 완료
- 🔗 **의존성**: **Task 3.1, 3.2, 3.3** / (API 연동) **Task 2.5**

---

### Phase 4: 🧪 통합 및 배포 (Integration & Deployment)

> 모든 개별 기능 개발 완료 후 진행합니다.

**Task 4.1: E2E 테스트 및 버그 수정**

- **담당**: `test-automator`
- **설명**: 프론트엔드와 실제 배포된 백엔드 API를 연동하여 전체 사용자 시나리오를 테스트하고 버그를 수정합니다.
- ✅ **완료 조건**:
  - [ ] MVP 핵심 기능(회원가입-로그인-CRUD-로그아웃) 시나리오 통과
  - [ ] 반응형 디자인 및 주요 브라우저 호환성 테스트 완료
- 🔗 **의존성**: **Phase 2, Phase 3의 모든 P0 작업 완료**

**Task 4.2: 백엔드/프론트엔드 프로덕션 배포**

- **담당**: `fullstack-developer`
- **설명**: 백엔드(Express)와 프론트엔드(React) 프로젝트를 Vercel에 각각 배포합니다.
- ✅ **완료 조건**:
  - [ ] 백엔드 프로젝트를 Vercel Serverless Function으로 배포 완료
  - [ ] 프론트엔드 프로젝트를 Vercel Static Hosting으로 배포 완료
  - [ ] Vercel 환경 변수에 `DATABASE_URL`, `JWT_SECRET` 등 등록 완료
  - [ ] 백엔드 CORS 설정에 프론트엔드 프로덕션 도메인 추가
- 🔗 **의존성**: **Task 4.1**

**Task 4.3: 프로덕션 환경 최종 검증**

- **담당**: `project-manager`, `fullstack-developer`
- **설명**: 최종 배포된 프로덕션 URL에서 모든 기능이 정상적으로 동작하는지 최종 검증합니다.
- ✅ **완료 조건**:
  - [ ] 프로덕션 환경에서 E2E 테스트 시나리오 통과
- 🔗 **의존성**: **Task 4.2**
