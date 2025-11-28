-- ============================================
-- csh-TodoList Database Schema
-- ============================================
-- 프로젝트명: csh-TodoList
-- 버전: 1.1
-- 작성일: 2025-11-26
-- 최종 수정: 2025-11-28
-- 데이터베이스: PostgreSQL 15+ (로컬)
-- ORM: Prisma
-- 인코딩: UTF-8
--
-- 사용 방법:
--   1. psql 클라이언트에서 실행:
--      psql -h localhost -U postgres -d csh_todolist -f schema.sql
--   2. 또는 PostgreSQL GUI 도구(pgAdmin, DBeaver 등)에서 실행
--   3. 환경변수 DATABASE_URL 설정 후 Prisma 사용
--      DATABASE_URL=postgresql://postgres:postgres@localhost:5432/csh_todolist
--
-- 주의사항:
--   - 이 스크립트는 기존 테이블을 삭제합니다 (DROP TABLE IF EXISTS)
--   - 프로덕션 환경에서는 백업 후 실행하세요
--   - 초기 데이터(관리자, 국경일)가 포함되어 있습니다
-- ============================================

-- ============================================
-- 1. Extension 설정
-- ============================================
-- UUID 자동 생성을 위한 Extension 활성화
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 2. 기존 테이블 삭제 (개발 환경용)
-- ============================================
-- 의존성 순서대로 삭제 (외래키 고려)
DROP TABLE IF EXISTS todos CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS holidays CASCADE;

-- 기존 Enum 타입 삭제
DROP TYPE IF EXISTS "Role" CASCADE;
DROP TYPE IF EXISTS "TodoStatus" CASCADE;

-- ============================================
-- 3. Enum 타입 생성
-- ============================================
-- 사용자 역할 Enum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- 할일 상태 Enum
CREATE TYPE "TodoStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'DELETED');

-- ============================================
-- 4. 테이블 생성
-- ============================================

-- --------------------------------------------
-- 4.1 users 테이블
-- --------------------------------------------
-- 사용자 정보 (인증 및 권한 관리)
CREATE TABLE users (
  "userId"    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "email"     VARCHAR(255) UNIQUE NOT NULL,
  "password"  VARCHAR(255) NOT NULL,  -- bcrypt 해시된 비밀번호 (salt rounds: 10)
  "username"  VARCHAR(100) NOT NULL,
  "role"      "Role" NOT NULL DEFAULT 'USER',
  "createdAt" TIMESTAMP(6) NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT NOW()
);

-- users 테이블 코멘트
COMMENT ON TABLE users IS '사용자 정보 테이블 (인증 및 권한 관리)';
COMMENT ON COLUMN users."userId" IS '사용자 고유 ID (Primary Key)';
COMMENT ON COLUMN users."email" IS '로그인용 이메일 주소 (고유값)';
COMMENT ON COLUMN users."password" IS 'bcrypt 해시된 비밀번호 (salt rounds: 10)';
COMMENT ON COLUMN users."username" IS '사용자 표시 이름';
COMMENT ON COLUMN users."role" IS '사용자 역할 (USER: 일반 사용자, ADMIN: 관리자)';
COMMENT ON COLUMN users."createdAt" IS '계정 생성일시 (자동 생성)';
COMMENT ON COLUMN users."updatedAt" IS '최종 수정일시 (자동 갱신)';

-- --------------------------------------------
-- 4.2 todos 테이블
-- --------------------------------------------
-- 할일 정보 (할일 생성, 조회, 수정, 삭제)
CREATE TABLE todos (
  "todoId"      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId"      UUID NOT NULL,
  "title"       VARCHAR(200) NOT NULL,
  "content"     TEXT,
  "startDate"   DATE,
  "dueDate"     DATE,
  "status"      "TodoStatus" NOT NULL DEFAULT 'ACTIVE',
  "isCompleted" BOOLEAN NOT NULL DEFAULT FALSE,
  "createdAt"   TIMESTAMP(6) NOT NULL DEFAULT NOW(),
  "updatedAt"   TIMESTAMP(6) NOT NULL DEFAULT NOW(),
  "deletedAt"   TIMESTAMP(6),

  -- 외래키 제약조건
  CONSTRAINT "FK_Todo_User"
    FOREIGN KEY ("userId")
    REFERENCES users("userId")
    ON DELETE CASCADE,

  -- Check 제약조건: 만료일은 시작일 이후여야 함
  CONSTRAINT "CHK_Todo_DateRange"
    CHECK ("dueDate" IS NULL OR "startDate" IS NULL OR "dueDate" >= "startDate")
);

-- todos 테이블 코멘트
COMMENT ON TABLE todos IS '할일 정보 테이블 (할일 생성, 조회, 수정, 삭제)';
COMMENT ON COLUMN todos."todoId" IS '할일 고유 ID (Primary Key)';
COMMENT ON COLUMN todos."userId" IS '할일 소유자 ID (users.userId 참조)';
COMMENT ON COLUMN todos."title" IS '할일 제목 (필수 입력)';
COMMENT ON COLUMN todos."content" IS '할일 상세 내용 (선택 입력)';
COMMENT ON COLUMN todos."startDate" IS '할일 시작일 (선택)';
COMMENT ON COLUMN todos."dueDate" IS '할일 만료일 (startDate 이후여야 함)';
COMMENT ON COLUMN todos."status" IS '할일 상태 (ACTIVE: 활성, COMPLETED: 완료, DELETED: 삭제)';
COMMENT ON COLUMN todos."isCompleted" IS '완료 여부 플래그';
COMMENT ON COLUMN todos."createdAt" IS '할일 생성일시 (자동 생성)';
COMMENT ON COLUMN todos."updatedAt" IS '최종 수정일시 (자동 갱신)';
COMMENT ON COLUMN todos."deletedAt" IS '삭제일시 (소프트 삭제용, NULL이면 미삭제)';

-- --------------------------------------------
-- 4.3 holidays 테이블
-- --------------------------------------------
-- 국경일 정보 (공통 국경일 조회 및 표시)
CREATE TABLE holidays (
  "holidayId"   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "title"       VARCHAR(100) NOT NULL,
  "date"        DATE NOT NULL,
  "description" TEXT,
  "isRecurring" BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt"   TIMESTAMP(6) NOT NULL DEFAULT NOW(),
  "updatedAt"   TIMESTAMP(6) NOT NULL DEFAULT NOW()
);

-- holidays 테이블 코멘트
COMMENT ON TABLE holidays IS '국경일 정보 테이블 (공통 국경일 조회 및 표시)';
COMMENT ON COLUMN holidays."holidayId" IS '국경일 고유 ID (Primary Key)';
COMMENT ON COLUMN holidays."title" IS '국경일 이름 (예: 신정, 설날)';
COMMENT ON COLUMN holidays."date" IS '국경일 날짜';
COMMENT ON COLUMN holidays."description" IS '국경일 설명 (선택)';
COMMENT ON COLUMN holidays."isRecurring" IS '매년 반복 여부 (대부분 true)';
COMMENT ON COLUMN holidays."createdAt" IS '생성일시 (자동 생성)';
COMMENT ON COLUMN holidays."updatedAt" IS '최종 수정일시 (자동 갱신)';

-- ============================================
-- 5. 인덱스 생성
-- ============================================

-- --------------------------------------------
-- 5.1 users 테이블 인덱스
-- --------------------------------------------
-- 이메일 고유 인덱스 (로그인 조회 최적화)
-- CREATE UNIQUE INDEX "UK_User_email" ON users("email"); -- UNIQUE 제약조건이 자동으로 인덱스 생성

-- 역할 인덱스 (관리자 필터링 최적화)
CREATE INDEX "IX_User_role" ON users("role");

-- --------------------------------------------
-- 5.2 todos 테이블 인덱스
-- --------------------------------------------
-- 복합 인덱스: 사용자별 상태 조회 (가장 빈번한 쿼리)
CREATE INDEX "IX_Todo_userId_status" ON todos("userId", "status");

-- 만료일 인덱스 (날짜 정렬 쿼리 최적화)
CREATE INDEX "IX_Todo_dueDate" ON todos("dueDate");

-- 삭제일 인덱스 (휴지통 조회 최적화)
CREATE INDEX "IX_Todo_deletedAt" ON todos("deletedAt");

-- 외래키 인덱스 (조인 성능 향상)
-- CREATE INDEX "IX_Todo_userId" ON todos("userId"); -- 복합 인덱스로 커버됨

-- --------------------------------------------
-- 5.3 holidays 테이블 인덱스
-- --------------------------------------------
-- 날짜 인덱스 (연도별, 월별 조회 최적화)
CREATE INDEX "IX_Holiday_date" ON holidays("date");

-- ============================================
-- 6. Trigger 생성 (updatedAt 자동 업데이트)
-- ============================================

-- --------------------------------------------
-- 6.1 updatedAt 자동 업데이트 함수
-- --------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 함수 코멘트
COMMENT ON FUNCTION update_updated_at_column() IS 'updatedAt 컬럼을 현재 시각으로 자동 업데이트하는 트리거 함수';

-- --------------------------------------------
-- 6.2 각 테이블별 UPDATE 트리거
-- --------------------------------------------
-- users 테이블 트리거
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- todos 테이블 트리거
CREATE TRIGGER update_todos_updated_at
  BEFORE UPDATE ON todos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- holidays 테이블 트리거
CREATE TRIGGER update_holidays_updated_at
  BEFORE UPDATE ON holidays
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 7. 초기 데이터 삽입 (Optional)
-- ============================================

-- --------------------------------------------
-- 7.1 테스트용 관리자 계정
-- --------------------------------------------
-- 비밀번호: admin123 (bcrypt hash: $2b$10$xK8TQxQqK8GqJ0JQJq.xJuqQ8KxP2K8L2K8L2K8L2K8L2K8L2K8L2)
-- 실제 사용 시 반드시 변경하세요!
INSERT INTO users ("userId", "email", "password", "username", "role", "createdAt", "updatedAt")
VALUES
  (
    uuid_generate_v4(),
    'admin@csh-todolist.com',
    '$2b$10$xK8TQxQqK8GqJ0JQJq.xJuqQ8KxP2K8L2K8L2K8L2K8L2K8L2K8L2',  -- 실제 bcrypt hash로 교체 필요
    '시스템 관리자',
    'ADMIN',
    NOW(),
    NOW()
  );

-- --------------------------------------------
-- 7.2 2025년 주요 국경일
-- --------------------------------------------
INSERT INTO holidays ("holidayId", "title", "date", "description", "isRecurring", "createdAt", "updatedAt")
VALUES
  -- 1월
  (uuid_generate_v4(), '신정', '2025-01-01', '새해 첫날', TRUE, NOW(), NOW()),
  (uuid_generate_v4(), '설날', '2025-01-28', '음력 1월 1일 전날', TRUE, NOW(), NOW()),
  (uuid_generate_v4(), '설날', '2025-01-29', '음력 1월 1일', TRUE, NOW(), NOW()),
  (uuid_generate_v4(), '설날', '2025-01-30', '음력 1월 2일', TRUE, NOW(), NOW()),

  -- 3월
  (uuid_generate_v4(), '삼일절', '2025-03-01', '3·1 독립운동 기념일', TRUE, NOW(), NOW()),

  -- 5월
  (uuid_generate_v4(), '어린이날', '2025-05-05', '어린이날', TRUE, NOW(), NOW()),
  (uuid_generate_v4(), '석가탄신일', '2025-05-05', '음력 4월 8일', TRUE, NOW(), NOW()),
  (uuid_generate_v4(), '현충일', '2025-06-06', '국가를 위해 희생한 분들을 기리는 날', TRUE, NOW(), NOW()),

  -- 8월
  (uuid_generate_v4(), '광복절', '2025-08-15', '대한민국 독립 기념일', TRUE, NOW(), NOW()),

  -- 9월
  (uuid_generate_v4(), '추석', '2025-10-05', '음력 8월 14일', TRUE, NOW(), NOW()),
  (uuid_generate_v4(), '추석', '2025-10-06', '음력 8월 15일', TRUE, NOW(), NOW()),
  (uuid_generate_v4(), '추석', '2025-10-07', '음력 8월 16일', TRUE, NOW(), NOW()),

  -- 10월
  (uuid_generate_v4(), '개천절', '2025-10-03', '대한민국 건국 기념일', TRUE, NOW(), NOW()),
  (uuid_generate_v4(), '한글날', '2025-10-09', '한글 반포 기념일', TRUE, NOW(), NOW()),

  -- 12월
  (uuid_generate_v4(), '크리스마스', '2025-12-25', '기독탄신일', TRUE, NOW(), NOW());

-- ============================================
-- 8. 권한 설정 (Supabase/RLS 사용 시)
-- ============================================
-- Row Level Security (RLS) 활성화
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE holidays ENABLE ROW LEVEL SECURITY;

-- users 테이블 정책
-- 사용자는 자신의 정보만 조회 가능
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT
  USING (auth.uid()::text = "userId"::text);

-- 사용자는 자신의 정보만 수정 가능
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE
  USING (auth.uid()::text = "userId"::text);

-- todos 테이블 정책
-- 사용자는 자신의 할일만 조회 가능
CREATE POLICY "Users can view own todos" ON todos
  FOR SELECT
  USING (auth.uid()::text = "userId"::text);

-- 사용자는 자신의 할일만 생성 가능
CREATE POLICY "Users can create own todos" ON todos
  FOR INSERT
  WITH CHECK (auth.uid()::text = "userId"::text);

-- 사용자는 자신의 할일만 수정 가능
CREATE POLICY "Users can update own todos" ON todos
  FOR UPDATE
  USING (auth.uid()::text = "userId"::text);

-- 사용자는 자신의 할일만 삭제 가능
CREATE POLICY "Users can delete own todos" ON todos
  FOR DELETE
  USING (auth.uid()::text = "userId"::text);

-- holidays 테이블 정책
-- 모든 인증된 사용자가 국경일 조회 가능
CREATE POLICY "Authenticated users can view holidays" ON holidays
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- 관리자만 국경일 추가/수정 가능
-- 주의: 관리자 판별 로직은 애플리케이션 레벨에서 구현 필요
-- 아래는 예시이며, 실제로는 users 테이블과 조인하여 role 확인 필요
CREATE POLICY "Admins can manage holidays" ON holidays
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users."userId"::text = auth.uid()::text
        AND users."role" = 'ADMIN'
    )
  );

-- ============================================
-- 9. 스키마 검증 쿼리
-- ============================================
-- 테이블 목록 조회
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;

-- 인덱스 목록 조회
-- SELECT indexname, tablename FROM pg_indexes WHERE schemaname = 'public' ORDER BY tablename, indexname;

-- 제약조건 목록 조회
-- SELECT conname, contype, conrelid::regclass AS table_name
-- FROM pg_constraint
-- WHERE connamespace = 'public'::regnamespace
-- ORDER BY conrelid::regclass::text, conname;

-- ============================================
-- 스키마 생성 완료
-- ============================================
-- 다음 단계:
--   1. Prisma 스키마 파일 생성: prisma/schema.prisma
--   2. Prisma 마이그레이션 실행: npx prisma migrate dev
--   3. Prisma Client 생성: npx prisma generate
--   4. 애플리케이션에서 데이터베이스 연결 테스트
-- ============================================
