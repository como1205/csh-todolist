import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { authenticateToken } from '../middlewares/auth.middleware';
import { pool } from '../config/database';

// JWT 비밀키 설정
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_access_secret';

describe('Auth Middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockNext = jest.fn();
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call next with user info when valid token is provided', async () => {
    // 테스트용 토큰 생성
    const mockUser = {
      userId: 'test-user-id',
      email: 'test@example.com',
      role: 'user'
    };
    
    const token = jwt.sign(
      { userId: mockUser.userId, email: mockUser.email, role: mockUser.role },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    mockReq = {
      headers: { authorization: `Bearer ${token}` }
    };

    // 데이터베이스 쿼리 모킹
    jest.spyOn(pool, 'query').mockResolvedValue({
      rows: [mockUser]
    } as any);

    await authenticateToken(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockReq.user).toEqual(mockUser);
  });

  it('should return 401 if no token is provided', async () => {
    mockReq = {
      headers: {}
    };

    await authenticateToken(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'NO_TOKEN',
        message: '액세스 토큰이 필요합니다'
      }
    });
  });

  it('should return 401 if invalid token is provided', async () => {
    mockReq = {
      headers: { authorization: 'Bearer invalid-token' }
    };

    await authenticateToken(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: '유효하지 않은 토큰입니다'
      }
    });
  });

  it('should return 401 if token has expired', async () => {
    // 만료된 토큰 생성
    const expiredToken = jwt.sign(
      { userId: 'test-id', email: 'test@example.com', role: 'user' },
      JWT_SECRET,
      { expiresIn: '-1h' } // 이미 만료된 토큰
    );

    mockReq = {
      headers: { authorization: `Bearer ${expiredToken}` }
    };

    await authenticateToken(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'TOKEN_EXPIRED',
        message: '액세스 토큰이 만료되었습니다'
      }
    });
  });

  it('should return 401 if user does not exist in database', async () => {
    const mockUser = {
      userId: 'nonexistent-user-id',
      email: 'nonexistent@example.com',
      role: 'user'
    };
    
    const token = jwt.sign(
      { userId: mockUser.userId, email: mockUser.email, role: mockUser.role },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    mockReq = {
      headers: { authorization: `Bearer ${token}` }
    };

    // 사용자가 존재하지 않는 경우를 모킹
    jest.spyOn(pool, 'query').mockResolvedValue({
      rows: []
    } as any);

    await authenticateToken(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: '유효하지 않은 토큰입니다'
      }
    });
  });
});