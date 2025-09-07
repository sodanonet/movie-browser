import { useEffect } from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: "danger" | "warning" | "info";
}

const ConfirmationModal = ({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  type = "warning",
}: ConfirmationModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onCancel();
    }
  };

  return (
    <div className="confirmation-modal-overlay" onClick={handleBackdropClick}>
      <div
        className={`confirmation-modal confirmation-modal--${type}`}
        data-cy="confirmation-modal"
        role="dialog"
        aria-labelledby="modal-title"
        aria-describedby="modal-message"
      >
        <div className="confirmation-modal__header">
          <h2 id="modal-title" className="confirmation-modal__title">
            {title}
          </h2>
        </div>

        <div className="confirmation-modal__body">
          <p id="modal-message" className="confirmation-modal__message">
            {message}
          </p>
        </div>

        <div className="confirmation-modal__footer">
          <button
            type="button"
            className="confirmation-modal__button confirmation-modal__button--cancel"
            data-cy="modal-cancel-button"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`confirmation-modal__button confirmation-modal__button--confirm confirmation-modal__button--${type}`}
            data-cy="modal-confirm-button"
            onClick={onConfirm}
            autoFocus
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
