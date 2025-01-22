import React from 'react';

const Modal = ({ isOpen, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 py-32 pt-64 overflow-auto">
        {/* <div className="modal-backdrop inset-0 bg-opacity-50 flex items-center justify-center z-50 fixed"> */}
      <div className="modal-content rounded-lg relative h-auto">
        {/* <div className="modal-content relative"> */}
        {/* <button className="absolute top-2 right-2" onClick={onClose}>
          Close
        </button> */}
        {children}
      </div>
    </div>
  );
};

export default Modal;
