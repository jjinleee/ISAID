# <img src="/public/images/star-boy-good.svg" width="40"> ISAID


> **ISAID**는 MZ세대를 위한  
> **맞춤형 ISA 포트폴리오 분석 서비스**입니다.  
>
> 
> 최근 MZ세대를 중심으로 투자에 대한 관심은 높아졌지만,  
> ISA 계좌의 구조나 세제 혜택, ETF 포트폴리오 구성은 여전히 복잡하고 진입장벽이 높습니다.  
> ISAID는 이러한 복잡함을 덜고, 누구나 직관적으로 투자 흐름을 파악할 수 있도록 기획되었습니다.
>







🔗 배포주소 :  [https://isaid.site/](https://isaid.site/) 


---

<br>

## System Architecture
<p align="left">
  <img src="https://github.com/user-attachments/assets/acb31cd6-edfd-488d-8c3c-0b3b329b4505" width="600"/>
</p>

<br>

<br>

## ERD
<p align="left">
 <img src="https://github.com/user-attachments/assets/efb185f2-5db4-4c8e-ae10-428bf5443cc8"/>
</p>

<br>
<br>


## 화면 구성

| 홈 화면 | 투자 성향 테스트 | ETF 추천 결과 | ETF 상세 조회 |
|--|--|--|--|
| ![](https://github.com/user-attachments/assets/27578b73-4b72-42c9-b821-cd61a79c489d) | ![](https://github.com/user-attachments/assets/e3f7045b-e034-4d21-a977-50550e1d1f49)  | ![](https://github.com/user-attachments/assets/335916e3-d50b-4185-8279-6c5e7c30bb53)  | ![](https://github.com/user-attachments/assets/4c2574e1-8dcd-42d7-92b4-40574c3ed9fa)  |

| 리밸런싱 추천 | 수익률 분석 | 절세 계산기 | 금융 퀴즈 캘린더 |
|--|--|--|--|
| ![](https://github.com/user-attachments/assets/c1b5582a-6062-413b-95f1-6861fa2b81fb) | ![](https://github.com/user-attachments/assets/10b619a3-d3e3-4fe9-8b72-e9d5fcf7362c) | ![](https://github.com/user-attachments/assets/19ede02e-96be-442b-bb29-88441c4d597d)  | ![](https://github.com/user-attachments/assets/46c26371-cec6-4c5b-a360-1aa8c24133b4)  |

| 마이페이지 | 금융 가이드 홈 | 가이드 카드 뷰 | 숏츠 가이드 |
|--|--|--|--|
| ![](https://github.com/user-attachments/assets/935a03f0-4ed8-48cc-ad3f-7ebdb9823b75) | ![](https://github.com/user-attachments/assets/b6e9fdb4-95a6-49fd-818a-1325b4d65b67) | ![](https://github.com/user-attachments/assets/1cd818bf-604f-467b-b4b6-e7f63a94aeaa) | ![](https://github.com/user-attachments/assets/4e94493e-8d9b-4b53-ae05-5762309f76c0) |



<br>
<br>

## ⚙️ 주요 기능 요약

| 분류 | 기능 | 설명 |
|------|------|------|
| 사용자 | 회원가입 / 로그인 | 자체 인증 기반 회원 시스템 (Credentials + JWT) |
| ISA 계좌 | ISA 계좌 등록/삭제 | 사용자는 ISA 계좌를 등록하고 삭제할 수 있음 |
| ISA 계좌 | 수익률 조회 | 월별 기준으로 자산 수익률을 계산해 제공 |
| ISA 계좌 | 포트폴리오 리밸런싱 | 기존 보유 ETF 기준으로 리밸런싱을 추천 |
| ISA 계좌 | 절세 계산기 | 예상 절세 효과 및 만기 후 수령액 시뮬레이션 |
| ETF | 테마 / 카테고리별 ETF 조회 | 다양한 조건(테마/카테고리)으로 ETF 탐색 가능 |
| ETF | 투자 성향 테스트 | 투자 성향을 진단하고 맞춤 ETF를 추천 |
| ETF | ETF 차트 및 구성 | 종목별 구성 비중 및 수익률 차트 제공 |
| 퀴즈 | 금융 퀴즈 | 퀴즈로 금융 지식을 점검하고 캘린더에 기록 |
| 챌린지 | 퀴즈 보상 시스템 | 일정 조건을 달성하면 보상 수령 가능 |


<br>
<br>

## 📁 폴더 구조
| app/ | App Router 기반 페이지, 액션, API 라우트 구성 |
| --- | --- |
| components/ | 서비스 전반적으로 사용되는, 재사용 가능한 공통 UI 컴포넌트 |
| context/ | 클라이언트 상태 공유 (예: 헤더 컨텍스트) |
| services/ | 핵심 알고리즘 계층 (ETF 추천, 리밸런싱 등) |
| lib/ | DB 접근, API 호출, 인증 등 로직 |
| data/ | 선택지, 기본값, 샘플 데이터 |
| types/ | 공통 타입 정의 |
| __tests__/, __mocks__/ | 테스트 및 의존성 모킹 코드 |
| prisma/ | 데이터베이스 모델 및 마이그레이션 |
| public/ | 정적 파일 (폰트, 이미지 등) |
| 설정 파일들 | 린트, 프리티어, 타입스크립트, 패키지 관리 설정 |
<br>
<br>


## 🛠 Tech Stack

### Platforms & Languages

<img src="https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white"/><img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white"/><img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white"/><img src="https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white"/><img src="https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white"/><img src="https://img.shields.io/badge/AWS RDS-527FFF?style=flat&logo=amazonrds&logoColor=white"/><img src="https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white"/>
<img src="https://img.shields.io/badge/Selenium-43B02A?style=flat&logo=selenium&logoColor=white"/>

### Deployment & Version Control

<img src="https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white"/><img src="https://img.shields.io/badge/Git-F05032?style=flat&logo=git&logoColor=white"/><img src="https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white"/>

### Development Environment

<img src="https://img.shields.io/badge/IntelliJ IDEA-000000?style=flat&logo=intellijidea&logoColor=white"/><img src="https://img.shields.io/badge/VSCode-007ACC?style=flat&logo=visualstudiocode&logoColor=white"/>

### Communication & Management

<img src="https://img.shields.io/badge/Notion-000000?style=flat&logo=notion&logoColor=white"/>


<br>
<br>

## 📌 API 문서 요약



### 👤 사용자 (User)

| 메서드 | 경로 | 설명 |
|--------|------|------|
| `POST` | `/api/auth/join` | 회원가입 |
| `POST` | `/api/auth/callback/credentials` | 로그인 (Credential 기반) |
| `PATCH` | `/api/user/update` | 회원정보 수정 |
| `DELETE` | `/api/user/delete` | 회원 탈퇴 |
| `GET` | `/api/user/me` | 내 정보 조회 |
| `POST` | `/api/user/verify-pin` | PIN 인증 |
| `PATCH` | `/api/user/reward-agree` | 보상 동의 |



### 💹 ETF

| 메서드 | 경로 | 설명 |
|--------|------|------|
| `GET` | `/api/etf/theme/{themeSlug}` | 테마별 ETF 리스트 조회 |
| `GET` | `/api/etf/category/{categoryId}` | 카테고리별 ETF 리스트 조회 |
| `GET` | `/api/etf/recommend` | 사용자 맞춤 ETF 추천 |
| `GET` | `/api/etf/{etfId}` | 개별 ETF 상세 정보 조회 |
| `GET` | `/api/etf/{etfId}/chart?range={period}` | ETF 기간별 차트 데이터 조회 |
| `GET` | `/api/etf/{etfId}/pdf` | ETF 구성 비중 PDF 반환 |
| `GET` | `/api/etf/portfolio` | 보유 ETF 상세 조회 |
| `GET` | `/api/etf/mbti` | 투자 성향 및 선호 카테고리 조회 |
| `POST` | `/api/etf/mbti` | 투자 성향 및 선호 카테고리 저장 |



### 💼 ISA

| 메서드 | 경로 | 설명 |
|--------|------|------|
| `POST` | `/api/isa` | ISA 계좌 등록 |
| `GET` | `/api/isa` | ISA 계좌 목록 조회 |
| `DELETE` | `/api/isa` | ISA 계좌 삭제 |
| `GET` | (서버액션) | 수익률 조회 |
| `GET` | (서버액션) | 포트폴리오 조회 |
| `POST` | `/api/isa/save` | 절세 계산기 |
| `GET` | `/api/isa/rebalancing` | 포트폴리오 리밸런싱 추천 |


### 🧠 금융 퀴즈 (Quiz)

| 메서드 | 경로 | 설명 |
|--------|------|------|
| `GET` | `/api/quiz/question` | 퀴즈 가져오기 |
| `POST` | `/api/quiz/question/submit` | 정답 제출 및 캘린더 기록 |
| `GET` | `/api/quiz/calendar` | 퀴즈 달력 조회 |



### 🏆 챌린지 (Challenge)

| 메서드 | 경로 | 설명 |
|--------|------|------|
| `POST` | `/api/challenge/claim` | 보상 수령 요청 |

<br>
<br>

## 🧪 테스트

ISAID 프로젝트는 포괄적인 테스트 스위트를 제공하여 코드의 안정성과 신뢰성을 보장합니다.

### API 테스트

| 테스트 파일 | API 경로 | 설명 |
|-------------|----------|------|
| `challenge-claim-api.test.ts` | `/api/challenge/claim` | 챌린지 보상 청구 API |
| `etf-recommend-api.test.ts` | `/api/etf/recommend` | ETF 추천 API |
| `etf-test-api.test.ts` | `/api/etf/mbti` | ETF 투자 성향 테스트 API |
| `isa-rebalancing-api.test.ts` | `/api/isa/rebalancing` | ISA 포트폴리오 리밸런싱 API |

<br>

### 서비스 테스트

| 테스트 파일 | 서비스 | 설명 |
|-------------|--------|------|
| `etf-recommend-service.test.ts` | `EtfRecommendService` | ETF 추천 알고리즘 및 위험등급 분류 |
| `etf-test-service.test.ts` | `EtfTestService` | 투자 성향 분석 및 테스트 결과 처리 |
| `challenge-claim.test.ts` | `ChallengeClaimService` | 챌린지 보상 청구 조건 검증 |
| `challenge-status.test.ts` | `ChallengeStatusService` | 챌린지 진행 상태 확인 |
| `isa-rebalancing-service.test.ts` | `IsaRebalancingService` | ISA 포트폴리오 리밸런싱 전략 |
| `get-isa-portfolio.test.ts` | `GetIsaPortfolioService` | ISA 포트폴리오 조회 |
| `get-monthly-returns.test.ts` | `GetMonthlyReturnsService` | 월별 수익률 계산 |
| `tax-saving.test.ts` | `TaxSavingService` | 세금 절약 효과 계산 |

<br>

### 헬퍼 함수

| 헬퍼 파일 | 설명 |
|-----------|------|
| `etf-recommend-helpers.ts` | ETF 추천 테스트용 모의 데이터 생성 |
| `etf-test-helpers.ts` | ETF 테스트 관련 헬퍼 함수 |
| `rebalancing-helpers.ts` | 리밸런싱 테스트 헬퍼 함수 |

<br>

### 테스트 환경

| 항목 | 설명 |
|------|------|
| **테스트 프레임워크** | Jest |
| **실행 환경** | Node.js (`@jest-environment node`) |
| **모킹** | Prisma, NextAuth, 외부 서비스 |
| **스냅샷 테스트** | UI 컴포넌트 스냅샷 테스트 지원 |

<br>
<br>

## 팀원 소개
| <img src="https://avatars.githubusercontent.com/dbstj0403" width="130"/> | <img src="https://avatars.githubusercontent.com/HyejeongSon" width="130"/> | <img src="https://avatars.githubusercontent.com/hyo-joon" width="130"/> | <img src="https://avatars.githubusercontent.com/jjinleee" width="130"/> | <img src="https://avatars.githubusercontent.com/KimGiii" width="130"/> | <img src="https://avatars.githubusercontent.com/VarGun" width="130"/> |
|:--:|:--:|:--:|:--:|:--:|:--:|
| **윤서**<br>[@dbstj0403](https://github.com/dbstj0403)<br/> | **Hyejeong Son**<br>[@HyejeongSon](https://github.com/HyejeongSon)<br/> | **Hyo-joon**<br>[@hyo-joon](https://github.com/hyo-joon)<br/> | **Jin Lee**<br>[@jjinleee](https://github.com/jjinleee)<br/>| **Gibo Kim**<br>[@KimGiii](https://github.com/KimGiii)<br/> | **Heegun Kwak**<br>[@VarGun](https://github.com/VarGun)<br/> |
