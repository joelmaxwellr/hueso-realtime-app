import React, { useContext, useEffect, useState } from 'react'
import Select from 'react-select'
import DataOrdenesContext from './DataOrdenesContext';

const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
]
const customStyles = {
    control: provided => ({
      ...provided,
      width: '300px', // Cambia el ancho del campo de entrada según tus necesidades
    })
  };
function Complete({ filteredData, selectedOption, setSelectedOption }) {
    const { nombreCliente, setNombreCliente } = useContext(DataOrdenesContext)
    /* const [selectedOption, setSelectedOption] = useState(null); */
    /*   const nombres = [] */
    

    const uniqueOptions = filteredData.filter(
        (option, index, self) =>
          index ===
          self.findIndex((o) => o.nombreCliente === option.nombreCliente)
    );
    
    const nombres = uniqueOptions.map(data => ({
        label: data.nombreCliente,
        value: data.nombreCliente
    }));

    useEffect(() => {
        
        /* console.log(selectedOption.label) */
    },[selectedOption])

    const handleSelectChange = (selectedOption) => {
        setNombreCliente(selectedOption.label)
        setSelectedOption(selectedOption);
    };
    
    return (
        <div>
            <Select
                value={selectedOption}
                onChange={handleSelectChange}
                options={nombres}
                placeholder="Cliente"
                styles={customStyles}
            />
           {/*  {selectedOption && (
                <div>
                    <h2>Fruta seleccionada:</h2>
                    <p>{selectedOption.label}</p>
                </div>
            )} */}
        </div>
    );
}



export default Complete;