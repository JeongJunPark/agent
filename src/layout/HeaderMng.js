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

    const isActive = (paths) => {
      return paths.some(path => location.pathname.startsWith(path));
    }

    console.log('ff ', sessionStorage)

      useEffect(() => {
              SendAPI("https://dev-home-api.leadcorp.co.kr:8080/getManagerInfoMng", {
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
    { key: "1", label: <Link to="/List1">개인정보처리방침</Link> },
    { key: "2", label: <Link to="/List2">개인정보취급방침</Link> },
    { key: "3", label: <Link to="/List3">개인정보처리방침</Link> },
    { key: "4", label: <Link to="/List4">개인정보처리방침</Link> },
    { key: "5", label: <Link to="/List5">개인정보처리방침</Link> },
    { key: "6", label: <Link to="/List6">개인정보처리방침</Link> },
    { key: "7", label: <Link to="/List7">개인정보처리방침</Link> },
    { key: "8", label: <Link to="/List8">개인정보처리방침</Link> },
    { key: "9", label: <Link to="/List9">개인정보처리방침</Link> },
    { key: "10", label: <Link to="/List10">개인정보처리방침</Link> },
    { key: "11", label: <Link to="/List11">개인정보처리방침</Link> },
    { key: "12", label: <Link to="/List12">개인정보처리방침</Link> },
    { key: "13", label: <Link to="/List13">개인정보처리방침</Link> }
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
                  trigger={["hover", "click"]}
                  placement="bottomLeft"
                  overlayClassName="custom-dropdown"
                >
                  <div className={`mypage_header ${isActive(["/ManagerList"]) ? "active" : ""}`}>
                    <AiFillSetting /> 관리자계정 관리
                  </div>
                </Dropdown>

                <Dropdown
                  menu={{ items: adminCompanyMenuItems }}
                  trigger={["hover", "click"]}
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
              <Dropdown menu={{ items: myMenuItemsMng }} trigger={['click', "hover"]} placement="bottomRight" overlayClassName="custom-dropdown">
                <div className="mypage_header user-menu">{<AiOutlineUser/>} {ID} {name}</div>
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
                    key: 'company',
                    label: '회사',
                    children: adminCompanyMenuItems, // ✅ 이게 기존 Menu.Item 배열
                },
                {
                    key: 'user-right',
                    label: `${ID} ${name}`,
                    children: myMenuItemsMng, // ✅ 이게 기존 myMenuItemsMng 배열
                },
                ]}
            />          
              </Drawer>         
         
      </div>
    </header>
  );
}

export default HeaderMng;