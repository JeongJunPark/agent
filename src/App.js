import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './login/Login';
import Borrower from './borrower/Borrower';
import Agent from './agent/Agent'
import MyPage from "./mypage/MyPage"
import PersonalInfoModify from "./mypage/PersonalInfoModify"

import ManageCompany from "./company/ManageCompany"
import RegisterCompany from "./company/RegisterCompany"
import ModifyCompany from "./company/ModifyCompany"
import CompanyIP from "./company/CompanyIP"
import CompanyMoAccount from "./company/CompanyMoAccount"

import ManageUser from "./user/ManageUser"
import RegisterUser from "./user/RegisterUser"
import ModifyUser from "./user/ModifyUser"
import UseHistory from "./user/UseHistory"
import { Outlet } from "react-router-dom";

import Header from './layout/Header'
import Footer from './layout/Footer'

function MainLayout() {
  return (
    <>
      <Header />
      <div className="content-body">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

function App() {
  return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Login" element={<Login />} />
        
        <Route element={<MainLayout/>}>
          <Route path="/MyPage" element={<MyPage />} />
          <Route path="/PersonalInfoModify" element={<PersonalInfoModify />} />

          <Route path="/Borrower" element={<Borrower />} />
          <Route path="/Agent" element={<Agent />} />
          <Route path="/ManageCompany" element={<ManageCompany />} />
          <Route path="/RegisterCompany" element={<RegisterCompany />} />
          <Route path="/ModifyCompany" element={<ModifyCompany />} />
          <Route path="/CompanyIP" element={<CompanyIP />} />
          <Route path="/CompanyMoAccount" element={<CompanyMoAccount />} />

          <Route path="/ManageUser" element={<ManageUser />} />
          <Route path="/ModifyUser" element={<ModifyUser />} />
          <Route path="/RegisterUser" element={<RegisterUser />} />
          <Route path="/UseHistory" element={<UseHistory />} />
        </Route>

      </Routes>
  );
}

/*
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Login" element={<Login />} />
        
        <Route path="/MyPage" element={<MyPage />} />
        <Route path="/PersonalInfoModify" element={<PersonalInfoModify />} />

        <Route path="/Borrower" element={<Borrower />} />
        <Route path="/Agent" element={<Agent />} />
        <Route path="/ManageCompany" element={<ManageCompany />} />
        <Route path="/RegisterCompany" element={<RegisterCompany />} />
        <Route path="/ModifyCompany" element={<ModifyCompany />} />
        <Route path="/CompanyIP" element={<CompanyIP />} />
        <Route path="/CompanyMoAccount" element={<CompanyMoAccount />} />

        <Route path="/ManageUser" element={<ManageUser />} />
        <Route path="/ModifyUser" element={<ModifyUser />} />
        <Route path="/RegisterUser" element={<RegisterUser />} />
        <Route path="/UseHistory" element={<UseHistory />} />


      </Routes>
    </BrowserRouter>
  );
}
*/

export default App;
