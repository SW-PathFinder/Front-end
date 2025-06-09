import { useState } from "react";

import { useNavigate } from "react-router";

import { useAuthenticated } from "@/contexts/AuthenticatedContext";

import { RulebookButton } from "../components/Common/RulebookButton";
import { SettingsButton } from "../components/Common/SettingsButton";
import LogoutModal from "../components/Lobby/LogoutModal";
import RoomConditionModal from "../components/Lobby/RoomConditionModal";
import RoomSearchModal from "../components/Lobby/RoomSearchModal";
import { useAuth } from "../contexts/AuthContext";
import lobby_bg from "/bg/lobby_bg.png";
import create_tn from "/thumbnail/createRoom.png";
import quick_tn from "/thumbnail/quickmatch.png";
import search_tn from "/thumbnail/searchRoom.png";

const LobbyPage = () => {
  const [fastMatchOpen, setFastMatchOpen] = useState<boolean>(false);
  const [createOpen, setCreateOpen] = useState<boolean>(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [logoutOpen, setLogoutOpen] = useState<boolean>(false);

  const { logout } = useAuth();
  const { userId } = useAuthenticated();
  const navigate = useNavigate();

  return (
    <div
      className="flex min-h-screen flex-col justify-between bg-cover bg-center"
      style={{ backgroundImage: `url(${lobby_bg})` }}
    >
      <p className="mt-12 text-center text-5xl font-bold">
        환영합니다! {userId}님
      </p>
      <div className="absolute top-8 right-8 flex gap-4">
        <RulebookButton />
        <SettingsButton />
      </div>
      <div className="mx-12 flex flex-1 items-center justify-center gap-12 p-4">
        <div
          className="card-style card-hover-style"
          onClick={() => setFastMatchOpen(true)}
        >
          <div className="pointer-events-none absolute inset-0" />
          <div className="relative z-10 flex flex-col items-center">
            <img
              src={quick_tn}
              alt="Logo"
              className="mx-auto mb-4 w-4xl rounded-2xl border-4 border-neutral"
            />
            <div className="text-center text-2xl font-bold">빠른 매칭</div>
          </div>
        </div>
        <div
          className="card-style card-hover-style"
          onClick={() => setCreateOpen(true)}
        >
          <div className="pointer-events-none absolute inset-0" />
          <div className="relative z-10 flex flex-col items-center">
            <img
              src={create_tn}
              alt="Logo"
              className="mx-auto mb-4 w-4xl rounded-2xl border-4 border-neutral"
            />
            <div className="text-center text-2xl font-bold">방 생성</div>
          </div>
        </div>
        <div
          className="card-style card-hover-style"
          onClick={() => setSearchOpen(true)}
        >
          <div className="pointer-events-none absolute inset-0" />
          <div className="relative z-10 flex flex-col items-center">
            <img
              src={search_tn}
              alt="Logo"
              className="mx-auto mb-4 w-4xl rounded-2xl border-4 border-neutral"
            />
            <div className="text-center text-2xl font-bold">방 코드 검색</div>
          </div>
        </div>
      </div>
      <button
        className="btn mb-8 ml-8 self-start btn-lg btn-neutral"
        onClick={() => setLogoutOpen(true)}
      >
        로그아웃
      </button>
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
  );
};

export default LobbyPage;
