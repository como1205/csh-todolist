import { Request, Response } from 'express';
import { TodoService } from '../services/todo.service';
import { CreateTodoRequest, UpdateTodoRequest, TodoListQuery } from '../types/todo.types';

export class TodoController {
  // 할일 목록 조회
  static async getTodos(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const query: TodoListQuery = {
        status: req.query.status as 'active' | 'completed' | 'deleted' | undefined,
        isCompleted: req.query.isCompleted !== undefined ? req.query.isCompleted === 'true' : undefined,
        dueDate: req.query.dueDate as string | undefined
      };

      const todos = await TodoService.getTodos(userId, query);

      res.status(200).json({
        success: true,
        data: todos
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: {
          code: 'GET_TODOS_ERROR',
          message: error.message
        }
      });
    }
  }

  // 할일 생성
  static async createTodo(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const todoData: CreateTodoRequest = req.body;

      const todo = await TodoService.createTodo(userId, todoData);

      res.status(201).json({
        success: true,
        data: todo
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: {
          code: 'CREATE_TODO_ERROR',
          message: error.message
        }
      });
    }
  }

  // 특정 할일 조회
  static async getTodoById(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const todoId = req.params.id;

      const todo = await TodoService.getTodoById(todoId, userId);

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
        data: todo
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: {
          code: 'GET_TODO_ERROR',
          message: error.message
        }
      });
    }
  }

  // 할일 수정
  static async updateTodo(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const todoId = req.params.id;
      const updateData: UpdateTodoRequest = req.body;

      const todo = await TodoService.updateTodo(todoId, userId, updateData);

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
        data: todo
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: {
          code: 'UPDATE_TODO_ERROR',
          message: error.message
        }
      });
    }
  }

  // 할일 완료/미완료 상태 변경
  static async toggleTodoCompletion(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const todoId = req.params.id;

      console.log(`Toggling todo ${todoId} for user ${userId}`);

      const todo = await TodoService.toggleTodoCompletion(todoId, userId);

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

      console.log(`Successfully toggled todo ${todoId}, new status: ${todo.status}, new isCompleted: ${todo.isCompleted}`);

      res.status(200).json({
        success: true,
        data: todo
      });
    } catch (error: any) {
      console.error('Toggle todo completion error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'TOGGLE_TODO_ERROR',
          message: error.message
        }
      });
    }
  }

  // 할일 삭제 (논리 삭제)
  static async deleteTodo(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const todoId = req.params.id;

      const success = await TodoService.deleteTodo(todoId, userId);

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
        message: '할일이 휴지통으로 이동되었습니다'
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

  // 할일 복원
  static async restoreTodo(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const todoId = req.params.id;

      const todo = await TodoService.restoreTodo(todoId, userId);

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