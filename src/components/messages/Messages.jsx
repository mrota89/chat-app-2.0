import React, { useContext, useEffect, useState } from 'react';
import { ActiveChatContext } from '../../context';
import { db } from '../../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import Message from '../message';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ActiveChatContext);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages)
    });

    return () => {
      unsub();
    }
  }, [data.chatId]);

  return (
    <div className='messages'>
      {messages.map(msg => (
        <Message dataMsg={msg} key={msg.id} />
      ))}
    </div>
  )
}

export default Messages