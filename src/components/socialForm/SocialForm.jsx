import React, { useMemo, useState, useContext, useEffect, useCallback } from 'react';
import { mapCodesErrorToMessage } from '../../utility/logic';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { ServerErrorsContext, AuthContext } from '../../context';
import loader from '../../img/loader.png'
import FormInput from '../formInput/FormInput';


const SocialForm = () => {
  const [initialValue, setInitialValue] = useState({});
  const [isEdit, setIsEdit] = useState({});
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const {
    setShowErrorModal,
    setErrorCode,
    setErrorMessage
  } = useContext(ServerErrorsContext);

  const isButtonFormEnabled = useMemo(() => Object.values(isEdit).includes(true), [isEdit])

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    const [linkedIn, gitHub] = event.target;
    setLoading(true)
    try {
      await updateDoc(doc(db, "users", currentUser.uid), {
        userSocial: {
          linkedIn: linkedIn.value,
          gitHub: gitHub.value,
        }
      })
      setLoading(false);
      setSaved(true);
    } catch (error) {
      setShowErrorModal(true);
      setErrorCode(error.code);
      setErrorMessage(mapCodesErrorToMessage(error.code));
      setLoading(false);
    }
  }, [currentUser, setErrorCode, setErrorMessage, setShowErrorModal])

  useEffect(() => {
    setInitialValue({
      linkedIn: currentUser.userSocial?.linkedIn || "",
      gitHub: currentUser.userSocial?.gitHub || "",
    })
  }, [currentUser])

  useEffect(() => {
    if (saved) {
      setTimeout(() => setSaved(false), 2000)
    }
  }, [saved])

  return (
    <form className="social-form" onSubmit={handleSubmit}>
      <FormInput
        type="text"
        placeholder="LinkedIn"
        name="linkedIn"
        initialValue={initialValue.linkedIn}
        setIsEdit={setIsEdit}
        size="small"
      />
      <FormInput
        type="text"
        placeholder="GitHub"
        name="gitHub"
        initialValue={initialValue.gitHub}
        setIsEdit={setIsEdit}
        size="small"
      />
      {loading && <img src={loader} alt="spinner" className="loader" />}
      {(!loading && saved) && <div className="saved">Modifiche salvate!</div>}
      {(!loading && !saved) && <button disabled={!isButtonFormEnabled}>Salva</button>}
    </form>
  )
}

export default SocialForm;