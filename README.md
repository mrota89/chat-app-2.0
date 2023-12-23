# Chat React con Firebase

Questo è un progetto in fase di sviluppo per una chat realizzata utilizzando React e le API di Firebase come backend. L'obiettivo principale di questo progetto è acquisire familiarità con React e Firebase attraverso la creazione di un'app di messaggistica semplice.

## Nota Importante

⚠️ **Importante:** Questa repository è stata recentemente ricreata da zero. Tutte le commit precedenti sono state eliminate. Le informazioni riportate di seguito si applicano alla versione attuale del progetto.

## Funzionalità principali

- **Iscrizione e login:** Gli utenti possono registrarsi e accedere all'app utilizzando un'email e una password (implementato)
- **Messaggistica:** Gli utenti possono inviare messaggi ai loro contatti registrati (implementato)
- **Invio di immagini:** È possibile inviare immagini tramite la chat (implementato)
- **Anteprima immagini:** Cliccando su una immagine presente nella chat, si apre un modale contenente l'anteprima della stessa (da implementare)
- **Modifica ed eliminazione dei messaggi inviati:** È possibile modificare ed eliminare i messaggi inviati (da implementare)
- **Contatti social:** Gli utenti possono condividere il proprio account GitHub e LinkedIn (in corso di implementazione)
- **Notifiche:** Ricevi notifiche quando ricevi nuovi messaggi (da implementare)

## Requisiti

Prima di iniziare a lavorare su questo progetto, assicurati di avere installato Node.js e npm (Node Package Manager) sul tuo computer. Puoi scaricarli da [nodejs.org](https://nodejs.org/).

## Installazione

1. Clona questo repository sul tuo computer;
2. Naviga nella directory del progetto;
3. Installa le dipendenze del progetto: npm install;

4. Configura Firebase:

- Crea un nuovo progetto su [Firebase Console](https://console.firebase.google.com/).
- Configura le tue credenziali Firebase in un file `.env` nella radice del progetto. Esempio:

  ```
  REACT_APP_FIREBASE_API_KEY=YOUR_API_KEY
  REACT_APP_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
  REACT_APP_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
  REACT_APP_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
  REACT_APP_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
  REACT_APP_FIREBASE_APP_ID=YOUR_APP_ID
  ```

Assicurati di attivare l'autenticazione con email e password in Firebase Console.

5. Avvia l'app in modalità di sviluppo:npm start


L'app dovrebbe ora essere accessibile all'indirizzo `http://localhost:3000`.

## Contributi

Questo progetto è principalmente destinato all'autoapprendimento. Tuttavia, se desideri contribuire con miglioramenti o correzioni, sentiti libero di aprire una pull request.

---

