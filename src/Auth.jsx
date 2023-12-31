import React from 'react';
import { useState } from 'react';
import "firebase/auth";
import { getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, setPersistence, browserSessionPersistence } from "firebase/auth";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        toast.success("Inicio de Sesión Exitoso", {
          position: toast.POSITION.TOP_CENTER
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error("Contraseña Incorrecta", {
          position: toast.POSITION.TOP_CENTER
        });

      });
  };

  const signingOut = () => {
    signOut(auth).then(() => {
      setLogStatus(null); // Establece logStatus a null para indicar que no hay usuario autenticado
    }).catch((error) => {
      // Un error ocurrió
    });
  };


  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      signIn();
    }
  };

  return (
    <div className='mx-auto  m-5 p-5'  style={{ width: '1500px', maxWidth: '100%', marginTop: '800px' }} >
      <ToastContainer />
      {!logStatus && (
        <div className='container mx-auto  m-5 p-5' style={{ width: '600px', maxWidth: '100%', marginTop: '800px' }}>
          <h1>Inicio de Sesión</h1>
          <div className="mb-3">
            <label htmlFor="email">Correo electrónico</label>
            <input className='form-control' type="email" id='email' onChange={(e) => setEmail(e.target.value)} />

          </div>
          <div className="mb-3">
            <label htmlFor="password">Contraseña</label>
            <input className='form-control' type="password" id='password' onKeyDown={handleKeyDown} onChange={(e) => setPassword(e.target.value)} />
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
          <a ></a>
          <Crud signingOut={signingOut} />
        </div>
      )}
    </div>
  );
}
