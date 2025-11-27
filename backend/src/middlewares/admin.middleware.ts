import { Request, Response, NextFunction } from 'express';

export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  // authenticateToken 미들웨어가 먼저 실행되어야 함
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: {
        code: 'NO_AUTH',
        message: '인증이 필요합니다'
      }
    });
    return;
  }

  if (req.user.role !== 'admin') {
    res.status(403).json({
      success: false,
      error: {
        code: 'NO_ADMIN',
        message: '관리자 권한이 필요합니다'
      }
    });
    return;
  }

  next();
};