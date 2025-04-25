import { ReactNode, useRef } from "react";
import { useOutsideClick } from "./hooks/useOutsideClick";

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
}

const Modal = ({ children, onClose }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useOutsideClick(modalRef, onClose);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-10">
      <div ref={modalRef} className="bg-white p-6 rounded-lg w-80 relative">
        <button
          className="absolute top-2 right-2 text-black font-bold text-xl px-2 py-1"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
