
import { useState, useEffect } from 'react';


const PrintButton = ({ objeto, mostrarBoton, separator}) => {

  const [selectedCliente, setSelectedCliente] = useState(null);

  const handleImprimirClick = (objeto) => {
    setSelectedCliente(objeto);
    console.log(selectedCliente)
  };
  useEffect(() => {
    console.log(selectedCliente);
  }, [selectedCliente]);

  const handlePrint = (cliente) => {
    const usuario = `${cliente.usuarioActual}`
    const codigoUsuario = usuario.slice(0,3)
 
     const printContents = `
 <div class="resultados divs">
 
     <img src="LOGOHUESO .png" width="75px" alt="" srcset=""> huesoJeans - ${codigoUsuario}<br>
     <div>
       <p id="dateAndTime">${cliente.hora} - ${cliente.fecha}</p>
       <h5 id="tiempoImpresion"></h5>
       <h5 id="tiempoEntrega"></h5>
     </div>
     <h2 id="cliente" className='text-capitalize'>${cliente.nombreCliente} / ${cliente.material}</h2>
     <h2 id="precio">RD$ ${separator(cliente.precio)}</h2>•
     <h1 id="precioDirecto"></h1>
 
   </div>
   `;

    const printWindow = window.open('', '_blank', 'width=800,height=600');

    printWindow.document.write(`
      <html>
        <head>
          <title>Print</title>
        </head>
        <style>
    * {
      padding: 0;
      margin: 0;
    }

    body {
      font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
      text-transform: capitalize;
    }

    .container {
      display: flex;
      flex-direction: row;
    }

    .divs {
      text-overflow: "";
      padding: 1em;
      margin: auto;
      justify-content: center;

      margin-bottom: 3em;
      width: 400px;
      height: 200px;
      padding: 0;
      /* border: 1px solid red; */
      box-sizing: border-box;


    }

    .resultados {
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      text-align: center;
      align-content: center;
      vertical-align: auto;
      align-items: center;
      padding: 3em;

    }

    .calculo {
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      text-align: center;
      align-content: center;
      vertical-align: auto;
      align-items: center;
      padding: 3em;

    }

    .botones {
      display: flex;
      flex-direction: row;
    }

    input,
    input::placeholder {
      text-align: center;
    }

    input[type=number] {
      font-size: 20px;
      width: 70%;
      padding: 10px 5px;
      margin: 3px 0;
      box-sizing: border-box;
    }

    input[type=text] {
      font-size: 20px;
      width: 70%;
      padding: 10px 5px;
      margin: 3px 0;
      box-sizing: border-box;
    }

    input[type=button] {
      font-size: 20px;
      width: 50%;
      padding: 10px 5px;
      margin: 5px;
      box-sizing: border-box;
    }

    .autocomplete {
      /the container must be positioned relative:/
      position: relative;
      display: inline-block;
    }

    input {
      border: 1px solid transparent;
      background-color: #f1f1f1;
      padding: 10px;
      font-size: 16px;
    }

    input[type=text] {
      background-color: #f1f1f1;
      width: 100%;
    }

    input[type=submit] {
      background-color: DodgerBlue;
      color: #fff;
    }

    .autocomplete-items {
      position: absolute;
      border: 1px solid #d4d4d4;
      border-bottom: none;
      border-top: none;
      z-index: 99;
      /position the autocomplete items to be the same width as the container:/
      top: 100%;
      left: 0;
      right: 0;
    }

    .autocomplete-items div {
      padding: 10px;
      cursor: pointer;
      background-color: #fff;
      border-bottom: 1px solid #d4d4d4;
    }

    .autocomplete-items div:hover {
      /when hovering an item:/
      background-color: #e9e9e9;
    }

    .autocomplete-active {
      /when navigating through the items using the arrow keys:/
      background-color: DodgerBlue !important;
      color: #ffffff;
    }
  </style>
        <body>
          ${printContents}
          <script type="text/javascript">
            window.onload = function() {
              window.print();
            }

            window.onafterprint = function() {
              window.close();
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };



  return (
    <div>
      <button className='btn btn-success' onClick={() => {
        handlePrint(objeto)
        handleImprimirClick(objeto)

      }} disabled={mostrarBoton}>Print</button>
      <div id="print-contents" style={{ display: 'none' }}>


      </div>
    </div>
  );
};

export default PrintButton;
