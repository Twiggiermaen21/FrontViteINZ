import { useEffect } from "react";

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onCancel();
      if (e.key === "Enter") onConfirm();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onConfirm, onCancel]);

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-9999 p-4"
      onClick={onCancel}
    >
      <div
        className="bg-[#2a2b2b] border border-[#374b4b] rounded-2xl shadow-2xl p-8 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-red-900/30 border border-red-700/50 flex items-center justify-center shrink-0">
            <span className="text-red-400 text-lg">!</span>
          </div>
          <p className="text-[#d2e4e2] text-base leading-relaxed">{message}</p>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-[#d2e4e2] bg-[#374b4b] hover:bg-[#4a5e5e] transition-all cursor-pointer"
          >
            Anuluj
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-all cursor-pointer"
          >
            Potwierdź
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
