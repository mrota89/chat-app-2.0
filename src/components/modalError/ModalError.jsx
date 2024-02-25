import React from 'react';
import { FaExclamationCircle } from 'react-icons/fa';

const ModalError = ({ errorCode, errorMessage, onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <FaExclamationCircle className="exclamation-icon" />
        <h2 className='error-title'>Errore</h2>
        <strong>{errorCode}</strong>
        <p className='error-message'>{errorMessage}</p>
        <button className="close-error" onClick={onClose}>Ok</button>
      </div>
    </div>
  );
};

export default ModalError;