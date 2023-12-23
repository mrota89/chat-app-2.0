import React, { useMemo, useContext, useCallback } from 'react';
import { FaLinkedin, FaGithub, FaArrowLeft, FaUser } from 'react-icons/fa';
import { ModalMobileContext, ActiveChatContext } from '../../context';
import Messages from '../messages';
import Input from '../input';

const ActiveChat = () => {

  const { isMobileModalOpen } = useContext(ModalMobileContext);
  const { showChatList, setShowChatList, data } = useContext(ActiveChatContext);

  const onClickBackToChatList = useCallback(() => {
    setShowChatList((prev) => !prev)
  }, [setShowChatList])

  const chat = useMemo(() => [
    "active-chat",
    isMobileModalOpen ? "slide" : "",
    !showChatList ? "show" : "",
  ].filter((x) => !!x).join(" "),
    [isMobileModalOpen, showChatList]
  );

  return (
    <div className={chat}>
      {!data.chatId ?
        (
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
              <div className="chat-icons">
                <FaLinkedin className='icon' />
                <FaGithub className='icon' />
              </div>
            </div>
            <Messages />
            <Input />
          </>
        )}
    </div>
  )
}

export default ActiveChat;