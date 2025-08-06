
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./Components/Layout.jsx";


// Composants pour chaque page

import Achats from "./Pages/Achats.jsx";
import Ventes from "./Pages/Ventes.jsx";
import Mouvement from "./Pages/Mouvement.jsx";
import Produit from "./Pages/Produit.jsx";
import Personnes from "./Pages/Personnes.jsx";

// Composant pour le tableau de bord
function Dashboard() {
  return (
    <div className="container-fluid">
      <h1 className="h3 mb-4 text-gray-800">Tableau de Bord ERP</h1>
      <div className="row">
        {/* Card 1: Revenus Mensuels */}
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-primary shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Revenus Mensuels
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">€40,000</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-calendar fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Revenus Annuels */}
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-success shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                    Revenus Annuels
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">€215,000</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-dollar-sign fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Tâches en Cours */}
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-info shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                    Tâches en Cours
                  </div>
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">10%</div>
                    </div>
                    <div className="col">
                      <div className="progress progress-sm mr-2">
                        <div
                          className="progress-bar bg-info"
                          role="progressbar"
                          style={{ width: "10%" }}
                          aria-valuenow="10"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-clipboard-list fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Demandes en Attente */}
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-warning shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                    Demandes en Attente
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">18</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-comments fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Card 5: Rapport de Base */}
        <div className="col-lg-6 mb-4">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Rapport de Base</h6>
            </div>
            <div className="card-body"></div>
          </div>
        </div>

        {/* Card 6: Menu Déroulant des Actions */}
        <div className="col-lg-6 mb-4">
          <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 font-weight-bold text-primary">Menu Déroulant des Actions</h6>
              <div className="dropdown no-arrow">
                <a
                  className="dropdown-toggle"
                  href="#"
                  role="button"
                  id="dropdownMenuLink"
                  data-bs-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <i className="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                </a>
                <div
                  className="dropdown-menu dropdown-menu-right shadow animated--fade-in"
                  aria-labelledby="dropdownMenuLink"
                >
                  <div className="dropdown-header">Actions :</div>
                  <a className="dropdown-item" href="#">
                    Générer Rapport
                  </a>
                  <a className="dropdown-item" href="#">
                    Exporter Données
                  </a>
                  <div className="dropdown-divider"></div>
                  <a className="dropdown-item" href="#">
                    Autre Option
                  </a>
                </div>
              </div>
            </div>
            <div className="card-body"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes> <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/achat" element={<Achats />} />
          <Route path="/vente" element={<Ventes />} />
          <Route path="/mouvement" element={<Mouvement />} />
          <Route path="/produit" element={<Produit />} />
          <Route path="/personnes" element={<Personnes />} />

        </Routes>
      </Layout>
    </Router>
  );
  
}

export default App;