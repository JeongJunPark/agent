import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useHistory } from "react-router-dom";
import SendAPI from "../utils/SendAPI";
import MyPage from "../MyPage";
import "../styles/common.css"

const RegisterUser = () => {

    const location = useLocation()
    const navigate = useNavigate();
    const locationState = location.state

    const [postData, setPostData] = useState({
        name: '',
        ID: '',
        userName: '',
        co: '',
        mgr: '',
        phone: '',
        auth: '',
        use: '',
    })

    // HIST 저장
    useEffect(() => {
        SendAPI("https://home-api.leadcorp.co.kr:8080/agentHistManage", { ID: sessionStorage.getItem('ID'), menu: "사용자등록", note: '', IP : sessionStorage.getItem('IP') })
            .then((returnResponse) => {
                if (returnResponse) {
                    console.log(returnResponse)
                }
            })
            .catch((error) => {
                console.log(error)
            })

    }, [])

    const [userID, setUserID] = useState("");
    const [userName, setUserName] = useState("")
    const [agentList, setAgentList] = useState()
    const [co, setCo] = useState()
    const [mgr, setMgr] = useState("")
    const [phone, setPhone] = useState("");
    const [auth, setAuth] = useState("1");
    const [use, setUse] = useState("Y")

    const registerAgentUser = () => {
        setPostData({
            ID: sessionStorage.getItem("ID"),
            userID: userID,
            userName: userName,
            co: co,
            mgr: mgr,
            phone: phone,
            auth: auth,
            use: use,
        })
    }

    useEffect(() => {
        SendAPI("https://home-api.leadcorp.co.kr:8080/agentUserCoList", { ID: sessionStorage.getItem("ID") })
            .then((returnResponse) => {
                console.log(returnResponse)
                setAgentList(returnResponse.result)
            })
            .catch((error) => {
                console.log(error)
            })

    }, [])

    useEffect(() => {
        SendAPI("https://home-api.leadcorp.co.kr:8080/submitAgentUser", postData)
            .then((returnResponse) => {
                console.log(returnResponse)
                if (returnResponse.result === 'Y') {
                    alert("등록이 완료 되었습니다.");
                    navigate("/ManageUser")
                }
            })
            .catch((error) => {
                console.log(error)
            })
        
    }, [postData])


    return (
        <>
            <MyPage />
            <div className="content_body">
                <p className="menu_title">사용자 등록</p>
                <table className="result_table" border="1">
                    <tr>
                        <td className="table_td_title">아이디</td>
                        <td className="table_td_value"><input className="searchInput" placeholder="아이디" value={userID} onChange={(e) => setUserID(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td className="table_td_title">이름</td>
                        <td className="table_td_value"><input className="searchInput" placeholder="이름" value={userName} onChange={(e) => setUserName(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td className="table_td_title">소속</td>
                        <td className="table_td_value">
                            <select className="searchInput" onChange={(e) => setCo(e.target.value)} value={co}>
                            <option value="">구분</option>
                            {agentList && agentList.map((item, index) => (
                                <option key={index} value={item.agent_co}>{item.agent_co}</option>
                            ))}
                        </select>
                        </td>
                    </tr>
                    <tr>
                        <td className="table_td_title">부서</td>
                        <td className="table_td_value"><input className="searchInput" placeholder="부서" value={mgr} onChange={(e) => setMgr(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td className="table_td_title">연락처</td>
                        <td className="table_td_value"><input className="searchInput" placeholder="연락처" value={phone} onChange={(e) => setPhone(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td className="table_td_title">권한</td>
                        <td className="table_td_value">에이전트 관리자 <input type="radio" value="1" checked={auth === '1'} onChange={(e) => setAuth(e.target.value)} />
                            에이전트 사용자 <input type="radio" value="2" checked={auth === '2'} onChange={(e) => setAuth(e.target.value)} />
                            관리자 <input type="radio" value="3" checked={auth === '3'} onChange={(e) => setAuth(e.target.value)} />
                            차입처 <input type="radio" value="4" checked={auth === '4'} onChange={(e) => setAuth(e.target.value)} />
                        </td>
                    </tr>
                    <tr>
                        <td className="table_td_title">사용 여부</td>
                        <td className="table_td_value">Y <input type="radio" value="Y" checked={use === 'Y'} onChange={(e) => setUse(e.target.value)} />
                            N <input type="radio" value="N" checked={use === 'N'} onChange={(e) => setUse(e.target.value)} />
                        </td>
                    </tr>
                </table>
                <div className="button_layout">
                    <button className="loginBtn" type="submit" onClick={registerAgentUser}>등록</button>
                    <button className="loginBtn" type="submit" onClick={() => navigate("/ManageUser")}>목록</button>
                </div>
            </div>
        </>
    )
}

export default RegisterUser