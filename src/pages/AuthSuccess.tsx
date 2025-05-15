// src/pages/AuthSuccess.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      navigate("/perfil"); // ou outra rota protegida
    } else {
      navigate("/entrar");
    }
  }, [navigate]);

  return <p>Autenticando com Google...</p>;
}

export default AuthSuccess;
