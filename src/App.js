import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './Login';
import Borrower from './Borrower';
import Agent from './Agent'
import MyPage from "./MyPage"

import ManageCompany from "./company/ManageCompany"
import RegisterCompany from "./company/RegisterCompany"
import ModifyCompany from "./company/ModifyCompany"
import CompanyIP from "./company/CompanyIP"
import CompanyMoAccount from "./company/CompanyMoAccount"

import ManageUser from "./user/ManageUser"
import RegisterUser from "./user/RegisterUser"
import ModifyUser from "./user/ModifyUser"


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/MyPage" element={<MyPage />} />
        <Route path="/Borrower" element={<Borrower />} />
        <Route path="/Agent" element={<Agent />} />
        <Route path="/ManageCompany" element={<ManageCompany />} />
        <Route path="/RegisterCompany" element={<RegisterCompany />} />
        <Route path="/ModifyCompany" element={<ModifyCompany />} />
        <Route path="/CompanyIP" element={<CompanyIP />} />
        <Route path="/CompanyMoAccount" element={<CompanyMoAccount />} />

        <Route path="/ManageUser" element={<ManageUser />} />
        <Route path="/RegisterUser" element={<RegisterUser />} />
        <Route path="/ModifyUser" element={<ModifyUser />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
