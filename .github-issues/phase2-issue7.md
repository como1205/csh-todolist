## 📋 설명

API 요청 헤더의 JWT를 검증하여 보호된 라우트에 대한 접근을 제어하는 Express 미들웨어를 작성합니다.

## ✅ Todo

- [ ] Access Token의 유효성을 검증하는 미들웨어 작성 완료
- [ ] 유효한 토큰일 경우 `req` 객체에 사용자 정보 주입 후 다음 핸들러로 전달
- [ ] 유효하지 않을 경우 401 Unauthorized 에러 응답

## ✅ 완료 조건

1. 인증 미들웨어 구현 (`src/middlewares/auth.middleware.ts`)
   - Authorization 헤더에서 Bearer token 추출
   - JWT 토큰 검증
   - 토큰 payload에서 사용자 정보 추출
   - `req.user`에 사용자 정보 저장

2. 타입 확장
   ```typescript
   // src/types/express.d.ts
   import { Request } from 'express';

   declare global {
     namespace Express {
       interface Request {
         user?: {
           userId: string;
           email: string;
           role: string;
         };
       }
     }
   }
   ```

3. 에러 처리
   - 토큰 없음: 401 "인증 토큰이 필요합니다"
   - 잘못된 형식: 401 "올바르지 않은 토큰 형식입니다"
   - 만료된 토큰: 401 "토큰이 만료되었습니다"
   - 유효하지 않은 토큰: 401 "유효하지 않은 토큰입니다"

4. 보호된 라우트에 미들웨어 적용
   - 모든 `/api/todos` 라우트
   - 모든 `/api/trash` 라우트
   - 관리자 전용 `/api/holidays` 라우트 (POST, PUT, DELETE)

5. (선택) 역할 기반 인증 미들웨어
   ```typescript
   // requireAdmin 미들웨어
   // user.role === 'admin' 검증
   ```

## 🔧 기술적 고려사항

**미들웨어 구현 예시**:
```typescript
// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Authorization 헤더 확인
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: '인증 토큰이 필요합니다' });
    }

    // 2. Bearer token 추출
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: '올바르지 않은 토큰 형식입니다' });
    }

    // 3. JWT 검증
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      email: string;
      role: string;
    };

    // 4. req.user에 저장
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: '토큰이 만료되었습니다' });
    }
    return res.status(401).json({ error: '유효하지 않은 토큰입니다' });
  }
};

// 관리자 전용 미들웨어
export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: '관리자 권한이 필요합니다' });
  }
  next();
};
```

**라우트 적용 예시**:
```typescript
// src/routes/todos.routes.ts
import { authenticate } from '../middlewares/auth.middleware';

router.get('/todos', authenticate, todoController.getAll);
router.post('/todos', authenticate, todoController.create);

// 관리자 전용
router.post('/holidays', authenticate, requireAdmin, holidayController.create);
```

**주의사항**:
- Authorization 헤더 형식: `Bearer <token>`
- 미들웨어 순서: authenticate → requireAdmin
- TypeScript 타입 확장 필요 (`express.d.ts`)
- 에러 메시지는 보안을 고려하여 작성

## 🔗 의존성

**선행 작업**:
- Task 2.2: 사용자 인증 API 구현

**후행 작업**:
- Task 2.4: 할일 API 구현 (미들웨어 적용)
- Task 2.5: 휴지통 및 국경일 API 구현 (미들웨어 적용)

## 👤 담당

`backend-developer`

## 📚 참고 문서

- docs/3-prd.md (9장: API 명세 - 인증 요구사항)
- Express 미들웨어: https://expressjs.com/en/guide/writing-middleware.html
- TypeScript Express 타입 확장: https://stackoverflow.com/questions/37377731/extend-express-request-object-using-typescript
