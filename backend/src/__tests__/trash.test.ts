import request from 'supertest';
import app from '../app';
import * as jwt from 'jsonwebtoken';
import { pool } from '../config/database';

describe('Trash API', () => {
  let validToken: string;
  let userId: string;
  let trashedTodoId: string;

  beforeAll(() => {
    // 테스트용 JWT 토큰 생성
    const JWT_SECRET = process.env.JWT_SECRET || 'fallback_access_secret';
    userId = 'test-user-id';
    validToken = jwt.sign(
      { userId: userId, email: 'test@example.com', role: 'user' },
      JWT_SECRET,
      { expiresIn: '15m' }
    );
  });

  // 테스트 전에 휴지통에 할일을 생성 (삭제된 상태로 만들기 위해)
  beforeAll(async () => {
    // 먼저 일반 할일 생성
    const createResponse = await request(app)
      .post('/api/todos')
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        title: 'Trash Test Todo',
        content: 'Test content for trash'
      })
      .expect(201);

    const todoId = createResponse.body.data.todoId;

    // 생성한 할일을 삭제하여 휴지통으로 이동
    await request(app)
      .delete(`/api/todos/${todoId}`)
      .set('Authorization', `Bearer ${validToken}`)
      .expect(200);

    trashedTodoId = todoId;
  }, 10000); // 시간이 걸릴 수 있으므로 타임아웃 설정

  afterAll(async () => {
    // 테스트 후 trashedTodoId가 아직 존재하면 정리
    if (trashedTodoId) {
      try {
        await pool.query('DELETE FROM todos WHERE "todoId" = $1', [trashedTodoId]);
      } catch (error) {
        // 이미 삭제된 경우 넘어감
      }
    }
  });

  describe('GET /api/trash', () => {
    it('should get trashed todos', async () => {
      const response = await request(app)
        .get('/api/trash')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.some((todo: any) => todo.todoId === trashedTodoId)).toBe(true);
    });
  });

  describe('DELETE /api/trash/:id', () => {
    it('should permanently delete a todo from trash', async () => {
      // 테스트용으로 다시 삭제된 todo 생성
      const freshTodo = await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          title: 'Fresh Trash Todo',
          content: 'Another test for trash'
        })
        .expect(201);

      const freshTodoId = freshTodo.body.data.todoId;

      // 생성한 할일을 삭제하여 휴지통으로 이동
      await request(app)
        .delete(`/api/todos/${freshTodoId}`)
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      // 휴지통에서 영구 삭제
      const response = await request(app)
        .delete(`/api/trash/${freshTodoId}`)
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('할일이 영구적으로 삭제되었습니다');
    });
  });

  describe('PATCH /api/trash/:id/restore', () => {
    it('should restore a todo from trash', async () => {
      // 테스트용으로 다시 삭제된 todo 생성
      const freshTodo = await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          title: 'Restore Test Todo',
          content: 'Test content for restore'
        })
        .expect(201);

      const freshTodoId = freshTodo.body.data.todoId;

      // 생성한 할일을 삭제하여 휴지통으로 이동
      await request(app)
        .delete(`/api/todos/${freshTodoId}`)
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      // 휴지통에서 복원
      const response = await request(app)
        .patch(`/api/trash/${freshTodoId}/restore`)
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('할일이 복원되었습니다');
      expect(response.body.data.status).toBe('active');
      expect(response.body.data.todoId).toBe(freshTodoId);

      // 복원된 할일은 이제 다시 삭제
      await request(app)
        .delete(`/api/todos/${freshTodoId}`)
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);
    });
  });
});