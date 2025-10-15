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


import PrivacyList from './admin/privacy/PrivacyList';


function App() {


  const adminPrivacyMenuItems = [
    { key: "1",  label: "개인정보처리방침" },
    { key: "2",  label: "개인정보취급방침" },
    { key: "9",  label: "신용정보활용체제" },
    { key: "3",  label: "제3자 제공현황" },
    { key: "4",  label: "내부정보관리규정" },
    { key: "5",  label: "법적고지" },
    { key: "6",  label: "약관조회" },
    { key: "7",  label: "유의사항" },
    { key: "8",  label: "이메일무단수집거부" },
    { key: "10", label: "채권추심업무처리절차" },
    { key: "11", label: "불법채권추심대응요령" },
    { key: "12", label: "소멸시효완성채권추심관련유의사항" },
    { key: "13", label: "대출계약철회권안내" }
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

        <Route
          path="/List/:pageId"
          element={
            <RouteGuard>
              <PrivacyList menuItems={adminPrivacyMenuItems} />
            </RouteGuard>
          }
        />
        
      </Route>

    </Routes>
  );
}

export default App;
