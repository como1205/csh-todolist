import React, { useState } from 'react';
import {
  Button,
  Input,
  Textarea,
  Modal,
  Checkbox,
  Badge,
  TodoCard,
} from '@/components/ui';

/**
 * UI 컴포넌트 쇼케이스 페이지
 * 개발 중 컴포넌트를 테스트하고 확인할 수 있는 페이지입니다.
 */
const ComponentShowcase: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadingDemo = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  const sampleTodos = [
    {
      todoId: '1',
      title: '프로젝트 회의 준비',
      content: '발표 자료 준비 및 리뷰',
      dueDate: '2025-11-28',
      isCompleted: false,
      status: 'active' as const,
    },
    {
      todoId: '2',
      title: '완료된 할일',
      content: '이미 완료된 작업입니다',
      dueDate: '2025-11-25',
      isCompleted: true,
      status: 'completed' as const,
    },
    {
      todoId: '3',
      title: '기한 초과된 할일',
      content: '어제까지였던 작업',
      dueDate: '2025-11-20',
      isCompleted: false,
      status: 'active' as const,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          UI 컴포넌트 쇼케이스
        </h1>

        {/* Button 섹션 */}
        <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Button</h2>
          <div className="space-y-4">
            <div className="flex gap-3 flex-wrap">
              <Button variant="primary" size="sm">Small Primary</Button>
              <Button variant="primary" size="md">Medium Primary</Button>
              <Button variant="primary" size="lg">Large Primary</Button>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Button variant="secondary" size="md">Secondary</Button>
              <Button variant="danger" size="md">Danger</Button>
              <Button variant="primary" size="md" disabled>Disabled</Button>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Button
                variant="primary"
                size="md"
                leftIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                }
              >
                아이콘 버튼
              </Button>
              <Button
                variant="primary"
                size="md"
                isLoading={isLoading}
                onClick={handleLoadingDemo}
              >
                로딩 테스트
              </Button>
            </div>
          </div>
        </section>

        {/* Input 섹션 */}
        <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Input</h2>
          <div className="space-y-4 max-w-md">
            <Input
              label="이메일"
              type="email"
              placeholder="이메일을 입력하세요"
              value={inputValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
            />
            <Input
              label="비밀번호"
              type="password"
              placeholder="비밀번호를 입력하세요"
              error="비밀번호는 8자 이상이어야 합니다"
            />
            <Input
              label="사용자 이름"
              type="text"
              helperText="2-20자 사이로 입력하세요"
            />
            <Input
              label="비활성 입력"
              type="text"
              value="수정할 수 없습니다"
              disabled
            />
          </div>
        </section>

        {/* Textarea 섹션 */}
        <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Textarea</h2>
          <div className="space-y-4 max-w-md">
            <Textarea
              label="내용"
              placeholder="상세 내용을 입력하세요"
              rows={4}
              value={textareaValue}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTextareaValue(e.target.value)}
            />
            <Textarea
              label="에러 상태"
              error="내용을 입력해주세요"
              rows={3}
            />
          </div>
        </section>

        {/* Checkbox 섹션 */}
        <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Checkbox</h2>
          <div className="space-y-3">
            <Checkbox
              label="레이블이 있는 체크박스"
              checked={isChecked}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIsChecked(e.target.checked)}
            />
            <Checkbox label="완료된 할일" checked />
            <Checkbox label="비활성 체크박스" disabled />
          </div>
        </section>

        {/* Badge 섹션 */}
        <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Badge</h2>
          <div className="flex gap-3 flex-wrap">
            <Badge status="active">진행 중</Badge>
            <Badge status="completed">완료</Badge>
            <Badge status="overdue">기한 초과</Badge>
          </div>
        </section>

        {/* Modal 섹션 */}
        <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Modal</h2>
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            모달 열기
          </Button>
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="할일 추가"
            footer={
              <>
                <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                  취소
                </Button>
                <Button variant="primary" onClick={() => setIsModalOpen(false)}>
                  저장
                </Button>
              </>
            }
          >
            <div className="space-y-4">
              <Input label="제목" placeholder="할일 제목을 입력하세요" />
              <Textarea label="내용" placeholder="상세 내용을 입력하세요" rows={4} />
              <Input label="만료일" type="date" />
            </div>
          </Modal>
        </section>

        {/* TodoCard 섹션 */}
        <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">TodoCard</h2>
          <div className="space-y-4 max-w-2xl">
            {sampleTodos.map((todo) => (
              <TodoCard
                key={todo.todoId}
                todo={todo}
                onToggleComplete={(id: string) => console.log('Toggle complete:', id)}
                onEdit={(id: string) => console.log('Edit:', id)}
                onDelete={(id: string) => console.log('Delete:', id)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ComponentShowcase;
