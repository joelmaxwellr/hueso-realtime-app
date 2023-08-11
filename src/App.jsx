
import Auth from './Auth'
import React, { useState } from 'react'
import DataOrdenesContext from './DataOrdenesContext'

function App() {
  const [nombreCliente, setNombreCliente] = useState('') 

  return (
    <>
      <DataOrdenesContext.Provider value={{ nombreCliente, setNombreCliente }}>

      <Auth />
      </DataOrdenesContext.Provider>
     
    </>
  )
}

export default App
