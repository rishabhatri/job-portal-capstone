import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check localStorage when the app loads to see if someone is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("userInfo", JSON.stringify(userData));
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("userInfo");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
