import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useHistory } from "react-router-dom";
import SendAPI from "../utils/SendAPI";
import "../styles/common.css"
import { AiOutlineShop } from "react-icons/ai";
import "../styles/button.css"
const RegisterCompany = () => {

    const location = useLocation()
    const navigate = useNavigate();
    const locationState = location.state

    const [postData, setPostData] = useState({
        name: '',
        coName: '',
        coDiv: '',
        coManagerID: '',
        coPhone: '',
        coUse: '',
    })

    const [coName, setCoName] = useState('')
    const [coDiv, setCoDiv] = useState()
    const [coManagerID, setCoManagerID] = useState()
    const [coPhone, setCoPhone] = useState()
    const [coUse, setCoUse] = useState('Y')

    const RegisterAgentCompany = () => {
        setPostData({
            ID: sessionStorage.getItem('ID'),
            coName: coName,
            coDiv: coDiv,
            coManagerID: coManagerID,
            coPhone: coPhone,
            coUse: coUse
        })
    }

    // HIST 저장
    useEffect(() => {
        SendAPI("https://dev-home-api.leadcorp.co.kr:8080/agentHistManage", { ID: sessionStorage.getItem('ID'), menu: "업체등록", note: '', IP : sessionStorage.getItem('IP') })
            .then((returnResponse) => {
                if (returnResponse) {
                    console.log(returnResponse)
                }
            })
            .catch((error) => {
                console.log(error)
            })

    }, [])

    useEffect(() => {
        if (postData.ID !== '' && postData.ID !== undefined) {
            SendAPI("https://dev-home-api.leadcorp.co.kr:8080/submitAgentCompany", postData)
                .then((returnResponse) => {
                    console.log(returnResponse)
                    if (returnResponse.result === 'Y') {
                        alert("등록이 완료 되었습니다.");
                        navigate("/ManageCompany")
                    }
                })
                .catch((error) => {
                    alert("입력정보를 확인해주세요.")
                    console.log(error)
                })
        }
    }, [postData])


    return (
        <>
            <div className="content_body_nogrid">
                <div className="table-wrapper-nogrid">   
                <p className="menu_title"><AiOutlineShop/> 업체 등록</p>
                <table className="result_table" border="1">
                    <tr>
                        <th className="table_td_title">업체명</th>
                        <td className="table_td_value"><input className="searchInput" value={coName} onChange={(e) => setCoName(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <th className="table_td_title">업체 구분</th>
                        <td className="table_td_value"><select className="searchInput" onChange={(e) => setCoDiv(e.target.value)} value={coDiv}>
                            <option value="">구분</option>
                            <option value="01">본사</option>
                            <option value="02">에이전트</option>
                            <option value="03">차입처</option>
                        </select></td>
                    </tr>
                    <tr>
                        <th className="table_td_title">대표 아이디</th>
                        <td className="table_td_value"><input className="searchInput" value={coManagerID} onChange={(e) => setCoManagerID(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <th className="table_td_title">대표 연락처</th>
                        <td className="table_td_value"><input className="searchInput" value={coPhone} onChange={(e) => setCoPhone(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <th className="table_td_title">사용 여부</th>
                        <td className="table_td_value">
                            <label>
                                <input type="radio" value="Y" checked={coUse === 'Y'} onChange={(e) => setCoUse(e.target.value)} />
                                <span>Y</span>
                            </label>

                            <label>
                                <input type="radio" value="N" checked={coUse === 'N'} onChange={(e) => setCoUse(e.target.value)} />
                                <span>N</span>
                            </label>                        
                        </td>
                    </tr>
                </table>
                <div className="button_layout">
                    <button className="loginBtn" type="submit" onClick={RegisterAgentCompany}>등록</button>
                    <button className="loginBtn" type="submit" onClick={() => navigate("/ManageCompany")}>목록</button>
                </div>
                </div>
            </div>
        </>
    )
}

export default RegisterCompany