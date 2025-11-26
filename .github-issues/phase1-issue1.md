## 📋 설명

Express.js, pg (node-postgres), TypeScript 기반의 백엔드 프로젝트를 설정합니다.

## ✅ Todo

- [ ] `npm init` 및 `package.json` 설정 완료
- [ ] Express, pg, TypeScript, ts-node 등 핵심 라이브러리 설치 완료
- [ ] `tsconfig.json` 파일 설정 완료
- [ ] 데이터베이스 연결 설정 완료

## ✅ 완료 조건

1. `package.json`에 필수 의존성 설치 완료
   - express, pg, typescript, ts-node
   - bcrypt, jsonwebtoken
   - cors, helmet, express-rate-limit
   - express-validator
   - @types/* 개발 의존성

2. `tsconfig.json` 파일이 다음 설정을 포함:
   - target: ES2020 이상
   - module: commonjs
   - strict: true
   - esModuleInterop: true

3. 데이터베이스 연결 설정 완료
   - `.env` 파일에 `DATABASE_URL` 플레이스홀더 추가
   - `pg` Pool 기본 설정 완료

4. 프로젝트 폴더 구조 생성
   ```
   backend/
   ├── src/
   │   ├── controllers/
   │   ├── services/
   │   ├── routes/
   │   ├── middlewares/
   │   └── index.ts
   ├── database/
   │   └── config.ts (또는 connection.ts)
   ├── package.json
   ├── tsconfig.json
   └── .env
   ```

## 🔧 기술적 고려사항

**사용 기술**:
- Runtime: Node.js 18+
- Framework: Express.js 4.x
- Database Driver: pg (node-postgres)
- Language: TypeScript

**주의사항**:
- `.env` 파일은 `.gitignore`에 추가
- `node_modules/` 제외 설정
- pg Pool은 커넥션 관리를 위해 필요

**설치할 주요 패키지**:
```bash
# 런타임 의존성
npm install express pg typescript ts-node
npm install bcrypt jsonwebtoken
npm install cors helmet express-rate-limit
npm install express-validator

# 개발 의존성
npm install -D @types/node @types/express @types/pg
npm install -D @types/bcrypt @types/jsonwebtoken
npm install -D @types/cors nodemon
```

## 🔗 의존성

**선행 작업**: 없음

**후행 작업**:
- 데이터베이스 스키마 정의 및 마이그레이션
- Phase 2 모든 백엔드 작업

## 👤 담당

`backend-developer`

## 📚 참고 문서

- docs/3-prd.md (7장: 기술 스택)
- docs/5-arch-diagram.md (3장: 백엔드 아키텍처)
