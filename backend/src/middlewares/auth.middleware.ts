import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { pool } from '../config/database';

// JWT 토큰에서 추출된 사용자 정보 타입
interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

// 미들웨어에서 사용자 정보를 req 객체에 추가하기 위한 타입 확장
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // Authorization 헤더에서 토큰 추출
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN" 형식에서 토큰 부분만 추출

  if (!token) {
    res.status(401).json({
      success: false,
      error: {
        code: 'NO_TOKEN',
        message: '액세스 토큰이 필요합니다'
      }
    });
    return;
  }

  try {
    // 토큰 유효성 검증
    const JWT_SECRET = process.env.JWT_SECRET || 'fallback_access_secret';
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // 데이터베이스에서 사용자 존재 확인 (토큰 재생 공격 방지)
    const userQuery = 'SELECT "userId", email, role FROM users WHERE "userId" = $1';
    const result = await pool.query(userQuery, [decoded.userId]);

    if (result.rows.length === 0) {
      res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: '유효하지 않은 토큰입니다'
        }
      });
      return;
    }

    // 사용자 정보를 req 객체에 추가
    req.user = {
      userId: result.rows[0].userId,
      email: result.rows[0].email,
      role: result.rows[0].role
    };

    // 다음 미들웨어 또는 라우트 핸들러로 전달
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({
        success: false,
        error: {
          code: 'TOKEN_EXPIRED',
          message: '액세스 토큰이 만료되었습니다'
        }
      });
    } else if (error.name === 'JsonWebTokenError') {
      res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: '유효하지 않은 토큰입니다'
        }
      });
    } else {
      res.status(401).json({
        success: false,
        error: {
          code: 'AUTH_ERROR',
          message: '인증 오류가 발생했습니다'
        }
      });
    }
  }
};