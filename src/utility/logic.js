import { getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase';

//mapping messaggi di errore firebase
export function mapCodesErrorToMessage(errorCode) {
  switch (errorCode) {
    case "auth/invalid-password":
      return "La password inserita non è valida.";

    case "auth/invalid-email":
      return "L'email fornita non è valida.";

    case "auth/email-already-exists":
      return "L'e-mail fornita è già utilizzata da un utente esistente.";

    case "auth/email-already-in-use":
      return "L'e-mail fornita è già utilizzata da un utente esistente.";

    case "auth/username-already-in-use":
      return "Lo username fornito è già utilizzato da un utente esistente.";

    case "auth/id-token-expired":
      return "Il token ID Firebase fornito è scaduto.";

    case "auth/id-token-revoked":
      return "Il token ID Firebase è stato revocato.";

    case "auth/internal-error":
      return "Errore server di autenticazione.";

    case "auth/user-not-found":
      return "Non è stato trovato alcun account utente corrispondente all'indirizzo email specificato.";

    case "auth/wrong-password":
      return "La password fornita per l'account utente non è corretta.";

    case "auth/weak-password":
      return "La password fornita non è sufficientemente sicura. Assicurati che la password abbia almeno 6 caratteri.";

    case "auth/popup-blocked":
      return "Il popup di accesso è stato bloccato dal browser. Assicurati di consentire i popup nel tuo browser.";

    default:
      return "Qualcosa è andato storto :(";
  }
};

//getElenco displayName raccolta users
export const getUserList = async () => {
  try {
    const collectionRef = collection(db, 'users');
    const querySnapshot = await getDocs(collectionRef);
    return querySnapshot.docs.map((doc) => doc.data());
  } catch (error) {
    throw error;
  }
};