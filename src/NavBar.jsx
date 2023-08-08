import { useState } from "react";

const Navbar = ({ setNavbarActive, signingOut, setActiveTab, activeTab }) => {

    

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setNavbarActive(tab);
    };

    return (
        <div>
            <ul className="nav nav-tabs p-1">
            <li onClick={() => handleTabClick("Principal")} className={`nav-item ${activeTab === "Principal" ? "active" : ""}`}>
                    <a className={`nav-link ${activeTab === "Principal" ? "active" : ""}`} aria-current="page" href="#">Ordenes Principal</a>
                </li>

                <li onClick={() => handleTabClick("DTF")} className={`nav-item ${activeTab === "DTF" ? "active" : ""}`}>
                    <a className={`nav-link ${activeTab === "DTF" ? "active" : ""}`} href="#">DTF</a>
                </li>
                
                <li onClick={() => handleTabClick("UV")} className={`nav-item ${activeTab === "UV" ? "active" : ""}`}>
                    <a className={`nav-link ${activeTab === "UV" ? "active" : ""}`} href="#">UV</a>
                </li>

                <li onClick={() => handleTabClick("Sublimación")} className={`nav-item ${activeTab === "Sublimación" ? "active" : ""}`}>
                    <a className={`nav-link ${activeTab === "Sublimación" ? "active" : ""}`} href="#">Sublimación</a>
                </li>

                <li onClick={() => handleTabClick("Impresión Directa")} className={`nav-item ${activeTab === "Impresión Directa" ? "active" : ""}`}>
                    <a className={`nav-link ${activeTab === "Impresión Directa" ? "active" : ""}`} href="#">Impresión Directa</a>
                </li>

                <li onClick={() => handleTabClick("Espera")} className={`nav-item ${activeTab === "Espera" ? "active" : ""}`}>
                    <a className={`nav-link ${activeTab === "Espera" ? "active" : ""}`} href="#">Espera</a>
                </li>
              
                <li onClick={() => handleTabClick("Aprobado")} className={`nav-item ${activeTab === "Aprobado" ? "active" : ""}`}>
                    <a className={`nav-link ${activeTab === "Aprobado" ? "active" : ""}`} href="#">Aprobado</a>
                </li>
              
                <li onClick={() => handleTabClick("Listo")} className={`nav-item ${activeTab === "Listo" ? "active" : ""}`}>
                    <a className={`nav-link ${activeTab === "Listo" ? "active" : ""}`} href="#">Listo</a>
                </li>
                <li onClick={() => handleTabClick("Para Envío")} className={`nav-item ${activeTab === "Para Envío" ? "active" : ""}`}>
                    <a className={`nav-link ${activeTab === "Para Envío" ? "active" : ""}`} href="#">Para Envío</a>
                </li>
              

                
                <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false"></a>
                    <ul className="dropdown-menu">
                        <li><a className="dropdown-item" href="#" onClick={signingOut}>Cerrar Sesión

                        {/* <button className='btn btn-secondary' onClick={signingOut}>Cerrar Sesión</button> */}
                        </a></li>
                        <li><a className="dropdown-item" href="#">Configuración</a></li>
                       {/*  <li><a className="dropdown-item" href="#">Something else here</a></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li><a className="dropdown-item" href="#">Separated link</a></li> */}
                    </ul>
                </li>
            </ul>
        </div>
    );
}

export default Navbar;