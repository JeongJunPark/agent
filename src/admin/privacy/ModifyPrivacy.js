//bbs indx

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useHistory } from "react-router-dom";
import { AiOutlineForm } from "react-icons/ai";
import SendAPI from "../../utils/SendAPI";
import "../../styles/common.css"
import "../../styles/button.css"
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const ModifyPrivacy = () => {

    const location = useLocation()
    const navigate = useNavigate();
    const locationState = location.state
    console.log("locationState: ", locationState)
    const [coID, setcoID] = useState(locationState.mgr_indx)

    const [managerVO, setmanagerVO] = useState({});
    

    useEffect(() => {
        SendAPI("https://dev-home-api.leadcorp.co.kr:8080/getPrivacyRowMng", { indx : coID })
            .then((returnResponse) => {
                if (returnResponse) {
                    console.log('dd ', returnResponse.result[0])
                    setmanagerVO(returnResponse.result[0]);
                }
            })
            .catch((error) => {
                console.log(error)
            })

    }, [])    

    const updatePrivacy = () => {
        const payload = {      
            mgr_indx: managerVO.mgr_indx || "",      
            mgr_id: mgr_id || managerVO.mgr_id || "",
            mgr_nm: mgr_nm || managerVO.mgr_nm || "",
            mgr_dept: mgr_dept || managerVO.mgr_dept || "",
            mgr_phn: mgr_phn || managerVO.mgr_phn || "",

            mgr_aprv: mgr_aprv || managerVO.mgr_aprv || "",
            mgr_phn: mgr_phn || managerVO.mgr_phn || "",
            
            mgr_dt: new Date().toISOString().split("T")[0]
        };
    
        SendAPI("https://dev-home-api.leadcorp.co.kr:8080/updatePrivacyMng", payload)
            .then((returnResponse) => {
                if (returnResponse.result === "Y") {
                    alert("수정이 완료 되었습니다.");
                    navigate("/ManagerList");
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };


    return (
        <>
            <div className="content_body">
                <p className="menu_title"><AiOutlineForm/> 관리자계정 관리 수정</p>
                
                <table className="result_table">
                    <colgroup>
                        <col width="10%" />
                        <col width="90%" />
                    </colgroup>
                    <tbody>
                        <tr>
                            <th>아이디</th>
                            <td>
                                {managerVO.mgr_id}
                            </td>                        
                        </tr>
                        
                        <tr>
                            <th>이름</th>
                            <td>
                                <input 
                                    className="searchInput" 
                                    value={mgr_nm || managerVO.mgr_nm || ""} 
                                    onChange={(e) => setMgrNm(e.target.value)} 
                                />
                            </td>                                  
                        </tr>
                        
                        <tr>
                            <th>부서</th>
                            <td>
                                <input 
                                    className="searchInput" 
                                    value={mgr_dept || managerVO.mgr_dept || ""} 
                                    onChange={(e) => setMgrDept(e.target.value)} 
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>연락처</th>
                            <td>
                                <input 
                                    className="searchInput" placeholder="연락처"
                                    value={mgr_phn || managerVO.mgr_phn || ""} 
                                    onChange={(e) => setMgrPhn(e.target.value)} 
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>인증</th>
                            <td>Y <input type="radio" value="Y" checked={mgr_aprv === 'Y'} onChange={(e) => setMgrAprv(e.target.value)} /> &nbsp;
                                N <input type="radio" value="N" checked={mgr_aprv === 'N'} onChange={(e) => setMgrAprv(e.target.value)} />
                            </td>                            
                        </tr>                        
                    </tbody>
                </table>
                
                <div className="button_layout">
                    <button className="modifyBtn" type="submit" onClick={ModifyManagerInfo}>수정</button>
                    <button className="listBtn" type="submit" onClick={() => navigate("/ManagerList")}>목록</button>
                </div>
            </div>
        </>
    )    

}

export default ModifyPrivacy;