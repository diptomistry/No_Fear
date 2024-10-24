import React, { ReactNode, useEffect } from "react";
import Modal from "react-modal";
import { FaTimes } from "react-icons/fa";

// Custom styles for the modal
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    maxWidth: "800px",
    maxHeight: "90vh",
    zIndex: 1000,
    padding: "20px",
    position: "relative" as const,
    backgroundColor: "#ffffff", // Light background color
    color: "#000319", // Text color
  },
  overlay: {
    zIndex: 1000,
    backgroundColor: "rgba(0, 0, 0, 0.75)", // Dark overlay background
  },
};

// Defining prop types
interface CustomModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  children: ReactNode;
  ChildrenStyle?: string; // Optional custom styles for children
}

const CustomModal: React.FC<CustomModalProps> = ({
  isOpen,
  onRequestClose,
  children,
  ChildrenStyle = "",
}) => {
  useEffect(() => {
    // Add 'overflow-hidden' to the body when modal opens, and remove it when modal closes
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    // Cleanup in case the modal is closed without triggering the useEffect
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Custom Modal"
    >
      <button
        onClick={onRequestClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-300 transition duration-300 z-50"
      >
        <FaTimes className="text-2xl" />
      </button>
      <div className={`max-h-[80vh] ${ChildrenStyle}`}>{children}</div>
    </Modal>
  );
};

export default CustomModal;
