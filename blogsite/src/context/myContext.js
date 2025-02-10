import { useState, createContext } from 'react';

//Created a context
export const ToggleContext = createContext();

//Created a custom provider to manage the toggle state
export const ToggleProvider = ({ children }) => {
  const url = "http://localhost:8080";  // Corrected URL

  // const url = "https://blogwise-backend.onrender.com";
    const [isToggled, setIsToggled] = useState(false);
    const [draftRefresh, setDraftRefresh] = useState(false);
  
    return (
      <ToggleContext.Provider value={{ isToggled, setIsToggled, draftRefresh, setDraftRefresh, url }}>
        {children}
      </ToggleContext.Provider>
    );
  };