import React from 'react';
import { useState } from 'react';
import "firebase/auth";
import { getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, setPersistence, browserSessionPersistence } from "firebase/auth";


import Crud from './Crud.jsx';

export default function Auth(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [logStatus, setLogStatus] = useState(null);
  const auth = getAuth();

  // Establecer la persistencia de sesión local
  setPersistence(auth, browserSessionPersistence);

  const create = () => {
    createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log(user.email);
        setLogStatus(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };

  const signingOut = () => {
    signOut(auth).then(() => {
      setLogStatus(null); // Establece logStatus a null para indicar que no hay usuario autenticado
    }).catch((error) => {
      // Un error ocurrió
    });
  };

  return (
    <div className='container mx-auto m-5 p-5'  style={{'height':'50%'}}>
      {!logStatus && (
        <div className=''>
          
            <div className="mb-3">
              <label htmlFor="email">Correo electronico</label>
              <input className='form-control' type="email" id='email' onChange={(e) => setEmail(e.target.value)} />

            </div>
            <div className="mb-3">
              <label htmlFor="password">Contraseña</label>
              <input className='form-control' type="password" id='password' onChange={(e) => setPassword(e.target.value)} />
            </div>
          
            <button className='btn btn-success' onClick={signIn}>Iniciar Sesión</button>
           {/*  <button className='btn btn-primary' onClick={create}>Crear cuenta</button> */}
          
{/* 
          <label htmlFor="email">Correo electronico</label>
          <input type="email" id='email' onChange={(e) => setEmail(e.target.value)} />
          <label htmlFor="password">Contraseña</label>
          <input type="password" id='password' onChange={(e) => setPassword(e.target.value)} />
          <button className='btn btn-primary' onClick={create}>Crear cuenta</button>
          <button className='btn btn-success' onClick={signIn}>Iniciar Sesión</button> */}
        </div>
      )}
      {logStatus && (
        <div>
          <button className='btn btn-secondary' onClick={signingOut}>Cerrar Sesión</button>
          <Crud />
        </div>
      )}
    </div>
  );
}
