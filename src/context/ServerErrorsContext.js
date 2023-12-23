import { createContext, useState } from 'react';

export const ServerErrorsContext = createContext();

export const ServerErrorContextProvider = ({ children }) => {
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorCode, setErrorCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');


  return (
    <ServerErrorsContext.Provider value={{
      showErrorModal,
      setShowErrorModal,
      errorCode,
      setErrorCode,
      errorMessage,
      setErrorMessage
    }}>
      {children}
    </ServerErrorsContext.Provider>
  )
}