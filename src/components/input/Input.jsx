import React, { useCallback, useContext, useState, useRef, useMemo, useEffect } from 'react'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, arrayUnion, updateDoc, Timestamp, serverTimestamp } from 'firebase/firestore';
import { FaPaperclip, FaCheckCircle } from 'react-icons/fa';
import { v4 as uuid } from 'uuid';
import { db, storage } from '../../firebase';
import loader from '../../img/loader.png'
import { mapCodesErrorToMessage } from '../../utility/logic';
import { AuthContext, ActiveChatContext, ServerErrorsContext } from '../../context';


const Input = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState(1);

  const inputImageRef = useRef(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ActiveChatContext);
  const {
    setShowErrorModal,
    setErrorCode,
    setErrorMessage
  } = useContext(ServerErrorsContext);

  const isSendButtonDisabled = useMemo(() => (
    (text.length === 0 && !image) || loading
  ), [image, loading, text.length])

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
    setRows(1);
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

  const handleTextChange = useCallback((event) => {
    setText(event.target.value);
    const charNumber = event.target.value.length;
    setRows(charNumber > 24 ? 3 : 1);
  }, []);

  useEffect(() => {
    if (image) {
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
      }, 2500)
    }
  }, [image])

  return (
    <div className='input-message'>
      {image && (
        <div className='image-file-name' style={{ bottom: rows > 1 ? '86px' : '50px' }}>
          {loading ? (
            <img src={loader} alt="spinner" className="loader" />
          ) : (
            <FaCheckCircle className='icon' />
          )}
          {image.name}
          {!loading && (
            <div className="delete-image-button" onClick={onDeleteAttachedImage}>
              <div className='close' />
              <div className='close' />
            </div>
          )}
        </div>
      )}
      <textarea
        onChange={handleTextChange}
        value={text}
        rows={rows}
        maxLength={1000}
        placeholder="Messaggio"
        style={{ minHeight: rows > 1 ? '50px' : 'unset' }}
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