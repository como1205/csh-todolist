## 📋 설명

`PRD 8장`의 데이터 모델을 기반으로 `database/schema.sql` 파일을 생성하고, PostgreSQL raw SQL 마이그레이션을 사용하여 Supabase DB에 적용합니다.

## ✅ Todo

- [ ] `database/schema.sql` 파일에 `User`, `Todo`, `Holiday` 테이블 DDL 정의 완료
- [ ] `pg` (node-postgres)를 사용하여 마이그레이션 스크립트 실행
- [ ] Supabase DB에 테이블 및 필드 생성 확인
- [ ] 데이터베이스 연결 및 쿼리 테스트 완료

## ✅ 완료 조건

1. `database/schema.sql` 파일 완성
   - PostgreSQL 15+ 문법 사용
   - User 테이블: userId, email, password, username, role, createdAt, updatedAt
   - Todo 테이블: todoId, userId, title, content, startDate, dueDate, status, isCompleted, deletedAt, createdAt, updatedAt
   - Holiday 테이블: holidayId, title, date, description, isRecurring, createdAt, updatedAt

2. 테이블 간 관계 정의
   - User ↔ Todo: 1:N 관계 (FOREIGN KEY)
   - userId에 index 추가
   - cascading delete 설정 (ON DELETE CASCADE)

3. 마이그레이션 실행 성공
   ```bash
   psql -h <HOST> -U <USER> -d <DATABASE> -f database/schema.sql
   ```
   - PostgreSQL DDL 및 트리거 생성 확인
   - Supabase DB에 테이블 생성 확인

4. 데이터베이스 연결 테스트
   ```javascript
   const { Pool } = require('pg');
   // 데이터베이스 연결 테스트 코드
   ```
   - pg Pool 생성 확인
   - 연결 테스트 성공 확인

5. (선택) 데이터베이스 초기 데이터 삽입
   ```sql
   INSERT INTO holidays VALUES (...);  -- 2025년 주요 국경일
   ```

## 🔧 기술적 고려사항

**사용 기술**:
- Database Driver: pg (node-postgres)
- Database: PostgreSQL (Supabase)
- Query Style: Raw SQL with Prepared Statements

**schema.sql 주요 구성**:
```sql
-- User 테이블
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

-- Todo 테이블
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

-- updatedAt 자동 업데이트 트리거
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
```

**주의사항**:
- DATABASE_URL이 `.env` 파일에 올바르게 설정되어 있어야 함
- SQL Injection 방지를 위해 Prepared Statements 사용
- pg Pool을 통한 Connection 관리

## 🔗 의존성

**선행 작업**:
- Task 1.1: 백엔드 프로젝트 초기화
- Task 1.3: 데이터베이스(Supabase) 설정

**후행 작업**:
- Phase 2 모든 백엔드 API 개발

## 👤 담당

`backend-developer`

## 📚 참고 문서

- docs/3-prd.md (8장: 데이터 모델)
- docs/5-arch-diagram.md (3장: 백엔드 아키텍처)
- docs/6-erd.md (ERD 다이어그램)
- pg (node-postgres) 문서: https://node-postgres.com/
- PostgreSQL 문서: https://www.postgresql.org/docs/
