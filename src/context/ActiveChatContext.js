import { createContext, useState, useContext, useReducer } from "react";
import { AuthContext } from './AuthContext';

const INITIAL_STATE = {
  chatId: null,
  user: {}
};

export const ActiveChatContext = createContext();

export const ActiveChatContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);

  const chatReducer = (state, action) => {
    switch (action.type) {
      case "CHANGE_USER":
        return {
          chatId: currentUser.uid > action.payload.uid
            ? `${currentUser.uid}${action.payload.uid}`
            : `${action.payload.uid}${currentUser.uid}`,
          user: action.payload
        }
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);
  const [showChatList, setShowChatList] = useState(true);

  return (
    <ActiveChatContext.Provider value={{
      showChatList,
      setShowChatList,
      data: state,
      dispatch
    }}>
      {children}
    </ActiveChatContext.Provider>
  )
}