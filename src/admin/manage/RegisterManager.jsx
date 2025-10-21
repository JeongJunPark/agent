import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useHistory } from "react-router-dom";
import SendAPI from "../../utils/SendAPI";
import "../../styles/common.css"
import { AiFillSetting } from "react-icons/ai";
import "../../styles/button.css"
const RegisterManager = () => {

    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    
    const location = useLocation()
    const navigate = useNavigate();
    const locationState = location.state

    const [mgr_id, setMgrId] = useState('')
    const [mgr_nm, setMgrNm] = useState('')
    const [mgr_dept, setMgrDept] = useState('')
    const [mgr_phn, setMgrPhn] = useState('')
    const [mgr_aprv, setMgrAprv] = useState('')

    const mgr_dt = new Date(now.getTime() - offset)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");


    const registManager = () => {
        const payload = {            
            mgr_id: mgr_id || "",
            mgr_nm: mgr_nm || "",
            mgr_dept: mgr_dept || "",
            mgr_phn: mgr_phn || "",

            mgr_aprv: mgr_aprv || "",
            mgr_phn: mgr_phn || "",
            
            mgr_dt: mgr_dt
        };
    
            SendAPI("https://home-api.leadcorp.co.kr:8080/insertManager", payload)
                .then((returnResponse) => {
                    console.log(returnResponse)
                    if (returnResponse.result) {
                        alert("등록이 완료 되었습니다.");
                        navigate("/ManagerList")
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
                <p className="menu_title"><AiFillSetting/> 관리자계정 등록</p>
                
                <table className="result_table">
                    <colgroup>
                        <col width="10%" />
                        <col width="90%" />
                    </colgroup>
                    <tbody>
                        <tr>
                            <th>아이디</th>
                            <td>
                                <input 
                                    className="searchInput" 
                                    value={mgr_id || ""} 
                                    onChange={(e) => setMgrId(e.target.value)} 
                                />
                            </td>                        
                        </tr>
                        
                        <tr>
                            <th>이름</th>
                            <td>
                                <input 
                                    className="searchInput" 
                                    value={mgr_nm || ""} 
                                    onChange={(e) => setMgrNm(e.target.value)} 
                                />
                            </td>                                  
                        </tr>
                        
                        <tr>
                            <th>부서</th>
                            <td>
                                <input 
                                    className="searchInput" 
                                    value={mgr_dept || ""} 
                                    onChange={(e) => setMgrDept(e.target.value)} 
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>연락처</th>
                            <td>
                                <input 
                                    className="searchInput" placeholder="연락처"
                                    value={mgr_phn || ""} 
                                    onChange={(e) => setMgrPhn(e.target.value)} 
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>인증</th>
                            <td>Y <input type="radio" value="Y" checked={mgr_aprv === 'Y'} onChange={(e) => setMgrAprv(e.target.value)} />
                                N <input type="radio" value="N" checked={mgr_aprv === 'N'} onChange={(e) => setMgrAprv(e.target.value)} />
                            </td>                            
                        </tr>                        
                    </tbody>
                </table>
                
                <div className="button_layout">
                    <button className="modifyBtn" type="submit" onClick={registManager}>등록</button>
                    <button className="listBtn" type="submit" onClick={() => navigate("/ManagerList")}>목록</button>
                </div>
            </div>
        </>    
    )    
}

export default RegisterManager