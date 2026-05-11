# MERN Twitter Clone

이 프로젝트는 MERN (MongoDB, Express, React, Node.js) 스택을 사용하여 개발된 트위터 클론 프로젝트입니다.

## 프로젝트 구조

- `backend/`: Node.js 및 Express 서버와 MongoDB 연동 로직이 포함되어 있습니다.
- `frontend/`: React 및 Vite를 사용한 클라이언트 애플리케이션입니다.

## 기술 스택

### Backend
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JWT (jsonwebtoken), bcryptjs
- **Storage:** Cloudinary (이미지 업로드)
- **Middleware:** cookie-parser, cors, dotenv
- **Dev Tool:** nodemon

### Frontend
- **Framework:** React (Vite)
- **Language:** JavaScript (ES Modules)
- **Styling:** Vanilla CSS (예정)

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

#### Backend
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

## 주의 사항
- `backend/server.js`에서 `auth.routes.js` 임포트 시 경로 확인이 필요합니다 (현재 `./auth.routes.js`로 되어 있으나 파일은 `routes/` 폴더 내에 존재할 수 있음).
