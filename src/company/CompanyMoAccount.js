import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useHistory } from "react-router-dom";
import SendAPI from "../utils/SendAPI";
import "../styles/common.css"
// import "../styles/modify.css"

const CompanyMoAccount = () => {

    // HIST 저장
    useEffect(() => {
        SendAPI("https://home-api.leadcorp.co.kr:8080/agentHistManage", { ID: sessionStorage.getItem('ID'), menu: "모계좌관리", note: '', IP : sessionStorage.getItem('IP') })
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

    const [postData, setPostData] = useState({
        id: locationState.id
    })

    const [coID, setcoID] = useState(locationState.id)
    const [response, setResponse] = useState()

    const [chageData, setChangeData] = useState({
        ID: ''
    })

    const [selectedBank, setSelectedBank] = useState("03")

    const [subittedMoAccount, setSubmittedMoAccount] = useState('');

    // 모계좌 리스트
    useEffect(() => {
        SendAPI("https://home-api.leadcorp.co.kr:8080/moAccountCompany", { companyINDX : locationState.companyINDX } )
            .then((returnResponse) => {
                if (returnResponse) {
                    console.log(returnResponse)
                    setResponse(returnResponse.moAcccountList);
                }
            })
            .catch((error) => {
                console.log(error)
            })

    }, [postData])

    // 모계좌 사용 여부 변경
    const changeUse = (number, useValue) => {
        SendAPI("https://home-api.leadcorp.co.kr:8080/changeUseMoAccount", { ID: sessionStorage.getItem('ID'), moAccount: number, useValue: useValue })
            .then((returnResponse) => {
                if (returnResponse.result === 'Y') {
                    window.location.reload();
                }

            })
            .catch((error) => {
                console.log(error)
            })
    }

    // 모계좌 삭제
    const deleteMoAccount = (number) => {
        SendAPI("https://home-api.leadcorp.co.kr:8080/deleteMoAccount", { moAccount: number })
            .then((returnResponse) => {
                if (returnResponse.result === 'Y') {
                    window.location.reload();
                }

            })
            .catch((error) => {
                console.log(error)
            })
    }

    // 모계좌 등록
    const submitIP = () => {
        SendAPI("https://home-api.leadcorp.co.kr:8080/submitMoAccount", { companyINDX : locationState.companyINDX, bankCd: selectedBank, moAccount: subittedMoAccount, ID: sessionStorage.getItem('ID') })
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

    const formattedData = (data) => {
        if (data === '03') {
            return "기업"
        }
        if (data === '88') {
            return "신한"
        }
        if (data === '20') {
            return "우리"
        }
        if (data === '23') {
            return "제일"
        }
        if (data === '279') {
            return "DB 금융투자"
        }
    }


    return (
        <>
            <div className="content_body">
                <p className="menu_title">모계좌 관리</p>
                <table className="result_table" border="1">
                    <tr>
                        <th>번호</th>
                        <th>은행</th>
                        <th>모계좌번호</th>
                        <th>사용여부</th>
                        <th>등록일</th>
                        <th>등록자</th>
                        <th>사용 여부 변경</th>
                        <th>삭제</th>
                    </tr>
                    {response && response.map((item, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{formattedData(item.bank_cd)}</td>
                            <td>{item.mo_act_number}</td>
                            <td>{item.mgr_use_yn}</td>
                            <td>{item.mgr_dt}</td>
                            <td>{item.mgr_id}</td>
                            <td><button className="loginBtn" onClick={() => changeUse(item.mo_act_number, item.mgr_use_yn)}>변경</button></td>
                            <td><button className="loginBtn" onClick={() => deleteMoAccount(item.mo_act_number)}>삭제</button></td>
                        </tr>

                    ))}
                </table>

                <table className="result_table" style={{ marginTop: "10px" }} border="1">
                    <tr>
                        <td className="table_td_title">은행</td>
                        <td className="table_td_value">
                            <select className="searchInput" onChange={(e) => setSelectedBank(e.target.value)}>
                                <option value="03">기업</option>
                                <option value="88">신한</option>
                                <option value="20">우리</option>
                                <option value="23">제일</option>
                                <option value="279">DB금융투자</option>
                            </select>
                        </td>
                        <td className="table_td_title">모계좌번호</td>
                        <td className="table_td_value"><input className="searchInput" placeholder="모계좌번호" onChange={(e) => setSubmittedMoAccount(e.target.value)} /></td>
                    </tr>
                </table>

                <div className="button_layout">
                    <button className="loginBtn" onClick={submitIP}>등록</button>
                    <button className="loginBtn" type="submit" onClick={() => navigate("/ManageCompany")}>목록</button>
                </div>
            </div>
        </>
    )
}

export default CompanyMoAccount