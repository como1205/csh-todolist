## 📋 설명

최종 배포된 프로덕션 URL에서 모든 기능이 정상적으로 동작하는지 최종 검증합니다.

## ✅ Todo

- [ ] 프로덕션 환경에서 E2E 테스트 시나리오 통과

## ✅ 완료 조건

### 1. 프로덕션 URL 확인

**배포 URL**:
- 프론트엔드: `https://csh-todolist.vercel.app`
- 백엔드 API: `https://csh-todolist-api.vercel.app`

**접속 테스트**:
- [ ] 프론트엔드 URL 접속 확인
- [ ] 백엔드 API `/api/health` 접속 확인
- [ ] HTTPS 연결 확인 (자물쇠 아이콘)

### 2. 핵심 기능 검증

**인증 플로우**:
1. [ ] 회원가입 페이지 접속
2. [ ] 신규 계정 생성 (프로덕션 DB에 저장)
3. [ ] 로그인 성공 및 토큰 발급 확인
4. [ ] 로그아웃 및 리다이렉트 확인

**할일 관리**:
1. [ ] 로그인 후 메인 페이지 접속
2. [ ] 할일 추가 (프로덕션 DB에 저장)
3. [ ] 할일 목록에 표시 확인
4. [ ] 할일 완료 체크
5. [ ] 할일 수정
6. [ ] 할일 삭제 (휴지통으로 이동)

**휴지통 기능**:
1. [ ] 휴지통 페이지 접속
2. [ ] 삭제된 할일 표시 확인
3. [ ] 할일 복원
4. [ ] 할일 영구 삭제

**토큰 관리**:
1. [ ] Access Token 자동 헤더 추가 확인 (개발자 도구)
2. [ ] (선택) Token 만료 시 자동 갱신 확인

### 3. 성능 검증

**Lighthouse 테스트**:
- [ ] Chrome DevTools → Lighthouse 실행
- [ ] Performance: 80점 이상
- [ ] Accessibility: 90점 이상
- [ ] Best Practices: 80점 이상
- [ ] SEO: 80점 이상

**로딩 시간**:
- [ ] 초기 페이지 로드: 3초 이내
- [ ] API 응답 시간: 1초 이내
- [ ] 페이지 전환: 즉시 (클라이언트 라우팅)

**리소스 크기**:
- [ ] JavaScript 번들: 500KB 이하 (gzip)
- [ ] CSS: 50KB 이하 (gzip)
- [ ] 총 페이지 크기: 1MB 이하

### 4. 보안 검증

**HTTPS**:
- [ ] 모든 요청이 HTTPS로 전송
- [ ] Mixed Content 경고 없음

**인증 보안**:
- [ ] JWT 토큰이 localStorage에 안전하게 저장
- [ ] 비밀번호가 평문으로 전송되지 않음 (HTTPS)
- [ ] 잘못된 토큰으로 보호된 API 접근 시 401 응답

**CORS**:
- [ ] 프론트엔드 도메인에서만 API 접근 허용
- [ ] 다른 도메인에서 접근 시 CORS 에러

### 5. 반응형 및 호환성 재검증

**모바일 테스트**:
- [ ] iPhone (Safari)
- [ ] Android (Chrome)
- [ ] 터치 인터랙션 정상 작동

**데스크톱 테스트**:
- [ ] Chrome (최신)
- [ ] Firefox (최신)
- [ ] Safari (최신)
- [ ] Edge (최신)

### 6. 에러 처리 검증

**네트워크 에러**:
- [ ] 백엔드 서버 다운 시뮬레이션 → 에러 메시지 표시
- [ ] 느린 네트워크 시뮬레이션 → 로딩 스피너 표시

**인증 에러**:
- [ ] 잘못된 로그인 정보 → 에러 메시지
- [ ] 토큰 만료 → 자동 갱신 또는 로그인 페이지 리다이렉트

**유효성 검사 에러**:
- [ ] 필수 필드 누락 → 유효성 검사 메시지
- [ ] 잘못된 이메일 형식 → 유효성 검사 메시지

### 7. 데이터베이스 확인

**Supabase Dashboard**:
- [ ] Users 테이블에 데이터 저장 확인
- [ ] Todos 테이블에 데이터 저장 확인
- [ ] 삭제된 할일 isDeleted=true 확인
- [ ] 영구 삭제된 할일 DB에서 제거 확인

### 8. 모니터링 설정

**Vercel Analytics (선택)**:
- [ ] Vercel Dashboard에서 Analytics 활성화
- [ ] 트래픽, 성능 지표 확인

**에러 추적 (선택)**:
- [ ] Sentry 연동 (선택)
- [ ] 에러 로그 수집 및 알림 설정

### 9. 사용자 수용 테스트 (UAT)

**실제 사용자 시나리오**:
1. [ ] 회원가입 후 첫 로그인
2. [ ] 하루치 할일 추가 (5-10개)
3. [ ] 할일 완료 및 미완료 표시
4. [ ] 완료된 할일 삭제
5. [ ] 휴지통에서 복원
6. [ ] 다음 날 접속하여 할일 확인

**피드백 수집**:
- [ ] 사용성 평가
- [ ] 버그 발견 여부
- [ ] 개선 사항 제안

### 10. 최종 체크리스트

**기능**:
- [ ] 회원가입, 로그인, 로그아웃 작동
- [ ] 할일 CRUD 모두 작동
- [ ] 휴지통 복원/영구삭제 작동
- [ ] 토큰 관리 정상 작동

**품질**:
- [ ] Lighthouse 점수 기준 통과
- [ ] 반응형 디자인 정상 작동
- [ ] 브라우저 호환성 확인
- [ ] 보안 요구사항 충족

**운영**:
- [ ] 배포 URL 문서화
- [ ] 환경 변수 백업
- [ ] 모니터링 설정 (선택)
- [ ] 에러 추적 설정 (선택)

**문서**:
- [ ] README.md 업데이트 (배포 URL, 기능 설명)
- [ ] 환경 설정 가이드
- [ ] 트러블슈팅 가이드

## 🔧 기술적 고려사항

**Lighthouse 실행**:
```bash
# Chrome DevTools
1. F12 → Lighthouse 탭
2. Mode: Navigation
3. Device: Desktop/Mobile
4. Generate report
```

**성능 프로파일링**:
```bash
# Chrome DevTools
1. F12 → Performance 탭
2. Record 클릭
3. 페이지 인터랙션 수행
4. Stop 클릭
5. 병목 지점 분석
```

**보안 헤더 확인**:
```bash
# 개발자 도구 → Network 탭에서 확인
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
```

**프로덕션 환경 테스트 팁**:
- 시크릿 모드에서 테스트 (캐시 영향 제거)
- 다양한 네트워크 속도 시뮬레이션 (Fast 3G, Slow 3G)
- 모바일 디바이스 시뮬레이션 (Chrome DevTools)

**최종 배포 확인 명령어**:
```bash
# 프론트엔드 빌드 확인
cd frontend
npm run build
npm run preview

# 백엔드 로컬 테스트
cd backend
npm run build
npm start
```

**문제 발생 시 대응**:
1. Vercel 로그 확인
2. 브라우저 콘솔 에러 확인
3. 네트워크 탭에서 API 요청/응답 확인
4. 환경 변수 설정 재확인
5. 롤백 (이전 배포 버전으로 복원)

**프로덕션 체크리스트 예시**:
```markdown
## 프로덕션 검증 체크리스트

### 기능 테스트
- [x] 회원가입
- [x] 로그인
- [x] 할일 추가
- [x] 할일 수정
- [x] 할일 삭제
- [x] 할일 복원
- [x] 영구 삭제
- [x] 로그아웃

### 성능 테스트
- [x] Lighthouse Performance: 85점
- [x] Lighthouse Accessibility: 92점
- [x] 초기 로딩: 2.3초
- [x] API 응답: 0.8초

### 보안 테스트
- [x] HTTPS 연결
- [x] CORS 설정
- [x] 토큰 인증
- [x] 보안 헤더

### 호환성 테스트
- [x] Chrome 120
- [x] Firefox 121
- [x] Safari 17
- [x] Mobile Safari (iOS)
- [x] Chrome Mobile (Android)

### 최종 승인
- [x] PM 승인
- [x] QA 승인
- [x] 프로덕션 배포 완료

배포 일시: 2025-XX-XX XX:XX
배포 URL: https://csh-todolist.vercel.app
```

## 🔗 의존성

**선행 작업**:
- Task 4.2: 백엔드/프론트엔드 프로덕션 배포

**후행 작업**:
- 없음 (프로젝트 완료)

## 👤 담당

`project-manager`, `fullstack-developer`

## 📚 참고 문서

- docs/3-prd.md (전체 요구사항)
- Lighthouse: https://developer.chrome.com/docs/lighthouse/
- Chrome DevTools: https://developer.chrome.com/docs/devtools/
- Vercel Monitoring: https://vercel.com/docs/concepts/analytics
- Web Vitals: https://web.dev/vitals/
