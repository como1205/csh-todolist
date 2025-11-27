import request from 'supertest';
import app from '../app';

describe('App', () => {
  describe('GET /', () => {
    it('should return a welcome message', (done) => {
      request(app)
        .get('/')
        .expect(200)
        .expect((res) => {
          expect(res.body.message).toBe('csh-TodoList Backend API');
        })
        .end(done);
    });
  });

  describe('GET /api/health', () => {
    it('should return health status', (done) => {
      request(app)
        .get('/api/health')
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe('ok');
        })
        .end(done);
    });
  });
});