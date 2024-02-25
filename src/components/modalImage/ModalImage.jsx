import React from 'react';
import { FaDownload } from 'react-icons/fa';

const ModalImage = ({ imageTitle, imageUrl, onClose }) => {
  return (
    <div className="modal image-viewer">
      <div className="modal-content">
        <div className="modal-title">
          <h4>{imageTitle}</h4>
          <div className="buttons-group">
            <FaDownload onClick={() => { }} className='icon' />
            <div className="close-button" onClick={onClose}>
              <div className='close' />
              <div className='close' />
            </div>
          </div>
        </div>
        <img className="modal-image" src={imageUrl} alt="modal" />
      </div>
    </div>
  );
};

export default ModalImage;