import { BrowserRouter, Routes, Route } from 'react-router-dom';

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


import MainLayout from './layout/MainLayout'

import Login from './login/Login';
import RouteGuard from './login/RouteGuard';
import Logout from './login/Logout';
import LogoutMng from './login/LogoutMng';

import List from './admin/history/List';
import MyPageMng from './admin/mypage/MyPageMng';


function App() {
  return (
    <Routes>
      {/* 로그인 페이지 */}
      <Route path="/" element={<Login />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Logout" element={<Logout />} />
      <Route path="/LogoutMng" element={<LogoutMng />} />
      {/* 메인 레이아웃 안에서 페이지 렌더링 */}
      <Route element={<MainLayout />}>
        <Route
          path="/MyPage"
          element={
            <RouteGuard>
              <MyPage />
            </RouteGuard>
          }
        />

        <Route
          path="/PersonalInfoModify"
          element={
            <RouteGuard>
              <PersonalInfoModify />
            </RouteGuard>
          }
        />

        <Route
          path="/Borrower"
          element={
            <RouteGuard>
              <Borrower />
            </RouteGuard>
          }
        />
        <Route
          path="/Agent"
          element={
            <RouteGuard>
              <Agent />
            </RouteGuard>
          }
        />
        <Route
          path="/ManageCompany"
          element={
            <RouteGuard>
              <ManageCompany />
            </RouteGuard>
          }
        />
        <Route
          path="/RegisterCompany"
          element={
            <RouteGuard>
              <RegisterCompany />
            </RouteGuard>
          }
        />
        <Route
          path="/ModifyCompany"
          element={
            <RouteGuard>
              <ModifyCompany />
            </RouteGuard>
          }
        />

        <Route
          path="/CompanyIP"
          element={
            <RouteGuard>
              <CompanyIP />
            </RouteGuard>
          }
        />

        <Route
          path="/CompanyMoAccount"
          element={
            <RouteGuard>
              <CompanyMoAccount />
            </RouteGuard>
          }
        />		
		
        <Route
          path="/ManageUser"
          element={
            <RouteGuard>
              <ManageUser />
            </RouteGuard>
          }
        />		

        <Route
          path="/ModifyUser"
          element={
            <RouteGuard>
              <ModifyUser />
            </RouteGuard>
          }
        />		

        <Route
          path="/RegisterUser"
          element={
            <RouteGuard>
              <RegisterUser />
            </RouteGuard>
          }
        />		

        <Route
          path="/UseHistory"
          element={
            <RouteGuard>
              <UseHistory />
            </RouteGuard>
          }
        />		

        <Route
          path="/List"
          element={
            <RouteGuard>
              <List />
            </RouteGuard>
          }
        />		        

        <Route
          path="/MyPageMng"
          element={
            <RouteGuard>
              <MyPageMng />
            </RouteGuard>
          }
        />		        
      </Route>

    </Routes>
  );
}

export default App;
