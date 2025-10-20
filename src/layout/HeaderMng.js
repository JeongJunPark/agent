import React, { useState, useEffect } from "react";
import { Dropdown, Drawer, Menu, Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import SendAPI from "../utils/SendAPI";
import { useLocation, Link } from "react-router-dom";

import { AiOutlineUser, AiOutlineShop, AiOutlineTeam, AiOutlineForm, AiOutlineDollarCircle, AiOutlineSolution, AiTwotoneContainer, AiFillSetting } from "react-icons/ai";

import "../styles/common.css"
import "../styles/header.css"
import Logo from "../images/leadcorp_img.svg"

const HeaderMng = () => {

    const [ID, setID] = useState(sessionStorage.getItem('ID'));
    const [managerVO, setManagerVO] = useState({});
    const [name, setName] = useState(''); 

    const location = useLocation();

    const isActive = (paths) => 
      paths.some(path => location.pathname === path);



      useEffect(() => {
              SendAPI("https://home-api.leadcorp.co.kr:8080/getManagerInfoMng", {
                  ID: sessionStorage.getItem('ID'),
                  menu: "Header",
                  note: '',
                  IP: sessionStorage.getItem('IP')
              })
                  .then((returnResponse) => {
                      if (returnResponse) {
                        console.log('222');
                          console.log(returnResponse);
                          const manager = returnResponse.result[0]; 
                          setManagerVO(manager);
                          sessionStorage.setItem('userName', returnResponse.result[0].mgr_nm)
                          setName(manager.mgr_nm);
                          console.log('name: ', name)
                        }
                      
                  })
                  .catch((error) => {
                      console.log(error);
                  });
        }, []);

  const [open, setOpen] = useState(false);
  const adminSettingMenuItems = [
    { key: "1", label: <Link to="/ManagerList">관리자계정 관리</Link> }
  ];    

  const adminPrivacyMenuItems = [
    { key: "1", label: <Link to="/List/1">개인정보처리방침</Link> },
    { key: "2", label: <Link to="/List/2">개인정보취급방침</Link> },
    { key: "9", label: <Link to="/List/9">신용정보활용체제</Link> },
    { key: "3", label: <Link to="/List/3">제3자 제공현황</Link> },
    { key: "4", label: <Link to="/List/4">내부정보관리규정</Link> },
    { key: "5", label: <Link to="/List/5">법적고지</Link> },
    { key: "6", label: <Link to="/List/6">약관조회</Link> },
    { key: "7", label: <Link to="/List/7">유의사항</Link> },
    { key: "8", label: <Link to="/List/8">이메일무단수집거부</Link> },
    { key: "10", label: <Link to="/List/10">채권추심업무처리절차</Link> },
    { key: "11", label: <Link to="/List/11">불법채권추심대응요령</Link> },
    { key: "12", label: <Link to="/List/12">소멸시효완성채권추심관련유의사항</Link> },
    { key: "13", label: <Link to="/List/13">대출계약철회권안내</Link> }
  ];  

  const adminCompanyMenuItems = [
    { key: "1", label: <Link to="/List">연혁관리</Link> }
  ];  

  const myMenuItemsMng = [
    { key: '1', label: <Link to="/MyPageMng">내 정보</Link> },    
    { key: '2', label: <Link to="/PersonalInfoModifyMng">설정</Link> },        
    { key: '3', label: <Link to="/LogoutMng">로그아웃</Link> },    
  ];


  return (
    <header>
      <div className="header-container">
        <div className="mypage_header" onClick={() => (window.location.href = "/MyPageMng")}>
        <img src={Logo} alt="logo" width={100} height={40}/>
        </div>
            <div className="desktop-menu">
              <div className="menu-left">
                <Dropdown
                  menu={{ items: adminSettingMenuItems }}
                  trigger={["click"]}
                  placement="bottomLeft"
                  overlayClassName="custom-dropdown"
                >
                  <div className={`mypage_header ${isActive(["/ManagerList"]) ? "active" : ""}`}>
                    <AiFillSetting /> 관리자계정 관리
                  </div>
                </Dropdown>

              <Dropdown menu={{ items: adminPrivacyMenuItems }} 
                trigger={["click"]} 
                placement="bottomLeft" 
                overlayClassName="custom-dropdown"
              >
              <div
                className={`mypage_header ${
                  isActive(Array.from({ length: 13 }, (_, i) => `/List/${i + 1}`)) ? 'active' : ''
                }`}
              >
                <AiOutlineForm /> 약관 / 정책
              </div>
              </Dropdown>

                <Dropdown
                  menu={{ items: adminCompanyMenuItems }}
                  trigger={["click"]}
                  placement="bottomLeft"
                  overlayClassName="custom-dropdown"
                >
                  <div className={`mypage_header ${isActive(["/List"]) ? "active" : ""}`}>
                    <AiOutlineShop /> 회사
                  </div>
                </Dropdown>

              </div>
              </div>

            <div className="menu-right">
              <Dropdown menu={{ items: myMenuItemsMng }} trigger={['click']} placement="bottomRight" overlayClassName="custom-dropdown">
                <div className="mypage_header user-menu">{<AiOutlineUser/>} {ID} {sessionStorage.getItem('userName')}</div>
              </Dropdown>          
            </div>
            
            <Button
              className="mobile-menu-btn"
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setOpen(true)}
            />

            <Drawer
              title="메뉴"
              placement="right"
              onClose={() => setOpen(false)}
              open={open}
            >
            <Menu
                mode="inline"
                items={[
                {
                    key: 'manage',
                    label: '관리자계정 관리',
                    children: adminSettingMenuItems,
                },
                {
                    key: 'privacy',
                    label: '약관 / 정책',
                    children: adminPrivacyMenuItems,
                },                
                {
                    key: 'company',
                    label: '회사',
                    children: adminCompanyMenuItems,
                },                
                {
                    key: 'user-right',
                    label: `${ID} ${name}`,
                    children: myMenuItemsMng,
                },
                ]}
            />          
              </Drawer>         
         
      </div>
    </header>
  );
}

export default HeaderMng;