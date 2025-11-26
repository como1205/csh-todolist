## 📋 설명

회원가입, 로그인, 토큰 갱신 API를 구현합니다.

## ✅ Todo

- [ ] `POST /api/auth/register`: 사용자 생성 및 `bcrypt` 해싱 처리
- [ ] `POST /api/auth/login`: 사용자 검증 및 JWT(Access/Refresh Token) 발급
- [ ] `POST /api/auth/refresh`: Refresh Token 검증 및 새 Access Token 발급

## ✅ 완료 조건

1. 회원가입 API (`POST /api/auth/register`)
   - Request Body: `{ email, password, username }`
   - 이메일 중복 검사
   - 비밀번호 bcrypt 해싱 (salt rounds: 10)
   - pg (node-postgres)로 User 생성
   - Response: `{ user: { userId, email, username, role } }`

2. 로그인 API (`POST /api/auth/login`)
   - Request Body: `{ email, password }`
   - 이메일로 사용자 조회
   - bcrypt로 비밀번호 검증
   - JWT Access Token 발급 (유효기간: 15분)
   - JWT Refresh Token 발급 (유효기간: 7일)
   - Response: `{ accessToken, refreshToken, user: { userId, email, username, role } }`

3. 토큰 갱신 API (`POST /api/auth/refresh`)
   - Request Body: `{ refreshToken }`
   - Refresh Token 검증
   - 새로운 Access Token 발급
   - Response: `{ accessToken }`

4. 에러 처리
   - 이메일 중복: 409 Conflict
   - 잘못된 인증 정보: 401 Unauthorized
   - 유효하지 않은 토큰: 401 Unauthorized
   - 서버 오류: 500 Internal Server Error

5. 환경변수 설정
   - `JWT_SECRET`: JWT 서명용 시크릿 키
   - `JWT_EXPIRES_IN`: Access Token 유효기간 (예: "15m")
   - `JWT_REFRESH_EXPIRES_IN`: Refresh Token 유효기간 (예: "7d")

## 🔧 기술적 고려사항

**사용 기술**:
- bcrypt: 비밀번호 해싱
- jsonwebtoken: JWT 생성 및 검증
- pg (node-postgres): 데이터베이스 접근

**구현 구조**:
```
src/
├── routes/
│   └── auth.routes.ts          # 라우트 정의
├── controllers/
│   └── auth.controller.ts      # 요청/응답 처리
├── services/
│   └── auth.service.ts         # 비즈니스 로직
└── types/
    └── auth.types.ts           # 타입 정의
```

**JWT Payload 예시**:
```typescript
{
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}
```

**bcrypt 사용 예시**:
```typescript
import bcrypt from 'bcrypt';

// 해싱
const hashedPassword = await bcrypt.hash(password, 10);

// 검증
const isValid = await bcrypt.compare(password, user.password);
```

**JWT 생성 예시**:
```typescript
import jwt from 'jsonwebtoken';

const accessToken = jwt.sign(
  { userId: user.userId, email: user.email, role: user.role },
  process.env.JWT_SECRET!,
  { expiresIn: '15m' }
);
```

**pg (node-postgres) 사용 예시**:
```typescript
// 사용자 생성
const { rows } = await pool.query(
  `INSERT INTO users (email, password, username)
   VALUES ($1, $2, $3)
   RETURNING "userId", email, username, role`,
  [email, hashedPassword, username]
);

// 사용자 조회
const { rows } = await pool.query(
  `SELECT "userId", email, password, role
   FROM users
   WHERE email = $1`,
  [email]
);
```

**주의사항**:
- 비밀번호는 절대 평문으로 저장하지 않음
- JWT_SECRET은 강력한 랜덤 문자열 사용
- 환경변수는 `.env` 파일에서 관리
- SQL Injection 방지를 위해 Prepared Statements 사용

## 🔗 의존성

**선행 작업**:
- Task 1.4: 데이터베이스 스키마 정의 및 마이그레이션
- Task 2.1: Express 서버 기본 구조 설정

**후행 작업**:
- Task 2.3: API 인증 미들웨어 구현
- Task 3.4: 회원가입 및 로그인 페이지 구현

## 👤 담당

`backend-developer`

## 📚 참고 문서

- docs/3-prd.md (9.1장: 인증 API)
- bcrypt 문서: https://github.com/kelektiv/node.bcrypt.js
- jsonwebtoken 문서: https://github.com/auth0/node-jsonwebtoken
- JWT 소개: https://jwt.io/
- pg (node-postgres) 문서: https://node-postgres.com/
