## 📋 설명

API 테스트 도구(Postman, Thunder Client)를 사용하여 모든 API 엔드포인트가 명세서대로 동작하는지 확인합니다.

## ✅ Todo

- [ ] 모든 API에 대한 테스트 케이스 실행 및 통과 확인
- [ ] 인증, 권한, 유효성 검사 등 예외 케이스 테스트 완료

## ✅ 완료 조건

### 1. 테스트 도구 선택 및 설정
- Postman 또는 Thunder Client (VS Code Extension) 설치
- API Base URL 설정 (예: `http://localhost:3000`)
- Collection 생성: `csh-todolist-api`

### 2. 인증 API 테스트

**회원가입 (`POST /api/auth/register`)**
- ✅ 정상: 새 사용자 생성 성공 (201)
- ✅ 이메일 중복: 409 Conflict
- ✅ 필수 필드 누락: 400 Bad Request
- ✅ 잘못된 이메일 형식: 400 Bad Request

**로그인 (`POST /api/auth/login`)**
- ✅ 정상: Access/Refresh Token 발급 (200)
- ✅ 잘못된 이메일: 401 Unauthorized
- ✅ 잘못된 비밀번호: 401 Unauthorized
- ✅ 필수 필드 누락: 400 Bad Request

**토큰 갱신 (`POST /api/auth/refresh`)**
- ✅ 정상: 새로운 Access Token 발급 (200)
- ✅ 잘못된 Refresh Token: 401 Unauthorized
- ✅ 만료된 Refresh Token: 401 Unauthorized

### 3. 할일 API 테스트 (인증 필요)

**목록 조회 (`GET /api/todos`)**
- ✅ 정상: 본인의 할일 목록 조회 (200)
- ✅ 토큰 없음: 401 Unauthorized
- ✅ 만료된 토큰: 401 Unauthorized

**할일 생성 (`POST /api/todos`)**
- ✅ 정상: 새 할일 생성 (201)
- ✅ title 누락: 400 Bad Request
- ✅ title 길이 초과: 400 Bad Request

**할일 조회 (`GET /api/todos/:id`)**
- ✅ 정상: 할일 상세 조회 (200)
- ✅ 존재하지 않는 ID: 404 Not Found
- ✅ 다른 사용자의 할일: 403 Forbidden

**할일 수정 (`PUT /api/todos/:id`)**
- ✅ 정상: 할일 수정 성공 (200)
- ✅ 다른 사용자의 할일: 403 Forbidden

**할일 완료 토글 (`PATCH /api/todos/:id/complete`)**
- ✅ 정상: isCompleted 토글 (200)
- ✅ 다른 사용자의 할일: 403 Forbidden

**할일 삭제 (`DELETE /api/todos/:id`)**
- ✅ 정상: 휴지통으로 이동 (200)
- ✅ 다른 사용자의 할일: 403 Forbidden

**할일 복원 (`PATCH /api/todos/:id/restore`)**
- ✅ 정상: 휴지통에서 복원 (200)
- ✅ 삭제되지 않은 할일 복원 시도: 400 Bad Request

### 4. 휴지통 API 테스트

**휴지통 목록 (`GET /api/trash`)**
- ✅ 정상: 삭제된 할일 목록 조회 (200)
- ✅ 토큰 없음: 401 Unauthorized

**영구 삭제 (`DELETE /api/trash/:id`)**
- ✅ 정상: 할일 영구 삭제 (200)
- ✅ 다른 사용자의 할일: 403 Forbidden
- ✅ 삭제되지 않은 할일: 400 Bad Request

### 5. 국경일 API 테스트

**국경일 목록 (`GET /api/holidays`)**
- ✅ 정상: 국경일 목록 조회 (200)
- ✅ 년도 필터: query string으로 특정 년도 조회

**국경일 생성 (`POST /api/holidays`) - 관리자 전용**
- ✅ 정상 (관리자): 국경일 생성 (201)
- ✅ 일반 사용자: 403 Forbidden
- ✅ 날짜 중복: 409 Conflict

**국경일 수정 (`PUT /api/holidays/:id`) - 관리자 전용**
- ✅ 정상 (관리자): 국경일 수정 (200)
- ✅ 일반 사용자: 403 Forbidden

**국경일 삭제 (`DELETE /api/holidays/:id`) - 관리자 전용**
- ✅ 정상 (관리자): 국경일 삭제 (200)
- ✅ 일반 사용자: 403 Forbidden

### 6. 통합 시나리오 테스트

**사용자 시나리오**:
1. 회원가입 → 로그인 → 할일 생성 → 할일 완료 → 할일 삭제 → 휴지통 확인 → 복원 → 로그아웃
2. 토큰 만료 → 토큰 갱신 → API 재호출

**관리자 시나리오**:
1. 관리자 로그인 → 국경일 생성 → 국경일 수정 → 국경일 삭제

### 7. 테스트 결과 문서화
- 모든 테스트 케이스 통과 여부 기록
- 발견된 버그는 이슈로 등록
- Postman Collection export (`.json`) 저장

## 🔧 기술적 고려사항

**Postman 사용 팁**:
- Environment Variables: `{{baseUrl}}`, `{{accessToken}}`
- Pre-request Script: 로그인 후 토큰 자동 저장
- Tests 탭: 응답 검증 자동화

```javascript
// Postman Tests 예시
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has accessToken", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.accessToken).to.exist;
});
```

**Thunder Client 사용 팁**:
- Environment: `baseUrl`, `accessToken` 설정
- Collection 구성: 폴더별로 API 그룹화
- Tests: JSON 응답 검증

**테스트 데이터**:
```json
// 테스트용 사용자
{
  "email": "test@example.com",
  "password": "Test1234!",
  "name": "테스트 사용자"
}

// 테스트용 관리자
{
  "email": "admin@example.com",
  "password": "Admin1234!",
  "name": "관리자",
  "role": "admin"  // DB에서 수동으로 설정 필요
}

// 테스트용 할일
{
  "title": "테스트 할일",
  "description": "API 테스트용 할일입니다",
  "dueDate": "2025-12-31"
}

// 테스트용 국경일
{
  "date": "2025-01-01",
  "name": "신정"
}
```

**주의사항**:
- 관리자 계정은 DB에서 직접 `role` 필드를 'admin'으로 변경
- 테스트 후 데이터 정리 (또는 테스트 DB 사용)
- 테스트 Collection을 Git에 포함하여 팀원과 공유

## 🔗 의존성

**선행 작업**:
- Task 2.2: 사용자 인증 API 구현
- Task 2.4: 할일 API 구현
- Task 2.5: 휴지통 및 국경일 API 구현

**후행 작업**:
- Task 3.4: 회원가입 및 로그인 페이지 구현 (프론트엔드 API 연동)
- Task 3.5: 할일 목록 페이지 구현 (프론트엔드 API 연동)

## 👤 담당

`test-automator`

## 📚 참고 문서

- docs/3-prd.md (9장: API 명세)
- Postman 다운로드: https://www.postman.com/downloads/
- Thunder Client: https://www.thunderclient.com/
- API 테스트 베스트 프랙티스: https://www.postman.com/api-platform/api-testing/
