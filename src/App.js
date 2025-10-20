import { useLocation, Routes, Route } from 'react-router-dom';

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
import ReadPrivacy from './admin/privacy/ReadPrivacy';
import ModifyPrivacy from './admin/privacy/ModifyPrivacy';
import RegisterPrivacy from './admin/privacy/RegisterPrivacy';


function App() {
  let managerYN = "";
  if(sessionStorage.getItem("managerYN")==="manager"){
    managerYN = true; 
  } else if(sessionStorage.getItem("managerYN")==="agent") {
    managerYN = false;
  }

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
      {/* login */}
      <Route path="/" element={<Login />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Logout" element={<Logout />} />
      <Route path="/LogoutMng" element={<LogoutMng />} />
      
      
      {/* agent */}
      {/* {managerYN===false ? */}
      <Route element={<MainLayout />}>
        <Route
          path="/MyPage"
          element={
            <RouteGuard allowedFor="user">
              <MyPage />
            </RouteGuard>
          }
        />    

        <Route
          path="/PersonalInfoModify"
          element={
            <RouteGuard >
              <PersonalInfoModify />
            </RouteGuard>
          }
        />

        <Route
          path="/Borrower"
          element={
            <RouteGuard allowedFor="user">
              <Borrower />
            </RouteGuard>
          }
        />
        <Route
          path="/Agent"
          element={
            <RouteGuard allowedFor="user">
              <Agent />
            </RouteGuard>
          }
        />
        <Route
          path="/ManageCompany"
          element={
            <RouteGuard allowedFor="user">
              <ManageCompany />
            </RouteGuard>
          }
        />
        <Route
          path="/RegisterCompany"
          element={
            <RouteGuard allowedFor="user">
              <RegisterCompany />
            </RouteGuard>
          }
        />
        <Route
          path="/ModifyCompany"
          element={
            <RouteGuard allowedFor="user">
              <ModifyCompany />
            </RouteGuard>
          }
        />

        <Route
          path="/CompanyIP"
          element={
            <RouteGuard allowedFor="user">
              <CompanyIP />
            </RouteGuard>
          }
        />

        <Route
          path="/CompanyMoAccount"
          element={
            <RouteGuard allowedFor="user">
              <CompanyMoAccount />
            </RouteGuard>
          }
        />		
		
        <Route
          path="/ManageUser"
          element={
            <RouteGuard allowedFor="user">
              <ManageUser />
            </RouteGuard>
          }
        />		

        <Route
          path="/ModifyUser"
          element={
            <RouteGuard allowedFor="user">
              <ModifyUser />
            </RouteGuard>
          }
        />		

        <Route
          path="/RegisterUser"
          element={
            <RouteGuard allowedFor="user">
              <RegisterUser />
            </RouteGuard>
          }
        />		

        <Route
          path="/UseHistory"
          element={
            <RouteGuard allowedFor="user">
              <UseHistory />
            </RouteGuard>
          }
        />		

        <Route
          path="/List"
          element={
            <RouteGuard allowedFor="manager">
              <List />
            </RouteGuard>
          }
        />		       

        <Route
          path="/ModifyList"
          element={
            <RouteGuard allowedFor="manager">
              <ModifyList />
            </RouteGuard>
          }
        />		            

        <Route
          path="/RegisterList"
          element={
            <RouteGuard allowedFor="manager">
              <RegisterList />
            </RouteGuard>
          }
        />

        <Route
          path="/MyPageMng"
          element={
            <RouteGuard allowedFor="manager">
              <MyPageMng />
            </RouteGuard>
          }
        />		        
        <Route
          path="/PersonalInfoModifyMng"
          element={
            <RouteGuard allowedFor="manager">
              <PersonalInfoModifyMng />
            </RouteGuard>
          }
        />		     

        <Route
          path="/ManagerList"
          element={
            <RouteGuard allowedFor="manager">
              <ManagerList />
            </RouteGuard>
          }
        />		     

        <Route
          path="/ModifyManager"
          element={
            <RouteGuard allowedFor="manager">
              <ModifyManager />
            </RouteGuard>
          }
        />		     

        <Route
          path="/RegisterManager"
          element={
            <RouteGuard allowedFor="manager">
              <RegisterManager />
            </RouteGuard>
          }
        />		     

        <Route
          path="/List/:pageId"
          element={
            <RouteGuard allowedFor="manager">
              <PrivacyList menuItems={adminPrivacyMenuItems} />
            </RouteGuard>
          }
        />   

        <Route
          path="/ReadPrivacy/:indx/:bbs"
          element={
            <RouteGuard allowedFor="manager">
              <ReadPrivacy menuItems={adminPrivacyMenuItems} />
            </RouteGuard>
          }
        />          

       <Route
          path="/ModifyPrivacy/:indx/:bbs"
          element={
            <RouteGuard allowedFor="manager">
              <ModifyPrivacy menuItems={adminPrivacyMenuItems} />
            </RouteGuard>
          }
        />          
      
       <Route
          path="/RegisterPrivacy/:bbs"
          element={
            <RouteGuard allowedFor="manager">
              <RegisterPrivacy menuItems={adminPrivacyMenuItems} />
            </RouteGuard>
          }
        />     

      </Route> 

    </Routes>
  );
}

export default App;
