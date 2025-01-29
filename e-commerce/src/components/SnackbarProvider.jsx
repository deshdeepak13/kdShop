import React, { createContext, useState, useContext, useCallback } from "react";
import Snackbar from "./SnackBar";

const SnackbarContext = createContext();

export const useSnackbar = () => useContext(SnackbarContext);

const SnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    isVisible: false,
    message: "",
    type: "info",
    position: "top-right",
    duration: 5000,
  });

  const showSnackbar = useCallback(({ message, type = "info", position = "top-right", duration = 5000 }) => {
    setSnackbar({ isVisible: true, message, type, position, duration });
    setTimeout(() => {
      setSnackbar((prev) => ({ ...prev, isVisible: false }));
    }, duration);
  }, []);

  return (
    <SnackbarContext.Provider value={showSnackbar}>
      {children}
      {snackbar.isVisible && (
        <Snackbar
          message={snackbar.message}
          type={snackbar.type}
          position={snackbar.position}
          duration={snackbar.duration}
        />
      )}
    </SnackbarContext.Provider>
  );
};

export default SnackbarProvider;
