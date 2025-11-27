# UI 컴포넌트 라이브러리

## 개요

이 디렉토리는 csh-TodoList 프로젝트의 공통 UI 컴포넌트들을 포함합니다.
모든 컴포넌트는 Tailwind CSS를 사용하며, TypeScript로 작성되었습니다.

## 컴포넌트 목록

### 1. Button

다양한 variant와 size를 지원하는 버튼 컴포넌트입니다.

**사용 예시:**

```tsx
import { Button } from '@/components/ui';

// Primary 버튼
<Button variant="primary" size="md">
  로그인
</Button>

// Secondary 버튼
<Button variant="secondary" size="md">
  취소
</Button>

// Danger 버튼
<Button variant="danger" size="md">
  삭제
</Button>

// 아이콘이 있는 버튼
<Button
  variant="primary"
  leftIcon={<PlusIcon />}
>
  할일 추가
</Button>

// 로딩 상태 버튼
<Button variant="primary" isLoading>
  저장 중...
</Button>
```

### 2. Input

레이블, 에러 메시지, 도움말 텍스트를 지원하는 입력 필드입니다.

**사용 예시:**

```tsx
import { Input } from '@/components/ui';

// 기본 입력 필드
<Input
  label="이메일"
  type="email"
  placeholder="이메일을 입력하세요"
/>

// 에러 상태
<Input
  label="비밀번호"
  type="password"
  error="비밀번호는 8자 이상이어야 합니다"
/>

// 도움말 텍스트
<Input
  label="사용자 이름"
  type="text"
  helperText="2-20자 사이로 입력하세요"
/>
```

### 3. Textarea

다중 행 텍스트 입력을 위한 컴포넌트입니다.

**사용 예시:**

```tsx
import { Textarea } from '@/components/ui';

<Textarea
  label="내용"
  placeholder="상세 내용을 입력하세요"
  rows={4}
/>

// 에러 상태
<Textarea
  label="설명"
  error="내용을 입력해주세요"
  rows={6}
/>
```

### 4. Modal

모달 다이얼로그 컴포넌트입니다. ESC 키와 오버레이 클릭으로 닫을 수 있습니다.

**사용 예시:**

```tsx
import { Modal, Button } from '@/components/ui';
import { useState } from 'react';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        모달 열기
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="할일 추가"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              취소
            </Button>
            <Button variant="primary" onClick={handleSave}>
              저장
            </Button>
          </>
        }
      >
        <p>모달 내용이 여기에 들어갑니다.</p>
      </Modal>
    </>
  );
}
```

### 5. Checkbox

체크박스 컴포넌트입니다. 레이블과 함께 사용할 수 있습니다.

**사용 예시:**

```tsx
import { Checkbox } from '@/components/ui';

// 레이블이 있는 체크박스
<Checkbox
  label="할일 완료"
  checked={isCompleted}
  onChange={(e) => setIsCompleted(e.target.checked)}
/>

// 레이블 없는 체크박스
<Checkbox
  checked={isChecked}
  onChange={(e) => setIsChecked(e.target.checked)}
/>
```

### 6. Badge

상태를 나타내는 작은 뱃지 컴포넌트입니다.

**사용 예시:**

```tsx
import { Badge } from '@/components/ui';

<Badge status="active">진행 중</Badge>
<Badge status="completed">완료</Badge>
<Badge status="overdue">기한 초과</Badge>
```

### 7. TodoCard

할일 항목을 표시하는 카드 컴포넌트입니다.

**사용 예시:**

```tsx
import { TodoCard } from '@/components/ui';

<TodoCard
  todo={{
    todoId: '1',
    title: '프로젝트 회의',
    content: '오후 2시 회의실 A에서 진행',
    dueDate: '2025-11-30',
    isCompleted: false,
    status: 'active',
  }}
  onToggleComplete={(id) => handleToggle(id)}
  onEdit={(id) => handleEdit(id)}
  onDelete={(id) => handleDelete(id)}
/>
```

## 접근성 (Accessibility)

모든 컴포넌트는 접근성을 고려하여 설계되었습니다:

- **키보드 네비게이션**: 모든 인터랙티브 요소는 키보드로 접근 가능합니다
- **ARIA 속성**: 적절한 ARIA 레이블과 역할이 설정되어 있습니다
- **포커스 관리**: Modal 컴포넌트는 포커스 트랩을 구현했습니다
- **에러 메시지**: 폼 요소의 에러는 스크린 리더에서 읽을 수 있습니다

## 스타일 가이드 준수

모든 컴포넌트는 `docs/9-style-guide.md`에 정의된 디자인 시스템을 따릅니다:

- **색상**: primary 색상 팔레트 사용
- **간격**: 4px 단위 간격 시스템
- **타이포그래피**: 정의된 폰트 크기 사용
- **그림자**: shadow-sm, shadow-md, shadow-lg 사용
- **트랜지션**: 200ms duration 일관성 유지

## TypeScript 지원

모든 컴포넌트는 완전한 TypeScript 타입 정의를 제공합니다.
Props 인터페이스는 export되어 있어 타입 체크가 가능합니다.

## 반응형 디자인

컴포넌트들은 모바일과 데스크톱 환경을 모두 고려하여 설계되었습니다:

- Modal은 모바일에서 풀스크린으로 표시됩니다
- TodoCard는 터치 친화적인 크기의 버튼을 사용합니다
- 모든 인터랙티브 요소는 최소 44px 터치 영역을 가집니다
