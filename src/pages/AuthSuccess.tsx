import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token); // ou sessionStorage
      navigate("/perfil"); // Redireciona para uma página após login
    } else {
      navigate("/entrar"); // Se não houver token, volta para login
    }
  }, [navigate]);

  return <p>Autenticando...</p>;
}

export default AuthSuccess;
