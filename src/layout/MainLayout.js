import { Outlet } from "react-router-dom";
import Header from "./Header";
import HeaderMng from "./HeaderMng";
import Footer from "./Footer";

function MainLayout() {

  const isManager = sessionStorage.getItem("managerYN") === "manager";

  return (
    <>
    {isManager ? (
      <>
      <HeaderMng />
        <div>
          <Outlet />
        </div>
        <Footer />
      </>
      
    ) : (
    <>
      <Header />
        <div>
          <Outlet />
        </div>
        <Footer />
      </>        
    )}
    </>
  );
}

export default MainLayout;
