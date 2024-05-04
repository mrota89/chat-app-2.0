import React, { useCallback, useContext } from 'react';
import { ServerErrorsContext } from '../../context';
import { FaDownload } from 'react-icons/fa';
import { mapCodesErrorToMessage } from '../../utility/logic';


const ModalImage = ({ imageTitle, imageUrl, onClose }) => {

  const {
    setShowErrorModal,
    setErrorCode,
    setErrorMessage
  } = useContext(ServerErrorsContext);

  const title = imageTitle.includes('\\n') ? imageTitle.split('\\n')[0] : imageTitle;
  const onImageDownload = useCallback(async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', title);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error(error);
      setErrorCode(error.code)
      setErrorMessage(mapCodesErrorToMessage(error.code))
      setShowErrorModal(true)
    }
  }, [imageUrl, setErrorCode, setErrorMessage, setShowErrorModal, title]);

  return (
    <div className="modal image-viewer">
      <div className="modal-content">
        <div className="modal-title">
          <h4>{title}</h4>
          <div className="buttons-group">
            <FaDownload onClick={onImageDownload} className='icon' />
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