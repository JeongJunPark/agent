import React, { useState, useEffect } from "react";
import { Dropdown, Drawer, Menu, Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import SendAPI from "../utils/SendAPI";

import "../styles/common.css"
import "../styles/header.css"

const Header = () => {

    const [ID, setID] = useState(sessionStorage.getItem('ID'));
    const [auth, setAuth] = useState();
    const [authList, setAuthList] = useState();

    const agentPageAuth = ["ROLE_ADMIN", "ROLE_AGENT_ADMIN", "ROLE_AGENT_USER"];
    const borrowerPageAuth = ["ROLE_ADMIN", "ROLE_BORROWER"];

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

    const [open, setOpen] = useState(false);
    
  const myPageItems = [
    { key: "1", label: <a href="/MyPage">My Page</a> },
    { key: "2", label: <a href="/PersonalInfoModify">개인정보수정</a> }
  ];

  const companyMenuItems = [
    { key: "1", label: <a href="/ManageCompany">업체 관리</a> },
    { key: "2", label: <a href="/RegisterCompany">업체 등록</a> }
  ];

  const userMenuItems = [
    { key: "1", label: <a href="/ManageUser">사용자 계정 관리</a> },
    { key: "2", label: <a href="/RegisterUser">사용자 계정 등록</a> },
    { key: "3", label: <a href="/UseHistory">사용이력조회</a> }
  ];

  const agentMenuItems = [{ key: "1", label: <a href="/Agent">에이전트 신청목록</a> }];
  const borrowerMenuItems = [{ key: "1", label: <a href="/Borrower">가상계좌 현황조회</a> }];

  return (
    <header>
      <div className="header-container">
        <div className="mypage_header" onClick={() => (window.location.href = "/MyPage")}>
          LEADCORP
        </div>

        {/* Desktop 메뉴 */}
        <div className="desktop-menu">
          <Dropdown menu={{ items: myPageItems }} trigger={["click"]} placement="bottomLeft">
            <div className="mypage_header">My Page</div>
          </Dropdown>

          <Dropdown menu={{ items: companyMenuItems }} trigger={["click"]} placement="bottomLeft">
            <div className="mypage_header">업체 관리</div>
          </Dropdown>

          <Dropdown menu={{ items: userMenuItems }} trigger={["click"]} placement="bottomLeft">
            <div className="mypage_header">사용자 관리</div>
          </Dropdown>

          {authList && authList.some((value) => agentPageAuth.includes(value)) && (
            <Dropdown menu={{ items: agentMenuItems }} trigger={["click"]} placement="bottomLeft">
              <div className="mypage_header">에이전트</div>
            </Dropdown>
          )}

          {authList && authList.some((value) => borrowerPageAuth.includes(value)) && (
            <Dropdown menu={{ items: borrowerMenuItems }} trigger={["click"]} placement="bottomLeft">
              <div className="mypage_header">차입처</div>
            </Dropdown>
          )}
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
          </Menu>
        </Drawer>
      </div>
    </header>
  );
}

export default Header;