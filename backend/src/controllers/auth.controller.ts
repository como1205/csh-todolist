import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { RegisterRequest, LoginRequest, RefreshTokenRequest } from '../types/auth.types';

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const userData: RegisterRequest = req.body;
      
      const user = await AuthService.register(userData);
      
      res.status(201).json({
        success: true,
        data: user
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: {
          code: 'REGISTRATION_ERROR',
          message: error.message
        }
      });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const loginData: LoginRequest = req.body;
      
      const response = await AuthService.login(loginData);
      
      res.status(200).json({
        success: true,
        data: response
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        error: {
          code: 'LOGIN_ERROR',
          message: error.message
        }
      });
    }
  }

  static async refresh(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken }: RefreshTokenRequest = req.body;

      if (!refreshToken) {
        res.status(401).json({
          success: false,
          error: {
            code: 'NO_REFRESH_TOKEN',
            message: '리프레시 토큰이 필요합니다'
          }
        });
        return;
      }

      const response = await AuthService.refresh(refreshToken);

      res.status(200).json({
        success: true,
        data: response
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        error: {
          code: 'TOKEN_REFRESH_ERROR',
          message: error.message
        }
      });
    }
  }

  static async logout(req: Request, res: Response): Promise<void> {
    // 클라이언트 측에서 토큰을 제거하기 때문에 특별한 서버 작업 없이 성공 응답
    res.status(200).json({
      success: true,
      message: '로그아웃 성공'
    });
  }
}