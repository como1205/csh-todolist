import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from './Modal';
import Button from './Button';
import Input from './Input';
import Textarea from './Textarea';
import { useTodoStore } from '@/stores/todoStore';
import type { Todo } from '@/types';

// Zod 스키마 정의
const todoFormSchema = z
  .object({
    title: z
      .string()
      .min(1, '제목을 입력해주세요')
      .max(200, '제목은 200자 이하여야 합니다'),
    content: z.string().optional(),
    startDate: z.string().optional(),
    dueDate: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.dueDate) {
        return new Date(data.dueDate) >= new Date(data.startDate);
      }
      return true;
    },
    {
      message: '만료일은 시작일보다 이후여야 합니다',
      path: ['dueDate'],
    }
  );

type TodoFormData = z.infer<typeof todoFormSchema>;

export interface TodoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  todo?: Todo;
}

const TodoFormModal: React.FC<TodoFormModalProps> = ({
  isOpen,
  onClose,
  mode,
  todo,
}) => {
  const { addTodo, updateTodo } = useTodoStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TodoFormData>({
    resolver: zodResolver(todoFormSchema),
    defaultValues: {
      title: '',
      content: '',
      startDate: '',
      dueDate: '',
    },
  });

  // todo prop 변경 시 폼 초기화
  useEffect(() => {
    if (todo && mode === 'edit') {
      reset({
        title: todo.title,
        content: todo.content || '',
        startDate: todo.startDate || '',
        dueDate: todo.dueDate || '',
      });
    } else {
      reset({
        title: '',
        content: '',
        startDate: '',
        dueDate: '',
      });
    }
  }, [todo, mode, reset, isOpen]);

  const onSubmit = async (data: TodoFormData) => {
    try {
      if (mode === 'add') {
        await addTodo({
          title: data.title,
          content: data.content || undefined,
          startDate: data.startDate || undefined,
          dueDate: data.dueDate || undefined,
        });
      } else if (mode === 'edit' && todo) {
        await updateTodo(todo.todoId, {
          title: data.title,
          content: data.content || undefined,
          startDate: data.startDate || undefined,
          dueDate: data.dueDate || undefined,
        });
      }
      onClose();
      reset();
    } catch (error) {
      console.error('할일 저장 실패:', error);
      // 에러는 todoStore에서 처리되므로 여기서는 로깅만
    }
  };

  const handleClose = () => {
    onClose();
    reset();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={mode === 'add' ? '할일 추가' : '할일 수정'}
      footer={
        <>
          <Button variant="secondary" onClick={handleClose} disabled={isSubmitting}>
            취소
          </Button>
          <Button onClick={handleSubmit(onSubmit)} isLoading={isSubmitting}>
            저장
          </Button>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="제목"
          placeholder="할일 제목을 입력하세요"
          {...register('title')}
          error={errors.title?.message}
        />

        <Textarea
          label="내용"
          placeholder="상세 내용을 입력하세요 (선택)"
          rows={5}
          {...register('content')}
          error={errors.content?.message}
        />

        <Input
          type="date"
          label="시작일"
          {...register('startDate')}
          error={errors.startDate?.message}
        />

        <Input
          type="date"
          label="만료일"
          {...register('dueDate')}
          error={errors.dueDate?.message}
        />
      </form>
    </Modal>
  );
};

export default TodoFormModal;
