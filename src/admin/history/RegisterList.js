import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useHistory } from "react-router-dom";
import SendAPI from "../../utils/SendAPI";
import "../../styles/common.css"
import { AiOutlineShop } from "react-icons/ai";
import "../../styles/button.css"
const RegisterList = () => {

    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    
    const location = useLocation()
    const navigate = useNavigate();
    const locationState = location.state

    const [his_year, setHisYear] = useState('')
    const [his_mth, setHisMth] = useState('01')

    const [his_titl, setHisTitl] = useState('')
    const his_nm = sessionStorage.getItem('userName');

    const his_dt = new Date(now.getTime() - offset)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");


    const registHistoryList = () => {
        const payload = {            
            his_titl: his_titl || "",
            his_year: his_year || "",
            his_mth: his_mth || "",
            his_id: sessionStorage.getItem('ID'),
            his_dt: his_dt,
            his_nm: his_nm
        };
            SendAPI("https://dev-home-api.leadcorp.co.kr:8080/insertHistory", payload)
                .then((returnResponse) => {
                    console.log(returnResponse)
                    if (returnResponse.result) {
                        alert("등록이 완료 되었습니다.");
                        navigate("/List")
                    }
                })
                .catch((error) => {
                    alert("입력정보를 확인해주세요.")
                    console.log(error)
                })
    };        

    return (
        <>
            <div className="content_body">
                <p className="menu_title"><AiOutlineShop/> 연혁관리 등록</p>
                
                <table className="result_table">
                    <colgroup>
                        <col width="10%" />
                        <col width="90%" />
                    </colgroup>
                    <tbody>
                    <tr>
                        <th>연도</th>
                        <td><input className="searchInput" placeholder="연도" value={his_year} onChange={(e) => setHisYear(e.target.value)} /></td>
                    </tr>

                    <tr>
                        <th>월</th>
                        <td>
                            <select 
                                className="searchInput" 
                                value={his_mth} 
                                onChange={(e) => setHisMth(e.target.value)}
                            >
                                {Array.from({length:12}, (_,i) => {
                                    const month = String(i+1).padStart(2,'0');
                                    return <option key={month} value={month}>{month}</option>
                                })}
                            </select>
                        </td>
                    </tr>

                    <tr>
                        <th>작성자</th>
                        <td><input className="tdInputReadonly" readOnly value={his_nm} /></td>
                    </tr>

                    <tr>
                        <th>제목</th>
                        <td>
                            <input 
                                className="searchInput"
                                placeholder="제목" 
                                value={his_titl} 
                                onChange={(e) => setHisTitl(e.target.value)} 
                            />
                        </td>
                    </tr>
                    </tbody>
                </table>
                
                <div className="button_layout">
                    <button className="registBtn" type="submit" onClick={registHistoryList}>등록</button>
                    <button className="listBtn" type="submit" onClick={() => navigate("/List")}>목록</button>
                </div>
            </div>
        </>
    )    
}

export default RegisterList