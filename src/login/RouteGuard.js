import { Navigate } from "react-router-dom";

const RouteGuard = ({ children }) => {
  const token = sessionStorage.getItem("validToken");

  if (!token) {
    alert("로그인이 필요합니다.");
    return <Navigate to="/Login" />;
  }

  return children;
};

export default RouteGuard;