import React from 'react';
import '../../PageUsers.css';
import { useSidebar } from '../../SidBar/SidebarContext';
import { SidBar } from '../../SidBar/SidBar';
import NavBar from '../../NavBar/NavBar';
import ComEtudiantNonBoursier from '../../Components/ComEtudiantNonBoursier/ComEtudiantNonBoursier';

const EtudiantNonBoursier = () => {  
  const { sidebarOpen } = useSidebar();

  return (
    <div className={`publications-app ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <SidBar />
      <div className="main-content">
        <NavBar/>
        <div className="content-wrapper">
            <ComEtudiantNonBoursier/>
        </div>
      </div>
    </div>
  );
};

export default EtudiantNonBoursier;