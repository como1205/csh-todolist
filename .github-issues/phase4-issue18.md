## 📋 설명

백엔드(Express)와 프론트엔드(React) 프로젝트를 Vercel에 각각 배포합니다.

## ✅ Todo

- [ ] 백엔드 프로젝트를 Vercel Serverless Function으로 배포 완료
- [ ] 프론트엔드 프로젝트를 Vercel Static Hosting으로 배포 완료
- [ ] Vercel 환경 변수에 `DATABASE_URL`, `JWT_SECRET` 등 등록 완료
- [ ] 백엔드 CORS 설정에 프론트엔드 프로덕션 도메인 추가

## ✅ 완료 조건

### 1. 백엔드 Vercel 배포

**사전 준비**:
- Vercel 계정 생성
- Vercel CLI 설치: `npm i -g vercel`
- 백엔드 프로젝트를 Git 리포지토리에 푸시

**배포 설정 파일 생성 (`backend/vercel.json`)**:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/index.ts"
    }
  ]
}
```

**환경 변수 설정**:
- Vercel Dashboard → Settings → Environment Variables
- `DATABASE_URL`: Supabase Connection String
- `JWT_SECRET`: 강력한 랜덤 문자열
- `JWT_EXPIRES_IN`: "15m"
- `JWT_REFRESH_EXPIRES_IN`: "7d"
- `NODE_ENV`: "production"

**배포 명령어**:
```bash
cd backend
vercel --prod
```

**배포 확인**:
- [ ] 배포 URL 확인 (예: `https://csh-todolist-api.vercel.app`)
- [ ] `/api/health` 엔드포인트 접속 확인
- [ ] 환경 변수 정상 로드 확인

### 2. 프론트엔드 Vercel 배포

**사전 준비**:
- 프론트엔드 프로젝트를 Git 리포지토리에 푸시

**환경 변수 설정**:
- Vercel Dashboard → Settings → Environment Variables
- `VITE_API_BASE_URL`: 백엔드 배포 URL (예: `https://csh-todolist-api.vercel.app/api`)

**빌드 설정 확인**:
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

**배포 명령어**:
```bash
cd frontend
vercel --prod
```

**배포 확인**:
- [ ] 배포 URL 확인 (예: `https://csh-todolist.vercel.app`)
- [ ] 모든 페이지 접속 확인
- [ ] API 연동 정상 작동 확인

### 3. CORS 설정 업데이트

**백엔드 CORS 설정 수정**:
```typescript
// backend/src/index.ts
import cors from 'cors';

const allowedOrigins = [
  'http://localhost:5173', // 로컬 개발
  'https://csh-todolist.vercel.app', // 프로덕션
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
```

**재배포**:
```bash
cd backend
vercel --prod
```

### 4. 도메인 설정 (선택)

**커스텀 도메인 연결**:
- Vercel Dashboard → Domains
- 도메인 추가 (예: `todolist.yourdomain.com`)
- DNS 레코드 설정 (A 또는 CNAME)

### 5. 배포 후 테스트

**백엔드 API 테스트**:
- [ ] Postman으로 프로덕션 API 엔드포인트 테스트
- [ ] 회원가입, 로그인 API 작동 확인
- [ ] 할일 CRUD API 작동 확인
- [ ] 데이터베이스 연결 확인

**프론트엔드 테스트**:
- [ ] 프로덕션 URL 접속
- [ ] 모든 페이지 정상 렌더링 확인
- [ ] API 호출 정상 작동 확인
- [ ] 로그인/회원가입 플로우 확인

**통합 테스트**:
- [ ] E2E 시나리오 프로덕션 환경에서 재실행
- [ ] HTTPS 연결 확인
- [ ] 성능 테스트 (Lighthouse)

### 6. 배포 정보 문서화

**배포 URL**:
- 백엔드: `https://csh-todolist-api.vercel.app`
- 프론트엔드: `https://csh-todolist.vercel.app`

**환경 변수 목록**:
- 백엔드: `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`, `NODE_ENV`
- 프론트엔드: `VITE_API_BASE_URL`

**배포 상태 모니터링**:
- Vercel Dashboard에서 배포 로그 확인
- 에러 발생 시 로그 분석 및 수정

## 🔧 기술적 고려사항

**Vercel Serverless 제약사항**:
- 최대 실행 시간: 10초 (Hobby Plan)
- 최대 응답 크기: 4.5MB
- 콜드 스타트 고려 (첫 요청 시 지연 가능)

**프로덕션 최적화**:
```typescript
// backend/src/index.ts
if (process.env.NODE_ENV === 'production') {
  // 프로덕션 전용 미들웨어
  app.use(helmet());
  app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15분
    max: 100 // IP당 100 요청
  }));
}
```

**프론트엔드 빌드 최적화**:
```typescript
// frontend/vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
});
```

**환경변수 보안**:
- `.env` 파일을 절대 Git에 커밋하지 말것
- Vercel Dashboard에서만 환경변수 관리
- 민감한 정보는 암호화 저장

**Vercel Git 연동 (추천)**:
- GitHub 리포지토리 연결
- 자동 배포 설정 (main 브랜치 푸시 시)
- Preview 배포 (PR 생성 시)

**Vercel CLI 명령어**:
```bash
# 로그인
vercel login

# 프로젝트 연결
vercel link

# 환경변수 추가
vercel env add VARIABLE_NAME

# 배포
vercel --prod

# 로그 확인
vercel logs
```

**배포 체크리스트**:
- [ ] Vercel 계정 생성
- [ ] 백엔드 배포 및 테스트
- [ ] 프론트엔드 배포 및 테스트
- [ ] 환경변수 설정 완료
- [ ] CORS 설정 업데이트
- [ ] 통합 테스트 통과
- [ ] 배포 URL 문서화

**문제 해결**:
- 빌드 실패: Vercel 로그 확인
- CORS 에러: allowedOrigins 확인
- 환경변수 미로드: Vercel Dashboard 확인
- API 연결 실패: VITE_API_BASE_URL 확인

## 🔗 의존성

**선행 작업**:
- Task 4.1: E2E 테스트 및 버그 수정

**후행 작업**:
- Task 4.3: 프로덕션 환경 최종 검증

## 👤 담당

`fullstack-developer`

## 📚 참고 문서

- docs/3-prd.md (11장: 배포 전략)
- Vercel 문서: https://vercel.com/docs
- Vercel Node.js: https://vercel.com/docs/functions/serverless-functions/runtimes/node-js
- Vercel Environment Variables: https://vercel.com/docs/concepts/projects/environment-variables
- Vercel CLI: https://vercel.com/docs/cli
