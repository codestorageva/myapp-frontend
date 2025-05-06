'use client';
import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'

export type InvoiceModeaProps = {
    isModalVisible: boolean;
    onHide: () => void;
}

export const InvoiceIDModel = ({ isModalVisible, onHide }: InvoiceModeaProps) => {
    return (
        <Modal show={isModalVisible} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>
                    <div className='d-flex align-items-center justify-content-between'>
                        Configure Invoice Number Preferences
                    </div>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Add your settings form here */}
                Coming soon!
            </Modal.Body>
        </Modal>
    );
};
