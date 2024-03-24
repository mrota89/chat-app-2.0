/* eslint-disable no-useless-escape */
import React, { useEffect, useContext } from 'react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { mapCodesErrorToMessage } from '../utility/logic.js';
import { ServerErrorsContext } from '../context';

import ModalError from '../common/modalError/ModalError';
import Loader from '../common/loader';
import FormInput from '../common/formInput';

const EMAIL_REGEX = "^[a-z0-9.]+@[a-z]+.[a-z]{2,3}$";
const ERROR_EMAIL = "Formato email non corretto";
const ERROR_PASSWORD = "Campo password obbligatorio";
const FORM_FIELD_NUMBER = 2;

const Login = () => {
  const [isButtonFormEnabled, setIsButtonFormEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState({});
  const navigate = useNavigate();

  const {
    showErrorModal,
    setShowErrorModal,
    errorCode,
    setErrorCode,
    errorMessage,
    setErrorMessage
  } = useContext(ServerErrorsContext);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const [email, password] = event.target;

    try {
      setLoading(true);

      // Effettua il login utilizzando l'email e la password fornite
      await signInWithEmailAndPassword(auth, email.value, password.value);

      setLoading(false);
      // Reindirizza l'utente alla pagina desiderata dopo il login
      navigate('/');
    } catch (error) {
      setLoading(false);
      setShowErrorModal(true);
      setErrorCode(error.code);
      setErrorMessage(mapCodesErrorToMessage(error.code));
    }
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    setErrorCode('');
    setErrorMessage('');
  };

  useEffect(() => {
    const errorFormValues = Object.values(formError);
    if (errorFormValues.every((x) => !x) && errorFormValues.length === FORM_FIELD_NUMBER) {
      setIsButtonFormEnabled(true);
    } else {
      setIsButtonFormEnabled(false);
    }
  }, [formError]);

  return (
    <>
      <div className="form-container">
        <div className="form-wrapper">
          <span className="logo">Bit Chat</span>
          <span className="title">Accedi al tuo account</span>
          <form onSubmit={handleSubmit}>
            <FormInput
              placeholder="email *"
              name="email"
              type="email"
              inputMode="email"
              pattern={EMAIL_REGEX}
              messageError={ERROR_EMAIL}
              setFormError={setFormError}
              isRequired
            />

            <FormInput
              placeholder="password *"
              name="password"
              type="password"
              messageError={ERROR_PASSWORD}
              setFormError={setFormError}
              isRequired
            />
            <button disabled={!isButtonFormEnabled}>Accedi</button>
          </form>
          <p>
            Non hai un account?
            <Link to="/register">Registrati</Link>
          </p>
        </div>
      </div>

      {/*modale errori server*/}
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
  );
};

export default Login;
