import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ConfirmationModal from "../ConfirmationModal";

const mockOnConfirm = jest.fn();
const mockOnCancel = jest.fn();

const defaultProps = {
  isOpen: true,
  title: "Test Title",
  message: "Test message",
  onConfirm: mockOnConfirm,
  onCancel: mockOnCancel,
};

// Mock body style for scroll lock tests
Object.defineProperty(document.body, "style", {
  value: {},
  writable: true,
});

describe("ConfirmationModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.body.style.overflow = "unset";
  });

  afterEach(() => {
    // Clean up any event listeners
    document.removeEventListener("keydown", jest.fn());
  });

  describe("Rendering", () => {
    it("should not render when isOpen is false", () => {
      render(<ConfirmationModal {...defaultProps} isOpen={false} />);

      expect(screen.queryByText("Test Title")).not.toBeInTheDocument();
      expect(screen.queryByText("Test message")).not.toBeInTheDocument();
    });

    it("should render modal when isOpen is true", () => {
      render(<ConfirmationModal {...defaultProps} />);

      expect(screen.getByText("Test Title")).toBeInTheDocument();
      expect(screen.getByText("Test message")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Confirm" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Cancel" })
      ).toBeInTheDocument();
    });

    it("should render with custom button text", () => {
      render(
        <ConfirmationModal
          {...defaultProps}
          confirmText="Delete"
          cancelText="Keep"
        />
      );

      expect(
        screen.getByRole("button", { name: "Delete" })
      ).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Keep" })).toBeInTheDocument();
    });

    it("should render with danger type styling", () => {
      render(<ConfirmationModal {...defaultProps} type="danger" />);

      const modal = document.querySelector(".confirmation-modal");
      expect(modal).toHaveClass("confirmation-modal--danger");
    });

    it("should render with warning type styling", () => {
      render(<ConfirmationModal {...defaultProps} type="warning" />);

      const modal = document.querySelector(".confirmation-modal");
      expect(modal).toHaveClass("confirmation-modal--warning");
    });

    it("should render with info type styling", () => {
      render(<ConfirmationModal {...defaultProps} type="info" />);

      const modal = document.querySelector(".confirmation-modal");
      expect(modal).toHaveClass("confirmation-modal--info");
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA attributes", () => {
      render(<ConfirmationModal {...defaultProps} />);

      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("aria-labelledby", "modal-title");
      expect(dialog).toHaveAttribute("aria-describedby", "modal-message");

      const title = screen.getByText("Test Title");
      expect(title).toHaveAttribute("id", "modal-title");

      const message = screen.getByText("Test message");
      expect(message).toHaveAttribute("id", "modal-message");
    });

    it("should auto-focus confirm button", () => {
      render(<ConfirmationModal {...defaultProps} />);

      const confirmButton = screen.getByRole("button", { name: "Confirm" });
      expect(confirmButton).toHaveFocus();
    });

    it("should lock body scroll when modal is open", () => {
      render(<ConfirmationModal {...defaultProps} />);

      expect(document.body.style.overflow).toBe("hidden");
    });

    it("should restore body scroll when modal is closed", () => {
      const { rerender } = render(<ConfirmationModal {...defaultProps} />);

      expect(document.body.style.overflow).toBe("hidden");

      rerender(<ConfirmationModal {...defaultProps} isOpen={false} />);

      expect(document.body.style.overflow).toBe("unset");
    });
  });

  describe("User Interactions", () => {
    it("should call onConfirm when confirm button is clicked", async () => {
      const user = userEvent.setup();
      render(<ConfirmationModal {...defaultProps} />);

      const confirmButton = screen.getByRole("button", { name: "Confirm" });
      await user.click(confirmButton);

      expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    });

    it("should call onCancel when cancel button is clicked", async () => {
      const user = userEvent.setup();
      render(<ConfirmationModal {...defaultProps} />);

      const cancelButton = screen.getByRole("button", { name: "Cancel" });
      await user.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    it("should call onCancel when backdrop is clicked", async () => {
      const user = userEvent.setup();
      render(<ConfirmationModal {...defaultProps} />);

      const overlay = document.querySelector(".confirmation-modal-overlay");
      if (overlay) {
        await user.click(overlay);
      }

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    it("should not call onCancel when modal content is clicked", async () => {
      const user = userEvent.setup();
      render(<ConfirmationModal {...defaultProps} />);

      const modal = document.querySelector(".confirmation-modal");
      if (modal) {
        await user.click(modal);
      }

      expect(mockOnCancel).not.toHaveBeenCalled();
    });

    it("should call onCancel when Escape key is pressed", () => {
      render(<ConfirmationModal {...defaultProps} />);

      fireEvent.keyDown(document, { key: "Escape" });

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    it("should not call onCancel for other keys", () => {
      render(<ConfirmationModal {...defaultProps} />);

      fireEvent.keyDown(document, { key: "Enter" });
      fireEvent.keyDown(document, { key: "Space" });

      expect(mockOnCancel).not.toHaveBeenCalled();
    });
  });

  describe("Button Type Styling", () => {
    it("should apply danger button styling", () => {
      render(<ConfirmationModal {...defaultProps} type="danger" />);

      const confirmButton = screen.getByRole("button", { name: "Confirm" });
      expect(confirmButton).toHaveClass("confirmation-modal__button--danger");
    });

    it("should apply warning button styling", () => {
      render(<ConfirmationModal {...defaultProps} type="warning" />);

      const confirmButton = screen.getByRole("button", { name: "Confirm" });
      expect(confirmButton).toHaveClass("confirmation-modal__button--warning");
    });

    it("should apply info button styling", () => {
      render(<ConfirmationModal {...defaultProps} type="info" />);

      const confirmButton = screen.getByRole("button", { name: "Confirm" });
      expect(confirmButton).toHaveClass("confirmation-modal__button--info");
    });

    it("should default to warning type", () => {
      render(<ConfirmationModal {...defaultProps} />);

      const modal = document.querySelector(".confirmation-modal");
      expect(modal).toHaveClass("confirmation-modal--warning");

      const confirmButton = screen.getByRole("button", { name: "Confirm" });
      expect(confirmButton).toHaveClass("confirmation-modal__button--warning");
    });
  });

  describe("Event Cleanup", () => {
    it("should remove event listeners when modal is closed", () => {
      const addEventListenerSpy = jest.spyOn(document, "addEventListener");
      const removeEventListenerSpy = jest.spyOn(
        document,
        "removeEventListener"
      );

      const { rerender } = render(<ConfirmationModal {...defaultProps} />);

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        "keydown",
        expect.any(Function)
      );

      rerender(<ConfirmationModal {...defaultProps} isOpen={false} />);

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "keydown",
        expect.any(Function)
      );

      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });

    it("should remove event listeners on unmount", () => {
      const removeEventListenerSpy = jest.spyOn(
        document,
        "removeEventListener"
      );

      const { unmount } = render(<ConfirmationModal {...defaultProps} />);

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "keydown",
        expect.any(Function)
      );

      removeEventListenerSpy.mockRestore();
    });
  });
});
