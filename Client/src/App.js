import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import classes from './components/UI/Navigation.module.css';
import Navigation from './components/UI/Navigation';
import Layout from './components/UI/Layout'

import AuthPage from './components/Pages/AuthPage'
import AuthContext from './components/Auth/AuthContext';
import EnterPage from './components/Pages/EnterPage';
import HomePage from './components/Pages/HomePage';

const App = () => {
  const authCtx = useContext(AuthContext);
  return (
    <Layout>
      <Routes>
        <Route path='*' element={<Navigate to='/' />} />
        {!authCtx.isLoggedIn && (
          <Route path='/auth' element={<AuthPage/>} />
        )}
        {authCtx.isLoggedIn && (
          <Route path='/enter' element={<EnterPage/>} />
        )};
        {authCtx.isLoggedIn && (
          <Route path='/enter/:ID' element={<EnterPage/>} />
        )};
        {authCtx.isLoggedIn && (
          <Route path='/' element={<HomePage/>} />
        )};
        {!authCtx.isLoggedIn && (
          <Route path='/' element={<Navigate to='/auth' />} />
        )};
      </Routes>
    </Layout>
  );
}

export default App;
