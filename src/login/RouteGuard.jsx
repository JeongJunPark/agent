import { Navigate, useLocation } from "react-router-dom";

const RouteGuard = ({ children, allowedFor  }) => {
  const token = sessionStorage.getItem("validToken");
  let managerYN = "";
  if(sessionStorage.getItem("managerYN")==="manager"){
    managerYN = true; 
  } else if(sessionStorage.getItem("managerYN")==="agent") {
    managerYN = false;
  }

  
  const location = useLocation();
  if (!token) {
    alert("로그인이 필요합니다.");
    return <Navigate to="/Login" />;
  }
  console.log("managerYN: ---> ", managerYN)

  if (
    (managerYN === true && allowedFor === "user") ||
    (managerYN === false && allowedFor === "manager")
  ) {
    alert("비정상적인 접근입니다.");
    return <Navigate to={managerYN === true ? "/MyPageMng" : "/MyPage"} replace />;
  } else {
    return children;

  }

  
};

export default RouteGuard;