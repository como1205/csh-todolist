import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/stores/authStore';
import { Input, Button } from '@/components/ui';

// Zod 스키마
const registerSchema = z
  .object({
    email: z.string().email('올바른 이메일 형식이 아닙니다'),
    password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다'),
    confirmPassword: z.string(),
    username: z.string().min(2, '사용자 이름은 최소 2자 이상이어야 합니다'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser, isAuthenticated, error, clearError } = useAuthStore();
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  // 회원가입 성공 시 로그인 페이지로 리다이렉트
  // (회원가입 API는 자동 로그인하지만, 사용자에게 명시적 로그인 유도)
  useEffect(() => {
    if (registerSuccess) {
      const timer = setTimeout(() => {
        // 회원가입 성공 후 로그인 페이지로 이동하기 전 상태 초기화
        clearError();
        navigate('/login');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [registerSuccess, navigate, clearError]);

  // 이미 로그인되어 있으면 메인 페이지로 리다이렉트
  // (단, 회원가입 성공 메시지 표시 중에는 제외)
  useEffect(() => {
    if (isAuthenticated && !registerSuccess) {
      navigate('/');
    }
  }, [isAuthenticated, navigate, registerSuccess]);

  // 컴포넌트 언마운트 시 에러 초기화
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data.email, data.password, data.username);
      setRegisterSuccess(true);
    } catch (err) {
      // authStore의 error 상태가 자동으로 업데이트됨
      console.error('회원가입 실패:', err);
    }
  };

  // 회원가입 성공 메시지 표시
  if (registerSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            회원가입 완료!
          </h2>
          <p className="text-gray-600">
            로그인 페이지로 이동합니다...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        {/* 로고 */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary-600">
            csh-TodoList
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            새 계정을 만들어 시작하세요
          </p>
        </div>

        {/* 회원가입 폼 */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          {/* 전역 에러 메시지 */}
          {error && (
            <div
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
              role="alert"
            >
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* 이메일 입력 */}
            <Input
              label="이메일"
              type="email"
              placeholder="이메일을 입력하세요"
              error={errors.email?.message}
              {...register('email')}
            />

            {/* 비밀번호 입력 */}
            <Input
              label="비밀번호"
              type="password"
              placeholder="비밀번호를 입력하세요 (최소 6자)"
              error={errors.password?.message}
              {...register('password')}
            />

            {/* 비밀번호 확인 입력 */}
            <Input
              label="비밀번호 확인"
              type="password"
              placeholder="비밀번호를 다시 입력하세요"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            {/* 사용자 이름 입력 */}
            <Input
              label="사용자 이름"
              type="text"
              placeholder="이름을 입력하세요"
              error={errors.username?.message}
              {...register('username')}
            />
          </div>

          {/* 회원가입 버튼 */}
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? '회원가입 중...' : '회원가입'}
          </Button>

          {/* 로그인 링크 */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              이미 계정이 있으신가요?{' '}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
              >
                로그인
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
