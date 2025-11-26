## 📋 설명

Supabase에서 신규 프로젝트를 생성하고, PostgreSQL 데이터베이스 접속 정보를 확보합니다.

## ✅ Todo

- [ ] Supabase 프로젝트 생성 완료
- [ ] 데이터베이스 Connection String (URL) 확보
- [ ] 확보된 URL을 백엔드 프로젝트의 `.env` 파일에 `DATABASE_URL`로 저장

## ✅ 완료 조건

1. Supabase 프로젝트 생성 완료
   - 프로젝트 이름: csh-todolist
   - Region: 가장 가까운 리전 선택
   - Database password 설정 및 안전하게 보관

2. Connection String 확보
   - Settings > Database > Connection string 에서 확인
   - Postgres connection string 복사
   - 비밀번호가 포함된 완전한 URL 형식

3. 백엔드 `.env` 파일에 설정 추가
   ```
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[HOST]:[PORT]/postgres"
   ```

4. 데이터베이스 연결 테스트 준비
   - Supabase Dashboard에서 데이터베이스 접근 가능 확인
   - SQL Editor 사용 가능 확인

## 🔧 기술적 고려사항

**사용 서비스**:
- Supabase (PostgreSQL 호스팅)
- PostgreSQL 15+

**주의사항**:
- Database password는 절대 Git에 커밋하지 말것
- `.env` 파일을 `.gitignore`에 반드시 추가
- Connection pooling 설정 확인 (필요시)

**Supabase 프로젝트 설정**:
1. https://supabase.com 접속
2. New Project 클릭
3. Organization 선택 또는 생성
4. Project 정보 입력:
   - Name: csh-todolist
   - Database Password: 강력한 비밀번호 생성 및 저장
   - Region: 가장 가까운 리전 선택 (예: Northeast Asia - Seoul)
5. Create new project 클릭
6. 프로젝트 생성 대기 (1-2분)

**Connection String 확보**:
1. Project Settings > Database
2. Connection string 섹션에서 "URI" 선택
3. 비밀번호 부분을 실제 비밀번호로 교체
4. 복사하여 백엔드 `.env` 파일에 저장

## 🔗 의존성

**선행 작업**: 없음 (Task 1.1, 1.2와 병렬 진행 가능)

**후행 작업**:
- Task 1.4: 데이터베이스 스키마 정의 및 마이그레이션

## 👤 담당

`architect-reviewer`

## 📚 참고 문서

- docs/3-prd.md (7장: 기술 스택)
- docs/5-arch-diagram.md (1장: 시스템 아키텍처)
- Supabase 문서: https://supabase.com/docs
- database/schema.sql 참조
