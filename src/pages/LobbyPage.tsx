import { useState } from "react";

import { useNavigate } from "react-router";

import { RulebookButton } from "../components/Common/RulebookButton";
import { SettingsButton } from "../components/Common/SettingsButton";
import LogoutModal from "../components/Lobby/LogoutModal";
import RoomConditionModal from "../components/Lobby/RoomConditionModal";
import RoomSearchModal from "../components/Lobby/RoomSearchModal";
import { useAuth } from "../contexts/AuthContext";

const LobbyPage = () => {
  const [fastMatchOpen, setFastMatchOpen] = useState<boolean>(false);
  const [createOpen, setCreateOpen] = useState<boolean>(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [logoutOpen, setLogoutOpen] = useState<boolean>(false);

  const { userId, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-base-300 pt-12">
      <div className="fixed top-4 z-50 flex w-full max-w-md justify-between pt-4">
        <div className="wrap flex h-fit w-fit justify-center">
          <p className="text-5xl font-bold">
            Welcome,
            <br />
            {userId}
          </p>
        </div>
        <div className="flex gap-2">
          <RulebookButton />
          <SettingsButton />
        </div>
      </div>
      <div className="my-10 flex h-full w-full max-w-md flex-col justify-between gap-10 pt-20">
        <div className="flex h-full flex-col items-center justify-between gap-4 overflow-auto">
          <div className="flex w-full flex-col items-center gap-4">
            <button
              className="btn w-full btn-accent"
              onClick={() => setFastMatchOpen(true)}
            >
              빠른 매칭
            </button>
            <button
              className="btn w-full btn-secondary"
              onClick={() => {
                setCreateOpen(true);
              }}
            >
              방 생성
            </button>
            <button
              className="btn w-full btn-primary"
              onClick={() => setSearchOpen(true)}
            >
              방 코드 검색
            </button>
          </div>
          <button
            className="btn w-full btn-soft btn-warning"
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
        {/* 방 생성 */}
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
            logout();
            navigate("/login");
            setLogoutOpen(false);
          }}
        />
      </div>
    </div>
  );
};

export default LobbyPage;
