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

  const onClickSocialButton = useCallback((social) => {
    if (social === "gitHub") {
      window.open(`https://github.com/${data.user.userSocial.gitHub}`, "_blank");
    } else {
      window.open(`https://www.linkedin.com/in/${data.user.userSocial.linkedIn}`, "_blank");
    }
  }, [data])

  const chat = useMemo(() => [
    "active-chat",
    isMobileModalOpen ? "slide" : "",
    !showChatList ? "show" : "",
  ].filter((x) => !!x).join(" "),
    [isMobileModalOpen, showChatList]
  );

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
            {data.user?.userSocial && (
              <div className="chat-icons">
                {data.user.userSocial.linkedIn && (
                  <FaLinkedin
                    onClick={() => onClickSocialButton("linkedIn")}
                    className='icon'
                  />
                )}
                {data.user.userSocial.gitHub && (
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