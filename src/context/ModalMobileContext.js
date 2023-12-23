import { createContext, useState } from "react";

export const ModalMobileContext = createContext();

export const ModalMobileContextProvider = ({ children }) => {
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);

  return (
    <ModalMobileContext.Provider value={{ isMobileModalOpen, setIsMobileModalOpen }}>
      {children}
    </ModalMobileContext.Provider>
  )
}
