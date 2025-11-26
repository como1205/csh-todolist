## 📋 설명

Express 앱 기본 구조(라우팅, 컨트롤러, 서비스)를 설정하고, `cors`, `helmet`, `express-rate-limit` 등 필수 미들웨어를 적용합니다.

## ✅ Todo

- [ ] 기본 Express 서버 실행 및 "Hello World" 응답 확인
- [ ] `/api` 경로 설정 및 라우터 분리 구조 마련
- [ ] CORS, Helmet 등 보안 및 유틸리티 미들웨어 적용 완료

## ✅ 완료 조건

1. Express 서버 기본 구조 완성
   - `src/index.ts`: 서버 엔트리 포인트
   - Express app 초기화 및 미들웨어 설정
   - 포트 설정 (환경변수 또는 기본값 3000)

2. 폴더 구조 완성
   ```
   backend/src/
   ├── controllers/     # API 컨트롤러
   ├── services/        # 비즈니스 로직
   ├── routes/          # 라우트 정의
   ├── middlewares/     # 커스텀 미들웨어
   ├── types/           # TypeScript 타입 정의
   └── index.ts         # 진입점
   ```

3. 필수 미들웨어 적용
   - `express.json()`: JSON 파싱
   - `express.urlencoded()`: URL 인코딩 파싱
   - `cors()`: CORS 허용 설정
   - `helmet()`: 보안 헤더 설정
   - `express-rate-limit`: Rate limiting (옵션)

4. 라우터 분리 구조
   - `/api/health`: 헬스체크 엔드포인트
   - `/api/auth`: 인증 관련 라우트 (향후 추가)
   - `/api/todos`: 할일 관련 라우트 (향후 추가)
   - `/api/trash`: 휴지통 관련 라우트 (향후 추가)
   - `/api/holidays`: 국경일 관련 라우트 (향후 추가)

5. 서버 실행 확인
   ```bash
   npm run dev
   # 또는
   npx ts-node src/index.ts
   ```
   - http://localhost:3000/api/health 접속 시 응답 확인

## 🔧 기술적 고려사항

**사용 기술**:
- Express.js 4.x
- TypeScript
- 미들웨어: cors, helmet, express-rate-limit

**기본 서버 구조 예시**:
```typescript
// src/index.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

// 헬스체크
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// 라우터 (향후 추가)
// app.use('/api/auth', authRouter);
// app.use('/api/todos', todoRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**주의사항**:
- CORS 설정 시 프론트엔드 개발 서버 주소 허용
- 환경변수로 PORT, CORS origin 관리
- Rate limiting은 API 남용 방지를 위해 적용 권장

**package.json scripts 추가**:
```json
{
  "scripts": {
    "dev": "nodemon --exec ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

## 🔗 의존성

**선행 작업**:
- Task 1.1: 백엔드 프로젝트 초기화

**후행 작업**:
- Task 2.2: 사용자 인증 API 구현
- Task 2.4: 할일 API 구현
- Task 2.5: 휴지통 및 국경일 API 구현

## 👤 담당

`backend-developer`

## 📚 참고 문서

- docs/3-prd.md (9장: API 명세)
- docs/5-arch-diagram.md (3장: 백엔드 아키텍처)
- Express 공식 문서: https://expressjs.com/
- Helmet 문서: https://helmetjs.github.io/
