import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useHistory } from "react-router-dom";
import SendAPI from "../utils/SendAPI";
import "../styles/common.css"

const ModifyUser = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const locationState = location.state;
    const {userINDX} = locationState.userINDX;
    const [userID, setUserID] = useState('');
    const [userName, setUserName] = useState("");
    const [agentList, setAgentList] = useState() // 소속 list
    const [co, setCo] = useState() // 선택한 소속 값
    const [mgr, setMgr] = useState("")
    const [phone, setPhone] = useState("");
    const [auth, setAuth] = useState("1");
    const [use, setUse] = useState("Y")

    const [modifyData, setModifyData] = useState({
        userID: '',
        coName: '',
        coDiv: '',
        coManagerID: '',
        coPhone: '',
        coUse: ''
    })

    useEffect(() => {

        // 사용자 세부정보
        // SendAPI("https://dev-home-api.leadcorp.co.kr:8080/detailAgentUser", { userINDX: locationState.userINDX })
        //     .then((returnResponse) => {
        //         if (returnResponse) {
        //             console.log("returnResponse ----> : ", returnResponse)
        //             setUserID(returnResponse.detailAgentUser[0].agent_id)
        //             setUserName(returnResponse.detailAgentUser[0].agent_nm)
        //             setCo(returnResponse.detailAgentUser[0].agent_co)
        //             setMgr(returnResponse.detailAgentUser[0].agent_dept)
        //             setPhone(returnResponse.detailAgentUser[0].agent_phn)
        //             if (returnResponse.detailAgentUser[0].agent_auth === 'ROLE_MANAGER,ROLE_AGENT_USER"') {
        //                 setAuth("2")
        //             }

        //             if (returnResponse.detailAgentUser[0].agent_auth === 'ROLE_MANAGER,ROLE_AGENT_USER') {
        //                 setAuth("1")
        //             } if (returnResponse.detailAgentUser[0].agent_auth === 'ROLE_MANAGER,ROLE_AGENT_ADMIN') {
        //                 setAuth("2")
        //             } if (returnResponse.detailAgentUser[0].agent_auth === 'ROLE_MANAGER,ROLE_ADMIN') {
        //                 setAuth("3")
        //             } if (returnResponse.detailAgentUser[0].agent_auth === 'ROLE_MANAGER,ROLE_BORROWER') {
        //                 setAuth("4")
        //             }

        //             setUse(returnResponse.detailAgentUser[0].mgr_use_yn)
        //         }
        //     })
        //     .catch((error) => {
        //         console.log(error)
        //     })

        SendAPI("https://dev-home-api.leadcorp.co.kr:8080/detailAgentUser", { userINDX })
            .then((returnResponse) => {
                const user = returnResponse.result[0]; // 클릭한 한 행 데이터
                if (user) {
                    setUserID(user.agent_id);
                    setUserName(user.agent_nm);
                    setCo(user.agent_co);
                    setMgr(user.agent_dept);
                    setPhone(user.agent_phn);

                    // agent_auth 매핑 정리
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
                            // setAuth(""); 
                    }

                    setUse(user.mgr_use_yn);
                }
            })
            .catch((error) => {
                console.log(error);
            }, [userINDX]);


        // 사용자 권한에 따른 업체 리스트
        SendAPI("https://home-api.leadcorp.co.kr:8080/agentUserCoList", { ID: sessionStorage.getItem("ID") })
            .then((returnResponse) => {
                console.log(returnResponse)
                setAgentList(returnResponse.result)
            })
            .catch((error) => {
                console.log(error)
            })

    }, [])

    const modifyAgenUser = () => {
        setModifyData({
            ID : sessionStorage.getItem("ID"),
            userINDX: locationState.userINDX,
            userID: userID,
            userName: userName,
            co: co,
            mgr: mgr,
            phone: phone,
            auth: auth,
            use: use
        })
    }

    // 사용자 수정
    useEffect(() => {
        if (modifyData.ID !== '' && modifyData.ID !== undefined) {
            SendAPI("https://dev-home-api.leadcorp.co.kr:8080/modifyAgentUser", modifyData)
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
    }, [modifyData])


    return (
        <>
            <div className="content_body">
                <p className="menu_title">사용자 변경</p>

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
                        <td className="table_td_value"><select className="searchInput" onChange={(e) => setCo(e.target.value)} value={co}>
                            <option value="">구분</option>
                            {agentList && agentList.map((item, index) => (
                                <option key={index} value={item.co_indx}>{item.agent_co}</option>
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
                    <button className="loginBtn" type="submit" onClick={modifyAgenUser}>수정</button>
                    <button className="loginBtn" type="submit" onClick={() => navigate("/ManageUser")}>목록</button>
                </div>
            </div>
        </>
    )
}

export default ModifyUser