import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useHistory } from "react-router-dom";
import SendAPI from "../utils/SendAPI";
import "../styles/common.css"
// import "../styles/modify.css"

const ModifyCompany = () => {

    const location = useLocation()
    const navigate = useNavigate();
    const locationState = location.state

    const [coID, setcoID] = useState(locationState.id)
    const [coName, setCoName] = useState('')
    const [coDiv, setCoDiv] = useState()
    const [coManagerID, setCoManagerID] = useState()
    const [coPhone, setCoPhone] = useState()
    const [coUse, setCoUse] = useState()

    const [response, setResponse] = useState()

    const [modifyData, setModifyData] = useState({
        ID: '',
        coName: '',
        coDiv: '',
        coManagerID: '',
        coPhone: '',
        coUse: ''
    })

    // HIST 저장
    useEffect(() => {
        SendAPI("https://home-api.leadcorp.co.kr:8080/agentHistManage", { ID: sessionStorage.getItem('ID'), menu: "업체변경", note: '', IP : sessionStorage.getItem('IP') })
            .then((returnResponse) => {
                if (returnResponse) {
                    console.log(returnResponse)
                }
            })
            .catch((error) => {
                console.log(error)
            })

    }, [])

    // 업체 세부 정보
    useEffect(() => {
        SendAPI("https://home-api.leadcorp.co.kr:8080/detailAgentCompany", { companyINDX : locationState.companyINDX })
            .then((returnResponse) => {
                if (returnResponse) {
                    setCoName(returnResponse.detailAgentCompany[0].agent_co)
                    setCoDiv(returnResponse.detailAgentCompany[0].agent_co_div)
                    setCoManagerID(returnResponse.detailAgentCompany[0].agent_dlgt_id)
                    setCoPhone(returnResponse.detailAgentCompany[0].agent_phn)
                    setCoUse(returnResponse.detailAgentCompany[0].mgr_use_yn)
                }
            })
            .catch((error) => {
                console.log(error)
            })

    }, [])

    const modifyAgentCompany = () => {
        setModifyData({
            companyINDX: locationState.companyINDX,
            coName: coName,
            coDiv: coDiv,
            coManagerID: coManagerID,
            coPhone: coPhone,
            coUse: coUse,
            ID: sessionStorage.getItem('ID')
        })
    }

    useEffect(() => {
        if (modifyData.ID !== '' && modifyData.ID !== undefined) {
            SendAPI("https://home-api.leadcorp.co.kr:8080/modifyAgentCompany", modifyData)
                .then((returnResponse) => {
                    if (returnResponse.result === 'Y') {
                        alert("수정이 완료 되었습니다.");
                        navigate("/ManageCompany")
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }, [modifyData])

    const managerIP = (companyINDX) => {
        navigate("/CompanyIP", {
            state: {
                companyINDX: companyINDX
            }
        })

    }

    const managerMoAccount = (companyINDX) => {
        navigate("/CompanyMoAccount", {
            state: {
                companyINDX: companyINDX
            }
        })

    }

    return (
        <>
            <div className="content_body">
                <p className="menu_title">업체 변경</p>
                <table className="result_table" border="1">
                    <tr>
                        <td className="table_td_title">업체명</td>
                        <td className="table_td_value"><input className="searchInput" value={coName} onChange={(e) => setCoName(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td className="table_td_title">업체 구분</td>
                        <td className="table_td_value"><select className="searchInput" onChange={(e) => setCoDiv(e.target.value)} value={coDiv}>
                            <option value="">구분</option>
                            <option value="01">본사</option>
                            <option value="02">에이전트</option>
                            <option value="03">차입처</option>
                        </select></td>
                    </tr>
                    <tr>
                        <td className="table_td_title">대표 아이디</td>
                        <td className="table_td_value"><input className="searchInput" value={coManagerID} onChange={(e) => setCoManagerID(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td className="table_td_title">대표 연락처</td>
                        <td className="table_td_value"><input className="searchInput" value={coPhone} onChange={(e) => setCoPhone(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td className="table_td_title">사용 여부</td>
                        <td className="table_td_value">Y <input type="radio" value="Y" checked={coUse === 'Y'} onChange={(e) => setCoUse(e.target.value)} />
                            N <input type="radio" value="N" checked={coUse === 'N'} onChange={(e) => setCoUse(e.target.value)} />
                        </td>
                    </tr>
                </table>
                
                <div className="button_layout">
                    <button className="loginBtn" type="submit" onClick={modifyAgentCompany}>수정</button>
                    <button className="loginBtn" type="submit" onClick={() => managerIP(locationState.companyINDX)}>IP 관리</button>
                    <button className="loginBtn" type="submit" onClick={() => managerMoAccount(locationState.companyINDX)}>모 계좌 관리</button>
                    <button className="loginBtn" type="submit" onClick={() => navigate("/ManageCompany")}>목록</button>
                </div>
            </div>
        </>
    )
}

export default ModifyCompany