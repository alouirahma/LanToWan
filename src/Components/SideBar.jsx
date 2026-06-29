import React from "react";
import { Link } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css"; 
function SideBar() {
 return (
    <ul
      className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
      id="accordionSidebar"
    >
      <a
        className="sidebar-brand d-flex align-items-center justify-content-center"
        href="/"
      >
        <div className="sidebar-brand-icon ">
          <img
            src="./public/img/LANTOWAN.png" // Chemin vers votre image dans public/
            alt="Logo LanToWan"
            style={{ width: "100px", height: "px" }} // Ajustez la taille selon vos besoins
          />
        </div>
        <div className="sidebar-brand-text mx-3">LanToWan</div>
      </a>
      <hr className="sidebar-divider my-0" />
    
      <hr className="sidebar-divider" />
     
{[{ href: "/dashboard", icon: "fa-solid fa-tachometer-alt", text: "Dashboard" },
        { href: "/achat", icon: "fa-solid fa-shopping-cart", text: "Achat" },
        { href: "/vente", icon: "fa-solid fa-dollar-sign", text: "Vente" },
        { href: "/mouvement", icon: "fa-solid fa-exchange-alt", text: "Mouvement"},
        { href: "/produit", icon: "fa-solid fa-box", text: "Produit"},
        { href: "/personnes", icon: "fa-solid fa-users", text: "Personnes" }, // Icône pour personnes
].map((item, index) => (
  <li className="nav-item" key={index}>
    <a className="nav-link" href={item.href}>
      <i className={item.icon}></i> 
      <span>{item.text}</span>
    </a>
  </li>
))}
      <hr className="sidebar-divider" />
    </ul>
  );
}

export default SideBar;