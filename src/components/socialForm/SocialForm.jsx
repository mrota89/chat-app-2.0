import React, { useMemo, useState, useContext, useEffect, useCallback } from 'react';
import { mapCodesErrorToMessage, getUserList } from '../../utility/logic';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { ServerErrorsContext, AuthContext } from '../../context';
import loader from '../../img/loader.png'
import FormInput from '../formInput/FormInput';


const SocialForm = () => {
  const [initialValue, setInitialValue] = useState({});
  const [isEdit, setIsEdit] = useState({});
  const [isButtonFormEnabled, setIsButtonFormEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const {
    setShowErrorModal,
    setErrorCode,
    setErrorMessage
  } = useContext(ServerErrorsContext);

  const isFormFieldEdited = useMemo(() => Object.values(isEdit).includes(true), [isEdit])

  const loadSocialCurrentUser = useCallback(async () => {
    try {
      const userList = await getUserList();
      const currentUserData = userList.find((x) => x.uid === currentUser.uid);
      setInitialValue(currentUserData?.userSocial);
    } catch (error) {
      console.error(error);
      setErrorCode(error.code);
      setErrorMessage(mapCodesErrorToMessage(error.code));
      setShowErrorModal(true);
    }
  }, [currentUser.uid, setErrorCode, setErrorMessage, setShowErrorModal])

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
      loadSocialCurrentUser();
      setLoading(false);
      setIsButtonFormEnabled(false);
      setIsEdit({});
      setSaved(true);
    } catch (error) {
      console.error(error);
      setShowErrorModal(true);
      setErrorCode(error.code);
      setErrorMessage(mapCodesErrorToMessage(error.code));
      setLoading(false);
    }
  }, [currentUser.uid, loadSocialCurrentUser, setErrorCode, setErrorMessage, setShowErrorModal])

  useEffect(() => {
    loadSocialCurrentUser()
  }, [loadSocialCurrentUser])

  useEffect(() => {
    if (saved) {
      setTimeout(() => setSaved(false), 2500)
    }
  }, [saved])

  useEffect(() => {
    setIsButtonFormEnabled(isFormFieldEdited)
  }, [isFormFieldEdited])

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
      {(!loading && saved) && <div className="saved">Modifiche salvate</div>}
      {(!loading && !saved) && <button disabled={!isButtonFormEnabled}>Salva</button>}
    </form>
  )
}

export default SocialForm;