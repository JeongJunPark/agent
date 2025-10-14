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
import ModifyList from './admin/history/ModifyList';
import RegisterList from './admin/history/RegisterList';


import MyPageMng from './admin/mypage/MyPageMng';
import PersonalInfoModifyMng from './admin/mypage/PersonalInfoModifyMng';
import ManagerList from './admin/manage/ManagerList'
import ModifyManager from './admin/manage/ModifyManager'
import RegisterManager from './admin/manage/RegisterManager'


import List1 from './admin/privacy/List1';
import List2 from './admin/privacy/List2';
import List3 from './admin/privacy/List3';
import List4 from './admin/privacy/List4';
import List5 from './admin/privacy/List5';
import List6 from './admin/privacy/List6';
import List7 from './admin/privacy/List7';
import List8 from './admin/privacy/List8';
import List9 from './admin/privacy/List9';
import List10 from './admin/privacy/List10';
import List11 from './admin/privacy/List11';
import List12 from './admin/privacy/List12';
import List13 from './admin/privacy/List13';


function App() {
  const listComponents = [
    List1, List2, List3, List4, List5, List6, List7, List8, List9, List10, List11, List12, List13
  ];

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
          path="/ModifyList"
          element={
            <RouteGuard>
              <ModifyList />
            </RouteGuard>
          }
        />		            

        <Route
          path="/RegisterList"
          element={
            <RouteGuard>
              <RegisterList />
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
        <Route
          path="/PersonalInfoModifyMng"
          element={
            <RouteGuard>
              <PersonalInfoModifyMng />
            </RouteGuard>
          }
        />		     

        <Route
          path="/ManagerList"
          element={
            <RouteGuard>
              <ManagerList />
            </RouteGuard>
          }
        />		     

        <Route
          path="/ModifyManager"
          element={
            <RouteGuard>
              <ModifyManager />
            </RouteGuard>
          }
        />		     

        <Route
          path="/RegisterManager"
          element={
            <RouteGuard>
              <RegisterManager />
            </RouteGuard>
          }
        />		     

      {listComponents.map((Comp, index) => (
        <Route
          key={index}
          path={`/List${index + 1}`}
          element={
            <RouteGuard>
              <Comp />
            </RouteGuard>
          }
        />
      ))}
        
        
      </Route>

    </Routes>
  );
}

export default App;
