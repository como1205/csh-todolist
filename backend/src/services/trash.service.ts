import { pool } from '../config/database';
import { Todo } from '../types/todo.types';

export class TrashService {
  // 휴지통 할일 목록 조회
  static async getTrashedTodos(userId: string): Promise<Todo[]> {
    const query = `
      SELECT "todoId", "userId", title, content, "startDate", "dueDate", status, "isCompleted", "createdAt", "updatedAt", "deletedAt"
      FROM todos
      WHERE "userId" = $1 AND status = 'deleted'
      ORDER BY "deletedAt" DESC
    `;
    
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  // 휴지통 할일 영구 삭제
  static async permanentlyDeleteTodo(todoId: string, userId: string): Promise<boolean> {
    const query = `
      DELETE FROM todos
      WHERE "todoId" = $1 AND "userId" = $2 AND status = 'deleted'
      RETURNING "todoId"
    `;

    const result = await pool.query(query, [todoId, userId]);
    return result.rows.length > 0;
  }

  // 할일 복원 (휴지통에서 복원)
  static async restoreTodo(todoId: string, userId: string): Promise<Todo | null> {
    const query = `
      UPDATE todos
      SET status = 'active',
          "deletedAt" = NULL,
          "updatedAt" = NOW()
      WHERE "todoId" = $1 AND "userId" = $2 AND status = 'deleted'
      RETURNING "todoId", "userId", title, content, "startDate", "dueDate", status, "isCompleted", "createdAt", "updatedAt", "deletedAt"
    `;
    
    const result = await pool.query(query, [todoId, userId]);
    return result.rows[0] || null;
  }
}