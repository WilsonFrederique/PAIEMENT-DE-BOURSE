import React from 'react';
import '../../PageUsers.css';
import { useSidebar } from '../../SidBar/SidebarContext';
import { SidBar } from '../../SidBar/SidBar';
import NavBar from '../../NavBar/NavBar';
import ComEtudiantBoursier from '../../Components/ComEtudiantBoursier/ComEtudiantBoursier';

const EtudiantBoursier = () => {  
  const { sidebarOpen } = useSidebar();

  return (
    <div className={`publications-app ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <SidBar />
      <div className="main-content">
        <NavBar/>
        <div className="content-wrapper">
            <ComEtudiantBoursier/>
        </div>
      </div>
    </div>
  );
};

export default EtudiantBoursier;