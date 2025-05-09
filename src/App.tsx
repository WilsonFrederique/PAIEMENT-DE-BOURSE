import React, { useState } from 'react';

import '@fortawesome/fontawesome-free/css/all.min.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from './Login/Login';

import Dashbord from "./Dashbord/Dashbord";
import 'boxicons/css/boxicons.min.css';

import Etudiant from "./Pages/Etudiant/Etudiant";
import FrmEtudiant from './Components/ComFRM/FrmEtudiant/FrmEtudiant';

import Montant from "./Pages/Montant/Etudiant";
import FrmMontant from './Components/ComFRM/FrmMontant/FrmMontant';

import Niveau from "./Pages/Niveau/Niveau";
import FrmNiveau from './Components/ComFRM/FrmNiveau/FrmNiveau';

import NumeroCompte from './Pages/NumeroCompte/Niveau';
import FrmNumCompte from './Components/ComFRM/FrmNumCompte/FrmNumCompte';

import Payer from "./Pages/Payer/Payer";
import FrmPayer from './Components/ComFRM/FrmPayer/FrmPayer';

import Message from "./Pages/Message/Message";

import Parametre from "./Pages/Parametre/Parametre";

import { ThemeContext } from './NavBar/NavBar';

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
    <>
      <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
        <BrowserRouter>

          <Routes>
            <Route path="/" element={<Login />} />

            <Route path="/dashbord" element={<Dashbord />} />
            
            <Route path="/etudiant" element={<Etudiant />} />
            <Route path="/frmEtudiant" element={<FrmEtudiant />} />

            <Route path="/niveau" element={<Niveau />} />
            <Route path="/frmNiveau" element={<FrmNiveau />} />

            <Route path="/numeroCompte" element={<NumeroCompte />} />
            <Route path="/frmNumCompte" element={<FrmNumCompte />} />

            <Route path="/montant" element={<Montant />} />
            <Route path="/frmMontant" element={<FrmMontant />} />

            <Route path="/payer" element={<Payer />} />
            <Route path="/frmPayer" element={<FrmPayer />} />

            <Route path="/message" element={<Message />} />

            <Route path="/parametre" element={<Parametre />} />
          </Routes>

        </BrowserRouter>
      </ThemeContext.Provider>
    </>
  )
}

export default App
