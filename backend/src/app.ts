import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import { errorHandler } from "./middlewares/errorHandler";
import apiRoutes from "./routes";
import { swaggerSpec } from "./config/swagger";

// 미들웨어 설정!!!!!수정
const app = express();

// Vercel/프록시 환경에서 실행 시 trust proxy 활성화
app.set('trust proxy', 1);

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API 라우트
app.use("/api", apiRoutes);

// 루트 경로 테스트
app.get("/", (req, res) => {
  res.json({ message: "csh-TodoList Backend API" });
});

// 에러 핸들러 미들웨어
app.use(errorHandler);

export default app;
