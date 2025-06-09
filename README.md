# 🎯 Path Finder Front-end

보드게임 **"사보타지(Sabotage)"**를 온라인에서 플레이할 수 있도록 구현한 프론트엔드 프로젝트입니다.  
**OpenVidu 기반 음성 채팅**, **실시간 인터랙션**, **턴제 게임 진행**, **Storybook 기반 컴포넌트 테스트**를 지원합니다.

---

## 🌟 Features

- 🎙 OpenVidu 기반 n:n 음성 채팅
- 🧩 사보타지 룰 기반 턴제 게임 로직
- 🔄 실시간 상태 동기화 (WebSocket 기반)
- 📱 반응형 UI 구성

---

## 🧑‍💻 Contributors

|    Name     |
| :---------: |
| Doohyun Kim |
| Hayoung Son |
| Jaehun Kim  |
| Jiwoo Park  |

---

## 🚀 Getting Started

```bash
pnpm install
pnpm run dev
```

> 기본 포트는 `localhost:5173`입니다.

---

## ⚙️ Environment Variables

`.env.example` 파일을 참고하여 `.env` 파일을 구성해주세요:

```env
VITE_OPENVIDU_API_BASE_URL=
VITE_OPENVIDU_URL=
VITE_OPENVIDU_SECRET=
VITE_SOCKET_URL=
```

> 변수 정보는 Front Slack 채널을 통해 공유됩니다.

---

## 📁 Project Structure

```
src/
├── components/       # 공통 UI 컴포넌트
├── contexts/         # 전역 상태 관리
├── hooks/            # 커스텀 React 훅
├── layouts/          # 페이지 레이아웃 템플릿
├── libs/             # 유틸리티 및 외부 라이브러리
├── pages/            # 라우팅 페이지들
├── services/         # API 통신 함수
│   └── api.ts
├── index.css         # 글로벌 스타일
├── main.tsx          # 앱 진입점
└── vite-env.d.ts     # Vite 환경 타입 정의
```

---

## 🛠️ Tech Stack

| Tool / Library         | Version          | Description                      |
| ---------------------- | ---------------- | -------------------------------- |
| React / ReactDOM       | ^19.0.0          | UI 라이브러리 및 렌더링          |
| Vite                   | ^6.2.0           | 빌드 도구 및 개발 서버           |
| pnpm                   | latest           | 패키지 매니저                    |
| TypeScript             | ~5.7.2           | 타입 안정성을 위한 언어          |
| Tailwind CSS / DaisyUI | ^4.1.4 / ^5.0.38 | 스타일링 프레임워크              |
| OpenVidu Browser       | ^2.31.0          | WebRTC 기반 음성 채팅 라이브러리 |
| React Hook Form        | ^7.56.3          | 폼 상태 관리                     |
| React Query            | ^5.74.3          | 서버 상태 관리                   |
| Storybook              | ^8.6.12          | 컴포넌트 문서화 및 테스트        |
| Vitest / Playwright    | ^3.1.2 / ^1.52.0 | 프론트엔드 테스트 프레임워크     |
| ESLint / Prettier      | ^9.21.0 / ^3.5.3 | 코드 정적 분석 및 포맷팅         |

---

## 📦 Build & Deployment

```bash
pnpm run build
```

- 빌드 결과는 `dist/` 디렉토리에 생성됩니다.
- Netlify, Vercel 또는 사내 서버를 통해 배포합니다.

---

## 🧪 Testing & Documentation

- `Storybook`을 통해 UI 컴포넌트를 문서화하고 시각적으로 테스트합니다.
- 정적 문서는 `storybook-static/`에 생성됩니다.

```bash
pnpm run storybook
```

---

## 📜 Scripts

| Command              | Description                       |
| -------------------- | --------------------------------- |
| `pnpm run dev`       | 개발 서버 실행 (`localhost:5173`) |
| `pnpm run build`     | 정적 빌드 파일 생성               |
| `pnpm run storybook` | Storybook UI 실행                 |
| `pnpm run test`      | Vitest 기반 테스트 실행           |
| `pnpm lint`          | 코드 린트 검사                    |
| `pnpm format`        | 코드 자동 포맷팅                  |

---

## 🤝 Contribution

1. `issue` 확인 또는 새 이슈 생성
2. 브랜치 생성: `feat/*`, `fix/*` 등
3. 커밋 시 prefix 사용: `feat`, `fix`, `chore` 등
4. PR 생성 후 코드 리뷰 → 병합

---

## 📷 Demo Screenshots

### 🔐 Log In Page

![로그인 페이지](media/Log_in_page.png)

### 🏠 Lobby Page

![로비 페이지](media/Lobby.png)

### ⏳ Waiting Room Page

![대기실 페이지](media/Waiting_room_page.png)

### 🧩 In Game Page

![인게임 페이지](media/In_game_page.png)

---

## 🔗 Project Links

- [🗂 View the project board on JIRA](https://hyu-sw-pathfinder.atlassian.net/jira/software/projects/SWPF/boards/1?atlOrigin=eyJpIjoiMjUwYjhlNjJmMGY2NDQzMzkxMmEwMTJjODM5NzE1NjciLCJwIjoiaiJ9)

- [💬 Join the conversation on Microsoft Teams](https://teams.microsoft.com/l/channel/19%3ANMhN29M-TQzndlg8f3plp7T40x2foyc06SzBpx2CA-81%40thread.tacv2/%EA%B3%BC%EC%A0%9C%EC%A7%84%EC%B2%99%EA%B3%B5%EC%9C%A0?groupId=d95b8384-a141-4df6-932b-b53c3c405ce4&tenantId=1d9d976d-975b-4977-9450-bfc64a7cc700)

- [📘 View documentation on Notion](https://www.notion.so/Path-Finder-1b3ee3f05d4081d99993c086806cdd25?source=copy_link)

- [🔗 View the repository on GitHub](https://github.com/SW-PathFinder/Front-end.git)

---

## 📄 License

This project is for internal use only.
