import React, { useState, useEffect } from "react";
import { Dropdown, Drawer, Menu, Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import SendAPI from "../utils/SendAPI";
import { useLocation, Link } from "react-router-dom";

import { AiOutlineUser, AiOutlineShop, AiOutlineTeam, AiOutlineForm, AiOutlineDollarCircle, AiOutlineSolution, AiTwotoneContainer, AiFillSetting } from "react-icons/ai";

import "../styles/common.css"
import "../styles/header.css"
import Logo from "../images/leadcorp_img.svg"

const Header = () => {

    const [ID, setID] = useState(sessionStorage.getItem('ID'));
    const [managerVO, setManagerVO] = useState({});
    const [name, setName] = useState(''); 
    const [auth, setAuth] = useState();
    const [authList, setAuthList] = useState([]);

    // const allAuth = ["ROLE_ADMIN", "ROLE_AGENT_ADMIN", "ROLE_AGENT_USER", "ROLE_BORROWER"];
    // const agentPageAuth = ["ROLE_ADMIN", "ROLE_AGENT_ADMIN", "ROLE_AGENT_USER"];
    // const borrowerPageAuth = "ROLE_BORROWER";

    const location = useLocation();

    const isActive = (paths) => {
      // paths: 최상위 메뉴 관련 path 배열
      return paths.some(path => location.pathname.startsWith(path));
    }

    useEffect(() => {
      if (sessionStorage.getItem("managerYN") === "manager") return
      else { 
        SendAPI("https://home-api.leadcorp.co.kr:8080/agentMenu", ID)
          .then((returnResponse) => {
            if (returnResponse?.auth) {
              setAuth(returnResponse.auth);
              setAuthList(returnResponse.auth.split(','));
              sessionStorage.setItem(
                'auth',
                returnResponse.auth.includes("ROLE_ADMIN") ? 1 : 0
              );
            }
          })
          .catch(console.log);
      }
    }, [ID]);

        useEffect(() => {
      if (sessionStorage.getItem("managerYN") === "manager") return
        else {           
              if (auth !== '' && auth !== undefined) {
                  setAuthList(auth.split(','));
                  console.log(auth.split(','));
                  console.log("auth: ", auth)
              }
        }
      }, [auth])

        
      
      useEffect(() => {
            if (sessionStorage.getItem("managerYN") === "manager") return
            else { 
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
              }
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

  const adminSettingMenuItems = [
    { key: "1", label: <Link to="/ManagerList">연혁관리</Link> }
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

        {sessionStorage.getItem("managerYN") === "manager" ? (
          <>
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
          </>
        ) 
           : (
            <>
            <div className="desktop-menu">
              <div className="menu-left">            
            {authList.some(role => ["ROLE_ADMIN"].includes(role)) && (
              <>
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

              <Dropdown menu={{ items: agentMenuItems }} trigger={["hover", "click"]} placement="bottomLeft" overlayClassName="custom-dropdown">
                <div className={`mypage_header ${isActive(['/Agent']) ? 'active' : ''}`}>
                  <AiOutlineSolution/> 에이전트
                </div>
              </Dropdown>

              <Dropdown menu={{ items: borrowerMenuItems }} trigger={["hover", "click"]} placement="bottomLeft" overlayClassName="custom-dropdown">
                <div className={`mypage_header ${isActive(['/Borrower']) ? 'active' : ''}`}>
                  <AiOutlineDollarCircle/> 차입처
                </div>
              </Dropdown>
            </>
            )}

            {authList.some(role => ["ROLE_AGENT_ADMIN"].includes(role)) && (
              <>
              <Dropdown menu={{ items: myPageItems }} trigger={["hover", "click"]} placement="bottomLeft" overlayClassName="custom-dropdown">
                <div className={`mypage_header ${isActive(['/MyPage', '/PersonalInfoModify']) ? 'active' : ''}`}>
                  <AiOutlineForm/> My Page
                </div>
              </Dropdown>

              <Dropdown menu={{ items: userMenuItems }} trigger={["hover", "click"]} placement="bottomLeft" overlayClassName="custom-dropdown">
                <div className={`mypage_header ${isActive(['/ManageUser', '/RegisterUser', '/ModifyUser', '/UseHistory']) ? 'active' : ''}`}>
                  <AiOutlineTeam/> 사용자 관리
                </div>
              </Dropdown>

              <Dropdown menu={{ items: agentMenuItems }} trigger={["hover", "click"]} placement="bottomLeft" overlayClassName="custom-dropdown">
                <div className={`mypage_header ${isActive(['/Agent']) ? 'active' : ''}`}>
                  <AiOutlineSolution/> 에이전트
                </div>
              </Dropdown>
            </>
            )}  

            {authList.some(role => ["ROLE_AGENT_USER"].includes(role)) && (
              <>
              <Dropdown menu={{ items: myPageItems }} trigger={["hover", "click"]} placement="bottomLeft" overlayClassName="custom-dropdown">
                <div className={`mypage_header ${isActive(['/MyPage', '/PersonalInfoModify']) ? 'active' : ''}`}>
                  <AiOutlineForm/> My Page
                </div>
              </Dropdown>

              <Dropdown menu={{ items: agentMenuItems }} trigger={["hover", "click"]} placement="bottomLeft" overlayClassName="custom-dropdown">
                <div className={`mypage_header ${isActive(['/Agent']) ? 'active' : ''}`}>
                  <AiOutlineSolution/> 에이전트
                </div>
              </Dropdown>
            </>
            )}  

            {authList.some(role => ["ROLE_BORROWER"].includes(role)) && (
              <>
              <Dropdown menu={{ items: myPageItems }} trigger={["hover", "click"]} placement="bottomLeft" overlayClassName="custom-dropdown">
                <div className={`mypage_header ${isActive(['/MyPage', '/PersonalInfoModify']) ? 'active' : ''}`}>
                  <AiOutlineForm/> My Page
                </div>
              </Dropdown>

              <Dropdown menu={{ items: borrowerMenuItems }} trigger={["hover", "click"]} placement="bottomLeft" overlayClassName="custom-dropdown">
                <div className={`mypage_header ${isActive(['/Borrower']) ? 'active' : ''}`}>
                  <AiOutlineDollarCircle/> 차입처
                </div>
              </Dropdown>
            </>
            )}

        </div>
            </div>
         </>
         )}      

        {sessionStorage.getItem("managerYN") === "manager" ? (
          <>
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
              <Menu mode="inline">
                <Menu.SubMenu key="user" title="회사">
                  {adminCompanyMenuItems.map((item) => (
                    <Menu.Item key={item.key}>{item.label}</Menu.Item>
                  ))}
                </Menu.SubMenu>
                  <Menu.SubMenu key="user-right" title={ID}>
                    {myMenuItemsMng.map((item) => (
                      <Menu.Item key={item.key}>{item.label}</Menu.Item>
                    ))}
                  </Menu.SubMenu>            
              </Menu>              
              </Drawer>         
          </>  
        ) : (
            <>
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

            {authList.some(role => ["ROLE_ADMIN"].includes(role)) && (          
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
                  <Menu.SubMenu key="agent" title="에이전트">
                    {agentMenuItems.map((item) => (
                      <Menu.Item key={item.key}>{item.label}</Menu.Item>
                    ))}
                  </Menu.SubMenu>

                  <Menu.SubMenu key="borrower" title="차입처">
                    {borrowerMenuItems.map((item) => (
                      <Menu.Item key={item.key}>{item.label}</Menu.Item>
                    ))}
                  </Menu.SubMenu>

                  <Menu.SubMenu key="user-right" title={ID}>
                    {myMenuItems.map((item) => (
                      <Menu.Item key={item.key}>{item.label}</Menu.Item>
                    ))}
                  </Menu.SubMenu>            
              </Menu>
              )}

                {authList.some(role => ["ROLE_AGENT_ADMIN"].includes(role)) && (    
              <Menu mode="inline">
                <Menu.SubMenu key="mypage" title="My Page">
                  {myPageItems.map((item) => (
                    <Menu.Item key={item.key}>{item.label}</Menu.Item>
                  ))}
                </Menu.SubMenu>

                <Menu.SubMenu key="user" title="사용자 관리">
                  {userMenuItems.map((item) => (
                    <Menu.Item key={item.key}>{item.label}</Menu.Item>
                  ))}
                </Menu.SubMenu>
                  <Menu.SubMenu key="agent" title="에이전트">
                    {agentMenuItems.map((item) => (
                      <Menu.Item key={item.key}>{item.label}</Menu.Item>
                    ))}
                  </Menu.SubMenu>

                  <Menu.SubMenu key="user-right" title={ID}>
                    {myMenuItems.map((item) => (
                      <Menu.Item key={item.key}>{item.label}</Menu.Item>
                    ))}
                  </Menu.SubMenu>            
              </Menu>       
                )}

              {authList.some(role => ["ROLE_AGENT_USER"].includes(role)) && (    
              <Menu mode="inline">
                <Menu.SubMenu key="mypage" title="My Page">
                  {myPageItems.map((item) => (
                    <Menu.Item key={item.key}>{item.label}</Menu.Item>
                  ))}
                </Menu.SubMenu>
                  <Menu.SubMenu key="agent" title="에이전트">
                    {agentMenuItems.map((item) => (
                      <Menu.Item key={item.key}>{item.label}</Menu.Item>
                    ))}
                  </Menu.SubMenu>

                  <Menu.SubMenu key="user-right" title={ID}>
                    {myMenuItems.map((item) => (
                      <Menu.Item key={item.key}>{item.label}</Menu.Item>
                    ))}
                  </Menu.SubMenu>            
              </Menu>       
                )}

                {authList.some(role => ["ROLE_BORROWER"].includes(role)) && (    
              <Menu mode="inline">
                <Menu.SubMenu key="mypage" title="My Page">
                  {myPageItems.map((item) => (
                    <Menu.Item key={item.key}>{item.label}</Menu.Item>
                  ))}
                </Menu.SubMenu>

                  <Menu.SubMenu key="borrower" title="차입처">
                    {borrowerMenuItems.map((item) => (
                      <Menu.Item key={item.key}>{item.label}</Menu.Item>
                    ))}
                  </Menu.SubMenu>

                  <Menu.SubMenu key="user-right" title={ID}>
                    {myMenuItems.map((item) => (
                      <Menu.Item key={item.key}>{item.label}</Menu.Item>
                    ))}
                  </Menu.SubMenu>            
              </Menu>       
                )}
            </Drawer>
            </>      
        )}
      </div>
    </header>
  );
}

export default Header;