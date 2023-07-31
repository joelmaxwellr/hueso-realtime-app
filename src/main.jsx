import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.min.js"
import App from './App.jsx'
/* import './index.css' */
import firebase from "./firebase-config.jsx"

import { useState, useEffect } from 'react';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>

    <Suspense fallback={"Cargando..."}>
      <App />
    </Suspense>

  </React.StrictMode>,
)
