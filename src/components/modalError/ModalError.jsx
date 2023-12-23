import React from 'react';
import { FaExclamationCircle } from 'react-icons/fa';

const ModalError = ({ errorCode, errorMessage, onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <FaExclamationCircle className="exclamation-icon" />
        <h2>Errore</h2>
        <strong>{errorCode}</strong>
        <p>{errorMessage}</p>
        <button onClick={onClose}>Ok</button>
      </div>
    </div>
  );
};

export default ModalError;