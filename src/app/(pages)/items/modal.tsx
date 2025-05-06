import { Modal } from "react-bootstrap";
import React, { ReactNode } from 'react';

interface ModalProps {
  show: boolean;
  onClose: () => void;
  title: string;
  children?: ReactNode; // ✅ allows custom content inside the modal
}

const CustomModal: React.FC<ModalProps> = ({ show, onClose, title, children }) => {
  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {children} {/* ✅ form content will go here */}
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={onClose}>Close</button>
      </Modal.Footer>
    </Modal>
  );
};

export default CustomModal;
