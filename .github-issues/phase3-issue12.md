## 📋 설명

`PRD 10.3`에 명시된 재사용 가능한 UI 컴포넌트를 Tailwind CSS를 사용하여 개발합니다.

## ✅ Todo

- [ ] `Button`, `Input`, `Modal`, `TodoCard` 등 공통 컴포넌트 구현 완료
- [ ] (선택) Storybook을 사용하여 컴포넌트 독립적 테스트 및 문서화

## ✅ 완료 조건

1. Button 컴포넌트 (`src/components/common/Button.tsx`)
   - variant: primary, secondary, danger
   - size: sm, md, lg
   - disabled 상태 지원
   - onClick 핸들러 지원

2. Input 컴포넌트 (`src/components/common/Input.tsx`)
   - type: text, email, password, date
   - label, placeholder, error 메시지 표시
   - react-hook-form과 호환되는 ref forwarding

3. Modal 컴포넌트 (`src/components/common/Modal.tsx`)
   - isOpen, onClose props
   - title, children 표시
   - 배경 클릭 시 닫기
   - ESC 키로 닫기
   - 포커스 트랩 (선택)

4. TodoCard 컴포넌트 (`src/components/common/TodoCard.tsx`)
   - 할일 정보 표시: 제목, 설명, 마감일, 완료 상태
   - 완료 체크박스
   - 수정, 삭제 버튼
   - 마감일 임박 시 시각적 표시

5. Textarea 컴포넌트 (`src/components/common/Textarea.tsx`)
   - label, placeholder, error 메시지 표시
   - rows 설정 가능
   - react-hook-form 호환

6. (선택) Storybook 설정
   - 각 컴포넌트의 Story 작성
   - 다양한 Props 조합 시연
   - 문서화 자동 생성

## 🔧 기술적 고려사항

**Button 컴포넌트 예시**:
```tsx
// src/components/common/Button.tsx
import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/cn'; // classnames 유틸리티

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'rounded font-semibold transition-colors';

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
```

**Input 컴포넌트 예시**:
```tsx
// src/components/common/Input.tsx
import { forwardRef, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label className="text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'px-3 py-2 border rounded focus:outline-none focus:ring-2',
            error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500',
            className
          )}
          {...props}
        />
        {error && (
          <span className="text-sm text-red-600">{error}</span>
        )}
      </div>
    );
  }
);

export default Input;
```

**Modal 컴포넌트 예시**:
```tsx
// src/components/common/Modal.tsx
import { ReactNode, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
}
```

**TodoCard 컴포넌트 예시**:
```tsx
// src/components/common/TodoCard.tsx
import { Todo } from '@/types/todo';
import Button from './Button';

interface TodoCardProps {
  todo: Todo;
  onToggleComplete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

export default function TodoCard({ todo, onToggleComplete, onEdit, onDelete }: TodoCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={todo.isCompleted}
          onChange={() => onToggleComplete(todo.id)}
          className="mt-1"
        />
        <div className="flex-1">
          <h3 className={cn(
            'font-semibold',
            todo.isCompleted && 'line-through text-gray-500'
          )}>
            {todo.title}
          </h3>
          {todo.description && (
            <p className="text-sm text-gray-600 mt-1">{todo.description}</p>
          )}
          {todo.dueDate && (
            <p className="text-xs text-gray-500 mt-2">
              마감: {new Date(todo.dueDate).toLocaleDateString('ko-KR')}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => onEdit(todo)}>
            수정
          </Button>
          <Button variant="danger" size="sm" onClick={() => onDelete(todo.id)}>
            삭제
          </Button>
        </div>
      </div>
    </div>
  );
}
```

**유틸리티 함수 (classnames)**:
```typescript
// src/utils/cn.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**필요한 패키지**:
```bash
npm install clsx tailwind-merge
```

**주의사항**:
- 모든 컴포넌트는 TypeScript로 작성
- Props 타입 정의 필수
- Tailwind CSS 클래스 사용
- 접근성(a11y) 고려 (ARIA 속성, 키보드 네비게이션)
- 재사용성과 확장성 고려

## 🔗 의존성

**선행 작업**:
- Task 1.2: 프론트엔드 프로젝트 초기화

**후행 작업**:
- Task 3.4: 회원가입 및 로그인 페이지 구현
- Task 3.5: 할일 목록 페이지 구현
- Task 3.6: 휴지통 페이지 구현

## 👤 담당

`ui-designer`

## 📚 참고 문서

- docs/3-prd.md (10.3장: UI 컴포넌트)
- Tailwind CSS: https://tailwindcss.com/docs
- React TypeScript Cheatsheet: https://react-typescript-cheatsheet.netlify.app/
- Storybook (선택): https://storybook.js.org/
