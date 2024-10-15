# CafeShare 프로젝트

이 저장소는 `client`와 `server` 두 개의 주요 디렉토리를 포함하고 있습니다. `client` 디렉토리에는 프론트엔드 코드가, `server` 디렉토리에는 백엔드 코드가 포함되어 있습니다.

## 사전 요구사항

프로젝트를 설정하기 전에 다음을 설치했는지 확인하세요:

- [Node.js](https://nodejs.org/) (v16 이상)
- [npm](https://www.npmjs.com/) (Node.js 설치 시 함께 제공됩니다)

## 시작하기

### 1. 리포지토리 클론

이 리포지토리를 로컬에 클론하세요:

```bash
git clone https://github.com/yourusername/CafeShare.git
cd CafeShare
```

### 2. 종속성 설치

#### 서버

1. 서버 디렉토리로 이동:

```bash
cd server
```

2. 서버 종속성 설치:

```bash
npm install
```

3. `server` 디렉토리에 `.env` 파일을 생성하고 필요한 환경 변수를 설정하세요:

```plaintext
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=3000 # 원하는 포트 번호로 설정
```

#### 클라이언트

1. 클라이언트 디렉토리로 이동:

```bash
cd ../client
```

2. 클라이언트 종속성 설치:

```bash
npm install
```

3. `client` 디렉토리에 `.env` 파일을 생성하고 서버의 기본 URL을 추가하세요:

```plaintext
REACT_APP_API_BASE_URL=http://localhost:4000
```

### 3. 프로젝트 실행

#### 서버

1. `server` 디렉토리로 이동:

```bash
cd ../server
```

2. 서버 시작:

```bash
npm start
```

서버는 이제 `http://localhost:4000`에서 실행됩니다.

#### 클라이언트

1. `client` 디렉토리로 이동:

```bash
cd ../client
```

2. 클라이언트 시작:

```bash
npm start
```

클라이언트는 이제 `http://localhost:3000`에서 실행됩니다.

### 4. 애플리케이션 접근

브라우저에서 `http://localhost:3000`으로 이동하여 CafeShare 애플리케이션에 접근하세요.

## 프로젝트 구조

### 클라이언트

클라이언트 디렉토리에는 리액트 프론트엔드 코드가 다음과 같이 구성되어 있습니다:

- **src/components** - 재사용 가능한 UI 컴포넌트를 포함합니다.
- **src/pages** - 애플리케이션의 주요 페이지가 포함되어 있습니다.
- **src/context** - 상태 관리를 위한 컨텍스트 제공자가 포함되어 있습니다.
- **src/api** - 서버와의 API 요청을 위한 함수가 포함되어 있습니다.

### 서버

서버 디렉토리는 Express 백엔드 코드로 구성되어 있으며, 다음과 같이 구성되어 있습니다:

- **src/routes** - 서버의 API 라우트를 정의합니다.
- **src/controllers** - 요청을 처리하는 컨트롤러 함수가 포함되어 있습니다.
- **src/middleware** - 인증, 오류 처리 등을 위한 미들웨어가 포함되어 있습니다.
- **src/data** - 데이터 파일 또는 JSON 파일을 저장합니다.

## 사용 가능한 스크립트

### 서버

- **`npm start`** - TypeScript 파일을 컴파일하고 `nodemon`으로 서버를 시작합니다.
- **`npm run lint`** - ESLint를 실행하여 린트 오류를 검사합니다.

### 클라이언트

- **`npm start`** - React 개발 서버를 시작합니다.
- **`npm run build`** - 프로덕션용 앱을 빌드합니다.
- **`npm test`** - 테스트 실행기를 실행합니다.

## 추가 정보

- 이 프로젝트는 이미지를 저장하기 위해 Cloudinary를 사용하므로, `.env` 파일에 Cloudinary 계정과 필요한 자격 증명을 입력해야 합니다.
- Tailwind CSS를 사용하여 클라이언트를 스타일링하므로, 필요에 따라 `tailwind.config.js`를 사용하여 스타일을 확장할 수 있습니다.
