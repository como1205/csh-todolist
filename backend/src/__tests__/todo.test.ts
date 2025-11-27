import request from 'supertest';
import app from '../app';
import * as jwt from 'jsonwebtoken';
import { pool } from '../config/database';

describe('Todo API', () => {
  let validToken: string;
  let userId: string;
  let testTodoId: string;

  beforeAll(() => {
    // 테스트용 JWT 토큰 생성 (실제 사용자 정보는 테스트 데이터베이스에 따라 다름)
    const JWT_SECRET = process.env.JWT_SECRET || 'fallback_access_secret';
    userId = 'test-user-id';
    validToken = jwt.sign(
      { userId: userId, email: 'test@example.com', role: 'user' },
      JWT_SECRET,
      { expiresIn: '15m' }
    );
  });

  afterAll(async () => {
    // 테스트 후 todo 데이터 정리
    if (testTodoId) {
      await pool.query('DELETE FROM todos WHERE "todoId" = $1', [testTodoId]);
    }
  });

  describe('POST /api/todos', () => {
    it('should create a new todo', async () => {
      const todoData = {
        title: 'Test Todo',
        content: 'Test content',
        dueDate: '2025-12-31'
      };

      const response = await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${validToken}`)
        .send(todoData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(todoData.title);
      expect(response.body.data.content).toBe(todoData.content);
      expect(response.body.data.userId).toBe(userId);
      
      // 생성된 todo ID 저장 (나중에 사용)
      testTodoId = response.body.data.todoId;
    });
  });

  describe('GET /api/todos', () => {
    it('should get todos for authenticated user', async () => {
      const response = await request(app)
        .get('/api/todos')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.some((todo: any) => todo.todoId === testTodoId)).toBe(true);
    });
  });

  describe('GET /api/todos/:id', () => {
    it('should get a specific todo', async () => {
      const response = await request(app)
        .get(`/api/todos/${testTodoId}`)
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.todoId).toBe(testTodoId);
    });

    it('should return 404 for non-existent todo', async () => {
      const response = await request(app)
        .get('/api/todos/non-existent-id')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('TODO_NOT_FOUND');
    });
  });

  describe('PUT /api/todos/:id', () => {
    it('should update a todo', async () => {
      const updateData = {
        title: 'Updated Test Todo',
        content: 'Updated content'
      };

      const response = await request(app)
        .put(`/api/todos/${testTodoId}`)
        .set('Authorization', `Bearer ${validToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(updateData.title);
      expect(response.body.data.content).toBe(updateData.content);
    });
  });

  describe('PATCH /api/todos/:id/complete', () => {
    it('should toggle todo completion status', async () => {
      const response = await request(app)
        .patch(`/api/todos/${testTodoId}`)
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.todoId).toBe(testTodoId);
      // isCompleted 상태가 반전되어야 함
    });
  });

  describe('DELETE /api/todos/:id', () => {
    it('should delete (soft delete) a todo', async () => {
      const response = await request(app)
        .delete(`/api/todos/${testTodoId}`)
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('할일이 휴지통으로 이동되었습니다');
    });
  });
});