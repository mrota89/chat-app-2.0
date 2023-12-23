import React, { useContext, useEffect, useMemo, useRef, useCallback } from 'react';
import { AuthContext } from '../../context';
import { ActiveChatContext } from '../../context';
import { FaUser } from 'react-icons/fa';

const Message = ({ dataMsg }) => {

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ActiveChatContext);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" })
  }, [dataMsg])

  const userImg = useMemo(() => (
    dataMsg?.senderId === currentUser.uid
      ? currentUser.photoURL
      : data.user.photoURL
  ), [currentUser.photoURL, currentUser.uid, data.user.photoURL, dataMsg])

  const message = useMemo(() => [
    'message',
    dataMsg?.senderId === currentUser.uid ? 'owner' : null,
  ].join(' '), [currentUser.uid, dataMsg?.senderId])

  const messageTextRows = useCallback((string) => {
    if (string.includes('\\n')) {
      return string.split('\\n');
    }
    return [string];
  }, [])

  return (
    <div className={message} ref={ref}>
      {(dataMsg?.image || dataMsg?.text) && (
        <div className="message-info">
          {userImg ? (
            <img src={userImg} alt="profile" />
          ) : (
            <FaUser className='user-icon' />
          )}
        </div>
      )}
      <div className="message-content">
        {dataMsg?.image && (
          <img src={dataMsg.image} alt="sended" />
        )}
        {dataMsg?.text
          && messageTextRows(dataMsg.text).length > 0
          && messageTextRows(dataMsg.text).map((line, index) => (
            <p key={index}>
              {line}
              <br />
            </p>
          ))}
      </div>
    </div>
  );

}

export default Message;