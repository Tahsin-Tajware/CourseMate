import { useState, useEffect, useContext, createContext } from "react";

const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: {
    },
    token: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const user = localStorage.getItem("user");
    if (token) {
      //const parseData = JSON.parse(data);
      setAuth({
        ...auth,
        user: JSON.parse(user),
        token: token,
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

// custom hook
const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };