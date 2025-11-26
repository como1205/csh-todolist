# csh-TodoList 데이터 모델 (ERD)

**버전**: 1.0
**작성일**: 2025-11-26
**상태**: 최종
**작성자**: Claude
**참조 문서**:
- [도메인 정의서](./1-domain-definition.md)
- [PRD](./3-prd.md)

---

## 목차

1. [개요](#1-개요)
2. [ERD 다이어그램](#2-erd-다이어그램)
3. [엔티티 상세](#3-엔티티-상세)
4. [관계 설명](#4-관계-설명)
5. [인덱스 전략](#5-인덱스-전략)
6. [제약조건](#6-제약조건)
7. [데이터베이스 스키마 (SQL)](#7-데이터베이스-스키마-sql)
8. [비즈니스 규칙](#8-비즈니스-규칙)

---

## 1. 개요

### 1.1 목적

본 문서는 csh-TodoList 애플리케이션의 데이터베이스 구조를 정의하고, 엔티티 간의 관계를 명확히 하기 위한 ERD(Entity Relationship Diagram) 문서입니다.

### 1.2 데이터베이스 정보

- **DBMS**: PostgreSQL 15+
- **호스팅**: Supabase
- **Driver**: pg (node-postgres)
- **주요 특징**:
  - UUID 기반 Primary Key
  - 소프트 삭제 지원 (Soft Delete)
  - 타임스탬프 자동 관리
  - 외래키 제약조건 (ON DELETE CASCADE)

### 1.3 엔티티 개요

| 엔티티 | 설명 | 주요 용도 |
|--------|------|-----------|
| **User** | 사용자 정보 | 인증 및 권한 관리 |
| **Todo** | 할일 정보 | 할일 생성, 조회, 수정, 삭제 |
| **Holiday** | 국경일 정보 | 공통 국경일 조회 및 표시 |

---

## 2. ERD 다이어그램

### 2.1 Mermaid ERD

```mermaid
erDiagram
    User ||--o{ Todo : "owns"

    User {
        uuid userId PK "사용자 고유 ID"
        varchar email UK "로그인 이메일"
        varchar password "bcrypt 해시된 비밀번호"
        varchar username "사용자 이름"
        enum role "사용자 역할 (user/admin)"
        timestamp createdAt "가입일시"
        timestamp updatedAt "최종 수정일시"
    }

    Todo {
        uuid todoId PK "할일 고유 ID"
        uuid userId FK "소유자 ID"
        varchar title "할일 제목"
        text content "할일 상세 내용"
        date startDate "시작일"
        date dueDate "만료일"
        enum status "할일 상태 (active/completed/deleted)"
        boolean isCompleted "완료 여부"
        timestamp createdAt "생성일시"
        timestamp updatedAt "최종 수정일시"
        timestamp deletedAt "삭제일시"
    }

    Holiday {
        uuid holidayId PK "국경일 고유 ID"
        varchar title "국경일 이름"
        date date "국경일 날짜"
        text description "설명"
        boolean isRecurring "매년 반복 여부"
        timestamp createdAt "생성일시"
        timestamp updatedAt "최종 수정일시"
    }
```

### 2.2 관계 다이어그램

```
┌─────────────────────────────┐
│          User               │
│  ┌─────────────────────┐    │
│  │ userId (PK)         │    │
│  │ email (unique)      │    │
│  │ password            │    │
│  │ username            │    │
│  │ role (user/admin)   │    │
│  │ createdAt           │    │
│  │ updatedAt           │    │
│  └─────────┬───────────┘    │
└────────────┼────────────────┘
             │
             │ 1:N
             │ (User owns many Todos)
             │
             ▼
┌─────────────────────────────┐
│          Todo               │
│  ┌─────────────────────┐    │
│  │ todoId (PK)         │    │
│  │ userId (FK) ────────┼────┘
│  │ title               │
│  │ content             │
│  │ startDate           │
│  │ dueDate             │
│  │ status              │
│  │ isCompleted         │
│  │ createdAt           │
│  │ updatedAt           │
│  │ deletedAt           │
│  └─────────────────────┘
└─────────────────────────────┘

┌─────────────────────────────┐
│        Holiday              │
│  ┌─────────────────────┐    │
│  │ holidayId (PK)      │    │
│  │ title               │    │
│  │ date                │    │
│  │ description         │    │
│  │ isRecurring         │    │
│  │ createdAt           │    │
│  │ updatedAt           │    │
│  └─────────────────────┘    │
└─────────────────────────────┘
(독립 엔티티 - 관계 없음)
```

---

## 3. 엔티티 상세

### 3.1 User (사용자)

#### 3.1.1 테이블 정의

| 필드명 | 타입 | 제약조건 | 기본값 | NULL 허용 | 설명 |
|--------|------|----------|--------|-----------|------|
| **userId** | UUID | PK | uuid() | NO | 사용자 고유 ID (Primary Key) |
| **email** | VARCHAR(255) | UNIQUE, NOT NULL | - | NO | 로그인용 이메일 주소 (고유값) |
| **password** | VARCHAR(255) | NOT NULL | - | NO | bcrypt 해시된 비밀번호 (salt rounds: 10) |
| **username** | VARCHAR(100) | NOT NULL | - | NO | 사용자 표시 이름 |
| **role** | ENUM('user', 'admin') | NOT NULL | 'user' | NO | 사용자 역할 (일반/관리자) |
| **createdAt** | TIMESTAMP | NOT NULL | now() | NO | 계정 생성일시 (자동 생성) |
| **updatedAt** | TIMESTAMP | NOT NULL | now() | NO | 최종 수정일시 (자동 갱신) |

#### 3.1.2 비즈니스 규칙

- [BR-01] 인증된 사용자만 애플리케이션 접근 가능
- [BR-02] 사용자는 자신의 할일만 조회/수정/삭제 가능
- 이메일은 시스템 내에서 고유해야 함
- 비밀번호는 평문 저장 금지 (bcrypt 해싱 필수)
- 관리자(role='admin')는 국경일 추가/수정 권한 보유

#### 3.1.3 샘플 데이터

```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "password": "$2b$10$...", // bcrypt hashed
  "username": "홍길동",
  "role": "user",
  "createdAt": "2025-11-25T10:00:00Z",
  "updatedAt": "2025-11-25T10:00:00Z"
}
```

### 3.2 Todo (할일)

#### 3.2.1 테이블 정의

| 필드명 | 타입 | 제약조건 | 기본값 | NULL 허용 | 설명 |
|--------|------|----------|--------|-----------|------|
| **todoId** | UUID | PK | uuid() | NO | 할일 고유 ID (Primary Key) |
| **userId** | UUID | FK, NOT NULL, INDEX | - | NO | 할일 소유자 ID (User.userId 참조) |
| **title** | VARCHAR(200) | NOT NULL | - | NO | 할일 제목 (필수 입력) |
| **content** | TEXT | - | - | YES | 할일 상세 내용 (선택 입력) |
| **startDate** | DATE | - | - | YES | 할일 시작일 (선택) |
| **dueDate** | DATE | CHECK | - | YES | 할일 만료일 (startDate 이후여야 함) |
| **status** | ENUM('active', 'completed', 'deleted') | NOT NULL, INDEX | 'active' | NO | 할일 상태 |
| **isCompleted** | BOOLEAN | NOT NULL | false | NO | 완료 여부 플래그 |
| **createdAt** | TIMESTAMP | NOT NULL | now() | NO | 할일 생성일시 (자동 생성) |
| **updatedAt** | TIMESTAMP | NOT NULL | now() | NO | 최종 수정일시 (자동 갱신) |
| **deletedAt** | TIMESTAMP | INDEX | - | YES | 삭제일시 (소프트 삭제용, NULL이면 미삭제) |

#### 3.2.2 상태(status) 설명

| 상태값 | 설명 | UI 표시 |
|--------|------|---------|
| **active** | 활성 상태의 할일 | 일반 목록에 표시 |
| **completed** | 완료된 할일 | 완료 표시와 함께 목록에 표시 |
| **deleted** | 삭제된 할일 (휴지통) | 휴지통에만 표시 |

#### 3.2.3 비즈니스 규칙

- [BR-02] 사용자는 자신의 할일만 조회/수정/삭제 가능
- [BR-05] 할일 삭제 시 휴지통으로 이동 (status='deleted', deletedAt 기록)
- [BR-06] 휴지통의 할일은 복원 가능
- [BR-07] 영구 삭제 시 DB에서 완전히 제거
- [BR-08] 할일 완료 시 isCompleted=true, status='completed'
- [BR-12] 만료일(dueDate)은 시작일(startDate)과 같거나 이후여야 함
- [BR-13] 만료일 지난 할일은 UI에서 시각적 구분 필요

#### 3.2.4 샘플 데이터

```json
{
  "todoId": "660e8400-e29b-41d4-a716-446655440001",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "title": "프로젝트 마감",
  "content": "PRD 작성 완료하기",
  "startDate": "2025-11-25",
  "dueDate": "2025-11-28",
  "status": "active",
  "isCompleted": false,
  "createdAt": "2025-11-25T10:00:00Z",
  "updatedAt": "2025-11-25T10:00:00Z",
  "deletedAt": null
}
```

### 3.3 Holiday (국경일)

#### 3.3.1 테이블 정의

| 필드명 | 타입 | 제약조건 | 기본값 | NULL 허용 | 설명 |
|--------|------|----------|--------|-----------|------|
| **holidayId** | UUID | PK | uuid() | NO | 국경일 고유 ID (Primary Key) |
| **title** | VARCHAR(100) | NOT NULL | - | NO | 국경일 이름 (예: "신정", "설날") |
| **date** | DATE | NOT NULL, INDEX | - | NO | 국경일 날짜 |
| **description** | TEXT | - | - | YES | 국경일 설명 (선택) |
| **isRecurring** | BOOLEAN | NOT NULL | true | NO | 매년 반복 여부 (대부분 true) |
| **createdAt** | TIMESTAMP | NOT NULL | now() | NO | 생성일시 (자동 생성) |
| **updatedAt** | TIMESTAMP | NOT NULL | now() | NO | 최종 수정일시 (자동 갱신) |

#### 3.3.2 비즈니스 규칙

- [BR-03] 모든 인증된 사용자가 조회 가능
- [BR-04] 관리자(role='admin')만 추가/수정 권한 보유
- [BR-09] 관리자만 국경일 추가/수정 가능
- [BR-10] 국경일은 삭제 불가 (수정만 가능)
- [BR-11] 매년 반복되는 일정 지원 (isRecurring=true)

#### 3.3.3 샘플 데이터

```json
[
  {
    "holidayId": "770e8400-e29b-41d4-a716-446655440002",
    "title": "신정",
    "date": "2025-01-01",
    "description": "새해 첫날",
    "isRecurring": true,
    "createdAt": "2025-11-25T00:00:00Z",
    "updatedAt": "2025-11-25T00:00:00Z"
  },
  {
    "holidayId": "880e8400-e29b-41d4-a716-446655440003",
    "title": "설날",
    "date": "2025-01-29",
    "description": "음력 1월 1일",
    "isRecurring": true,
    "createdAt": "2025-11-25T00:00:00Z",
    "updatedAt": "2025-11-25T00:00:00Z"
  },
  {
    "holidayId": "990e8400-e29b-41d4-a716-446655440004",
    "title": "광복절",
    "date": "2025-08-15",
    "description": "대한민국 독립 기념일",
    "isRecurring": true,
    "createdAt": "2025-11-25T00:00:00Z",
    "updatedAt": "2025-11-25T00:00:00Z"
  }
]
```

---

## 4. 관계 설명

### 4.1 User ↔ Todo (1:N)

- **관계 유형**: 일대다 (One-to-Many)
- **관계 설명**: 한 명의 사용자는 여러 개의 할일을 소유할 수 있음
- **외래키**: `Todo.userId` → `User.userId`
- **삭제 정책**: `ON DELETE CASCADE`
  - 사용자 삭제 시 해당 사용자의 모든 할일도 함께 삭제됨
- **비즈니스 의미**:
  - 각 할일은 반드시 한 명의 소유자를 가짐
  - 사용자는 0개 이상의 할일을 가질 수 있음
  - 타인의 할일은 조회/수정 불가

**쿼리 예시**:
```sql
-- 특정 사용자의 모든 활성 할일 조회
SELECT * FROM todos
WHERE "userId" = '550e8400-e29b-41d4-a716-446655440000'
  AND status = 'active'
ORDER BY "dueDate" ASC;
```

### 4.2 Holiday (독립 엔티티)

- **관계 유형**: 없음 (독립 엔티티)
- **관계 설명**: 국경일은 모든 사용자에게 공통으로 적용되므로 특정 사용자와 연결되지 않음
- **접근 권한**:
  - 조회: 모든 인증된 사용자
  - 추가/수정: 관리자(role='admin')만
  - 삭제: 불가
- **비즈니스 의미**:
  - 시스템 전체에서 공유하는 데이터
  - 사용자별 개인화 불가

**쿼리 예시**:
```sql
-- 2025년 모든 국경일 조회
SELECT * FROM holidays
WHERE EXTRACT(YEAR FROM date) = 2025
ORDER BY date ASC;
```

---

## 5. 인덱스 전략

### 5.1 User 테이블 인덱스

| 인덱스명 | 타입 | 컬럼 | 목적 | 예상 성능 향상 |
|----------|------|------|------|----------------|
| **PK_User** | PRIMARY KEY | userId | 고유 식별 | 필수 |
| **UK_User_email** | UNIQUE | email | 이메일 중복 방지 및 로그인 조회 | 로그인 쿼리 최적화 |
| **IX_User_role** | INDEX | role | 관리자 조회 | 관리자 필터링 시 향상 |

**쿼리 최적화 예시**:
```sql
-- 인덱스 활용: UK_User_email
SELECT * FROM users WHERE email = 'user@example.com'; -- O(log n)

-- 인덱스 활용: IX_User_role
SELECT * FROM users WHERE role = 'admin'; -- O(log n)
```

### 5.2 Todo 테이블 인덱스

| 인덱스명 | 타입 | 컬럼 | 목적 | 예상 성능 향상 |
|----------|------|------|------|----------------|
| **PK_Todo** | PRIMARY KEY | todoId | 고유 식별 | 필수 |
| **IX_Todo_userId_status** | COMPOSITE INDEX | userId, status | 사용자별 상태 조회 (가장 빈번한 쿼리) | 메인 화면 로딩 최적화 |
| **IX_Todo_dueDate** | INDEX | dueDate | 만료일 기준 정렬 | 날짜 정렬 쿼리 향상 |
| **IX_Todo_deletedAt** | INDEX | deletedAt | 휴지통 조회 | 휴지통 화면 최적화 |

**쿼리 최적화 예시**:
```sql
-- 인덱스 활용: IX_Todo_userId_status (복합 인덱스)
SELECT * FROM todos
WHERE "userId" = '...' AND status = 'active'; -- 매우 빠름

-- 인덱스 활용: IX_Todo_dueDate
SELECT * FROM todos
WHERE "userId" = '...'
ORDER BY "dueDate" ASC; -- 정렬 최적화

-- 인덱스 활용: IX_Todo_deletedAt
SELECT * FROM todos
WHERE "userId" = '...' AND "deletedAt" IS NOT NULL; -- 휴지통 조회
```

### 5.3 Holiday 테이블 인덱스

| 인덱스명 | 타입 | 컬럼 | 목적 | 예상 성능 향상 |
|----------|------|------|------|----------------|
| **PK_Holiday** | PRIMARY KEY | holidayId | 고유 식별 | 필수 |
| **IX_Holiday_date** | INDEX | date | 날짜 기준 조회 (연도별, 월별) | 국경일 조회 최적화 |

**쿼리 최적화 예시**:
```sql
-- 인덱스 활용: IX_Holiday_date
SELECT * FROM holidays
WHERE date >= '2025-01-01' AND date < '2026-01-01'
ORDER BY date ASC; -- 빠른 범위 검색
```

### 5.4 인덱스 설계 원칙

1. **Primary Key**: 모든 테이블에 UUID 기반 PK 설정
2. **Unique Index**: 비즈니스 고유 제약조건 (예: User.email)
3. **Foreign Key Index**: 조인 성능 향상 (예: Todo.userId)
4. **Composite Index**: 자주 함께 사용되는 컬럼 조합 (예: userId + status)
5. **Date Index**: 날짜 범위 검색 및 정렬 (예: dueDate, deletedAt)

---

## 6. 제약조건

### 6.1 Primary Key 제약조건

| 테이블 | 컬럼 | 제약조건 | 설명 |
|--------|------|----------|------|
| User | userId | PRIMARY KEY | UUID 자동 생성 |
| Todo | todoId | PRIMARY KEY | UUID 자동 생성 |
| Holiday | holidayId | PRIMARY KEY | UUID 자동 생성 |

### 6.2 Foreign Key 제약조건

| 테이블 | 컬럼 | 참조 테이블 | 참조 컬럼 | 삭제 정책 | 설명 |
|--------|------|-------------|-----------|-----------|------|
| Todo | userId | User | userId | CASCADE | 사용자 삭제 시 할일도 삭제 |

**삭제 정책 설명**:
- `ON DELETE CASCADE`: 부모 레코드 삭제 시 자식 레코드도 함께 삭제
- 사용자 탈퇴 시 해당 사용자의 모든 할일도 자동 삭제됨

### 6.3 Unique 제약조건

| 테이블 | 컬럼 | 제약조건 | 설명 |
|--------|------|----------|------|
| User | email | UNIQUE | 이메일 중복 불가 (로그인 ID) |

### 6.4 Check 제약조건

| 테이블 | 컬럼 | 제약조건 | 설명 |
|--------|------|----------|------|
| Todo | dueDate | CHECK (dueDate >= startDate) | 만료일은 시작일 이후여야 함 |

**SQL 제약조건 예시**:
```sql
ALTER TABLE todos
ADD CONSTRAINT CHK_Todo_DateRange
CHECK ("dueDate" IS NULL OR "startDate" IS NULL OR "dueDate" >= "startDate");
```

### 6.5 Not Null 제약조건

| 테이블 | 필수 컬럼 (NOT NULL) |
|--------|---------------------|
| **User** | userId, email, password, username, role, createdAt, updatedAt |
| **Todo** | todoId, userId, title, status, isCompleted, createdAt, updatedAt |
| **Holiday** | holidayId, title, date, isRecurring, createdAt, updatedAt |

### 6.6 Default 제약조건

| 테이블 | 컬럼 | 기본값 | 설명 |
|--------|------|--------|------|
| User | userId | uuid() | UUID 자동 생성 |
| User | role | 'user' | 일반 사용자 역할 |
| User | createdAt | now() | 현재 시각 |
| User | updatedAt | now() | 현재 시각 |
| Todo | todoId | uuid() | UUID 자동 생성 |
| Todo | status | 'active' | 활성 상태 |
| Todo | isCompleted | false | 미완료 |
| Todo | createdAt | now() | 현재 시각 |
| Todo | updatedAt | now() | 현재 시각 |
| Holiday | holidayId | uuid() | UUID 자동 생성 |
| Holiday | isRecurring | true | 매년 반복 |
| Holiday | createdAt | now() | 현재 시각 |
| Holiday | updatedAt | now() | 현재 시각 |

---

## 7. 데이터베이스 스키마 (SQL)

### 7.1 SQL Schema

```sql
-- ============================================
-- User 테이블
-- ============================================
CREATE TABLE users (
  "userId"    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "email"     VARCHAR(255) UNIQUE NOT NULL,
  "password"  VARCHAR(255) NOT NULL,
  "username"  VARCHAR(100) NOT NULL,
  "role"      VARCHAR(10) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX "IX_User_role" ON users(role);

-- ============================================
-- Todo 테이블
-- ============================================
CREATE TABLE todos (
  "todoId"      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId"      UUID NOT NULL REFERENCES users("userId") ON DELETE CASCADE,
  "title"       VARCHAR(200) NOT NULL,
  "content"     TEXT,
  "startDate"   DATE,
  "dueDate"     DATE,
  "status"      VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'deleted')),
  "isCompleted" BOOLEAN NOT NULL DEFAULT FALSE,
  "createdAt"   TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt"   TIMESTAMP NOT NULL DEFAULT NOW(),
  "deletedAt"   TIMESTAMP,
  CONSTRAINT "CHK_Todo_DateRange" CHECK ("dueDate" IS NULL OR "startDate" IS NULL OR "dueDate" >= "startDate")
);

CREATE INDEX "IX_Todo_userId_status" ON todos("userId", "status");
CREATE INDEX "IX_Todo_dueDate" ON todos("dueDate");
CREATE INDEX "IX_Todo_deletedAt" ON todos("deletedAt");

-- ============================================
-- Holiday 테이블
-- ============================================
CREATE TABLE holidays (
  "holidayId"   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "title"       VARCHAR(100) NOT NULL,
  "date"        DATE NOT NULL,
  "description" TEXT,
  "isRecurring" BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt"   TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt"   TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX "IX_Holiday_date" ON holidays(date);

-- ============================================
-- Triggers for updatedAt
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_todos_updated_at BEFORE UPDATE ON todos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_holidays_updated_at BEFORE UPDATE ON holidays
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 7.2 데이터베이스 마이그레이션

#### psql을 사용한 스키마 적용

```bash
# PostgreSQL 데이터베이스 접속
psql -h <HOST> -p <PORT> -U <USERNAME> -d <DATABASE>

# SQL 파일 실행
\i schema.sql

# 또는 직접 실행
psql -h <HOST> -p <PORT> -U <USERNAME> -d <DATABASE> -f schema.sql
```

#### Supabase SQL Editor 사용

1. Supabase 대시보드 접속
2. SQL Editor 탭 클릭
3. 위 SQL 스키마 붙여넣기
4. "Run" 버튼 클릭하여 실행

#### node-postgres를 사용한 마이그레이션 스크립트 예시

```javascript
// migrate.js
const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function migrate() {
  try {
    const sql = fs.readFileSync('./schema.sql', 'utf8');
    await pool.query(sql);
    console.log('마이그레이션 완료');
  } catch (error) {
    console.error('마이그레이션 실패:', error);
  } finally {
    await pool.end();
  }
}

migrate();
```

### 7.3 환경 변수 설정

`.env` 파일:
```env
# Supabase PostgreSQL Connection String
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

# 예시:
# DATABASE_URL="postgresql://postgres:mypassword@db.abc123.supabase.co:5432/postgres"
```

---

## 8. 비즈니스 규칙

### 8.1 인증 및 권한

| 규칙 코드 | 설명 | 적용 대상 |
|-----------|------|-----------|
| [BR-01] | 인증된 사용자만 애플리케이션 접근 가능 | 모든 API |
| [BR-02] | 사용자는 자신의 할일만 조회/수정/삭제 가능 | Todo API |
| [BR-03] | 모든 인증된 사용자가 국경일 조회 가능 | Holiday API (GET) |
| [BR-04] | 관리자(role='admin')만 국경일 추가/수정 권한 | Holiday API (POST/PUT) |
| [BR-09] | 관리자만 국경일 추가/수정 가능 | Holiday API |

### 8.2 할일 관리

| 규칙 코드 | 설명 | 구현 방법 |
|-----------|------|-----------|
| [BR-05] | 할일 삭제 시 휴지통으로 이동 (소프트 삭제) | status='deleted', deletedAt 기록 |
| [BR-06] | 휴지통의 할일은 복원 가능 | status='active', deletedAt=null 변경 |
| [BR-07] | 영구 삭제 시 DB에서 완전히 제거 | DELETE FROM todos WHERE ... |
| [BR-08] | 할일 완료 시 isCompleted=true, status='completed' | UPDATE todos SET "isCompleted"=true, status='completed' |
| [BR-12] | 만료일(dueDate)은 시작일(startDate)과 같거나 이후여야 함 | CHECK 제약조건 또는 애플리케이션 검증 |
| [BR-13] | 만료일 지난 할일은 UI에서 시각적 구분 | 프론트엔드에서 현재 날짜와 비교하여 표시 |

### 8.3 국경일 관리

| 규칙 코드 | 설명 | 구현 방법 |
|-----------|------|-----------|
| [BR-10] | 국경일은 삭제 불가 (수정만 가능) | DELETE API 미제공 |
| [BR-11] | 매년 반복되는 일정 지원 | isRecurring 필드 활용 |

### 8.4 데이터 검증 규칙

| 엔티티 | 필드 | 검증 규칙 |
|--------|------|-----------|
| User | email | 이메일 형식 검증, 중복 확인 |
| User | password | 최소 8자 이상 (평문), bcrypt 해싱 |
| User | username | 1-100자 이내 |
| Todo | title | 필수 입력, 1-200자 이내 |
| Todo | dueDate | startDate 이후여야 함 (NULL 허용) |
| Holiday | title | 필수 입력, 1-100자 이내 |
| Holiday | date | 유효한 날짜 형식 |

---

## 부록

### A. 쿼리 예시

#### A.1 사용자별 활성 할일 조회 (정렬)

```sql
SELECT "todoId", title, "startDate", "dueDate", status, "isCompleted"
FROM todos
WHERE "userId" = '550e8400-e29b-41d4-a716-446655440000'
  AND status = 'active'
ORDER BY "dueDate" ASC NULLS LAST;
```

#### A.2 휴지통 조회

```sql
SELECT "todoId", title, "deletedAt"
FROM todos
WHERE "userId" = '550e8400-e29b-41d4-a716-446655440000'
  AND status = 'deleted'
ORDER BY "deletedAt" DESC;
```

#### A.3 만료일 지난 할일 조회

```sql
SELECT "todoId", title, "dueDate"
FROM todos
WHERE "userId" = '550e8400-e29b-41d4-a716-446655440000'
  AND status = 'active'
  AND "dueDate" < CURRENT_DATE
ORDER BY "dueDate" ASC;
```

#### A.4 특정 연도 국경일 조회

```sql
SELECT "holidayId", title, date, description
FROM holidays
WHERE EXTRACT(YEAR FROM date) = 2025
ORDER BY date ASC;
```

### B. 데이터베이스 생성 SQL

```sql
-- ============================================
-- User 테이블
-- ============================================
CREATE TABLE users (
  "userId"    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "email"     VARCHAR(255) UNIQUE NOT NULL,
  "password"  VARCHAR(255) NOT NULL,
  "username"  VARCHAR(100) NOT NULL,
  "role"      VARCHAR(10) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX "IX_User_role" ON users(role);

-- ============================================
-- Todo 테이블
-- ============================================
CREATE TABLE todos (
  "todoId"      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId"      UUID NOT NULL REFERENCES users("userId") ON DELETE CASCADE,
  "title"       VARCHAR(200) NOT NULL,
  "content"     TEXT,
  "startDate"   DATE,
  "dueDate"     DATE,
  "status"      VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'deleted')),
  "isCompleted" BOOLEAN NOT NULL DEFAULT FALSE,
  "createdAt"   TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt"   TIMESTAMP NOT NULL DEFAULT NOW(),
  "deletedAt"   TIMESTAMP,
  CONSTRAINT "CHK_Todo_DateRange" CHECK ("dueDate" IS NULL OR "startDate" IS NULL OR "dueDate" >= "startDate")
);

CREATE INDEX "IX_Todo_userId_status" ON todos("userId", "status");
CREATE INDEX "IX_Todo_dueDate" ON todos("dueDate");
CREATE INDEX "IX_Todo_deletedAt" ON todos("deletedAt");

-- ============================================
-- Holiday 테이블
-- ============================================
CREATE TABLE holidays (
  "holidayId"   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "title"       VARCHAR(100) NOT NULL,
  "date"        DATE NOT NULL,
  "description" TEXT,
  "isRecurring" BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt"   TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt"   TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX "IX_Holiday_date" ON holidays(date);

-- ============================================
-- Triggers for updatedAt
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_todos_updated_at BEFORE UPDATE ON todos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_holidays_updated_at BEFORE UPDATE ON holidays
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### C. 변경 이력

| 버전 | 날짜 | 변경 내용 | 작성자 |
|------|------|----------|--------|
| 1.0 | 2025-11-26 | ERD 문서 초안 작성 | Claude |

---

**문서 종료**
