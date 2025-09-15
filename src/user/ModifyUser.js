import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useHistory } from "react-router-dom";
import SendAPI from "../utils/SendAPI";
import "../styles/common.css"
import { AiOutlineTeam } from "react-icons/ai";
import "../styles/button.css"
const ModifyUser = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const locationState = location.state;

    const userINDX = locationState.userINDX;
    // const userID = useState(locationState.id);
    
    const [userID, setUserID] = useState("");
    const [userName, setUserName] = useState("");
    const [agentList, setAgentList] = useState() // 소속 list
    const [co, setCo] = useState() // 선택한 소속 값
    const [mgr, setMgr] = useState("")
    const [phone, setPhone] = useState("");
    const [auth, setAuth] = useState("1");
    const [use, setUse] = useState("Y")

    const [managerVO, setManagerVO] = useState({});

    const [modifyData, setModifyData] = useState({
        userID: '',
        coName: '',
        coDiv: '',
        coManagerID: '',
        coPhone: '',
        coUse: ''
    })

    useEffect(() => {
        SendAPI("https://dev-home-api.leadcorp.co.kr:8080/detailAgentUser", { userINDX: userINDX })
        .then((returnResponse) => {
            // 서버에서 받아온 데이터 배열
            const user = returnResponse.detailAgentUser[0];
            
            if (!user) {
            alert("사용자 데이터를 불러오지 못했습니다.");
            return;
            }

            // 화면에 뿌릴 상태값 세팅
            setUserID(user.agent_id);
            setUserName(user.agent_nm);
            setCo(user.agent_co);
            setMgr(user.agent_dept);
            setPhone(user.agent_phn);

            // agent_auth 매핑
            switch (user.agent_auth) {
            case 'ROLE_MANAGER,ROLE_AGENT_USER':
                setAuth("1");
                break;
            case 'ROLE_MANAGER,ROLE_AGENT_ADMIN':
                setAuth("2");
                break;
            case 'ROLE_MANAGER,ROLE_ADMIN':
                setAuth("3");
                break;
            case 'ROLE_MANAGER,ROLE_BORROWER':
                setAuth("4");
                break;
            default:
                setAuth("");
            }

            setUse(user.mgr_use_yn);
        })
        .catch((error) => {
            console.error("사용자 상세 조회 에러:", error);
            alert("사용자 정보를 가져오는 중 오류가 발생했습니다.");
        });



        // 사용자 권한에 따른 업체 리스트
        SendAPI("https://dev-home-api.leadcorp.co.kr:8080/agentUserCoList", { ID: sessionStorage.getItem("ID") })
            .then((returnResponse) => {
                console.log(returnResponse)
                setAgentList(returnResponse.result)
            })
            .catch((error) => {
                console.log(error)
            })

    }, [])

    const modifyAgenUser = () => {
        const payload = {
            userINDX: userINDX,
            ID: userID,
            userID: userID,
            userName: userName,
            co: co,
            mgr: mgr,
            phone: phone,
            auth: auth,
            use: use
        };

        SendAPI("https://dev-home-api.leadcorp.co.kr:8080/modifyAgentUser", payload)
            .then((returnResponse) => {
                if (returnResponse.result === 'Y') {
                    alert("수정이 완료 되었습니다.");
                    navigate("/ManageUser")
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }



    return (
        <>
            <div className="content_body_nogrid">
                <p className="menu_title"><AiOutlineTeam/>사용자 변경</p>
                <table className="result_table">
                    <tr>
                        <th>아이디</th>
                        <td>{userID}</td>
                    </tr>
                    <tr>
                        <th>이름</th>
                        <td><input className="searchInput" placeholder="이름" value={userName} onChange={(e) => setUserName(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <th>소속</th>
                        <td><select className="searchInput" onChange={(e) => setCo(e.target.value)} value={co}>
                            <option value="">구분</option>
                            {agentList && agentList.map((item, index) => (
                                <option key={index} value={item.co_indx}>{item.agent_co}</option>
                            ))}
                        </select>
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
                        <td>에이전트 관리자 <input type="radio" value="1" checked={auth === '1'} onChange={(e) => setAuth(e.target.value)} />
                            에이전트 사용자 <input type="radio" value="2" checked={auth === '2'} onChange={(e) => setAuth(e.target.value)} />
                            관리자 <input type="radio" value="3" checked={auth === '3'} onChange={(e) => setAuth(e.target.value)} />
                            차입처 <input type="radio" value="4" checked={auth === '4'} onChange={(e) => setAuth(e.target.value)} />
                        </td>
                    </tr>
                    <tr>
                        <th>사용 여부</th>
                        <td>Y <input type="radio" value="Y" checked={use === 'Y'} onChange={(e) => setUse(e.target.value)} />
                            N <input type="radio" value="N" checked={use === 'N'} onChange={(e) => setUse(e.target.value)} />
                        </td>
                    </tr>
                </table>

                <div className="button_layout">
                    <button className="modifyBtn" type="submit" onClick={modifyAgenUser}>수정</button>
                    <button className="listBtn" type="submit" onClick={() => navigate("/ManageUser")}>목록</button>
                </div>

            </div>
        </>
    )
}

export default ModifyUser