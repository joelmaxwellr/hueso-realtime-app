const TablaOrdenes = () => {
    return ( 
        <>
        <h5>Ordenes {activeTab}</h5>
                <table className="table mx-auto m-5">
                    <thead>
                        <tr>

                            <th scope="col">#</th>
                            <th scope="col">Cliente</th>
                            <th scope="col">Precio</th>
                            <th scope="col">Material</th>
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
                                <tr key={item.id} className={colorTabla}>

                                    {/* <th scope="row">{item.orden}</th> */}
                                    <th scope="row"> <div className='input-group-prepend'>

                                        <input className='' type="checkbox" id='checkSeleccion' /* checked={checkEnvio} onChange={(e) => setCheckEnvio(e.target.checked)}  *//>
                                    </div>
                                    </th>
                                    <td className='text-capitalize text-right'>{item.nombreCliente}</td>
                                    <td className='text-left' >RD$ {separator(item.precio)}</td>


                                    <td >{item.material}</td>
                                    {/* <td>{item.nota}</td> */}
                                    <td className={item.estadoImpresion.className ? item.estadoImpresion.className : undefined}>{item.estadoImpresion.value}</td>
                                    <td className={colorTabla} >{item.fecha}</td>
                                    <td>{item.hora}</td>
                                    <td>{item.usuarioActual ? acortarUsuario(item.usuarioActual) : '-'}</td>
                                    <td>
                                        {item.checkEnvio === true ?
                                            <PiMotorcycleFill
                                                style={{ padding: '6px', borderRadius: '8px' }}
                                                className={style.ParaEnvío} size={40} />
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

        </>
     );
}
 
export default TablaOrdenes;