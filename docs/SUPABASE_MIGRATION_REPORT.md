# Supabase 마이그레이션 보고서

**마이그레이션 일시**: 2025-11-28
**소스**: 로컬 PostgreSQL (localhost:5432/csh_todolist)
**대상**: Supabase MyProject (ap-northeast-2, 서울)
**프로젝트 ID**: djuoiaahkfycodyecijr

---

## 1. 마이그레이션 개요

로컬 PostgreSQL 데이터베이스의 전체 스키마를 Supabase 클라우드로 성공적으로 마이그레이션했습니다.

### 사용된 도구
- **PostgreSQL MCP**: 로컬 DB 스키마 추출
- **Supabase MCP**: Supabase 마이그레이션 적용 및 검증

### 마이그레이션 방식
- 단일 마이그레이션 파일로 전체 스키마 적용
- 마이그레이션 이름: `initial_schema_migration`
- 마이그레이션 버전: `20251128014637`

---

## 2. 마이그레이션 결과 요약

| 항목 | 상태 | 세부 내용 |
|------|------|-----------|
| **Extension** | ✅ 성공 | uuid-ossp 설치 완료 |
| **ENUM 타입** | ✅ 성공 | Role, TodoStatus 생성 완료 |
| **테이블** | ✅ 성공 | users, todos, holidays 테이블 생성 완료 |
| **인덱스** | ✅ 성공 | 5개 인덱스 생성 완료 |
| **트리거** | ✅ 성공 | updatedAt 자동 업데이트 트리거 3개 생성 완료 |
| **RLS 정책** | ✅ 성공 | 8개 보안 정책 생성 완료 |
| **초기 데이터** | ✅ 성공 | 관리자 계정 1개, 국경일 15개 삽입 완료 |

**최종 상태**: ✅ **마이그레이션 100% 완료**

---

## 3. 생성된 스키마 상세

### 3.1 Extension

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

**설치 확인**: ✅ 설치됨 (extensions 스키마)

### 3.2 ENUM 타입

#### Role ENUM
```sql
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');
```
- **값**: USER, ADMIN
- **사용 위치**: users.role 컬럼

#### TodoStatus ENUM
```sql
CREATE TYPE "TodoStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'DELETED');
```
- **값**: ACTIVE, COMPLETED, DELETED
- **사용 위치**: todos.status 컬럼

### 3.3 테이블

#### users 테이블
- **Primary Key**: userId (UUID)
- **Unique 제약**: email
- **컬럼 수**: 7개
- **RLS 활성화**: ✅ YES
- **현재 레코드 수**: 1개 (관리자 계정)

**컬럼 구조**:
```sql
userId      UUID           PRIMARY KEY DEFAULT uuid_generate_v4()
email       VARCHAR(255)   UNIQUE NOT NULL
password    VARCHAR(255)   NOT NULL
username    VARCHAR(100)   NOT NULL
role        "Role"         NOT NULL DEFAULT 'USER'
createdAt   TIMESTAMP(6)   NOT NULL DEFAULT NOW()
updatedAt   TIMESTAMP(6)   NOT NULL DEFAULT NOW()
```

#### todos 테이블
- **Primary Key**: todoId (UUID)
- **Foreign Key**: userId → users.userId (ON DELETE CASCADE)
- **컬럼 수**: 11개
- **RLS 활성화**: ✅ YES
- **현재 레코드 수**: 0개

**컬럼 구조**:
```sql
todoId      UUID           PRIMARY KEY DEFAULT uuid_generate_v4()
userId      UUID           NOT NULL
title       VARCHAR(200)   NOT NULL
content     TEXT           NULL
startDate   DATE           NULL
dueDate     DATE           NULL
status      "TodoStatus"   NOT NULL DEFAULT 'ACTIVE'
isCompleted BOOLEAN        NOT NULL DEFAULT FALSE
createdAt   TIMESTAMP(6)   NOT NULL DEFAULT NOW()
updatedAt   TIMESTAMP(6)   NOT NULL DEFAULT NOW()
deletedAt   TIMESTAMP(6)   NULL
```

**제약조건**:
- `FK_Todo_User`: userId → users.userId ON DELETE CASCADE
- `CHK_Todo_DateRange`: dueDate >= startDate (NULL 허용)

#### holidays 테이블
- **Primary Key**: holidayId (UUID)
- **컬럼 수**: 7개
- **RLS 활성화**: ✅ YES
- **현재 레코드 수**: 15개 (2025년 국경일)

**컬럼 구조**:
```sql
holidayId   UUID           PRIMARY KEY DEFAULT uuid_generate_v4()
title       VARCHAR(100)   NOT NULL
date        DATE           NOT NULL
description TEXT           NULL
isRecurring BOOLEAN        NOT NULL DEFAULT TRUE
createdAt   TIMESTAMP(6)   NOT NULL DEFAULT NOW()
updatedAt   TIMESTAMP(6)   NOT NULL DEFAULT NOW()
```

### 3.4 인덱스

| 인덱스 이름 | 테이블 | 컬럼 | 타입 |
|------------|--------|------|------|
| IX_User_role | users | role | INDEX |
| IX_Todo_userId_status | todos | userId, status | COMPOSITE INDEX |
| IX_Todo_dueDate | todos | dueDate | INDEX |
| IX_Todo_deletedAt | todos | deletedAt | INDEX |
| IX_Holiday_date | holidays | date | INDEX |

**추가 자동 인덱스**:
- users.email: UNIQUE 제약으로 인한 자동 인덱스
- 각 테이블의 Primary Key: 자동 인덱스

### 3.5 트리거 및 함수

#### updatedAt 자동 업데이트 함수
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

**트리거 목록**:
1. `update_users_updated_at`: users 테이블
2. `update_todos_updated_at`: todos 테이블
3. `update_holidays_updated_at`: holidays 테이블

### 3.6 Row Level Security (RLS) 정책

#### users 테이블 정책
1. **Users can view own profile** (SELECT)
   - 조건: `auth.uid()::text = "userId"::text`
   - 설명: 사용자는 자신의 프로필만 조회 가능

2. **Users can update own profile** (UPDATE)
   - 조건: `auth.uid()::text = "userId"::text`
   - 설명: 사용자는 자신의 프로필만 수정 가능

#### todos 테이블 정책
1. **Users can view own todos** (SELECT)
   - 조건: `auth.uid()::text = "userId"::text`
   - 설명: 사용자는 자신의 할일만 조회 가능

2. **Users can create own todos** (INSERT)
   - 조건: `auth.uid()::text = "userId"::text`
   - 설명: 사용자는 자신의 할일만 생성 가능

3. **Users can update own todos** (UPDATE)
   - 조건: `auth.uid()::text = "userId"::text`
   - 설명: 사용자는 자신의 할일만 수정 가능

4. **Users can delete own todos** (DELETE)
   - 조건: `auth.uid()::text = "userId"::text`
   - 설명: 사용자는 자신의 할일만 삭제 가능

#### holidays 테이블 정책
1. **Authenticated users can view holidays** (SELECT)
   - 조건: `auth.role() = 'authenticated'`
   - 설명: 모든 인증된 사용자가 국경일 조회 가능

2. **Admins can manage holidays** (ALL)
   - 조건: `EXISTS (SELECT 1 FROM users WHERE users."userId"::text = auth.uid()::text AND users."role" = 'ADMIN')`
   - 설명: 관리자만 국경일 관리 가능

---

## 4. 초기 데이터

### 4.1 관리자 계정
- **이메일**: admin@csh-todolist.com
- **사용자명**: 시스템 관리자
- **역할**: ADMIN
- **비밀번호**: admin123 (bcrypt 해시됨)
- **주의**: 프로덕션 환경에서는 반드시 비밀번호 변경 필요

### 4.2 국경일 데이터 (2025년)
총 **15개** 국경일 삽입:

| 날짜 | 국경일 이름 | 설명 |
|------|------------|------|
| 2025-01-01 | 신정 | 새해 첫날 |
| 2025-01-28 | 설날 | 음력 1월 1일 전날 |
| 2025-01-29 | 설날 | 음력 1월 1일 |
| 2025-01-30 | 설날 | 음력 1월 2일 |
| 2025-03-01 | 삼일절 | 3·1 독립운동 기념일 |
| 2025-05-05 | 어린이날 | 어린이날 |
| 2025-05-05 | 석가탄신일 | 음력 4월 8일 |
| 2025-06-06 | 현충일 | 국가를 위해 희생한 분들을 기리는 날 |
| 2025-08-15 | 광복절 | 대한민국 독립 기념일 |
| 2025-10-03 | 개천절 | 대한민국 건국 기념일 |
| 2025-10-05 | 추석 | 음력 8월 14일 |
| 2025-10-06 | 추석 | 음력 8월 15일 |
| 2025-10-07 | 추석 | 음력 8월 16일 |
| 2025-10-09 | 한글날 | 한글 반포 기념일 |
| 2025-12-25 | 크리스마스 | 기독탄신일 |

---

## 5. 검증 결과

### 5.1 테이블 검증
```
✅ users 테이블 생성 완료
✅ todos 테이블 생성 완료
✅ holidays 테이블 생성 완료
```

### 5.2 데이터 검증
```
✅ users 테이블: 1개 레코드 (관리자 계정)
✅ todos 테이블: 0개 레코드 (정상)
✅ holidays 테이블: 15개 레코드 (2025년 국경일)
```

### 5.3 RLS 검증
```
✅ users 테이블: RLS 활성화
✅ todos 테이블: RLS 활성화
✅ holidays 테이블: RLS 활성화
```

### 5.4 Extension 검증
```
✅ uuid-ossp: 설치 완료 (extensions 스키마)
✅ pgcrypto: 설치 완료 (extensions 스키마)
✅ pg_graphql: 설치 완료 (graphql 스키마)
✅ pg_stat_statements: 설치 완료 (extensions 스키마)
✅ supabase_vault: 설치 완료 (vault 스키마)
```

### 5.5 마이그레이션 목록
```
✅ 20251128014637_initial_schema_migration
```

---

## 6. 다음 단계

### 6.1 애플리케이션 연결
로컬 애플리케이션을 Supabase로 연결하려면 다음 단계를 수행하세요:

1. **Supabase 프로젝트 정보 확인**
   ```bash
   프로젝트 ID: djuoiaahkfycodyecijr
   리전: ap-northeast-2 (서울)
   ```

2. **Supabase URL 및 API 키 가져오기**
   - Supabase 대시보드에서 Project Settings → API 메뉴 확인
   - `SUPABASE_URL`: 프로젝트 URL
   - `SUPABASE_ANON_KEY`: 익명 API 키

3. **환경 변수 설정**
   ```bash
   # .env 파일 업데이트
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.djuoiaahkfycodyecijr.supabase.co:5432/postgres
   SUPABASE_URL=https://djuoiaahkfycodyecijr.supabase.co
   SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
   ```

4. **Prisma 스키마 업데이트** (선택사항)
   ```bash
   # Prisma를 사용하는 경우
   npx prisma db pull
   npx prisma generate
   ```

### 6.2 보안 설정
1. **관리자 비밀번호 변경**
   - admin@csh-todolist.com 계정의 비밀번호를 즉시 변경하세요
   - 테스트용 bcrypt 해시는 보안에 취약합니다

2. **RLS 정책 검토**
   - 현재 RLS 정책이 비즈니스 요구사항에 맞는지 확인
   - 필요시 추가 정책 생성

3. **API 키 보안**
   - `SUPABASE_ANON_KEY`는 클라이언트 사이드에서 사용 가능
   - `SUPABASE_SERVICE_KEY`는 서버 사이드에서만 사용
   - 환경 변수를 Git에 커밋하지 마세요

### 6.3 데이터 마이그레이션 (선택사항)
로컬 DB에 기존 사용자 데이터나 할일 데이터가 있다면:

1. **데이터 내보내기**
   ```bash
   # PostgreSQL MCP 사용
   pg_export_table_data --table=users --output=users.json
   pg_export_table_data --table=todos --output=todos.json
   ```

2. **데이터 가져오기**
   ```bash
   # Supabase에 데이터 삽입
   # Supabase 대시보드의 SQL Editor 또는 Supabase MCP 사용
   ```

### 6.4 모니터링 설정
1. **Supabase 대시보드**
   - Database → Tables: 데이터 확인
   - Database → Logs: 쿼리 로그 확인
   - Auth: 사용자 인증 관리

2. **알림 설정**
   - 데이터베이스 사용량 알림
   - API 사용량 알림

---

## 7. 주의사항

### 7.1 Supabase vs 로컬 PostgreSQL 차이점
1. **RLS 필수**
   - Supabase는 RLS를 통한 보안이 필수입니다
   - 모든 테이블에 적절한 RLS 정책을 설정해야 합니다

2. **auth 스키마**
   - `auth.uid()`, `auth.role()` 함수는 Supabase Auth와 통합됩니다
   - 로컬 PostgreSQL에는 없는 기능입니다

3. **Extensions 스키마**
   - uuid-ossp는 `extensions` 스키마에 설치됩니다
   - 함수 호출 시 `extensions.uuid_generate_v4()` 형태로 사용됩니다

### 7.2 비용 관리
- **Free Tier 제한**: 500MB 데이터베이스, 2GB 대역폭/월
- **Pro Plan**: 월 $25 (8GB 데이터베이스, 50GB 대역폭)
- 사용량을 주기적으로 확인하세요

### 7.3 백업
- Supabase는 자동 백업을 제공합니다 (Pro Plan 이상)
- Free Tier에서는 수동 백업을 권장합니다

---

## 8. 마이그레이션 SQL 전문

전체 마이그레이션 SQL은 다음 위치에 저장되어 있습니다:
- **소스 파일**: `database/schema.sql`
- **Supabase 마이그레이션**: Supabase 대시보드 → Database → Migrations에서 확인 가능

---

## 9. 결론

✅ **마이그레이션 성공**

로컬 PostgreSQL 데이터베이스의 모든 스키마, 제약조건, 인덱스, 트리거, RLS 정책이 Supabase로 성공적으로 마이그레이션되었습니다.

**마이그레이션 통계**:
- 테이블: 3개
- ENUM 타입: 2개
- 인덱스: 5개 (+ 자동 인덱스)
- 트리거: 3개
- RLS 정책: 8개
- 초기 데이터: 관리자 1개, 국경일 15개

**Supabase 프로젝트 정보**:
- 프로젝트명: MyProject
- 리전: ap-northeast-2 (서울)
- 프로젝트 ID: djuoiaahkfycodyecijr
- 상태: ACTIVE_HEALTHY

이제 애플리케이션을 Supabase에 연결하여 사용할 수 있습니다!

---

**작성일**: 2025-11-28
**작성자**: Claude (AI)
**도구**: PostgreSQL MCP, Supabase MCP
