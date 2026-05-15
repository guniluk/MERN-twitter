# MERN Twitter Clone

이 프로젝트는 MERN (MongoDB, Express, React, Node.js) 스택을 사용하여 개발된 트위터 클론 프로젝트입니다.

## 프로젝트 구조

- `backend/`: Node.js 및 Express 서버와 MongoDB 연동 로직이 포함되어 있습니다.
    - `controllers/`: 각 라우트의 비즈니스 로직을 처리합니다.
    - `models/`: MongoDB 데이터 스키마 정의 (User, Notification, Post).
    - `routes/`: API 엔드포인트를 정의합니다.
    - `middleware/`: 요청 보호를 위한 인증 미들웨어가 포함되어 있습니다.
- `frontend/`: React 및 Vite를 사용한 클라이언트 애플리케이션입니다.
    - `src/components/`: 공통 UI 요소 (Header, Post 등) 및 SVG 아이콘 관리.
    - `src/pages/`: 라우팅된 주요 페이지 (Auth, Home, Profile).

## 기술 스택

### Backend
- **Framework:** Express.js 5.2.1
- **Database:** MongoDB (via Mongoose 9.6.2)
- **Authentication:** JWT (jsonwebtoken), bcryptjs
- **Storage:** Cloudinary (이미지 업로드)
- **Middleware:** cookie-parser, cors, dotenv
- **Dev Tool:** nodemon

### Frontend
- **Framework:** React 19 (Vite 8.0.10)
- **Language:** JavaScript (ES Modules)
- **Styling:** Vanilla CSS
- **Features:**
    - 반응형 레이아웃 및 사용자 정의 컴포넌트 구조.
    - API 요청 처리를 위한 상태 관리 및 라우팅.
    - 인증 처리 및 사용자 프로필 관리.

## API 엔드포인트

### Auth Routes (`/api/auth`)
- `GET /me`: 현재 로그인된 사용자 정보 확인 (Protected)
- `POST /signup`: 회원가입
- `POST /login`: 로그인
- `POST /logout`: 로그아웃

### User Routes (`/api/users`)
- `GET /profile/:username`: 특정 사용자 프로필 정보 조회 (Protected)
- `GET /suggested`: 추천 사용자 목록 조회 (Protected)
- `POST /follow/:id`: 사용자 팔로우/언팔로우 (Protected)
- `POST /update`: 사용자 정보 업데이트 (Protected)

## 데이터 모델

### User Model
- `username`, `fullname`, `email`, `password` (기본 정보)
- `followers`, `following` (팔로우 관계)
- `profileImg`, `coverImg`, `bio`, `link` (프로필 세부 정보)

### Notification Model
- `from`, `to` (관련 사용자)
- `type`: 'follow', 'like'
- `read`: 읽음 여부

### Post Model
- `user` (작성자)
- `text` (게시물 내용)
- `img` (게시물 이미지)
- `likes` (좋아요 누른 사용자 목록)
- `comments` (댓글 목록)

## 시작하기

### 환경 변수 설정
루트 디렉토리에 `.env` 파일을 생성하고 다음 변수들을 설정해야 합니다:

```env
PORT=3001
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 설치 및 실행

#### Root (Backend)
```bash
# 의존성 설치
npm install

# 서버 실행 (개발 모드)
npm run dev
```

#### Frontend
```bash
# frontend 디렉토리로 이동
cd frontend

# 의존성 설치
npm install

# 클라이언트 실행
npm run dev
```

## 개발 컨벤션

- **ES Modules:** 프로젝트 전반에서 `import/export` 구문을 사용합니다.
- **MVC Pattern:** Backend는 `models`, `controllers`, `routes` 폴더 구조를 따릅니다.
- **Linting:** Frontend는 ESLint를 사용하여 코드 품질을 관리합니다.

