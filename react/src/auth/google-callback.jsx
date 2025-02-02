import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const user = urlParams.get("user");

    if (token && user) {
      const parsedUser = JSON.parse(decodeURIComponent(user));

      localStorage.setItem("access_token", token);
      localStorage.setItem("user", JSON.stringify(parsedUser));

      setAuth({
        token,
        user: parsedUser,
      });

      navigate("/");
    }
    // else {
    //   navigate("/login");
    // }
  }, []);

  return <p>Logging you in...</p>;
};

export default AuthCallback;
