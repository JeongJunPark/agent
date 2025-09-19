import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useHistory } from "react-router-dom";
import SendAPI from "../utils/SendAPI";
import "../styles/common.css"
import "../styles/button.css"

const CompanyIP = () => {

    // HIST 저장
    useEffect(() => {
        SendAPI("https://dev-home-api.leadcorp.co.kr:8080/agentHistManage", { ID: sessionStorage.getItem('ID'), menu: "IP관리", note: '', IP : sessionStorage.getItem('IP') })
            .then((returnResponse) => {
                if (returnResponse) {
                    console.log(returnResponse)
                }
            })
            .catch((error) => {
                console.log(error)
            })

    }, [])

    const location = useLocation()
    const navigate = useNavigate();
    const locationState = location.state

    const [coID, setcoID] = useState(locationState.id)
    const [response, setResponse] = useState()

    const [submittedIP, setSubmittedIP] = useState('');

    // 업체 IP 리스트
    useEffect(() => {
        SendAPI("https://dev-home-api.leadcorp.co.kr:8080/IPCompany", { companyINDX : locationState.companyINDX })
            .then((returnResponse) => {
                if (returnResponse) {
                    setResponse(returnResponse.IPList);
                }
            })
            .catch((error) => {
                console.log(error)
            })

    }, [])

    // 업체 IP 사용 여부 변경
    const changeUse = (IP, useValue) => {
        SendAPI("https://dev-home-api.leadcorp.co.kr:8080/changeUseIP", { ID: sessionStorage.getItem('ID'), IP : IP, useValue: useValue })
            .then((returnResponse) => {
                if (returnResponse.result === 'Y') {
                    window.location.reload();
                }

            })
            .catch((error) => {
                console.log(error)
            })
    }

    // 업체 IP 등록
    const submitIP = () => {
        SendAPI("https://dev-home-api.leadcorp.co.kr:8080/submitIP", { ID: sessionStorage.getItem('ID'), companyINDX: locationState.companyINDX, IP: submittedIP,  })
            .then((returnResponse) => {
                if (returnResponse.result === 'Y') {
                    alert("등록이 완료되었습니다.");
                    window.location.reload();
                }

            })
            .catch((error) => {
                console.log(error)
            })
    }



    return (
        <>
            <div className="content_body_nogrid">
                <p className="menu_title">IP 관리</p>
                <table className="result_table" border="1">
                    <tr>
                        <th>번호</th>
                        <th>IP 번호</th>
                        <th>사용 여부</th>
                        <th>등록자</th>
                        <th>사용 여부 변경</th>
                    </tr>
                    {response && response.map((item, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.ip_number}</td>
                            <td>{item.mgr_use_yn}</td>
                            <td>{item.mgr_id}</td>
                            <td><button className="loginBtn" onClick={() => changeUse(item.ip_number, item.mgr_use_yn)}>변경</button></td>
                        </tr>

                    ))}
                </table>

                <table className="result_table" style={{ marginTop : "10px" }} border="1">
                    <tr>
                        <th>등록할 IP</th>
                        <td><input className="searchInput" placeholder="IP 번호" onChange={(e) => setSubmittedIP(e.target.value)} /></td>
                    </tr>
                </table>

                <div className="button_layout">
                    <button className="registBtn" onClick={submitIP}>등록</button>
                    <button className="listBtn" type="submit" onClick={() => navigate("/ManageCompany")}>목록</button>
                </div>
            </div>
        </>
    )
}

export default CompanyIP