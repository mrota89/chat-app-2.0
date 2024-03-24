/* eslint-disable no-useless-escape */
import React, { useMemo, useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { FaQuestion } from 'react-icons/fa';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { auth, storage, db } from '../firebase';
import { getUserList, mapCodesErrorToMessage } from '../utility/logic.js';
import { ServerErrorsContext } from '../context';

import ModalError from '../common/modalError/ModalError';
import Loader from '../common/loader';
import FormInput from '../common/formInput';
import UploadImageInput from '../components/uploadImageInput';

const ERROR_EMAIL = 'Formato email non corretto';
const ERROR_PASSWORD = 'Formato password non corretto';
const FORM_FIELD_NUMBER = 3;

const Register = () => {
  const [formError, setFormError] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    showErrorModal,
    setShowErrorModal,
    errorCode,
    setErrorCode,
    errorMessage,
    setErrorMessage
  } = useContext(ServerErrorsContext);

  const isButtonFormEnabled = useMemo(() => {
    const errorFormValues = Object.values(formError);
    return errorFormValues.every(x => !x) && errorFormValues.length === FORM_FIELD_NUMBER
  }, [formError])

  const handleFileUpload = async (displayName, email, file, response) => {

    // Crea un riferimento a Firebase Storage utilizzando il displayName come percorso
    const storageRef = ref(storage, displayName.value);

    // Carica il file selezionato dall'utente in Firebase Storage
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Registra i gestori di eventi per lo stato dell'operazione di caricamento del file
    uploadTask.on(
      'state_changed',
      null, // Non viene eseguita alcuna azione durante il caricamento del file
      (error) => {
        setErrorCode(error.code);
        setErrorMessage(mapCodesErrorToMessage(error.code));
        setShowErrorModal(true);
      },
      async () => {
        // Ottieni l'URL di download del file appena caricato
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

        // Aggiorna il profilo dell'utente con il displayName e il downloadURL
        await updateProfile(response.user, {
          displayName: displayName.value,
          photoURL: downloadURL,
        });

        // Crea un oggetto userData con i dati dell'utente
        const userData = {
          uid: response.user.uid,
          displayName: displayName.value,
          email: email.value,
          photoURL: downloadURL,
          userSocial: {
            linkedIn: "",
            gitHub: "",
          }
        };

        // Esegui in parallelo la scrittura dei dati dell'utente nel database
        await Promise.all([
          setDoc(doc(db, 'users', response.user.uid), userData),
          setDoc(doc(db, 'userChats', response.user.uid), {}),
        ]);

        navigate('/');
      }
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const [displayName, email, password, file] = event.target;
    const fileImage = file.files[0];

    try {
      setLoading(true);
      const userList = await getUserList();
      const userNameList = userList.map(user => user.displayName);

      //controlla che lo username inserito non sia già in uso
      if (userNameList.includes(displayName.value)) {
        setErrorCode('auth/username-already-in-use');
        setErrorMessage(mapCodesErrorToMessage('auth/username-already-in-use'));
        setShowErrorModal(true);
        setLoading(false);
      } else {
        // Registra un nuovo utente utilizzando l'email e la password fornite
        const response = await createUserWithEmailAndPassword(
          auth,
          email.value,
          password.value
        );

        if (file.files.length > 0 && fileImage.size > 0) {
          await handleFileUpload(displayName, email, fileImage, response);
        } else {
          await updateProfile(response.user, {
            displayName: displayName.value,
            photoURL: "",
          });

          const userData = {
            uid: response.user.uid,
            displayName: displayName.value,
            email: email.value,
            photoURL: "",
            userSocial: {
              linkedIn: "",
              gitHub: "",
            }
          };

          await Promise.all([
            setDoc(doc(db, 'users', response.user.uid), userData),
            setDoc(doc(db, 'userChats', response.user.uid), {}),
          ]);

          navigate('/');
        }
      }
    } catch (error) {
      setLoading(false);
      setErrorCode(error.code);
      setErrorMessage(mapCodesErrorToMessage(error.code));
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    setErrorCode('');
    setErrorMessage('');
  };

  return (
    <>
      <div className='form-container'>
        <div className='form-wrapper'>
          <div className='form-tooltip-icon'>
            <FaQuestion />
          </div>
          <span className='logo'>Bit Chat</span>
          <span className='title'>Crea account</span>
          <form onSubmit={handleSubmit}>
            <FormInput
              placeholder='username *'
              name='username'
              type='text'
              pattern="^[^\s]+$"
              setFormError={setFormError}
              isRequired
            />

            <FormInput
              placeholder='email *'
              name='email'
              type='email'
              inputMode='email'
              pattern="^[a-z0-9.]+@[a-z]+.[a-z]{2,3}$"
              messageError={ERROR_EMAIL}
              setFormError={setFormError}
              isRequired
            />

            <FormInput
              placeholder='password *'
              name='password'
              type='password'
              pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!£$%&=?^])\S{8,}$"
              messageError={ERROR_PASSWORD}
              setFormError={setFormError}
              isRequired
            />
            <div className='input-wrapper'>
              <UploadImageInput />
            </div>
            <button disabled={!isButtonFormEnabled}>
              Registrati
            </button>
          </form>
          <p>
            Hai un account?
            <Link to="/login">Login</Link>
          </p>

          {/*tooltip password */}
          <span className='form-tooltip'>
            La password deve contenere:
            <ul>
              <li>minimo otto caratteri</li>
              <li>almeno una lettera maiuscola</li>
              <li>almeno una lettera minuscola</li>
              <li>almeno un numero </li>
              <li>almeno uno di questi caratteri: !£$%&=?^</li>
            </ul>
          </span>
        </div>
      </div>

      {/* modale errori server */}
      {showErrorModal && (
        <ModalError
          errorCode={errorCode}
          errorMessage={errorMessage}
          onClose={handleCloseErrorModal}
        />
      )}

      {loading && (
        <Loader />
      )}
    </>
  )

}
export default Register;