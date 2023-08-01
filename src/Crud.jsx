import React, { useState, useEffect, createContext } from 'react'
import { set } from 'firebase/database';
import PrintButton from './PrintButton';
import { getDatabase, ref, push, onValue, remove } from "firebase/database";
import style from "./Crud.module.css"
import { getAuth } from "firebase/auth";
import Navbar from './NavBar';

const styleBoot = {
    EnEspera: 'bg-warning text-white',
    Aprobado: 'bg-primary text-white',
    Cancelado: 'bg-danger text-white',
    Detenido: 'bg-warning-subtle ',
    Imprimiendo: 'bg-info text-white',
    Listo: 'bg-info bg-opacity-50 text-white',
    Entregado: 'bg-success text-white'
}


export default function Crud() {
    const [usuarioActual, setUsuarioActual] = useState("")
    const [nombreCliente, setNombreCliente] = useState("")
    const [material, setMaterial] = useState("DTF")
    const [nota, setnota] = useState("")
    const [precio, setPrecio] = useState(0)
    const [data, setData] = useState([])
    const [fecha, setFecha] = useState("")
    const [fechaOrden, setFechaOrden] = useState("")
    const [orden, setOrden] = useState("")
    const [estadoImpresion, setEstadoImpresion] = useState({ value: "En Espera", className: style["EnEspera"] })
    const [hora, setHora] = useState("")
    const [actualizando, setActualizando] = useState(false)
    const [mostrarBoton, setMostrarBoton] = useState(false)
    const [clienteActualizando, setClienteActualizando] = useState(null);

    const auth = getAuth()


    const db = getDatabase()

    const limpiarCampos = (e) => {
        setNombreCliente("");
        setMaterial("");
        setPrecio(0);
        setnota("");
        setMaterial("DTF")
        setEstadoImpresion({ value: "En Espera", className: style["EnEspera"] })
    }


    const crear = async () => {
        const fechaActual = new Date();
        const fechaOrdens = fechaActual.getTime();
        const fechaFormateada = fechaActual.toLocaleDateString();
        const horaFormateada = fechaActual.toLocaleTimeString();

        /*  setFecha(fechaFormateada);
         setFechaOrden(fechaOrdens);
         setHora(horaFormateada); */
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

        fetchData();
        limpiarCampos();
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
            } else {
                setData([]);
            }
        });
    };

    const filtroData = (data, busqueda) => {
        const resultado = data.filter(Element => Element.material == busqueda)
        /* console.log(resultado) */
    }
    filtroData(data, "UV")


    useEffect(() => {
        fetchData();
        setUsuarioActual(auth.currentUser.email)
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
        setMaterial(item.material);
        setPrecio(item.precio);
        setnota(item.nota);
        setEstadoImpresion({ value: item.estadoImpresion.value, className: item.estadoImpresion.className })
        setActualizando(true);
        setClienteActualizando(item);
        setMostrarBoton(true)



    }

    const guardarActualizacion = async () => {
        try {
            const dbRef = ref(db, `ordenes/${clienteActualizando.id}`);
            await set(dbRef, {
                nombreCliente: nombreCliente,
                material: material,
                nota: nota,
                precio: precio,
                fecha: clienteActualizando.fecha,
                fechaOrden: clienteActualizando.fechaOrden,
                hora: clienteActualizando.hora,
                estadoImpresion: estadoImpresion,
                /* usuarioActual: usuarioActual */
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


    }

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
    return (
        <div>
            <h3>
                {usuarioActual}
            </h3>
            <Navbar />
            <div className='input-group mb-3'>


                <input className='form-control' type="text" id='nombreCliente' placeholder='cliente' value={nombreCliente} onChange={(e) => setNombreCliente(e.target.value)} />


                <input className='form-control' type="number" id='precio' placeholder='Precio' value={precio} onChange={(e) => setPrecio(e.target.value)} />
                <select className='form-control' name="material" id="material" value={material} onChange={(e) => setMaterial(e.target.value)}>
                    <option value="DTF">DTF</option>
                    <option value="UV">UV</option>
                    <option value="Sublimación">Sublimación</option>
                    <option value="Impresión Directa">Impresion Directa</option>
                </select>
                <select name="estadoImpresion"
                    className={estadoImpresion.className}
                    id="estadoImpresion"
                    value={estadoImpresion.value}
                    onChange={(e) => setEstadoImpresion({ value: e.target.value, className: style[`${e.target.value}`] })}>
                    <option value="EnEspera" className={style.EnEspera}>En Espera</option>
                    <option value="Aprobado" className={style.Aprobado}>Aprobado</option>
                    <option value="Cancelado" className={style.Cancelado}>Cancelado</option>
                    <option value="Detenido" className={style.Detenido}>Detenido</option>
                    <option value="Imprimiendo" className={style.Imprimiendo}>Imprimiendo</option>
                    <option value="Listo" className={style.Listo}>Listo</option>
                    <option value="Entregado" className={style.Entregado}>Entregado</option>
                </select>
                <input className='form-control' type="text" id='nota' placeholder='Nota' value={nota} onChange={(e) => setnota(e.target.value)} />
            </div>
            <div className=''>

                {!actualizando ? <div className="row justify-content-center"><button className='btn btn-primary ' onClick={crear}>Crear</button>  </div>
                    : <div className='d-grid gap-2'><button className='btn btn-primary' onClick={guardarActualizacion}>Guardar Actualización</button>
                        <button className='btn btn-danger' onClick={cancelar}>Cancelar</button></div>}
            </div>
            <div>
                <table className="table">
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
                        </tr>
                    </thead>
                    <tbody>

                        {
                            data.length == 0 ? (
                                <tr>
                                    <td colSpan="10">No hay ordenes de trabajo</td>
                                </tr>
                            ) : data.map(item => (
                                <tr key={item.id}>

                                    <th scope="row">{item.orden}</th>
                                    <td className='text-capitalize'>{item.nombreCliente}</td>
                                    <td>{separator(item.precio)}</td>
                                    <td >{item.material}</td>
                                    <td>{item.nota}</td>
                                    <td /* style= {{backgroundColor: style.Aprobado}}  */className={item.estadoImpresion.className}>{item.estadoImpresion.value}</td>
                                    <td>{item.fecha}</td>
                                    <td>{item.hora}</td>



                                    <td> <PrintButton objeto={item} mostrarBoton={mostrarBoton} /> </td>
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
