import React, { useEffect, useState, useCallback, useContext } from 'react';
import { db } from '../../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { useWindowWidth } from '../../utility/hook';
import { AuthContext, ActiveChatContext } from '../../context';
import { FaUser } from 'react-icons/fa';

const Chats = () => {
  const [chats, setChats] = useState([]);

  const windowWidth = useWindowWidth();

  const { currentUser } = useContext(AuthContext);
  const { setShowChatList, dispatch } = useContext(ActiveChatContext);

  const onSelectChat = useCallback((selectedChat) => {
    if (windowWidth <= 576) {
      setShowChatList((prev) => !prev);
    }

    dispatch({ type: "CHANGE_USER", payload: selectedChat })
  }, [dispatch, setShowChatList, windowWidth])

  useEffect(() => {
    if (!currentUser.uid) return;
    const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
      const data = Object.entries(doc.data());
      setChats((data && data[0]) ? data[0][1] : []);
    });

    return () => {
      unsub();
    }
  }, [currentUser.uid]);

  return (
    <div className="chats">
      {Object.entries(chats).sort((a, b) => b.date - a.date).map(chat => {
        const [chatId, chatContent] = chat;
        const userInfo = chatContent?.userInfo || {};
        const lastMessage = chatContent?.lastMessage?.text || "";

        return (
          <div className="chat" key={chatId} onClick={() => onSelectChat(userInfo)}>
            {userInfo.photoURL ? (
              <img src={userInfo.photoURL} alt="profile" />
            ) : (
              <FaUser className='user-icon' />
            )}
            <div className="chat-info">
              <span>{userInfo?.displayName}</span>
              <p>{lastMessage}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Chats;