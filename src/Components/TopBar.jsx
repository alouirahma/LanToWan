import React from "react";
import PropTypes from "prop-types";

function TopBar({ userName = "Rahma", profileImage }) {
  return (
    <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow-sm">
      <button
        id="sidebarToggleTop"
        className="btn btn-link d-md-none rounded-circle mr-3"
        onClick={() => {
          const sidebar = document.getElementById("accordionSidebar");
          if (sidebar) sidebar.classList.toggle("toggled");
        }}
        aria-label="Basculer la barre latérale"
      >
        <i className="fa fa-bars"></i>
      </button>
      <span className="navbar-brand mr-auto font-weight-bold">
        Bienvenue, {userName} !
      </span>
      <ul className="navbar-nav ml-auto">
        <li className="nav-item dropdown">
          <a
            className="nav-link dropdown-toggle"
            href="#"
            id="userDropdown"
            role="button"
            data-bs-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <span className="mr-2 d-none d-lg-inline text-gray-600 small">
              {userName}
            </span>
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profil"
                className="rounded-circle"
                style={{ width: "30px", height: "30px", objectFit: "cover" }}
              />
            ) : (
              <i className="fas fa-user-circle fa-fw"></i>
            )}
          </a>
        
        </li>
      </ul>
    </nav>
  );
}

TopBar.propTypes = {
  userName: PropTypes.string.isRequired,
  profileImage: PropTypes.string,
};

TopBar.defaultProps = {
  userName: "Rahma",
  profileImage: null,
};

export default TopBar;