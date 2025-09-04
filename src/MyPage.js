import { useEffect, useState, useRef } from "react";
import SendAPI from "./utils/SendAPI";
import "./styles/common.css"

const MyPage = () => {

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


    const [companyOpen, setCompanyOpen] = useState(false)
    const [userOpen, setUserOpen] = useState(false)

    return (
        <>
            <div className="mypage_layout">
                <div className="sub_mypage_layout mypage_header" onClick={() => setCompanyOpen(!companyOpen)}>업체 관리
                {
                    companyOpen && (
                        <>
                            <div className="mypage_sub_header" onClick={() => window.location.href = "/ManageCompany"}>업체 관리</div>
                            <div className="mypage_sub_header" onClick={() => window.location.href = "/RegisterCompany"}>업체 등록</div>
                        </>
                    )
                }
                </div>
                <div className="sub_mypage_layout mypage_header" style={{ width : "180px" }}onClick={() => setUserOpen(!userOpen)}>사용자 관리
                {
                    userOpen && (
                        <>
                            <div className="mypage_sub_header" onClick={() => window.location.href = "/ManageUser"}>사용자 계정 관리</div>
                            <div className="mypage_sub_header" onClick={() => window.location.href = "/RegisterUser"}>사용자 계정 등록</div>
                        </>
                    )
                }
                </div>
                {
                    authList && authList.some(value => agentPageAuth.includes(value)) && <div className="sub_mypage_layout mypage_header" onClick={() => window.location.href = "/Agent"}>에이전트</div>
                }
                {
                    authList && authList.some(value => borrowerPageAuth.includes(value)) && <div className="sub_mypage_layout mypage_header" onClick={() => window.location.href = "/Borrower"}>차입처</div>
                }
            </div>
        </>
    )
}

export default MyPage