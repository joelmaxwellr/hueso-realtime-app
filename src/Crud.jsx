import React, { useState, useEffect, createContext, useRef } from 'react'
import { set } from 'firebase/database';
import PrintButton from './PrintButton';
import { getDatabase, ref, push, onValue, remove } from "firebase/database";
import style from "./Crud.module.css"
import { getAuth } from "firebase/auth";
import Navbar from './NavBar';

const styleBoot = {
    Espera: 'bg-warning text-white',
    Aprobado: 'bg-primary text-white',
    Cancelado: 'bg-danger text-white',
    Detenido: 'bg-warning-subtle ',
    Imprimiendo: 'bg-info text-white',
    Listo: 'bg-info bg-opacity-50 text-white',
    Entregado: 'bg-success text-white'
}



export default function Crud({ signingOut }) {
    const [usuarioActual, setUsuarioActual] = useState("")
    const [nombreCliente, setNombreCliente] = useState("")
    const [material, setMaterial] = useState("DTF")
    const [nota, setnota] = useState("")
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
    const [navBarActive, setNavbarActive] = useState("principal")
    const [filteredData, setFilteredData] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [mensajeAlerta, setMensajeAlerta] = useState("");
    const [cambiosEstado, setCambiosEstado] = useState([]);
    const [filtroEspera, setFiltroEspera] = useState([]);
    const [activeTab, setActiveTab] = useState("principal");

    const auth = getAuth()


    const db = getDatabase()

    const limpiarCampos = (e) => {
        setNombreCliente("");
        setMaterial("");
        setPrecio(0);
        setnota("");
        setMaterial("DTF")
        setEstadoImpresion({ value: "Espera", className: style["Espera"] })
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
                    usuarioActual: usuarioActual
                });
                console.log("Document written with ID: ");
            } catch (e) {
                console.error("Error adding document: ", e);
            }
            console.log(estadoImpresion)
            setFecha(fechaFormateada);
            setFechaOrden(fechaOrdens);
            setHora(horaFormateada);
            setActiveTab("Principal")


            fetchData();
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
                setFilteredData([]); // Si no hay datos, también limpiar la data filtrada
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

    const clienteInputRef = useRef(null);

    useEffect(() => {
        filtroDataEspera(filteredData)
        clienteInputRef.current.focus();
    }, [filteredData, cambiosEstado]);

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
        setMaterial(item.material);
        setPrecio(item.precio);
        setnota(item.nota);
        setEstadoImpresion({ value: item.estadoImpresion.value, className: item.estadoImpresion.className })
        setActualizando(true);
        setClienteActualizando(item);
        setMostrarBoton(true)



    }
    const guardarActualizacion = async () => {
        const fechaActual = new Date();
        const fechaOrdens = fechaActual.getTime();
        const fechaFormateada = fechaActual.toLocaleDateString();
        const horaFormateada = fechaActual.toLocaleTimeString();

        try {
            const dbRef = ref(db, `ordenes/${clienteActualizando.id}`);
            const nuevoCambiosEstado = {
                estado: clienteActualizando.estadoImpresion.value,
                usuarioCambioEstado: usuarioActual,
                fechaOrdenCambioEstado: fechaOrdens,
                fecha: fechaFormateada,
                hora: horaFormateada
            };

            setCambiosEstado([...cambiosEstado, nuevoCambiosEstado]);

            await set(dbRef, {
                nombreCliente: nombreCliente,
                material: material,
                nota: nota,
                precio: precio,
                fecha: clienteActualizando.fecha,
                fechaOrden: fechaOrdens,
                hora: clienteActualizando.hora,
                estadoImpresion: estadoImpresion,
                /* datosCambiosEstado: cambiosEstado,  */// Ya incluye el nuevo estado agregado arriba
                usuarioActual: usuarioActual
            });
            console.log("Document successfully updated!");
        } catch (e) {
            console.error("Error updating document: ", e);
        }
        console.log(clienteActualizando)
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
    const colorTabla = actualizando && 'table-secondary'

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            crear();
        }
    };

    return (
        <div>
            <div style={{ height: "90px" }}></div>
            <h3>
                {usuarioActual}
            </h3>
            <div className='container fixed-top navbar-expand-lg bg-white p-3'>




                <div className='input-group mb-3 container-fluid'>

                    <input className='form-control validate' type="text" id="validationCustom03" required placeholder='cliente' value={nombreCliente} ref={clienteInputRef} onChange={(e) => setNombreCliente(e.target.value)} />
                    <div className="invalid-feedback">
                        Campos vacios!
                    </div>



                    <input className='form-control' type="number" id='precio' placeholder='Precio' value={precio} onChange={(e) => setPrecio(e.target.value)} onKeyDown={handleKeyDown} />
                    <select className='form-control' name="material" id="material" value={material} onChange={(e) => setMaterial(e.target.value)}>
                        <option value="DTF">DTF</option>
                        <option value="UV">UV</option>
                        <option value="Sublimación">Sublimación</option>
                        <option value="Impresión Directa">Impresion Directa</option>
                    </select>
                    <select name="estadoImpresion"
                        className={estadoImpresion.className ? estadoImpresion.className : undefined}
                        id="estadoImpresion"
                        value={estadoImpresion.value}
                        onChange={(e) => setEstadoImpresion({ value: e.target.value, className: style[`${e.target.value}`] })}>
                        <option value="Espera" className={style.Espera}>Espera</option>
                        <option value="Aprobado" className={style.Aprobado}>Aprobado</option>
                        <option value="Cancelado" className={style.Cancelado}>Cancelado</option>
                        <option value="Detenido" className={style.Detenido}>Detenido</option>
                        <option value="Imprimiendo" className={style.Imprimiendo}>Imprimiendo</option>
                        <option value="Listo" className={style.Listo}>Listo</option>
                        <option value="Entregado" className={style.Entregado}>Entregado</option>
                    </select>
                    <input className='form-control' type="text" id='nota' placeholder='Nota' value={nota} onChange={(e) => setnota(e.target.value)} />
                    <input className='form-control' type="text" id='buscador' placeholder='Buscar cliente' value={busqueda}
                        onChange={(e) => {
                            setBusqueda(e.target.value)
                            filtrar(e.target.value)
                        }} />
                </div>
                <div >

                    {!actualizando ? <div className="row justify-content-center"><button className='btn btn-primary ' onClick={crear}>Crear</button>  </div>
                        : <div className='d-grid gap-2'><button className='btn btn-primary' onClick={guardarActualizacion}>Guardar Actualización</button>
                            <button className='btn btn-danger' onClick={cancelar}>Cancelar</button></div>}
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
                            <th scope="col">Nota</th>
                            <th scope="col">Estatus</th>
                            <th scope="col">Fecha</th>
                            <th scope="col">Hora</th>
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
                                <tr key={item.id} className={colorTabla}>

                                    <th scope="row">{item.orden}</th>
                                    <td className='text-capitalize'>{item.nombreCliente}</td>
                                    <td >{separator(item.precio)}</td>
                                    <td >{item.material}</td>
                                    <td>{item.nota}</td>
                                    <td className={item.estadoImpresion.className ? item.estadoImpresion.className : undefined}>{item.estadoImpresion.value}</td>
                                    <td className={colorTabla} >{item.fecha}</td>
                                    <td>{item.hora}</td>



                                    <td> <PrintButton objeto={item} mostrarBoton={mostrarBoton} separator={separator} /> </td>
                                    <td><button className='btn btn-danger' onClick={() => borrar(item.id)} disabled={mostrarBoton}>Borrar</button></td>
                                    <td><button className='btn btn-primary' onClick={(e) => actualizar(item, e)} >Actualizar</button></td>

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
                            <th scope="col">Nota</th>
                            <th scope="col">Estatus</th>
                            <th scope="col">Fecha</th>
                            <th scope="col">Hora</th>
                            <th scope="col">Acciones</th>
                            <th scope="col"></th>

                        </tr>
                    </thead>
                    <tbody>

                        {
                            data.length == 0 ? (
                                <tr>
                                    <td colSpan="10">No hay ordenes de trabajo</td>
                                </tr>
                            ) : filteredData.map(item => (
                                <tr key={item.id} className={colorTabla}>

                                    <th scope="row">{item.orden}</th>
                                    <td className='text-capitalize'>{item.nombreCliente}</td>
                                    <td >{separator(item.precio)}</td>
                                    <td >{item.material}</td>
                                    <td>{item.nota}</td>
                                    <td className={item.estadoImpresion.className ? item.estadoImpresion.className : undefined}>{item.estadoImpresion.value}</td>
                                    <td className={colorTabla} >{item.fecha}</td>
                                    <td>{item.hora}</td>



                                    <td> <PrintButton objeto={item} mostrarBoton={mostrarBoton} separator={separator} /> </td>
                                    <td><button className='btn btn-danger' onClick={() => borrar(item.id)} disabled={mostrarBoton}>Borrar</button></td>
                                    <td><button className='btn btn-primary' onClick={(e) => actualizar(item, e)} >Actualizar</button></td>

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
