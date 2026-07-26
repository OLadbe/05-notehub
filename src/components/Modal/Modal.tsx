import { createPortal } from "react-dom";
import css from "./Modal.module.css"
import { useEffect } from "react";

interface ModalProps {
    onClose: () => void;
    children: React.ReactNode;
}


export default function Modal({ onClose, children }: ModalProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    return createPortal(
        <div
            className={css.backdrop}
            role="dialog"
            aria-modal="true"
            onClick={onClose}
            >
            <div className={css.modal} onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>, document.getElementById("modal-root") as HTMLDivElement,

    );
}