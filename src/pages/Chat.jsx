import React, { useState, useEffect, useContext } from 'react'
import MobileNavbar from '../components/mobileNavbar';
import Sidebar from '../components/sidebar';
import ActiveChat from '../components/activeChat';
import ModalError from '../components/modalError/ModalError';
import { ModalMobileContextProvider } from '../context/ModalMobileContext';
import { ModalContextProvider } from '../context/ModalContext';
import { ServerErrorsContext } from '../context';

const Chat = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const {
    showErrorModal,
    setShowErrorModal,
    errorCode,
    setErrorCode,
    errorMessage,
    setErrorMessage
  } = useContext(ServerErrorsContext);

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    setErrorCode('');
    setErrorMessage('');
  };

  useEffect(() => {

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <ModalMobileContextProvider>
      <ModalContextProvider>
        <div className="chat-wrapper">
          <div className="container">
            <Sidebar />
            {(windowWidth <= 768 && windowWidth >= 481) && (
              <MobileNavbar />
            )}
            < ActiveChat />
            {/*modale errori server*/}
            {showErrorModal && (
              <ModalError
                errorCode={errorCode}
                errorMessage={errorMessage}
                onClose={handleCloseErrorModal}
              />
            )}
          </div>
        </div>
      </ModalContextProvider>
    </ModalMobileContextProvider>
  )
}

export default Chat;
