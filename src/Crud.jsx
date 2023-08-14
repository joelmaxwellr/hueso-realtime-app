import React, { useState, useEffect, createContext, useRef, useContext } from 'react'
import { set } from 'firebase/database';
import PrintButton from './PrintButton';
import { getDatabase, ref, push, onValue, remove, update } from "firebase/database";
import style from "./Crud.module.css"
import { getAuth } from "firebase/auth";
import Navbar from './NavBar';
import { PiMotorcycleFill } from "react-icons/pi";
import { MdCreateNewFolder } from "react-icons/md";
import { GrDocumentUpdate } from "react-icons/gr";
import { BiSearch } from "react-icons/bi";
import { GiCancel } from "react-icons/gi";
import { FaRegCopy } from "react-icons/fa";
import CampoClienteAutocomplete from './CampoClienteAutocomplete'
import DataOrdenesContext from './DataOrdenesContext';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Complete from './Complete';
import Modal from 'react-modal';
Modal.setAppElement('#root');

const styleBoot = {
    Espera: 'bg-warning text-white',
    Aprobado: 'bg-primary text-white',
    Cancelado: 'bg-danger text-white',
    Detenido: 'bg-warning-subtle ',
    Imprimiendo: 'bg-info text-white',
    Listo: 'bg-info bg-opacity-50 text-white',
    Entregado: 'bg-success text-white'
}

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: '50%',
        bottom: '25%',
        marginRight: '-35%',
        transform: 'translate(-50%, -50%)',
    },
};

export default function Crud({ signingOut }) {
    const { nombreCliente, setNombreCliente } = useContext(DataOrdenesContext)
    const [usuarioActual, setUsuarioActual] = useState("")
    /* const [nombreCliente, setNombreCliente] = useState('') */
    const [material, setMaterial] = useState("DTF")
    const [nota, setnota] = useState("")
    const [checkEnvio, setCheckEnvio] = useState(false)
    const [checkSeleccion, setCheckSeleccion] = useState(true)
    const [precio, setPrecio] = useState(0)
    const [data, setData] = useState([])
    const [fecha, setFecha] = useState("")
    const [fechaOrden, setFechaOrden] = useState("")
    const [orden, setOrden] = useState("")
    const [estadoImpresion, setEstadoImpresion] = useState({ value: "Espera", className: style["Espera"] })
    const [hora, setHora] = useState("")
    const [actualizando, setActualizando] = useState(false)
    const [mostrarBoton, setMostrarBoton] = useState(false)
    const [clienteActualizando, setClienteActualizando] = useState(null);
    const [navBarActive, setNavbarActive] = useState("Principal")
    const [filteredData, setFilteredData] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [mensajeAlerta, setMensajeAlerta] = useState("");
    const [cambiosEstado, setCambiosEstado] = useState([]);
    const [filtroEspera, setFiltroEspera] = useState([]);
    const [activeTab, setActiveTab] = useState("Principal");
    const [textoColapsadoVisible, setTextoColapsadoVisible] = useState(null);
    const [colapsosVisibles, setColapsosVisibles] = useState({});
    const [grupoCambioEstado, setGrupoCambioEstado] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);

    // Función para ocultar el contenido colapsado

    const ocultarTextoColapsado = (id) => {
        setColapsosVisibles((prevColapsos) => ({ ...prevColapsos, [id]: false }));
    };

    const auth = getAuth()


    const db = getDatabase()

    const limpiarCampos = () => {
        setSelectedOption(null)
        setNombreCliente("");
        setMaterial("");
        setPrecio(0);
        setnota("");
        setMaterial("DTF")
        setEstadoImpresion({ value: "Espera", className: style["Espera"] })
        setCheckEnvio(false)
    }


    const crear = async () => {

        const fechaActual = new Date();
        const fechaOrdens = fechaActual.getTime();
        const fechaFormateada = fechaActual.toLocaleDateString();
        const horaFormateada = fechaActual.toLocaleTimeString();

        /*  setFecha(fechaFormateada);
         setFechaOrden(fechaOrdens);
         setHora(horaFormateada); */
        if (nombreCliente || precio) {
            try {
                await push(ref(db, "ordenes"), {
                    nombreCliente: nombreCliente,
                    material: material,
                    nota: nota,
                    precio: precio,
                    fecha: fechaFormateada,
                    fechaOrden: fechaOrdens,
                    hora: horaFormateada,
                    estadoImpresion: estadoImpresion,
                    usuarioActual: usuarioActual,
                    checkEnvio: checkEnvio
                });
                console.log("Document written with ID: ");
            } catch (e) {
                console.error("Error adding document: ", e);
            }
            console.log(estadoImpresion)
            setFecha(fechaFormateada);
            setFechaOrden(fechaOrdens);
            setHora(horaFormateada);
            fetchData();
            setActiveTab("Principal")
            setNavbarActive("Principal")


            limpiarCampos();
        } else {

            console.log("Campos vacios")
        }
    }



    const fetchData = async () => {
        const dbRef = ref(db, 'ordenes');
        onValue(dbRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const newArray = Object.keys(data).map((key) => ({ ...data[key], id: key }));

                // Ordenar el array por la propiedad "valor" de forma ascendente
                newArray.sort((a, b) => b.fechaOrden - a.fechaOrden);

                setData(newArray);
                setFilteredData(newArray); // Actualizar la data filtrada al obtener nuevos datos
            } else {
                setData([]);
                setFilteredData([]);
                // Si no hay datos, también limpiar la data filtrada
            }
        });

    };

    const filtroData = (busqueda) => {
        if (busqueda === "Principal") {
            setFilteredData(data); // Mostrar todos los elementos sin filtrar
        }
        else if (busqueda === "Cancelado") {
            const resultado = data.filter((Element) => Element.estadoImpresion.value === busqueda);

            setFilteredData(resultado);
        }
        else if (/* busqueda === "Para Envío" || */ busqueda === "Para Envío") {
            const resultado = data.filter((Element) => Element.checkEnvio === true || Element.estadoImpresion.value == busqueda);

            setFilteredData(resultado);
        }
       
        else {
            const resultado = data.filter((Element) => Element.material == busqueda || Element.estadoImpresion.value == busqueda);
            setFilteredData(resultado);
        }
    }

    const filtroDataEspera = () => {

        const resultado = data.filter((Element) => Element.estadoImpresion.value === "Espera");

        setFiltroEspera(resultado);

    }


    const filtrar = (terminoBusqueda) => {
        var resultadosBusqueda = data.filter((elemento) => {
            if (elemento.nombreCliente.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())
                /* || elemento.company.name.toString().toLowerCase().includes(terminoBusqueda.toLowerCase()) */
            ) {

                return elemento;
            }
        });
        setData(resultadosBusqueda);
    }



    useEffect(() => {



        fetchData();
        if (navBarActive) {
            filtroData(navBarActive); // Llamar al filtro después de obtener datos y si navBarActive es verdadero
        }
        setUsuarioActual(auth.currentUser.email)
    }, [navBarActive, busqueda, cambiosEstado,]);
    /* 
        const clienteInputRef = useRef(null); */

    useEffect(() => {
        filtroDataEspera(filteredData)
        /* clienteInputRef.current.focus(); */
    }, [filteredData, cambiosEstado]);

    useEffect(() => {
        // Agregar un evento de clic al documento
        document.addEventListener('click', ocultarTextoColapsado);

        // Remover el evento de clic cuando el componente se desmonte
        return () => {
            document.removeEventListener('click', ocultarTextoColapsado);
        };
    }, []);

    const borrar = async (id) => {
        try {
            await remove(ref(db, `ordenes/${id}`));
            console.log("Document successfully deleted!");
        } catch (e) {
            console.error("Error deleting document: ", e);
        }
        fetchData();
    }

    const actualizar = (item) => {

        setNombreCliente(item.nombreCliente);
        setSelectedOption({ label: item.nombreCliente, value: item.nombreCliente });
        setMaterial(item.material);
        setPrecio(item.precio);
        setnota(item.nota);
        setCheckEnvio(item.checkEnvio)
        setEstadoImpresion({ value: item.estadoImpresion.value, className: item.estadoImpresion.className })
        setActualizando(true);
        setClienteActualizando(item);
        setMostrarBoton(true)
        ocultarTextoColapsado(item.id);



    }

    const guardarActualizacion = async () => {
        const fechaActual = new Date();
        const fechaOrdens = fechaActual.getTime();
        const fechaFormateada = fechaActual.toLocaleDateString();
        const horaFormateada = fechaActual.toLocaleTimeString();

        const nuevoCambioEstado = {
            estado: clienteActualizando.estadoImpresion.value,
            usuarioCambioEstado: usuarioActual,
            fechaOrdenCambioEstado: fechaOrdens,
            fecha: fechaFormateada,
            hora: horaFormateada
        };

        // Copiar los cambios de estado acumulados en una variable temporal
        const cambiosEstadoTemp = [...cambiosEstado, nuevoCambioEstado];

        try {
            const dbRef = ref(db, `ordenes/${clienteActualizando.id}`);

            await update(dbRef, {
                nombreCliente: nombreCliente,
                material: material,
                nota: nota,
                precio: precio,
                fecha: clienteActualizando.fecha,
                fechaOrden: fechaOrdens,
                hora: clienteActualizando.hora,
                estadoImpresion: estadoImpresion,
                checkEnvio: checkEnvio
                /* datosCambiosEstado: cambiosEstadoTemp,  */// Usar los cambios acumulados en la actualización
            });
            console.log("Document successfully updated!");
        } catch (e) {
            console.error("Error updating document: ", e);
        }

        // Actualizar el estado con los cambios acumulados
        setCambiosEstado(cambiosEstadoTemp);

        setActualizando(false);
        limpiarCampos();
        fetchData();
        setMostrarBoton(false);
    };




    const cancelar = () => {
        setActualizando(false);
        limpiarCampos();
        fetchData();
        setMostrarBoton(false)
    }

    function separator(numb) {
        var str = numb.toString().split(".");
        str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return str.join(".");
    }
    function acortarUsuario(usuario) {
        const codigoUsuario = usuario.slice(0, 3)
        return codigoUsuario

    }


    const colorTabla = actualizando && 'table-secondary'

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            crear();
        }
    };

    const sumaData = (filteredData) => {
        var sumaDTF = 0
        var sumaUV = 0
        var sumaSubli = 0
        var sumaDirect = 0
        var sumaTotal = 0
        const result = filteredData.map(e => {
            if (e.material == "Sublimación") {

                var n = parseInt(e.precio)
                sumaSubli = sumaSubli + n
            }
            else if (e.material == "DTF") {

                var n = parseInt(e.precio)
                sumaDTF = sumaDTF + n
            }
            else if (e.material == "UV") {

                var n = parseInt(e.precio)
                sumaUV = sumaUV + n
            }
            else if (e.material == "Impresión Directa") {

                var n = parseInt(e.precio)
                sumaDirect += n
            }



            var n = parseInt(e.precio)
            sumaTotal = sumaTotal + n


        })
        console.log(`DTF = ${sumaDTF}, UV = ${sumaUV}, subli = ${sumaSubli}, Directa = ${sumaDirect}  Total = ${sumaTotal}`)
    }
    if (usuarioActual == "joelmaxwellr@gmail.com") {
        sumaData(data)
    }



    const handleCopyClick = (item) => {
        const textToCopy = `${item.nombreCliente} - RD$${item.precio} - ${item.material}`;

        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                console.log('Texto copiado: ', textToCopy);
                toast.success(`Texto copiado correctamente ${item.nombreCliente} `);
            })
            .catch((error) => {
                console.error('Error al copiar: ', error);
                toast.error('Error al copiar el texto');
            });
    };


    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {

    }, [])

    const openModal = (item) => {
        setSelectedItem(item);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setSelectedItem(null);
        setModalIsOpen(false);
    };
    return (
        <div>
            <ToastContainer />
            <div style={{ height: "90px" }}></div>
            <h3>
                {usuarioActual}
            </h3>
            <div className='container fixed-top navbar-expand-lg bg-white p-3'>





                <div className='input-group mb-3 container-fluid'>
                    {/*  <Complete filteredData={data} selectedOption={selectedOption} setSelectedOption={setSelectedOption} /> */}
                    {/* <CampoClienteAutocomplete filteredData={filteredData} nombreCliente={nombreCliente} setNombreCliente={setNombreCliente}/> */}
                    {<input className='form-control validate' type="text" id="validationCustom03" required placeholder='cliente' value={nombreCliente} onChange={(e) => setNombreCliente(e.target.value)} />}
                    <div className="invalid-feedback">
                        Campos vacios!
                    </div>



                    <input className='form-control' type="number" id='precio' placeholder='Precio' value={precio} onChange={(e) => setPrecio(e.target.value)} onKeyDown={handleKeyDown} />
                    <select className='form-control' name="material" id="material" value={material} onChange={(e) => setMaterial(e.target.value)}>
                        <option value="DTF">DTF</option>
                        <option value="UV">UV</option>
                        <option value="Sublimación">Sublimación</option>
                        <option value="Impresión Directa">Impresion Directa</option>
                        <option value="Otros">Otros</option>
                    </select>
                    <select name="estadoImpresion"
                        className={estadoImpresion.className ? estadoImpresion.className : undefined}
                        id="estadoImpresion"
                        value={estadoImpresion.value}
                        onChange={(e) => setEstadoImpresion({ value: e.target.value, className: style[`${e.target.value}`] ? style[`${e.target.value}`] : undefined })}>
                        <option value="Espera" className={style.Espera ? style.Espera : undefined}>Espera</option>
                        <option value="Aprobado" className={style.Aprobado ? style.Aprobado : undefined}>Aprobado</option>
                        <option value="Cancelado" className={style.Cancelado ? style.Cancelado : undefined}>Cancelado</option>
                        <option value="Detenido" className={style.Detenido ? style.Detenido : undefined}>Detenido</option>
                        <option value="Imprimiendo" className={style.Imprimiendo ? style.Imprimiendo : undefined}>Imprimiendo</option>
                        <option value="Listo" className={style.Listo ? style.Listo : undefined}>Listo</option>
                        <option value="Entregado" className={style.Entregado ? style.Entregado : undefined}>Entregado</option>
                        <option value="ParaEnvío" className={style.ParaEnvío ? style.ParaEnvío : undefined}>Para Envío</option>
                        {/*  <option value="Otros" className={style.Otros ? style.Otros : undefined}>Otros</option> */}
                    </select>


                    {/*  <input className='form-control' type="text" id='nota' placeholder='Nota' value={nota} onChange={(e) => setnota(e.target.value)} /> */}


                    <div className='p-2'>
                        Para Envío
                    </div>
                    <div className="input-group-text ">
                        <div className='input-group-prepend'>

                            <input className='' type="checkbox" id='checkEnvio' checked={checkEnvio} onChange={(e) => setCheckEnvio(e.target.checked)} />
                        </div>
                    </div>
                    <input className='form-control' type="text" id='buscador' placeholder="Buscar cliente" value={busqueda}
                        onChange={(e) => {
                            setBusqueda(e.target.value)
                            filtrar(e.target.value)
                        }} />
                    <span className="input-group-text">
                        <BiSearch />
                    </span>
                </div>
                <div >
                    {material === "Otros" ? <textarea className='form-control m-3' type="search" id='nota' placeholder='Nota' value={nota} onChange={(e) => setnota(e.target.value)} />
                        : " "}

                    {!actualizando ? <div className="row justify-content-center"><button className='btn btn-primary ' onClick={crear}>Crear <MdCreateNewFolder size={25} /></button>  </div>
                        : <div className='d-grid gap-2'><button className='btn btn-primary' onClick={guardarActualizacion}>Guardar Actualización <GrDocumentUpdate size={20} /></button>
                            <button className='btn btn-danger' onClick={cancelar}>Cancelar <GiCancel size={20} /></button></div>}
                </div>

                <Navbar setNavbarActive={setNavbarActive} signingOut={signingOut} setActiveTab={setActiveTab} activeTab={activeTab} />
            </div>
            <div>


                <h5>Ordenes En Espera</h5>
                <table className="table mx-auto m-5" >
                    <thead>
                        <tr>

                            <th scope="col">#</th>
                            <th scope="col">Cliente</th>
                            <th scope="col">Precio</th>
                            <th scope="col">Material</th>
                            <th scope="col"></th>
                            {/*  <th scope="col">Nota</th> */}
                            <th scope="col">Estatus</th>
                            <th scope="col">Fecha</th>
                            <th scope="col">Hora</th>
                            <th scope="col">Usuario</th>
                            <th scope="col">Para Envío</th>
                            <th scope="col">Acciones</th>
                            <th scope="col"></th>

                        </tr>
                    </thead>
                    <tbody>

                        {
                            filtroEspera.length == 0 ? (
                                <tr>
                                    <td colSpan="10">No hay ordenes En Espera</td>
                                </tr>
                            ) : filtroEspera.map(item => (
                                <tr key={item.id} className={colorTabla ? colorTabla : undefined}>

                                    {/*   <th scope="row">{item.orden}</th> */}
                                    <th scope="row"> <div className='input-group-prepend'>

                                        {/*  <input className='' type="checkbox" id='checkSeleccion' checked={checkSeleccion} onChange={(e) => setCheckSeleccion(e.target.checked)} /> */}
                                        {/*   {checkSeleccion===true ? console.log :a} */}
                                    </div>
                                    </th>
                                    <td className='text-capitalize'>{item.nombreCliente}</td>
                                    <td className="text-right"><label>RD$</label> {separator(item.precio)}</td>
                                    <td >{item.material}</td>

                                    <td >

                                        <button className="btn btn-secondary " onClick={() => handleCopyClick(item)}><FaRegCopy size={14} /></button>

                                    </td>

                                    {/* <td>{item.nota}</td> */}
                                    <td className={item.estadoImpresion.className ? item.estadoImpresion.className : undefined}>{item.estadoImpresion.value}</td>
                                    <td className={colorTabla ? colorTabla : undefined} >{item.fecha}</td>
                                    <td>{item.hora}</td>
                                    <td>{item.usuarioActual ? acortarUsuario(item.usuarioActual) : '-'}</td>

                                    <td>
                                        {item.checkEnvio === true ?
                                            <PiMotorcycleFill
                                                style={{ padding: '6px', borderRadius: '8px' }}
                                                className={style.ParaEnvío ? style.ParaEnvío : undefined} size={40} />
                                            : '-'}
                                    </td>
                                    {/*   <td>
                                        <button data-toggle="tooltip" href="#collapseExample" data-placement="top" title={item.datosCambiosEstado}
                                            className="btn btn-info"
                                            data-bs-toggle="collapse"
                                            data-bs-target={`#textoColapsado-${item.id}espera`}
                                            onClick={() => {
                                                if (colapsosVisibles[item.id]) {
                                                    ocultarTextoColapsado(item.id);
                                                } else {
                                                    setColapsosVisibles((prevColapsos) => ({ ...prevColapsos, [item.id]: true }));
                                                }
                                            }}
                                        >
                                            Info
                                        </button>
                                        <div id={`textoColapsado-${item.id}espera`} className={`collapse  bg-white card p-2 ${colapsosVisibles[item.id] ? 'show' : ''}`} >
                                            {item.nota ? item.nota : '-'}

                                        </div>
                                    </td> */}
                                    <td>
                                        {item.nota &&
                                            <button className="btn btn-info" onClick={() => openModal(item)}>Nota</button>}
                                        <Modal
                                            isOpen={modalIsOpen}
                                            onRequestClose={closeModal}
                                            contentLabel="Ejemplo Modal"
                                            style={customStyles}
                                            animationType='slide'
                                            transparent
                                        >

                                            {selectedItem && (
                                                <div className='card-body'>
                                                    <h4 class="card-title m-2 text-center text-capitalize">{selectedItem.nombreCliente}</h4>
                                                    <br />
                                
                                                    <div className='list-group'>

                                                   {/*  <p class="card-text text-capitalize ">Nota</p> */}
                                                    <p class="card-text text-capitalize text-center">{selectedItem.nota}</p>
                                                    <button className="btn btn-danger text-center" onClick={closeModal}>Cerrar</button>
                                                    </div>
                                                </div>
                                            )}


                                        </Modal>
                                    </td>
                                    {/*    <td>
                                        <button data-toggle="tooltip" href="#collapseExample" data-placement="top" title={item.datosCambiosEstado}
                                            className="btn btn-info"
                                            data-bs-toggle="collapse"
                                            data-bs-target={`#textoColapsado-${item.id}espera`}
                                            onClick={() => {
                                                if (colapsosVisibles[item.id]) {
                                                    ocultarTextoColapsado(item.id);
                                                } else {
                                                    setColapsosVisibles((prevColapsos) => ({ ...prevColapsos, [item.id]: true }));
                                                }
                                            }}
                                        >
                                            Info
                                        </button>
                                        <div id={`textoColapsado-${item.id}espera`} className={`collapse position-absolute bg-white card p-2 ${colapsosVisibles[item.id] ? 'show' : ''}`} >
                                            {item.datosCambiosEstado ? item.datosCambiosEstado.map((e, id) => (
                                                <p key={id}>- {e.estado} - {e.hora} -</p>
                                       )) : '-'}

                                        </div>
                                    </td> */}


                                    <td> <PrintButton objeto={item} mostrarBoton={mostrarBoton} separator={separator} /> </td>
                                    {/*  <td><button className='btn btn-danger' onClick={() => borrar(item.id)} disabled={mostrarBoton}>Borrar</button></td> */}
                                    <td><button className='btn btn-primary' onClick={(e) => actualizar(item, e)} >Actualizar <GrDocumentUpdate size={17} /></button></td>


                                    {/* <td>{item.estatus}</td> */}
                                </tr>
                            ))

                        }

                    </tbody>

                </table>
                <h5>Ordenes {activeTab}</h5>
                <table className="table mx-auto m-5">
                    <thead>
                        <tr>

                            <th scope="col">#</th>
                            <th scope="col">Cliente</th>
                            <th scope="col">Precio</th>
                            <th scope="col">Material</th>
                            <th scope="col"></th>
                            {/*  <th scope="col">Nota</th> */}
                            <th scope="col">Estatus</th>
                            <th scope="col">Fecha</th>
                            <th scope="col">Hora</th>
                            <th scope="col">Usuario</th>
                            <th scope="col">Para Envío</th>
                            <th scope="col">Acciones</th>
                            <th scope="col"></th>

                        </tr>
                    </thead>
                    <tbody>

                        {
                            filteredData.length == 0 ? (
                                <tr>
                                    <td colSpan="10">No hay ordenes {navBarActive}</td>
                                </tr>
                            ) : filteredData.map(item => (
                                <tr key={item.id} className={colorTabla ? colorTabla : undefined}>

                                    {/* <th scope="row">{item.orden}</th> */}
                                    <th scope="row"> <div className='input-group-prepend'>

                                        {/*   <input className='' type="checkbox" id='checkSeleccion' checked={checkSeleccion} onChange={(e) => setCheckSeleccion(e.target.checked)} /> */}
                                    </div>
                                    </th>
                                    <td className='text-capitalize text-right'>{item.nombreCliente}</td>
                                    <td className='text-left' >RD$ {separator(item.precio)}</td>


                                    <td >{item.material}</td>

                                    <td >

                                        <button className="btn btn-secondary " onClick={() => handleCopyClick(item)}><FaRegCopy size={14} /></button>
                                        <ToastContainer /></td>
                                    {/* <td>{item.nota}</td> */}
                                    <td className={item.estadoImpresion.className ? item.estadoImpresion.className : undefined}>{item.estadoImpresion.value}</td>
                                    <td className={colorTabla ? colorTabla : undefined} >{item.fecha}</td>
                                    <td>{item.hora}</td>
                                    <td>{item.usuarioActual ? acortarUsuario(item.usuarioActual) : '-'}</td>
                                    <td>
                                        {item.checkEnvio === true ?
                                            <PiMotorcycleFill
                                                style={{ padding: '6px', borderRadius: '8px' }}
                                                className={style.ParaEnvío ? style.ParaEnvío : undefined} size={40} />
                                            : '-'}
                                    </td>
                                    {/*   <td>
                                        <button
                                            type="button"
                                            className="btn btn-info"
                                            data-bs-toggle="collapse"
                                            data-bs-target={`#textoColapsado-${item.id}`}
                                            onClick={() => {
                                                if (colapsosVisibles[item.id]) {
                                                    ocultarTextoColapsado(item.id);
                                                } else {
                                                    setColapsosVisibles((prevColapsos) => ({ ...prevColapsos, [item.id]: true }));
                                                }
                                            }}
                                        >
                                            Info
                                        </button>
                                        <div id={`textoColapsado-${item.id}`} className={`collapse position-absolute bg-white card p-2 ${colapsosVisibles[item.id] ? 'show' : ''}`}>
                                            
                                            {item.datosCambiosEstado ? item.datosCambiosEstado.map((e, id) => (
                                                <p key={id}>- {e.estado} - {e.hora} - {acortarUsuario(e.usuarioCambioEstado)}</p>
                                            )) : '-'}
                                        </div>
                                    </td> */}
                                    <td>

                                    {item.nota &&
                                        <button className="btn btn-info" onClick={() => openModal(item)}>Nota</button>}

                                    </td>

                                    <td> <PrintButton objeto={item} mostrarBoton={mostrarBoton} separator={separator} /> </td>
                                    {/*   <td><button className='btn btn-danger' onClick={() => borrar(item.id)} disabled={mostrarBoton}>Borrar</button></td> */}
                                    <td><button className='btn btn-primary' onClick={(e) => actualizar(item, e)} >Actualizar <GrDocumentUpdate size={17} /></button></td>

                                    {/* <td>
                                        <button
                                            type="button"
                                            className="btn btn-info"
                                            data-bs-toggle="collapse"
                                            data-bs-target={`#textoColapsado-${item.id}`}
                                        >
                                            info
                                        </button>
                                        <div id={`textoColapsado-${item.id}`} className="collapse">
                                            <p>cliente {item.nombreCliente}</p>
                                            hol
                                    </td>
                                        </div> */}

                                    {/* <td>{item.estatus}</td> */}
                                </tr>
                            ))

                        }
                    </tbody>

                </table>







            </div>



        </div >
    )
}
