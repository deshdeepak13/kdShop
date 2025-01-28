import React from 'react';

const Modal = ({ isOpen, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50  overflow-auto  ">
      <div className=" sm:w-11/12 md:w-1/2 lg:w-1/3 p-6 relative">
        {/* Optional close button */}
        {/* <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={onClose}>
          Close
        </button> */}
        {children}
      </div>
    </div>
  );
};

export default Modal;
