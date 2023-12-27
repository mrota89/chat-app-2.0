import React, { useState, useMemo, useContext, useCallback, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { FaLinkedin, FaGithub, FaArrowLeft, FaUser } from 'react-icons/fa';
import { ModalMobileContext, ActiveChatContext } from '../../context';
import { db } from '../../firebase';
import Messages from '../messages';
import Input from '../input';

const ActiveChat = () => {
  const [userSocial, setUserSocial] = useState(undefined);

  const { isMobileModalOpen } = useContext(ModalMobileContext);
  const { showChatList, setShowChatList, data } = useContext(ActiveChatContext);

  const onClickBackToChatList = useCallback(() => {
    setShowChatList((prev) => !prev)
  }, [setShowChatList])

  const onClickSocialButton = useCallback((social) => {
    if (social === "gitHub") {
      window.open(`https://github.com/${userSocial.gitHub}`, "_blank");
    } else {
      window.open(`https://www.linkedin.com/in/${userSocial.linkedIn}`, "_blank");
    }
  }, [userSocial])

  const chat = useMemo(() => [
    "active-chat",
    isMobileModalOpen ? "slide" : "",
    !showChatList ? "show" : "",
  ].filter((x) => !!x).join(" "),
    [isMobileModalOpen, showChatList]
  );

  useEffect(() => {
    if (data?.user.uid) {
      const unsub = onSnapshot(doc(db, "users", data.user.uid), (doc) => {
        doc.exists() && setUserSocial(doc.data().userSocial)
      });

      return () => {
        unsub();
      }
    }
  }, [data.user.uid]);

  return (
    <div className={chat}>
      {!data.chatId ? (
        <div className='no-conversation-selected'>
          Seleziona una chat per iniziare una conversazione
        </div>
      ) : (
        <>
          <div className='chat-info'>
            <div className='user-info'>
              <FaArrowLeft className='icon back-to-contacts' onClick={onClickBackToChatList} />
              {data.user?.photoURL ? (
                <img src={data.user.photoURL} alt="profile" />
              ) : (
                <FaUser className='user-icon' />
              )}
              <span>{data.user?.displayName}</span>
            </div>
            {userSocial && (
              <div className="chat-icons">
                {userSocial.linkedIn && (
                  <FaLinkedin
                    onClick={() => onClickSocialButton("linkedIn")}
                    className='icon'
                  />
                )}
                {userSocial.gitHub && (
                  <FaGithub
                    onClick={() => onClickSocialButton("gitHub")}
                    className='icon'
                  />
                )}
              </div>
            )}
          </div>
          <Messages />
          <Input />
        </>
      )}
    </div>
  );
}

export default ActiveChat;