import React, { useState, useEffect } from "react";
import { Dropdown, Drawer, Menu, Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import SendAPI from "../utils/SendAPI";
import { useLocation, Link } from "react-router-dom";

import { AiOutlineUser, AiOutlineShop, AiOutlineTeam, AiOutlineForm, AiOutlineDollarCircle, AiOutlineSolution } from "react-icons/ai";

import "../styles/common.css"
import "../styles/header.css"
import Logo from "../images/leadcorp_img.svg"

const Header = () => {

    const [ID, setID] = useState(sessionStorage.getItem('ID'));
    const [managerVO, setManagerVO] = useState({});
    const [name, setName] = useState(''); 
    const [auth, setAuth] = useState();
    const [authList, setAuthList] = useState();

    const agentPageAuth = ["ROLE_ADMIN", "ROLE_AGENT_ADMIN", "ROLE_AGENT_USER"];
    const borrowerPageAuth = ["ROLE_ADMIN", "ROLE_BORROWER"];

    const location = useLocation();

    const isActive = (paths) => {
      // paths: 최상위 메뉴 관련 path 배열
      return paths.some(path => location.pathname.startsWith(path));
    }

    useEffect(() => {
        SendAPI("https://home-api.leadcorp.co.kr:8080/agentMenu", ID)
            .then((returnResponse) => {
                if (returnResponse) {
                    setAuth(returnResponse.auth);
                    if (!returnResponse.auth.includes("ROLE_ADMIN")) {
                        sessionStorage.setItem('auth', 0); // 관리자일 경우 0으로 session 권한 저장
                    } else {
                        sessionStorage.setItem('auth', 1); // 비관리자일 경우 1로 session 권한 저장
                    }

                }
            })
            .catch((error) => {
                console.log(error)
            })
    })

    useEffect(() => {
        if (auth !== '' && auth !== undefined) {
            setAuthList(auth.split(','));
            console.log(auth.split(','))
        }
    }, [auth])

    useEffect(() => {
        SendAPI("https://home-api.leadcorp.co.kr:8080/getManagerInfo", {
            ID: sessionStorage.getItem('ID'),
            menu: "Header",
            note: '',
            IP: sessionStorage.getItem('IP')
        })
            .then((returnResponse) => {
                if (returnResponse) {
                    console.log(returnResponse);
                    const manager = returnResponse.result[0]; 
                    setManagerVO(manager);
                    setName(manager.agent_nm);
                    sessionStorage.setItem('agent_dlgt_id', manager.agent_dlgt_id);
                    if (!sessionStorage.getItem('agent_dlgt_id')) { // 없으면
                        sessionStorage.setItem('agent_dlgt_id', manager.agent_dlgt_id);
                    }
                  }
                
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

  const [open, setOpen] = useState(false);
    
  const myPageItems = [
    { key: '1', label: <Link to="/MyPage">My Page</Link> },    
    { key: '2', label: <Link to="/PersonalInfoModify">개인정보수정</Link> }       
  ];

  const companyMenuItems = [
    { key: '1', label: <Link to="/ManageCompany">업체 관리</Link> },    
    { key: '2', label: <Link to="/RegisterCompany">업체 등록</Link> }    
  ];

  const userMenuItems = [
    { key: '1', label: <Link to="/ManageUser">사용자 계정 관리</Link> },    
    { key: '2', label: <Link to="/RegisterUser">사용자 계정 등록</Link> },        
    { key: '3', label: <Link to="/UseHistory">사용이력조회</Link> },        
  ];

  const agentMenuItems = [
    { key: '1', label: <Link to="/Agent">에이전트 신청목록</Link> }
  ];

  const borrowerMenuItems = [
    { key: "1", label: <Link to="/Borrower">가상계좌 현황조회</Link> }
  ];


  const myMenuItems = [
    { key: '1', label: <Link to="/MyPage">내 정보</Link> },    
    { key: '2', label: <Link to="/PersonalInfoModify">설정</Link> },        
    { key: '3', label: <Link to="/Logout">로그아웃</Link> },    
  ];

  return (
    <header>
      <div className="header-container">
        <div className="mypage_header" onClick={() => (window.location.href = "/MyPage")}>
        <img src={Logo} alt="logo" width={100} height={40}/>
        </div>

        {/* Desktop 메뉴 */}
        <div className="desktop-menu">
          <div className="menu-left">
          <Dropdown menu={{ items: myPageItems }} trigger={["hover", "click"]} placement="bottomLeft" overlayClassName="custom-dropdown">
            <div className={`mypage_header ${isActive(['/MyPage', '/PersonalInfoModify']) ? 'active' : ''}`}>
              <AiOutlineForm/> My Page
            </div>
          </Dropdown>

          <Dropdown menu={{ items: companyMenuItems }} trigger={["hover", "click"]} placement="bottomLeft" overlayClassName="custom-dropdown">
            <div className={`mypage_header ${isActive(['/ManageCompany', '/RegisterCompany', '/ModifyCompany']) ? 'active' : ''}`}>
              <AiOutlineShop/> 업체 관리
            </div>
          </Dropdown>

          <Dropdown menu={{ items: userMenuItems }} trigger={["hover", "click"]} placement="bottomLeft" overlayClassName="custom-dropdown">
            <div className={`mypage_header ${isActive(['/ManageUser', '/RegisterUser', '/ModifyUser', '/UseHistory']) ? 'active' : ''}`}>
              <AiOutlineTeam/> 사용자 관리
            </div>
          </Dropdown>

          {authList && authList.some((value) => agentPageAuth.includes(value)) && (
            <Dropdown menu={{ items: agentMenuItems }} trigger={["hover", "click"]} placement="bottomLeft" overlayClassName="custom-dropdown">
              <div className={`mypage_header ${isActive(['/Agent']) ? 'active' : ''}`}>
                <AiOutlineSolution/> 에이전트
              </div>
            </Dropdown>
          )}

          {authList && authList.some((value) => borrowerPageAuth.includes(value)) && (
            <Dropdown menu={{ items: borrowerMenuItems }} trigger={["hover", "click"]} placement="bottomLeft" overlayClassName="custom-dropdown">
              <div className={`mypage_header ${isActive(['/Borrower']) ? 'active' : ''}`}>
                <AiOutlineDollarCircle/> 차입처
              </div>
            </Dropdown>
          )}
        </div>

      </div>
        <div className="menu-right">
          <Dropdown menu={{ items: myMenuItems }} trigger={['click', "hover"]} placement="bottomRight" overlayClassName="custom-dropdown">
            <div className="mypage_header user-menu">{<AiOutlineUser/>} {ID} {name}</div>
          </Dropdown>          
        </div>



        {/* 모바일 햄버거 버튼 */}
        <Button
          className="mobile-menu-btn"
          type="text"
          icon={<MenuOutlined />}
          onClick={() => setOpen(true)}
        />

        {/* Drawer 메뉴 */}
        <Drawer
          title="메뉴"
          placement="right"
          onClose={() => setOpen(false)}
          open={open}
        >
          <Menu mode="inline">
            <Menu.SubMenu key="mypage" title="My Page">
              {myPageItems.map((item) => (
                <Menu.Item key={item.key}>{item.label}</Menu.Item>
              ))}
            </Menu.SubMenu>
            <Menu.SubMenu key="company" title="업체 관리">
              {companyMenuItems.map((item) => (
                <Menu.Item key={item.key}>{item.label}</Menu.Item>
              ))}
            </Menu.SubMenu>
            <Menu.SubMenu key="user" title="사용자 관리">
              {userMenuItems.map((item) => (
                <Menu.Item key={item.key}>{item.label}</Menu.Item>
              ))}
            </Menu.SubMenu>
            {authList && authList.some((value) => agentPageAuth.includes(value)) && (
              <Menu.SubMenu key="agent" title="에이전트">
                {agentMenuItems.map((item) => (
                  <Menu.Item key={item.key}>{item.label}</Menu.Item>
                ))}
              </Menu.SubMenu>
            )}
            {authList && authList.some((value) => borrowerPageAuth.includes(value)) && (
              <Menu.SubMenu key="borrower" title="차입처">
                {borrowerMenuItems.map((item) => (
                  <Menu.Item key={item.key}>{item.label}</Menu.Item>
                ))}
              </Menu.SubMenu>
            )}
              <Menu.SubMenu key="user-right" title={ID}>
                {myMenuItems.map((item) => (
                  <Menu.Item key={item.key}>{item.label}</Menu.Item>
                ))}
              </Menu.SubMenu>            
          </Menu>
        </Drawer>
      </div>
    </header>
  );
}

export default Header;