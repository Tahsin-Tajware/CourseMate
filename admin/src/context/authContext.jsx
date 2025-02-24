import { useState, useEffect, useContext, createContext } from "react";

const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user_admin: {
    },
    token_admin: "",
  });

  useEffect(() => {
    const token_admin = localStorage.getItem("token_admin");
    const user_admin = localStorage.getItem("user_admin");
    if (token_admin) {
      //const parseData = JSON.parse(data);
      setAuth({
        ...auth,
        user_admin: JSON.parse(user_admin),
        token_admin: token_admin,
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