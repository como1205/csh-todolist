import { Request, Response } from 'express';
import { TrashService } from '../services/trash.service';

export class TrashController {
  // 휴지통 할일 목록 조회
  static async getTrashedTodos(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;

      const todos = await TrashService.getTrashedTodos(userId);

      res.status(200).json({
        success: true,
        data: todos
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: {
          code: 'GET_TRASH_ERROR',
          message: error.message
        }
      });
    }
  }

  // 휴지통 할일 영구 삭제
  static async permanentlyDeleteTodo(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const todoId = req.params.id;

      const success = await TrashService.permanentlyDeleteTodo(todoId, userId);

      if (!success) {
        res.status(404).json({
          success: false,
          error: {
            code: 'TODO_NOT_FOUND',
            message: '할일을 찾을 수 없습니다'
          }
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: '할일이 영구적으로 삭제되었습니다'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: {
          code: 'DELETE_TODO_ERROR',
          message: error.message
        }
      });
    }
  }

  // 휴지통 할일 복원
  static async restoreTodo(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const todoId = req.params.id;

      const todo = await TrashService.restoreTodo(todoId, userId);

      if (!todo) {
        res.status(404).json({
          success: false,
          error: {
            code: 'TODO_NOT_FOUND',
            message: '할일을 찾을 수 없습니다'
          }
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: todo,
        message: '할일이 복원되었습니다'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: {
          code: 'RESTORE_TODO_ERROR',
          message: error.message
        }
      });
    }
  }
}