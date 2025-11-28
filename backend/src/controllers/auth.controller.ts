import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import {
  RegisterRequest,
  LoginRequest,
  RefreshTokenRequest,
} from "../types/auth.types";

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    const clientIp = req.ip || req.headers["x-forwarded-for"] || "unknown";
    console.log(
      `[REGISTER] Attempt from IP: ${clientIp}, Email: ${req.body.email}`
    );

    try {
      const userData: RegisterRequest = req.body;

      const user = await AuthService.register(userData);

      console.log(
        `[REGISTER] SUCCESS - User: ${user.userId}, Email: ${user.email}`
      );

      res.status(201).json({
        success: true,
        data: user,
      });
    } catch (error: any) {
      console.error(
        `[REGISTER] FAILED - Email: ${req.body.email}, Error: ${error.message}`
      );

      res.status(400).json({
        success: false,
        error: {
          code: "REGISTRATION_ERROR",
          message: error.message,
        },
      });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    const clientIp = req.ip || req.headers["x-forwarded-for"] || "unknown";
    console.log(
      `[LOGIN] Attempt from IP: ${clientIp}, Email: ${req.body.email}`
    );

    try {
      const loginData: LoginRequest = req.body;

      const response = await AuthService.login(loginData);

      console.log(
        `[LOGIN] SUCCESS - User: ${response.user.userId}, Email: ${response.user.email}, Tokens generated`
      );

      res.status(200).json({
        success: true,
        data: response,
      });
    } catch (error: any) {
      console.error(
        `[LOGIN] FAILED - Email: ${req.body.email}, Error: ${error.message}`
      );

      res.status(401).json({
        success: false,
        error: {
          code: "LOGIN_ERROR",
          message: error.message,
        },
      });
    }
  }

  static async refresh(req: Request, res: Response): Promise<void> {
    const clientIp = req.ip || req.headers["x-forwarded-for"] || "unknown";
    console.log(`[REFRESH] Attempt from IP: ${clientIp}`);

    try {
      const { refreshToken }: RefreshTokenRequest = req.body;

      if (!refreshToken) {
        console.error(`[REFRESH] FAILED - No refresh token provided`);

        res.status(401).json({
          success: false,
          error: {
            code: "NO_REFRESH_TOKEN",
            message: "리프레시 토큰이 필요합니다",
          },
        });
        return;
      }

      const response = await AuthService.refresh(refreshToken);

      console.log(`[REFRESH] SUCCESS - New tokens generated`);

      res.status(200).json({
        success: true,
        data: response,
      });
    } catch (error: any) {
      console.error(`[REFRESH] FAILED - Error: ${error.message}`);

      res.status(401).json({
        success: false,
        error: {
          code: "TOKEN_REFRESH_ERROR",
          message: error.message,
        },
      });
    }
  }

  static async logout(req: Request, res: Response): Promise<void> {
    const clientIp = req.ip || req.headers["x-forwarded-for"] || "unknown";
    const userId = (req as any).user?.userId || "unknown";

    console.log(`[LOGOUT] User: ${userId}, IP: ${clientIp}`);

    // 클라이언트 측에서 토큰을 제거하기 때문에 특별한 서버 작업 없이 성공 응답
    res.status(200).json({
      success: true,
      message: "로그아웃 성공",
    });

    console.log(`[LOGOUT] SUCCESS - User: ${userId}`);
  }
}
