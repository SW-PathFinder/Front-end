interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutModal = ({ isOpen, onClose, onConfirm }: LogoutModalProps) => {
  if (!isOpen) return null;

  return (
    <dialog open className="modal" onCancel={onClose} onClose={onClose}>
      <div className="modal-box">
        <h3 className="text-lg font-bold">정말로 로그아웃하시겠습니까?</h3>
        <div className="modal-action mt-4 flex justify-end space-x-2">
          <button type="button" className="btn btn-outline" onClick={onClose}>
            취소
          </button>
          <button type="button" className="btn-danger btn" onClick={onConfirm}>
            확인
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={onClose}>
          close
        </button>
      </form>
    </dialog>
  );
};

export default LogoutModal;
