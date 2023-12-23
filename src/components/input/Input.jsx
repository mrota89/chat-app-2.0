import React, { useCallback, useContext, useState, useRef, useMemo } from 'react'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, arrayUnion, updateDoc, Timestamp, serverTimestamp } from 'firebase/firestore';
import { FaPaperclip } from 'react-icons/fa';
import { v4 as uuid } from 'uuid';
import { db, storage } from '../../firebase';
import { mapCodesErrorToMessage } from '../../utility/logic';
import { AuthContext, ActiveChatContext, ServerErrorsContext } from '../../context';


const Input = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);

  const inputImageRef = useRef(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ActiveChatContext);
  const {
    setShowErrorModal,
    setErrorCode,
    setErrorMessage
  } = useContext(ServerErrorsContext);

  const isSendButtonDisabled = useMemo(() => (
    text.length === 0 && !image
  ), [image, text.length])

  const attachedImageCaption = useMemo(() => (
    text ? `${image?.name}\\n${text}` : image?.name
  ), [image, text])

  const chatTextPreview = useMemo(() => {
    if (text && !image) {
      return text;
    }
    if (text && image) {
      return text;
    }
    if (!text && image) {
      return image.name;
    }
  }, [image, text])

  const handleImageChange = useCallback((event) => {
    setImage(
      (
        event.target.files
        && event.target.files[0].type.includes("image")
      ) ? event.target.files[0]
        : null
    );
    if (!image) {
      return;
    }
  }, [image])

  const handleSend = useCallback(async () => {
    if (image) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        'state_changed',
        null,
        (error) => {
          setErrorCode(error.code);
          setErrorMessage(mapCodesErrorToMessage(error.code));
          setShowErrorModal(true);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await updateDoc(doc(db, "chats", data.chatId), {
            messages: arrayUnion({
              id: uuid(),
              text: attachedImageCaption,
              senderId: currentUser.uid,
              date: Timestamp.now(),
              image: downloadURL,
            })
          })
          setImage(null)
        }
      );
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        })
      })
    }

    /*
    aggiorno i dati della chat (presente nella lista chat nella sidebar) 
    con quelli dell'ultimo messaggio, sia per il sender (currentUser), sia 
    per il ricevente.
    */
    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [`chats.${data.chatId}.lastMessage`]: { text: chatTextPreview },
      [`chats.${data.chatId}.date`]: serverTimestamp(),
    })

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [`chats.${data.chatId}.lastMessage`]: { text: chatTextPreview },
      [`chats.${data.chatId}.date`]: serverTimestamp(),
    })

    setText("");
    setImage(null);
    inputImageRef.current.value = null;
  }, [
    currentUser.uid, data.chatId, data.user.uid, image,
    setErrorCode, setErrorMessage, setShowErrorModal, text,
    attachedImageCaption, chatTextPreview
  ])

  const onDeleteAttachedImage = useCallback(() => {
    setImage(null)
    inputImageRef.current.value = null;
  }, [])

  return (
    <div className='input-message'>
      {image && (
        <div className='image-file-name'>
          <div className="delete-image-button" onClick={onDeleteAttachedImage}>
            <div className='close' />
            <div className='close' />
          </div>
          {image.name}
        </div>
      )}
      <input
        type="text"
        placeholder="Messaggio"
        onChange={(event) => setText(event.target.value)}
        value={text}
      />
      <div className="send">
        <input
          ref={inputImageRef}
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={handleImageChange}
          accept="image/*"
        />
        <label htmlFor="file">
          <FaPaperclip className='icon' />
        </label>
        <button
          onClick={handleSend}
          disabled={isSendButtonDisabled}
        >
          Invia
        </button>
      </div>
    </div>
  )
}

export default Input;