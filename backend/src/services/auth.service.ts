import { pool } from '../config/database';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User, RegisterRequest, LoginRequest } from '../types/auth.types';

const SALT_ROUNDS = 10;
const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || 'fallback_access_secret';
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret';

export class AuthService {
  static async register(userData: RegisterRequest): Promise<Omit<User, 'password'>> {
    const { email, password, username } = userData;

    console.log(`[AUTH_SERVICE] Register - Checking email: ${email}`);

    // 이메일 중복 확인
    const existingUserQuery = 'SELECT * FROM users WHERE email = $1';
    const existingUserResult = await pool.query(existingUserQuery, [email]);

    if (existingUserResult.rows.length > 0) {
      console.log(`[AUTH_SERVICE] Register - Email already exists: ${email}`);
      throw new Error('이미 존재하는 이메일입니다');
    }

    console.log(`[AUTH_SERVICE] Register - Hashing password for: ${email}`);

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    console.log(`[AUTH_SERVICE] Register - Creating user: ${email}`);

    // 사용자 생성
    const createUserQuery = `
      INSERT INTO users (email, password, username)
      VALUES ($1, $2, $3)
      RETURNING "userId", email, username, role, "createdAt", "updatedAt"
    `;

    const result = await pool.query(createUserQuery, [email, hashedPassword, username]);

    console.log(`[AUTH_SERVICE] Register - User created successfully: ${result.rows[0].userId}`);

    // password 필드 제외하고 반환
    const { password: _, ...user } = result.rows[0];
    return user;
  }

  static async login(loginData: LoginRequest): Promise<{
    accessToken: string;
    refreshToken: string;
    user: Omit<User, 'password'>
  }> {
    const { email, password } = loginData;

    console.log(`[AUTH_SERVICE] Login - Looking up user: ${email}`);

    // 사용자 조회
    const userQuery = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(userQuery, [email]);

    if (result.rows.length === 0) {
      console.log(`[AUTH_SERVICE] Login - User not found: ${email}`);
      throw new Error('이메일 또는 비밀번호가 잘못되었습니다');
    }

    const user = result.rows[0];

    console.log(`[AUTH_SERVICE] Login - User found: ${user.userId}, verifying password`);

    // 비밀번호 검증
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.log(`[AUTH_SERVICE] Login - Invalid password for: ${email}`);
      throw new Error('이메일 또는 비밀번호가 잘못되었습니다');
    }

    console.log(`[AUTH_SERVICE] Login - Password valid, generating tokens for: ${user.userId}`);

    // JWT 토큰 생성
    const accessToken = jwt.sign(
      { userId: user.userId, email: user.email, role: user.role },
      ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user.userId },
      REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    console.log(`[AUTH_SERVICE] Login - Tokens generated successfully for: ${user.userId}`);

    // password 필드 제외하고 반환
    const { password: _, ...userWithoutPassword } = user;

    return {
      accessToken,
      refreshToken,
      user: userWithoutPassword
    };
  }

  static async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    console.log(`[AUTH_SERVICE] Refresh - Verifying refresh token`);

    try {
      // Refresh Token 검증
      const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as { userId: string };

      console.log(`[AUTH_SERVICE] Refresh - Token valid for user: ${decoded.userId}`);

      // 사용자 존재 확인
      const userQuery = 'SELECT "userId", email, role FROM users WHERE "userId" = $1';
      const result = await pool.query(userQuery, [decoded.userId]);

      if (result.rows.length === 0) {
        console.log(`[AUTH_SERVICE] Refresh - User not found: ${decoded.userId}`);
        throw new Error('사용자가 존재하지 않습니다');
      }

      console.log(`[AUTH_SERVICE] Refresh - User found, generating new access token: ${decoded.userId}`);

      // 새 Access Token 발급
      const newAccessToken = jwt.sign(
        {
          userId: result.rows[0].userId,
          email: result.rows[0].email,
          role: result.rows[0].role
        },
        ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
      );

      console.log(`[AUTH_SERVICE] Refresh - New access token generated for: ${decoded.userId}`);

      return { accessToken: newAccessToken };
    } catch (error) {
      console.error(`[AUTH_SERVICE] Refresh - Token verification failed:`, error);
      throw new Error('유효하지 않은 리프레시 토큰입니다');
    }
  }
}