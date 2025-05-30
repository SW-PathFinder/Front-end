import { useState } from "react";

import { RulebookButton } from "../components/Common/RulebookButton";
import { SettingsButton } from "../components/Common/SettingsButton";
import LogoutModal from "../components/Lobby/LogoutModal";
import RoomConditionModal from "../components/Lobby/RoomConditionModal";
import RoomSearchModal from "../components/Lobby/RoomSearchModal";

const LobbyPage = () => {
  const [fastMatchOpen, setFastMatchOpen] = useState<boolean>(false);
  const [createOpen, setCreateOpen] = useState<boolean>(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [logoutOpen, setLogoutOpen] = useState<boolean>(false);

  const USER_NAME = "사용자 이름";

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-base-300 px-4">
      <div className="fixed top-4 right-4 z-50">
        <div className="flex space-x-2 p-4">
          <RulebookButton />
          <SettingsButton />
        </div>
      </div>
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center p-4">
          <p className="mb-12 text-center text-5xl font-bold">{USER_NAME}</p>
        </div>
        <div className="flex flex-col items-center gap-4">
          <button
            className="btn w-full btn-accent"
            onClick={() => setFastMatchOpen(true)}
          >
            빠른 매칭
          </button>
          <button
            className="btn w-full btn-secondary"
            onClick={() => setCreateOpen(true)}
          >
            방 생성
          </button>
          <button
            className="btn w-full btn-primary"
            onClick={() => setSearchOpen(true)}
          >
            방 코드 검색
          </button>
          <button
            className="btn mt-16 w-full btn-soft btn-warning"
            onClick={() => setLogoutOpen(true)}
          >
            로그아웃
          </button>
        </div>
        {/* 빠른 매칭 */}
        <RoomConditionModal
          isOpen={fastMatchOpen}
          onClose={() => setFastMatchOpen(false)}
          mode="fastMatch"
        />
        {/* 방 생성성 */}
        <RoomConditionModal
          isOpen={createOpen}
          onClose={() => setCreateOpen(false)}
          mode="create"
        />
        <RoomSearchModal
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
        />
        <LogoutModal
          isOpen={logoutOpen}
          onClose={() => setLogoutOpen(false)}
          onConfirm={() => {
            // TODO: 실제 로그아웃 처리 로직
            console.log("로그아웃 처리");
            setLogoutOpen(false);
          }}
        />
      </div>
    </div>
  );
};

export default LobbyPage;
