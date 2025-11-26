## 📋 설명

`PRD 8장`의 데이터 모델을 `prisma/schema.prisma` 파일에 정의하고, `prisma migrate`를 실행하여 Supabase DB에 적용합니다.

## ✅ Todo

- [ ] `schema.prisma` 파일에 `User`, `Todo`, `Holiday` 모델 및 관계 정의 완료
- [ ] `prisma migrate dev` 실행 성공 및 마이그레이션 히스토리 생성
- [ ] Supabase DB에 테이블 및 필드 생성 확인
- [ ] 타입이 적용된 Prisma Client 생성 확인

## ✅ 완료 조건

1. `schema.prisma` 파일 완성
   - provider: postgresql
   - User 모델: id, email, password, name, role, createdAt
   - Todo 모델: id, title, description, status, isCompleted, dueDate, isDeleted, deletedAt, userId, createdAt, updatedAt
   - Holiday 모델: id, date, name, createdAt

2. 모델 간 관계 정의
   - User ↔ Todo: 1:N 관계
   - userId에 index 추가
   - cascading delete 설정

3. 마이그레이션 실행 성공
   ```bash
   npx prisma migrate dev --name init
   ```
   - migrations/ 폴더에 마이그레이션 파일 생성
   - Supabase DB에 테이블 생성 확인

4. Prisma Client 생성 확인
   ```bash
   npx prisma generate
   ```
   - node_modules/@prisma/client 생성 확인
   - TypeScript 타입 자동 생성 확인

5. (선택) Prisma Studio로 데이터베이스 확인
   ```bash
   npx prisma studio
   ```

## 🔧 기술적 고려사항

**사용 기술**:
- ORM: Prisma
- Database: PostgreSQL (Supabase)

**schema.prisma 주요 설정**:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  role      String   @default("user")
  createdAt DateTime @default(now())
  todos     Todo[]
}

model Todo {
  id          String    @id @default(uuid())
  title       String
  description String?
  status      String    @default("pending")
  isCompleted Boolean   @default(false)
  dueDate     DateTime?
  isDeleted   Boolean   @default(false)
  deletedAt   DateTime?
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([userId])
}

model Holiday {
  id        String   @id @default(uuid())
  date      DateTime
  name      String
  createdAt DateTime @default(now())

  @@unique([date])
}
```

**주의사항**:
- DATABASE_URL이 `.env` 파일에 올바르게 설정되어 있어야 함
- 마이그레이션은 개발 환경에서 먼저 테스트
- Prisma Client는 마이그레이션 후 자동 생성됨

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
- database/schema.sql
- Prisma 문서: https://www.prisma.io/docs
- Prisma Schema 참조: https://www.prisma.io/docs/concepts/components/prisma-schema
