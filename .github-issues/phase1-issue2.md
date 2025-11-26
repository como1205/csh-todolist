## 📋 설명

Vite와 React, TypeScript를 사용하여 프론트엔드 SPA 프로젝트를 생성합니다.

## ✅ Todo

- [ ] `npm create vite@latest` 명령어로 React + TypeScript 프로젝트 생성 완료
- [ ] `react-router-dom`, `axios`, `zustand`, `tailwindcss` 등 PRD 기반 라이브러리 설치 완료
- [ ] Tailwind CSS 설정 (`tailwind.config.js`, `postcss.config.js`) 완료

## ✅ 완료 조건

1. Vite 프로젝트 생성 완료
   - React 18+
   - TypeScript 5+
   - Vite 5+

2. 필수 라이브러리 설치 완료
   - react-router-dom (라우팅)
   - axios (API 통신)
   - zustand (상태관리)
   - react-hook-form (폼 관리)
   - zod (유효성 검사)
   - tailwindcss (스타일링)

3. Tailwind CSS 설정 완료
   - `tailwind.config.js` 파일 생성 및 설정
   - `postcss.config.js` 파일 생성
   - `index.css`에 Tailwind 지시어 추가

4. 프로젝트 폴더 구조 생성
   ```
   frontend/
   ├── src/
   │   ├── components/
   │   │   ├── common/
   │   │   └── layout/
   │   ├── pages/
   │   ├── store/
   │   ├── api/
   │   ├── types/
   │   ├── utils/
   │   ├── App.tsx
   │   └── main.tsx
   ├── public/
   ├── package.json
   ├── tailwind.config.js
   ├── postcss.config.js
   ├── tsconfig.json
   ├── vite.config.ts
   └── .env
   ```

## 🔧 기술적 고려사항

**사용 기술**:
- Build Tool: Vite 5.x
- Framework: React 18+
- Language: TypeScript 5+
- Styling: Tailwind CSS

**주의사항**:
- `.env` 파일은 `.gitignore`에 추가
- `node_modules/` 제외 설정
- Vite 환경변수는 `VITE_` 접두사 사용

**설치할 주요 패키지**:
```bash
# Vite 프로젝트 생성
npm create vite@latest frontend -- --template react-ts

# 라우팅 및 상태관리
npm install react-router-dom zustand

# API 통신
npm install axios

# 폼 및 유효성 검사
npm install react-hook-form zod @hookform/resolvers

# 스타일링
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 개발 의존성
npm install -D @types/node
```

## 🔗 의존성

**선행 작업**: 없음 (Task 1.1과 병렬 진행 가능)

**후행 작업**:
- Phase 3 모든 프론트엔드 작업

## 👤 담당

`frontend-developer`

## 📚 참고 문서

- docs/3-prd.md (7장: 기술 스택)
- docs/5-arch-diagram.md (2장: 프론트엔드 아키텍처)
- Vite 공식 문서: https://vitejs.dev/
- Tailwind CSS 설치: https://tailwindcss.com/docs/guides/vite
