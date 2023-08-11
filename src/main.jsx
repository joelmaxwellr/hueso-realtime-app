import React, { Suspense,  } from 'react'
import ReactDOM from 'react-dom/client'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.min.js"
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "/crud",
    element: <Crud />,
  },
  {
    path: "/hola",
    element: <Hola />,
  },
]);

import App from './App.jsx'
/* import './index.css' */
import firebase from "./firebase-config.jsx"

import { useState, useEffect } from 'react';
import Root from './Root.jsx';
import Crud from './Crud.jsx';
import Hola from './Hola.jsx';



/* const [nombreCliente, setNombreCliente] = useState('') */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    

    <Suspense fallback={"Cargando..."}>
      <RouterProvider router={router} />
    </Suspense>
    

  </React.StrictMode>,
)
