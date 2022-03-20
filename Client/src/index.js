import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { AuthContextProvider } from './components/Auth/AuthContext';

import './index.css';
import App from './App';
import { DateContextProvider } from './components/Home/DateContextProvider';

ReactDOM.render(
<DateContextProvider>
    <AuthContextProvider>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </AuthContextProvider>
</DateContextProvider>
, document.getElementById('root'));
