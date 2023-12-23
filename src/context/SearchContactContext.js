import { createContext, useState } from "react";

export const SearchContactContext = createContext();

export const SearchContactContextProvider = ({ children }) => {
  const [userList, setUserList] = useState([])
  const [userListFiltered, setUserListFiltered] = useState([])

  return (
    <SearchContactContext.Provider value={{
      userList,
      setUserList,
      userListFiltered,
      setUserListFiltered,
    }}>
      {children}
    </SearchContactContext.Provider>
  )
}
