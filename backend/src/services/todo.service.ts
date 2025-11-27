import { pool } from '../config/database';
import { Todo, CreateTodoRequest, UpdateTodoRequest, TodoListQuery } from '../types/todo.types';

// Helper function to convert database status to TypeScript status
function mapDbStatusToTypeScript(dbStatus: string): 'active' | 'completed' | 'deleted' {
  switch (dbStatus.toUpperCase()) {
    case 'ACTIVE':
      return 'active';
    case 'COMPLETED':
      return 'completed';
    case 'DELETED':
      return 'deleted';
    default:
      return 'active'; // default fallback
  }
}

// Helper function to convert TypeScript status to database status
function mapTypeScriptStatusToDb(tsStatus: 'active' | 'completed' | 'deleted'): string {
  return tsStatus.toUpperCase();
}

export class TodoService {
  // 할일 목록 조회
  static async getTodos(userId: string, query?: TodoListQuery): Promise<Todo[]> {
    let queryStr = `
      SELECT "todoId", "userId", title, content, "startDate", "dueDate", status, "isCompleted", "createdAt", "updatedAt", "deletedAt"
      FROM todos
      WHERE "userId" = $1
    `;

    const params: any[] = [userId];
    let paramIndex = 2;

    // 상태 필터 (TypeScript lowercase -> PostgreSQL uppercase)
    if (query?.status) {
      const dbStatus = query.status.toUpperCase();
      queryStr += ` AND status = $${paramIndex}`;
      params.push(dbStatus);
      paramIndex++;
    }

    // 완료 여부 필터
    if (query?.isCompleted !== undefined) {
      queryStr += ` AND "isCompleted" = $${paramIndex}`;
      params.push(query.isCompleted);
      paramIndex++;
    }

    // 만료일 필터
    if (query?.dueDate) {
      queryStr += ` AND "dueDate" = $${paramIndex}`;
      params.push(query.dueDate);
      paramIndex++;
    }

    // 삭제된 할일 제외 (기본)
    if (!query?.status || query.status !== 'deleted') {
      queryStr += ` AND status != 'DELETED'`;
    }

    queryStr += ` ORDER BY "dueDate" ASC, "createdAt" DESC`;

    const result = await pool.query(queryStr, params);
    // Convert database results to TypeScript types
    return result.rows.map(row => ({
      ...row,
      status: mapDbStatusToTypeScript(row.status)
    }));
  }

  // 할일 생성
  static async createTodo(userId: string, todoData: CreateTodoRequest): Promise<Todo> {
    const { title, content, startDate, dueDate } = todoData;

    // 날짜 형식 확인
    if (dueDate && startDate && new Date(dueDate) < new Date(startDate)) {
      throw new Error('만료일은 시작일 이후여야 합니다');
    }

    const query = `
      INSERT INTO todos ("userId", title, content, "startDate", "dueDate", status)
      VALUES ($1, $2, $3, $4, $5, 'ACTIVE')
      RETURNING "todoId", "userId", title, content, "startDate", "dueDate", status, "isCompleted", "createdAt", "updatedAt", "deletedAt"
    `;

    const result = await pool.query(query, [userId, title, content, startDate, dueDate]);
    const row = result.rows[0];
    return {
      ...row,
      status: mapDbStatusToTypeScript(row.status)
    };
  }

  // 특정 할일 조회
  static async getTodoById(todoId: string, userId: string): Promise<Todo | null> {
    const query = `
      SELECT "todoId", "userId", title, content, "startDate", "dueDate", status, "isCompleted", "createdAt", "updatedAt", "deletedAt"
      FROM todos
      WHERE "todoId" = $1 AND "userId" = $2
    `;

    const result = await pool.query(query, [todoId, userId]);
    const row = result.rows[0];
    return row ? {
      ...row,
      status: mapDbStatusToTypeScript(row.status)
    } : null;
  }

  // 할일 수정
  static async updateTodo(todoId: string, userId: string, updateData: UpdateTodoRequest): Promise<Todo | null> {
    const { title, content, startDate, dueDate } = updateData;

    // 기존 할일 조회
    const existingTodo = await this.getTodoById(todoId, userId);
    if (!existingTodo) {
      return null;
    }

    // 날짜 유효성 검사
    const newStartDate = startDate ? new Date(startDate) : existingTodo.startDate;
    const newDueDate = dueDate ? new Date(dueDate) : existingTodo.dueDate;

    if (newDueDate && newStartDate && newDueDate < newStartDate) {
      throw new Error('만료일은 시작일 이후여야 합니다');
    }

    const query = `
      UPDATE todos
      SET title = COALESCE($1, title),
          content = COALESCE($2, content),
          "startDate" = COALESCE($3, "startDate"),
          "dueDate" = COALESCE($4, "dueDate"),
          "updatedAt" = NOW()
      WHERE "todoId" = $5 AND "userId" = $6
      RETURNING "todoId", "userId", title, content, "startDate", "dueDate", status, "isCompleted", "createdAt", "updatedAt", "deletedAt"
    `;

    const result = await pool.query(query, [title, content, startDate, dueDate, todoId, userId]);
    const row = result.rows[0];
    return row ? {
      ...row,
      status: mapDbStatusToTypeScript(row.status)
    } : null;
  }

  // 할일 완료/미완료 상태 변경
  static async toggleTodoCompletion(todoId: string, userId: string): Promise<Todo | null> {
    // First, get the current todo to determine its new state
    const currentTodoQuery = `
      SELECT "isCompleted" FROM todos WHERE "todoId" = $1 AND "userId" = $2
    `;
    const currentResult = await pool.query(currentTodoQuery, [todoId, userId]);

    if (currentResult.rows.length === 0) {
      return null; // Todo not found or doesn't belong to user
    }

    // Handle possible null value: treat null as false
    const currentIsCompleted = currentResult.rows[0].isCompleted || false;
    const newIsCompleted = !currentIsCompleted; // Toggle the current value
    const newStatus = newIsCompleted ? 'COMPLETED' : 'ACTIVE';

    // Now update the todo with new values
    const query = `
      UPDATE todos
      SET
          "isCompleted" = $3,
          status = $4,
          "updatedAt" = NOW()
      WHERE "todoId" = $1 AND "userId" = $2
      RETURNING "todoId", "userId", title, content, "startDate", "dueDate", status, "isCompleted", "createdAt", "updatedAt", "deletedAt"
    `;

    const result = await pool.query(query, [todoId, userId, newIsCompleted, newStatus]);
    const row = result.rows[0];

    // Logging for debugging
    if (!row) {
      console.log(`Todo with id ${todoId} for user ${userId} not found after update`);
      return null;
    }

    return {
      ...row,
      status: mapDbStatusToTypeScript(row.status)
    };
  }

  // 할일 삭제 (논리 삭제)
  static async deleteTodo(todoId: string, userId: string): Promise<boolean> {
    const query = `
      UPDATE todos
      SET status = 'DELETED',
          "deletedAt" = NOW(),
          "updatedAt" = NOW()
      WHERE "todoId" = $1 AND "userId" = $2
      RETURNING "todoId"
    `;

    const result = await pool.query(query, [todoId, userId]);
    return result.rows.length > 0;
  }

  // 할일 복원
  static async restoreTodo(todoId: string, userId: string): Promise<Todo | null> {
    const query = `
      UPDATE todos
      SET status = 'ACTIVE',
          "deletedAt" = NULL,
          "updatedAt" = NOW()
      WHERE "todoId" = $1 AND "userId" = $2 AND status = 'DELETED'
      RETURNING "todoId", "userId", title, content, "startDate", "dueDate", status, "isCompleted", "createdAt", "updatedAt", "deletedAt"
    `;

    const result = await pool.query(query, [todoId, userId]);
    const row = result.rows[0];
    return row ? {
      ...row,
      status: mapDbStatusToTypeScript(row.status)
    } : null;
  }
}