import React, {
  useCallback, useContext, useMemo, useEffect, useState
} from 'react'
import { getUserList, mapCodesErrorToMessage } from '../../utility/logic';
import { useWindowWidth } from '../../utility/hook';
import { FaUser } from 'react-icons/fa';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import Chats from '../chats/Chats';

import {
  AuthContext,
  ModalContext,
  ServerErrorsContext,
  ActiveChatContext,
  SearchContactContext
} from '../../context';

const ContactList = () => {
  const [userInput, setUserInput] = useState("");
  const windowWidth = useWindowWidth();
  const { currentUser } = useContext(AuthContext);
  const { isModalOpen } = useContext(ModalContext);
  const { setShowChatList, dispatch } = useContext(ActiveChatContext);
  const {
    userList,
    setUserList,
    userListFiltered,
    setUserListFiltered,
  } = useContext(SearchContactContext);

  const {
    setShowErrorModal,
    setErrorCode,
    setErrorMessage
  } = useContext(ServerErrorsContext);

  const contactList = useMemo(() => [
    "contact-list-wrapper",
    isModalOpen ? "open" : "",
  ].filter((x) => !!x).join(" "), [isModalOpen]);

  const onSelectContact = useCallback(async (selectedUser) => {
    //mostra/nasconde elenco contatti in visualizzazione smartphone
    if (windowWidth <= 576) {
      setShowChatList((prev) => !prev);
    }

    /* verifica se esiste il documento chat dentro la collezione 
    chats tra l'utente loggato e l'utente selezionato. 
    Se non esiste lo crea.
    Il combinedId deve essere sempre lo stesso, a prescindere
    di chi sia il currentUser e il selectedUser, è per questo
    che faccio il confronto */
    const combinedId = currentUser.uid > selectedUser.uid
      ? `${currentUser.uid}${selectedUser.uid}`
      : `${selectedUser.uid}${currentUser.uid}`

    try {
      // recupera la chat (se esiste) tra il currentUser e il selectedUser
      const existingChats = await getDoc(doc(db, "chats", combinedId));

      if (!existingChats.exists()) {
        // crea una nuova chat nella chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [`chats.${combinedId}.userInfo`]: {
            uid: selectedUser.uid,
            displayName: selectedUser.displayName,
            photoURL: selectedUser.photoURL,
            userSocial: selectedUser.userSocial,
          },
          [`chats.${combinedId}.date`]: serverTimestamp()
        });

        await updateDoc(doc(db, "userChats", selectedUser.uid), {
          [`chats.${combinedId}.userInfo`]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [`chats.${combinedId}.date`]: serverTimestamp()
        });
        dispatch({ type: "CHANGE_USER", payload: selectedUser });
        setUserListFiltered([]);
        setUserInput("");
      } else {
        dispatch({ type: "CHANGE_USER", payload: selectedUser });
        setUserListFiltered([]);
        setUserInput("");
      }
    } catch (error) {
      console.error(error)
      setErrorCode(error.code);
      setErrorMessage(mapCodesErrorToMessage(error.code));
      setShowErrorModal(true);
    }
  }, [
    currentUser, setErrorCode, setErrorMessage, setShowChatList,
    setShowErrorModal, windowWidth, dispatch, setUserListFiltered
  ])

  const loadUserList = useCallback(async () => {
    try {
      const fetchedUsers = await getUserList();
      setUserList(fetchedUsers.filter((x) => x.displayName !== currentUser.displayName));
    } catch (error) {
      setErrorCode(error.code);
      setErrorMessage(mapCodesErrorToMessage(error.code));
      setShowErrorModal(true);
    }
  }, [currentUser.displayName, setErrorCode, setErrorMessage, setShowErrorModal, setUserList])

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
    loadUserList();
  }, [loadUserList])

  return (
    <div className={contactList}>
      <div className="search">
        <input
          type="text"
          placeholder="Cerca un utente"
          onChange={onChangeUsername}
          value={userInput}
        />
      </div>
      <div className="contact-list">
        {userListFiltered.map((item, index) => (
          <div key={index} className="contact" onClick={() => onSelectContact(item)}>
            {item.photoURL ? (
              <img src={item.photoURL} alt="foto utente" />
            ) : (
              <FaUser className='user-icon' />
            )}
            <div className="contact-info">
              <span>{item.displayName}</span>
            </div>
          </div>
        ))}
      </div>
      <Chats />
    </div>
  )
}

export default ContactList;