## 📋 설명

`/register`, `/login` 페이지 UI와 폼 로직, API 연동을 구현합니다.

## ✅ Todo

- [ ] `react-hook-form`과 `zod`를 사용한 폼 및 유효성 검사 구현
- [ ] 로그인/회원가입 API 연동 및 성공/실패 처리 완료

## ✅ 완료 조건

### 1. 회원가입 페이지 (`src/pages/RegisterPage.tsx`)

**UI 구성**:
- 이메일 입력 필드
- 비밀번호 입력 필드
- 비밀번호 확인 필드
- 이름 입력 필드
- 회원가입 버튼
- 로그인 페이지로 이동 링크

**유효성 검사 (Zod)**:
- 이메일: 이메일 형식, 필수
- 비밀번호: 최소 8자, 영문+숫자 조합, 필수
- 비밀번호 확인: 비밀번호와 일치
- 이름: 2-20자, 필수

**API 연동**:
- `POST /api/auth/register` 호출
- 성공 시: 로그인 페이지로 리다이렉트 + 성공 메시지
- 실패 시: 에러 메시지 표시 (이메일 중복 등)

### 2. 로그인 페이지 (`src/pages/LoginPage.tsx`)

**UI 구성**:
- 이메일 입력 필드
- 비밀번호 입력 필드
- 로그인 버튼
- 회원가입 페이지로 이동 링크

**유효성 검사 (Zod)**:
- 이메일: 이메일 형식, 필수
- 비밀번호: 필수

**API 연동**:
- `POST /api/auth/login` 호출
- 성공 시:
  - authStore에 사용자 정보 및 토큰 저장
  - 메인 페이지(`/`)로 리다이렉트
- 실패 시: 에러 메시지 표시

### 3. API 서비스 함수 작성 (`src/api/auth.ts`)

```typescript
export const authAPI = {
  register: async (data: RegisterInput) => { ... },
  login: async (data: LoginInput) => { ... },
  refresh: async (refreshToken: string) => { ... },
};
```

### 4. 에러 처리
- 네트워크 에러: "서버와 연결할 수 없습니다"
- 401 Unauthorized: "이메일 또는 비밀번호가 올바르지 않습니다"
- 409 Conflict: "이미 사용 중인 이메일입니다"
- 기타 에러: 서버 응답 에러 메시지 표시

### 5. 로딩 상태 처리
- 버튼 로딩 스피너 표시
- 폼 제출 중 버튼 비활성화

## 🔧 기술적 고려사항

**회원가입 Zod 스키마 예시**:
```typescript
// src/schemas/auth.schema.ts
import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
  password: z
    .string()
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
    .regex(/^(?=.*[A-Za-z])(?=.*\d)/, '영문과 숫자를 포함해야 합니다'),
  confirmPassword: z.string(),
  name: z.string().min(2, '이름은 최소 2자 이상이어야 합니다').max(20),
}).refine((data) => data.password === data.confirmPassword, {
  message: '비밀번호가 일치하지 않습니다',
  path: ['confirmPassword'],
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
  password: z.string().min(1, '비밀번호를 입력하세요'),
});

export type LoginInput = z.infer<typeof loginSchema>;
```

**회원가입 페이지 예시**:
```tsx
// src/pages/RegisterPage.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterInput } from '@/schemas/auth.schema';
import { authAPI } from '@/api/auth';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      await authAPI.register(data);
      navigate('/login', { state: { message: '회원가입이 완료되었습니다' } });
    } catch (err: any) {
      setError(err.response?.data?.error || '회원가입에 실패했습니다');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6">회원가입</h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="이메일"
            type="email"
            {...register('email')}
            error={errors.email?.message}
          />

          <Input
            label="비밀번호"
            type="password"
            {...register('password')}
            error={errors.password?.message}
          />

          <Input
            label="비밀번호 확인"
            type="password"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />

          <Input
            label="이름"
            {...register('name')}
            error={errors.name?.message}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? '처리 중...' : '회원가입'}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          이미 계정이 있으신가요?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
```

**API 서비스 예시**:
```typescript
// src/api/auth.ts
import api from './axios';
import { RegisterInput, LoginInput } from '@/schemas/auth.schema';

export const authAPI = {
  register: async (data: RegisterInput) => {
    const response = await api.post('/auth/register', {
      email: data.email,
      password: data.password,
      name: data.name,
    });
    return response.data;
  },

  login: async (data: LoginInput) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  refresh: async (refreshToken: string) => {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  },
};
```

**로그인 페이지 예시**:
```tsx
// src/pages/LoginPage.tsx
const onSubmit = async (data: LoginInput) => {
  try {
    const result = await authAPI.login(data);
    const { user, accessToken, refreshToken } = result;

    // Zustand store에 저장
    useAuthStore.getState().login(user, accessToken, refreshToken);

    // 메인 페이지로 리다이렉트
    navigate('/');
  } catch (err: any) {
    setError(err.response?.data?.error || '로그인에 실패했습니다');
  }
};
```

**필요한 패키지**:
```bash
npm install react-hook-form @hookform/resolvers zod
```

**주의사항**:
- 비밀번호는 type="password"로 마스킹
- 에러 메시지는 사용자 친화적으로 표시
- 로딩 중 중복 제출 방지
- 성공/실패 메시지는 시각적으로 구분

## 🔗 의존성

**선행 작업**:
- Task 3.1: 라우팅 및 페이지 레이아웃 설정
- Task 3.2: 공통 UI 컴포넌트 개발
- Task 3.3: 전역 상태 및 API 클라이언트 설정

**API 의존성**:
- Task 2.2: 사용자 인증 API 구현

**후행 작업**:
- Task 3.5: 할일 목록 페이지 구현

## 👤 담당

`frontend-developer`

## 📚 참고 문서

- docs/3-prd.md (10.2장: 페이지 구성 - 로그인/회원가입)
- React Hook Form: https://react-hook-form.com/
- Zod: https://zod.dev/
- @hookform/resolvers: https://github.com/react-hook-form/resolvers
