type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-3/4 flex-col overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="w-full text-center text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-xl text-gray-500 hover:text-gray-800"
          >
            &times;
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 text-sm text-gray-800">
          {children}
        </div>
      </div>
    </div>
  );
};
