## 📋 설명

할일의 CRUD, 상태 변경(완료, 복원, 삭제) API를 모두 구현합니다.

## ✅ Todo

- [ ] `GET /api/todos`, `POST /api/todos`, `GET /api/todos/:id`, `PUT /api/todos/:id` 구현
- [ ] `PATCH /api/todos/:id/complete`, `DELETE /api/todos/:id`, `PATCH /api/todos/:id/restore` 구현
- [ ] 모든 API에 인증 미들웨어를 적용하여 '자신의 할일'만 접근하도록 처리

## ✅ 완료 조건

1. 할일 목록 조회 (`GET /api/todos`)
   - Query params: `status`, `isCompleted`, `dueDate`
   - 현재 사용자의 삭제되지 않은(`isDeleted=false`) 할일만 조회
   - 정렬: `createdAt` 내림차순
   - Response: `{ todos: Todo[] }`

2. 할일 생성 (`POST /api/todos`)
   - Request Body: `{ title, description?, dueDate? }`
   - 유효성 검사: title 필수 (1-200자)
   - userId는 `req.user.userId`에서 자동 설정
   - Response: `{ todo: Todo }`

3. 할일 상세 조회 (`GET /api/todos/:id`)
   - 본인의 할일만 조회 가능
   - 삭제되지 않은 할일만 조회
   - Response: `{ todo: Todo }`
   - 없으면 404 Not Found

4. 할일 수정 (`PUT /api/todos/:id`)
   - Request Body: `{ title?, description?, status?, dueDate? }`
   - 본인의 할일만 수정 가능
   - Response: `{ todo: Todo }`

5. 할일 완료/미완료 토글 (`PATCH /api/todos/:id/complete`)
   - `isCompleted` 필드를 토글
   - `status`를 "completed" 또는 "pending"으로 변경
   - Response: `{ todo: Todo }`

6. 할일 삭제 (휴지통으로 이동) (`DELETE /api/todos/:id`)
   - `isDeleted=true`, `deletedAt=현재시각` 설정
   - 실제로 DB에서 삭제하지 않음 (soft delete)
   - Response: `{ message: "할일이 휴지통으로 이동되었습니다" }`

7. 할일 복원 (`PATCH /api/todos/:id/restore`)
   - `isDeleted=false`, `deletedAt=null` 설정
   - Response: `{ todo: Todo }`

8. 권한 검증
   - 모든 API에서 `todo.userId === req.user.userId` 검증
   - 본인의 할일이 아니면 403 Forbidden

9. 에러 처리
   - 할일 없음: 404 Not Found
   - 권한 없음: 403 Forbidden
   - 유효성 검사 실패: 400 Bad Request

## 🔧 기술적 고려사항

**구현 구조**:
```
src/
├── routes/
│   └── todos.routes.ts         # 라우트 정의
├── controllers/
│   └── todos.controller.ts     # 요청/응답 처리
├── services/
│   └── todos.service.ts        # 비즈니스 로직 (Prisma 사용)
└── middlewares/
    └── auth.middleware.ts      # 인증 미들웨어 (적용)
```

**Prisma 쿼리 예시**:
```typescript
// 할일 목록 조회 (현재 사용자, 삭제되지 않은 것만)
const todos = await prisma.todo.findMany({
  where: {
    userId: req.user!.userId,
    isDeleted: false,
  },
  orderBy: {
    createdAt: 'desc',
  },
});

// 할일 생성
const todo = await prisma.todo.create({
  data: {
    title,
    description,
    dueDate,
    userId: req.user!.userId,
  },
});

// 할일 완료 토글
const todo = await prisma.todo.update({
  where: { id },
  data: {
    isCompleted: !currentTodo.isCompleted,
    status: !currentTodo.isCompleted ? 'completed' : 'pending',
  },
});

// 할일 삭제 (soft delete)
const todo = await prisma.todo.update({
  where: { id },
  data: {
    isDeleted: true,
    deletedAt: new Date(),
  },
});
```

**유효성 검사**:
- express-validator 또는 zod 사용
- title: 1-200자 문자열
- description: 최대 1000자 (선택)
- dueDate: ISO 8601 날짜 형식 (선택)

**주의사항**:
- Soft delete 구현 (실제 삭제는 휴지통에서만)
- 모든 API에 authenticate 미들웨어 적용
- userId는 토큰에서 자동 추출
- 쿼리 성능을 위해 userId에 index 설정 (Task 1.4에서 완료)

## 🔗 의존성

**선행 작업**:
- Task 1.4: Prisma 스키마 정의 및 마이그레이션
- Task 2.3: API 인증 미들웨어 구현

**후행 작업**:
- Task 2.6: API 기능 테스트
- Task 3.5: 할일 목록 페이지 및 모달 구현

## 👤 담당

`backend-developer`

## 📚 참고 문서

- docs/3-prd.md (9.2장: 할일 API)
- Prisma CRUD: https://www.prisma.io/docs/concepts/components/prisma-client/crud
- Express 라우팅: https://expressjs.com/en/guide/routing.html
