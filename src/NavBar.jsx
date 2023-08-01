import { useState } from "react";

const Navbar = ({setNavbarActive}) => {
    

    return (
        <div>
            <ul className="nav nav-tabs">
                <li onClick={(e) => {
                    e.target.className = "nav-link  active"
                    setNavbarActive("principal")
                }} className="nav-item">
                    <a className="nav-link active" aria-current="page" href="#">Ordenes Principal</a>
                </li>

                <li onClick={(e) => {
                    e.target.className = "nav-link  active"
                    setNavbarActive("DTF")
                }} className="nav-item active">
                    <a className="nav-link" href="#">DTF</a>
                </li>
                <li onClick={(e) => {
                    e.target.className = "nav-link  active"
                    setNavbarActive("UV")
                }} className="nav-item">
                    <a className="nav-link " aria-disabled="true">UV</a>
                </li>
                <li onClick={(e) => {
                    e.target.className = "nav-link  active"
                    setNavbarActive("Sublimación")
                }} className="nav-item">
                    <a className="nav-link " aria-disabled="true">Sublimación</a>
                </li>
                <li onClick={(e) => {
                    e.target.className = "nav-link  active"
                    setNavbarActive("Impresion Directa")
                }} className="nav-item">
                    <a className="nav-link " aria-disabled="true">Impresion Directa</a>
                </li>
                <li onClick={(e) => {
                    e.target.className = "nav-link  active"
                    setNavbarActive("Cancelado")
                }} className="nav-item">
                    <a className="nav-link " aria-disabled="true">Cancelado</a>
                </li>
                <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false"></a>
                    <ul className="dropdown-menu">
                        <li><a className="dropdown-item" href="#">Action</a></li>
                        <li><a className="dropdown-item" href="#">Another action</a></li>
                        <li><a className="dropdown-item" href="#">Something else here</a></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li><a className="dropdown-item" href="#">Separated link</a></li>
                    </ul>
                </li>
            </ul>
        </div>
    );
}

export default Navbar;