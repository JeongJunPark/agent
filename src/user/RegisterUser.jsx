import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useHistory } from "react-router-dom";
import SendAPI from "../utils/SendAPI";
import "../styles/common.css"
import { AiOutlineTeam } from "react-icons/ai";
import "../styles/button.css"

const RegisterUser = () => {

    const location = useLocation()
    const navigate = useNavigate();
    const locationState = location.state

    const [userID, setUserID] = useState("");
    const [userName, setUserName] = useState("")
    const [agentList, setAgentList] = useState()
    const [co, setCo] = useState()
    const [mgr, setMgr] = useState("")
    const [phone, setPhone] = useState("");
    const [auth, setAuth] = useState("1");
    const [use, setUse] = useState("Y")
    const [dlgtId, setDlgtID] = useState()
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

    const [postData, setPostData] = useState({
        name: '',
        ID: '',
        userName: '',
        co: '',
        mgr: '',
        phone: '',
        auth: '',
        chg_id: '',
        use: '',
    })

    const registerAgentUser = async () => {
        try {
            const returnResponse = await SendAPI('https://home-api.leadcorp.co.kr:8080/searchAgent', { search: "" });
            const data = returnResponse.searchUserData;

            const isDuplicate = Array.isArray(data) && data.some((user) => user.agent_id === userID);
            if (isDuplicate) {
                alert("이미 존재하는 ID입니다. 다른 ID를 입력하세요.");
                return;
            }

            const payload = {         
                userID: userID,
                ID: dlgtId,
                userName: userName,                       
                co: co,                                   
                mgr: mgr,                                 
                phone: phone,       
                auth: auth,                         
                chg_id: sessionStorage.getItem("ID"),         
                use: use,                           
            };

            const submitResponse = await SendAPI("https://home-api.leadcorp.co.kr:8080/submitAgentUser", payload);
            console.log(submitResponse);

            if (submitResponse.result === "Y") {
                alert("등록이 완료되었습니다.");
                navigate("/ManageUser");
            } else {
                alert("등록에 실패했습니다. 다시 시도해주세요.");
            }
        } catch (error) {
            console.error("API Error:", error);
            alert("서버 오류가 발생했습니다.");
        }
    };


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


    return (
        <>
            <div className="content_body_nogrid">               
                <p className="menu_title"><AiOutlineTeam/> 사용자 등록</p>
                <table className="result_table" border="1">
                    <colgroup>
                        <col width="10%" />
                        <col width="90%" />
                    </colgroup>                
                    <tbody>
                    <tr>
                        <th>아이디</th>
                        <td><input className="searchInput" placeholder="아이디" value={userID} onChange={(e) => setUserID(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <th>이름</th>
                        <td><input className="searchInput" placeholder="이름" value={userName} onChange={(e) => setUserName(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <th>소속</th>
                        <td>
                            <select
                            className="searchInput"
                            onChange={(e) => {
                                const selectedOption = e.target.options[e.target.selectedIndex];
                                setCo(selectedOption.getAttribute("data-co"));
                                setDlgtID(selectedOption.getAttribute("data-dlgtid"));
                            }}
                            >
                            <option value="">구분</option>
                            {agentList && agentList.map((item, index) => (
                                <option
                                key={index}
                                value={item.agent_co}
                                data-co={item.agent_co}
                                data-dlgtid={item.agent_dlgt_id}
                                >
                                {item.agent_co}
                                </option>
                            ))}
                            </select>


                            {/* <select className="searchInput" onChange={(e) => setCo(e.target.value) setDlgtID(e.target.value) } value={co, dlgtId}>
                            <option value="">구분</option>
                            {agentList && agentList.map((item, index) => (
                                <option key={index} value={item.agent_co}>{item.agent_co}</option>
                            ))}
                        </select> */}
                        </td>
                    </tr>
                    <tr>
                        <th>부서</th>
                        <td><input className="searchInput" placeholder="부서" value={mgr} onChange={(e) => setMgr(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <th>연락처</th>
                        <td><input className="searchInput" placeholder="연락처" value={phone} onChange={(e) => setPhone(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <th>권한</th>
                        <td>
                            <label>
                                <input type="radio" value="1" checked={auth === '1'} onChange={(e) => setAuth(e.target.value)} />
                                <span>에이전트 관리자</span>
                            </label>
                            
                            <label>
                            <input type="radio" value="2" checked={auth === '2'} onChange={(e) => setAuth(e.target.value)} />
                                <span>에이전트 사용자</span>
                            </label>

                            <label>
                                <input type="radio" value="3" checked={auth === '3'} onChange={(e) => setAuth(e.target.value)} />
                                <span>관리자</span>
                            </label>

                            <label>     
                                <input type="radio" value="4" checked={auth === '4'} onChange={(e) => setAuth(e.target.value)} />
                                <span>차입처</span>
                            </label>
                        </td>
                    </tr>
                    <tr>
                        <th>사용 여부</th>
                        <td>
                            <label>
                                <input type="radio" value="Y" checked={use === 'Y'} onChange={(e) => setUse(e.target.value)} />
                                <span>Y</span>
                            </label>

                            <label>
                                <input type="radio" value="N" checked={use === 'N'} onChange={(e) => setUse(e.target.value)} />
                                <span>N</span>
                            </label>                        
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div className="button_layout">
                    <button className="searchBtn" type="submit" onClick={registerAgentUser}>등록</button>
                    <button className="listBtn" type="submit" onClick={() => navigate("/ManageUser")}>목록</button>
                </div>

            </div>
        </>
    )
}

export default RegisterUser