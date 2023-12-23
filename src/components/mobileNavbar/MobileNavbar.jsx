import React, { useCallback, useContext, useState, useEffect } from 'react';
import UserProfile from '../userProfile';
import SocialForm from '../socialForm';
import { SearchContactContext, ActiveChatContext } from '../../context';

const MobileNavbar = () => {
  const [userInput, setUserInput] = useState("");

  const {
    userList,
    setUserListFiltered,
  } = useContext(SearchContactContext);

  const { data } = useContext(ActiveChatContext);

  const onChangeUsername = useCallback((event) => {
    if (event.target.value) {
      setUserInput(event.target.value);
      const filteredUser = userList.filter(x => (
        x.displayName.toLowerCase().includes(event.target.value.toLowerCase())
      ));

      setUserListFiltered(filteredUser);
    } else {
      setUserInput("");
      setUserListFiltered([]);
    }
  }, [setUserListFiltered, userList])

  useEffect(() => {
    setUserInput("");
  }, [data.chatId, setUserListFiltered])

  return (
    <div className="mobile-navbar">
      <div className="user-wrapper">
        <UserProfile />
        <SocialForm />
      </div>
      <div className="search">
        <input
          type="text"
          placeholder="Cerca un utente"
          onChange={onChangeUsername}
          value={userInput}
        />
      </div>
    </div>
  )
}

export default MobileNavbar;