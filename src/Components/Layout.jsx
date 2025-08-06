import React from "react";
import PropTypes from "prop-types";
import SideBar from "./SideBar.jsx";
import TopBar from "./TopBar.jsx";

function Layout({ children }) {
  return (
    <div id="wrapper" className="d-flex w-100 h-100">
      <SideBar />
      <div id="content-wrapper" className="d-flex flex-column flex-grow-1">
        <div id="content" className="flex-grow-1">
          <TopBar />
          <div className="container-fluid p-4">
            {children || <p className="text-danger">Aucun contenu fourni.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
};

export default Layout;