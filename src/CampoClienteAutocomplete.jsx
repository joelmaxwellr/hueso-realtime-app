import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import {Stack}from '@mui/material';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import DataOrdenesContext from './DataOrdenesContext';
import { useContext } from 'react';


function CampoClienteAutocomplete({ filteredData, /* nombreCliente, setNombreCliente */ }) {
    const {nombreCliente, setNombreCliente} = useContext(DataOrdenesContext)
    const uniqueOptions = filteredData.filter(
        (option, index, self) =>
          index ===
          self.findIndex((o) => o.nombreCliente === option.nombreCliente)
    );
    
    const sortedOptions = uniqueOptions.sort((a, b) => a.nombreCliente.localeCompare(b.nombreCliente));
    
    return (
        <Autocomplete
            id="autocomplete"
            options={sortedOptions}
            getOptionLabel={(option) => option.nombreCliente}
          /*   value={nombreCliente} // Asegúrate de que nombreCliente sea una cadena de texto
            onChange={(event, newValue) => {
                setNombreCliente(newValue); // Actualiza el estado con la nueva selección
            }} */
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Cliente"
                    size="small"
                    style={{ width: 300 }}
                   

                />
            )}
        />
    );
}


export default CampoClienteAutocomplete