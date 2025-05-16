import React, { useState } from 'react';
import ProtectedRoute from './ProtectedRoute';

import '@fortawesome/fontawesome-free/css/all.min.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ThemeContext } from './NavBar/NavBar';

// Login 
import Login from './Login/Login';

// Admin 
import Dashbord from "./Dashbord/Dashbord";
import 'boxicons/css/boxicons.min.css';

import Etudiant from "./PageAdmin/Etudiant/Etudiant";
import FrmEtudiant from './Components/ComFRM/FrmEtudiant/FrmEtudiant';
import DetailEtudiant from './Components/ComFRM/DetailEtudiant/DetailEtudiant';

import Montant from "./PageAdmin/Montant/Etudiant";
import FrmMontant from './Components/ComFRM/FrmMontant/FrmMontant';

import NumeroCompte from './PageAdmin/NumeroCompte/Niveau';
import FrmNumCompte from './Components/ComFRM/FrmNumCompte/FrmNumCompte';

import Payer from "./PageAdmin/Payer/Payer";
import FrmPayer from './Components/ComFRM/FrmPayer/FrmPayer';
import DetailPaiment from './Components/ComFRM/DetailPaiment/DetailPaiment';

import Message from "./PageAdmin/Message/Message";

import Parametre from "./PageAdmin/Parametre/Parametre";

import Niveau from "./PageAdmin/Niveau/Niveau";
import FrmNiveau from './Components/ComFRM/FrmNiveau/FrmNiveau';

import ListesUsers from './PageAdmin/ListesUsers/ListesUsers';

// Users 
import DashbordUser from './PageUsers/Pages/DashbordUser/DashbordUser';
import EtudiantBoursier from './PageUsers/Pages/EtudiantBoursier/EtudiantBoursier';
import EtudiantNonBoursier from './PageUsers/Pages/EtudiantNonBoursier/EtudiantNonBoursier';

import { SidebarProvider } from './PageUsers/SidBar/SidebarContext';



function App() {

  const [darkMode, setDarkMode] = useState(true);

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    document.body.classList.toggle('dark', newDarkMode);
    document.body.classList.toggle('light', !newDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      <SidebarProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            
            {/* Routes protégées pour admin */}
            <Route element={<ProtectedRoute allowedRoles={['admin', 'superadmin']} />}>
              <Route path="/dashbord" element={<Dashbord />} />

              <Route path="/etudiant" element={<Etudiant />} />
              <Route path="/frmEtudiant" element={<FrmEtudiant />} />
              <Route path="/modifierEtudiant/:matricule" element={<FrmEtudiant />} />
              <Route path="/detailEtudiant/:matricule" element={<DetailEtudiant />} />              

              <Route path="/numeroCompte" element={<NumeroCompte />} />
              <Route path="/frmNumCompte" element={<FrmNumCompte />} />
              <Route path="/modifierFrmNumCompte/:idNumCompte" element={<FrmNumCompte />} />

              <Route path="/montant" element={<Montant />} />
              <Route path="/frmMontant" element={<FrmMontant />} />
              <Route path="/modifierFrmMontant/:idMontant" element={<FrmMontant />} />

              <Route path="/payer" element={<Payer />} />
              <Route path="/impression/:idPaiement" element={<Payer />} />
              <Route path="/frmPayer" element={<FrmPayer />} />
              <Route path="/modifierFrmPayer/:idPaiement" element={<FrmPayer />} />
              <Route path="/detailPayer/:idPaiement" element={<DetailPaiment />} />

              <Route path="/message" element={<Message />} />

              <Route path="/parametre" element={<Parametre />} />

              <Route path="/niveau" element={<Niveau />} />
              <Route path="/frmNiveau" element={<FrmNiveau />} />
              <Route path="/modifierFrmNiveau/:idNiveau" element={<FrmNiveau />} />

              <Route path="/listesUsers" element={<ListesUsers />} />
            </Route>
            
            {/* Routes protégées pour user */}
            <Route element={<ProtectedRoute allowedRoles={['user', 'admin', 'superadmin']} />}>
              <Route path="/dashbordUser" element={<DashbordUser />} />
              <Route path="/etudiantBoursier" element={<EtudiantBoursier />} />
              <Route path="/etudiantNonBoursier" element={<EtudiantNonBoursier />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SidebarProvider>
    </ThemeContext.Provider>
  );
}

export default App
