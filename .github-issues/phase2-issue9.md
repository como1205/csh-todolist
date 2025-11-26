## 📋 설명

휴지통 조회/영구삭제 및 국경일 조회/관리 API를 구현합니다.

## ✅ Todo

- [ ] `GET /api/trash`, `DELETE /api/trash/:id` 구현 완료
- [ ] `GET /api/holidays` (전체 사용자용), `POST /api/holidays`, `PUT /api/holidays/:id` (관리자용) 구현
- [ ] 국경일 관리 API에 관리자(`role='admin'`) 권한 확인 로직 적용

## ✅ 완료 조건

### 휴지통 API

1. 휴지통 목록 조회 (`GET /api/trash`)
   - 현재 사용자의 삭제된(`isDeleted=true`) 할일만 조회
   - 정렬: `deletedAt` 내림차순
   - Response: `{ todos: Todo[] }`

2. 할일 영구 삭제 (`DELETE /api/trash/:id`)
   - DB에서 실제로 삭제 (hard delete)
   - 본인의 할일만 삭제 가능 (`userId` 검증)
   - 삭제된 할일(`isDeleted=true`)만 영구 삭제 가능
   - Response: `{ message: "할일이 영구적으로 삭제되었습니다" }`
   - 없으면 404 Not Found

### 국경일 API

3. 국경일 목록 조회 (`GET /api/holidays`)
   - 모든 사용자 접근 가능 (인증 불필요)
   - Query params: `year`, `month` (선택)
   - 정렬: `date` 오름차순
   - Response: `{ holidays: Holiday[] }`

4. 국경일 생성 (`POST /api/holidays`) - 관리자 전용
   - Request Body: `{ date, name }`
   - `authenticate` + `requireAdmin` 미들웨어 적용
   - 날짜 중복 검사 (unique constraint)
   - Response: `{ holiday: Holiday }`

5. 국경일 수정 (`PUT /api/holidays/:id`) - 관리자 전용
   - Request Body: `{ date?, name? }`
   - `authenticate` + `requireAdmin` 미들웨어 적용
   - Response: `{ holiday: Holiday }`

6. 국경일 삭제 (`DELETE /api/holidays/:id`) - 관리자 전용
   - `authenticate` + `requireAdmin` 미들웨어 적용
   - Response: `{ message: "국경일이 삭제되었습니다" }`

7. 권한 검증
   - 휴지통 API: 본인의 할일만 접근
   - 국경일 관리 API: 관리자(`role='admin'`) 권한 필요

8. 에러 처리
   - 권한 없음: 403 Forbidden
   - 리소스 없음: 404 Not Found
   - 날짜 중복: 409 Conflict

## 🔧 기술적 고려사항

**구현 구조**:
```
src/
├── routes/
│   ├── trash.routes.ts         # 휴지통 라우트
│   └── holidays.routes.ts      # 국경일 라우트
├── controllers/
│   ├── trash.controller.ts
│   └── holidays.controller.ts
├── services/
│   ├── trash.service.ts
│   └── holidays.service.ts
└── middlewares/
    └── auth.middleware.ts      # authenticate, requireAdmin
```

**Prisma 쿼리 예시**:
```typescript
// 휴지통 목록 조회
const trashedTodos = await prisma.todo.findMany({
  where: {
    userId: req.user!.userId,
    isDeleted: true,
  },
  orderBy: {
    deletedAt: 'desc',
  },
});

// 할일 영구 삭제 (hard delete)
await prisma.todo.delete({
  where: { id },
});

// 국경일 목록 조회 (특정 년도)
const holidays = await prisma.holiday.findMany({
  where: {
    date: {
      gte: new Date(`${year}-01-01`),
      lt: new Date(`${year + 1}-01-01`),
    },
  },
  orderBy: {
    date: 'asc',
  },
});

// 국경일 생성
const holiday = await prisma.holiday.create({
  data: { date, name },
});
```

**미들웨어 적용 예시**:
```typescript
// src/routes/trash.routes.ts
router.get('/trash', authenticate, trashController.getAll);
router.delete('/trash/:id', authenticate, trashController.permanentDelete);

// src/routes/holidays.routes.ts
router.get('/holidays', holidayController.getAll);  // 인증 불필요
router.post('/holidays', authenticate, requireAdmin, holidayController.create);
router.put('/holidays/:id', authenticate, requireAdmin, holidayController.update);
router.delete('/holidays/:id', authenticate, requireAdmin, holidayController.delete);
```

**주의사항**:
- 휴지통에서만 hard delete 수행
- 국경일 날짜는 unique constraint 설정 (Task 1.4에서 완료)
- 국경일 조회는 모든 사용자 접근 가능
- 국경일 관리는 관리자만 가능

**유효성 검사**:
- date: ISO 8601 날짜 형식
- name: 1-100자 문자열

## 🔗 의존성

**선행 작업**:
- Task 1.4: Prisma 스키마 정의 및 마이그레이션
- Task 2.3: API 인증 미들웨어 구현

**후행 작업**:
- Task 2.6: API 기능 테스트
- Task 3.6: 휴지통 페이지 구현

## 👤 담당

`backend-developer`

## 📚 참고 문서

- docs/3-prd.md (9.3장: 휴지통 API, 9.4장: 국경일 API)
- Prisma Delete: https://www.prisma.io/docs/concepts/components/prisma-client/crud#delete
- Express 미들웨어 체이닝: https://expressjs.com/en/guide/using-middleware.html
