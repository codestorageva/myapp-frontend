"use client";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import CustomButton from "../buttons/page";
import styles from './CustomButton.module.css';
export type ModalProps = {
  title?: string;
  idKey?: string;
  message?: string;
  onclick?: () => void;
  onHide: () => void;
  closeNoBtn: () => void;
  okBtn?: () => void;
  isModalVisible: boolean;
  isSoftDeletePage?: boolean;
  hasPermissionChanged?: boolean;
};

export default function DeleteRestoreModal({
  title,
  idKey,
  message,
  isModalVisible,
  onclick,
  onHide,
  closeNoBtn,
  okBtn,
  isSoftDeletePage = false,
  hasPermissionChanged = false,
}: ModalProps) {
  const [show, setShow] = useState(isModalVisible);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Modal show={isModalVisible} onHide={onHide}>
      {!hasPermissionChanged ? (
        <>
          <Modal.Header>
            <Modal.Title>
              <div className="d-flex align-items-center justify-content-between">
                {`${isSoftDeletePage ? "Restore" : "Delete"} ${title}`}{" "}
              </div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {`Are you sure you want to ${isSoftDeletePage ? "restore" : "delete"
              } this?`}
          </Modal.Body>
          <Modal.Footer>
            {/* <CustomButton
              className={"btn text-light nobtn"}
              showInitially={true}
              name="No"
              onclick={closeNoBtn}
            />
            <CustomButton
              className={"btn text-light yesbtn"}
              showInitially={true}
              name="Yes"
              onclick={onclick}
            /> */}

            <CustomButton
              // className="bg-gradient-to-t from-red-500 to-red-400 px-3 py-1.5 rounded flex items-center space-x-1 transition duration-200 text-white hover:bg-gradient-to-t hover:from-red-400 hover:to-red-500 border-0"
              className="previous-btn"
              showInitially={true}
              name="No"
              onClick={closeNoBtn}
          
            />
            
            <CustomButton
              className="ok-btn"
              showInitially={true}
              name="Yes"
              onClick={onclick}
            />
          </Modal.Footer>
        </>
      ) : (
        <>
          <Modal.Header>
            <Modal.Body className="fs-5">
              {/* Super Admin has changed your permissions. Please login again. */}
              {message}
            </Modal.Body>
          </Modal.Header>
          <Modal.Footer>
            <CustomButton
              // className={"btn text-light yesbtn"}
              className="ok-btn"
              showInitially={true}
              name="Ok"
              // onclick={okBtn}
              onClick={onclick}
            />
          </Modal.Footer>
        </>
      )}
    </Modal>
  );
}
