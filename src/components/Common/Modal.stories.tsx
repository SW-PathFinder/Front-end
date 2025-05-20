import { useState } from "react";

import type { Meta } from "@storybook/react";

import { Modal } from "./Modal";

const meta: Meta<typeof Modal> = { title: "Common/Modal", component: Modal };

export default meta;

export const Default = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCancel = (): void => {
    alert("취소됨");
    setIsOpen(false);
  };

  const handleConfirm = (): void => {
    alert("확인됨");
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded bg-blue-500 px-4 py-2 text-white"
      >
        모달 열기
      </button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="샘플 모달">
        <p className="mb-4 text-center text-sm text-gray-700">
          재사용 가능한 모달. 룰북, 확인용으로 사용
        </p>
        <div className="flex justify-center gap-2">
          <button
            onClick={handleCancel}
            className="rounded bg-gray-300 px-4 py-2 text-gray-800"
          >
            취소
          </button>
          <button
            onClick={handleConfirm}
            className="rounded bg-blue-600 px-4 py-2 text-white"
          >
            확인
          </button>
        </div>
      </Modal>
    </>
  );
};
