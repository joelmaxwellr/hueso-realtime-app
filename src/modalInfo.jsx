import React, { useState } from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        {children}
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default Modal