import { useState } from "react";

export const SettingsButton = () => {
  const [open, setOpen] = useState(false);
  const [volume, setVolume] = useState(50);

  return (
    <>
      <button onClick={() => setOpen(true)}>
        <img
          className="h-16 w-16 hover:cursor-pointer"
          src="/buttons/setting.png"
          alt="settings"
        />
      </button>
      {open && (
        <div className="modal-open modal" onClick={() => setOpen(false)}>
          <div
            className="relative modal-box bg-neutral-900"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="btn absolute top-2 right-2 btn-circle btn-sm"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
            <h3 className="text-center text-lg font-bold">사운드 설정</h3>
            <div className="mt-4">
              <label htmlFor="volume-slider" className="label">
                볼륨: {volume}%
              </label>
              <input
                id="volume-slider"
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="range w-full range-primary"
              />
            </div>
            <div className="modal-action justify-center">
              <button
                type="button"
                className="btn"
                onClick={() => setOpen(false)}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
