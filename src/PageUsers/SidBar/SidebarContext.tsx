import React, { createContext, useContext, useState, useEffect } from 'react';

interface SidebarContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [activeTab, setActiveTab] = useState<TabType>(() => {
    const saved = localStorage.getItem('activeTab');
    return (saved !== null ? saved : 'annonces') as TabType;
  });

  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen));
    localStorage.setItem('activeTab', activeTab);
  }, [sidebarOpen, activeTab]);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <SidebarContext.Provider value={{ 
      sidebarOpen, 
      toggleSidebar,
      activeTab,
      setActiveTab
    }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};