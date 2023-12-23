import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouting from './AppRouting';
import { AuthContextProvider } from './context/AuthContext';
import { ActiveChatContextProvider } from './context/ActiveChatContext';
import { SearchContactContextProvider } from './context/SearchContactContext';
import { ServerErrorContextProvider } from './context/ServerErrorsContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthContextProvider>
    <ServerErrorContextProvider>
      <ActiveChatContextProvider>
        <SearchContactContextProvider>
          <React.StrictMode>
            <AppRouting />
          </React.StrictMode>
        </SearchContactContextProvider>
      </ActiveChatContextProvider>
    </ServerErrorContextProvider>
  </AuthContextProvider >
);
