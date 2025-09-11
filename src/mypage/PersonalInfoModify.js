import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SendAPI from "../utils/SendAPI";
import "../styles/common.css"
import { AiOutlineForm } from "react-icons/ai";
import "../styles/button.css"
const PersonalInfoModify = () => {

    const [managerVO, setManagerVO] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        SendAPI("https://dev-home-api.leadcorp.co.kr:8080/getManagerInfo", { ID: sessionStorage.getItem('ID'), menu: "개인정보 수정", note: '', IP : sessionStorage.getItem('IP') })
            .then((returnResponse) => {
                if (returnResponse) {
                    console.log(returnResponse)
                    setManagerVO(returnResponse.result[0]);
                }
            })
            .catch((error) => {
                console.log(error)
            })

    }, [])

    // modify action
    const modifyPersonalInfo = () => {
        const payload = {            
            agent_id: sessionStorage.getItem('ID'),
            agent_co: managerVO.agent_co || "",
            agent_dept: managerVO.agent_dept || "",
            agent_phn: managerVO.agent_phn || "",
            mgr_dt: new Date().toISOString().split("T")[0]
        };

        SendAPI("https://dev-home-api.leadcorp.co.kr:8080/updateManagerInfo", payload)
            .then((returnResponse) => {
                if (returnResponse.result === 'Y') {
                    alert("수정이 완료 되었습니다.");
                    navigate("/PersonalInfoModify");
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    return (
        <>
            <div className="content_body_nogrid">
                <div className="table-wrapper-nogrid">
                <p className="menu_title"><AiOutlineForm/> 개인정보수정</p>
                <table className="result_table" border="1">
                    <colgroup>
                        <col width="10%" />
                        <col width="90%" />
                    </colgroup>
                        <tr>
                            <th>아이디</th>
                            <td>{managerVO.agent_id }</td>
                        </tr>
                        <tr>
                            <th>이름</th>
                            <td><input type="text" className="tdInputReadonly" value={managerVO.agent_nm } readOnly></input></td>
                        </tr>
                        <tr>
                        <th>소속</th>
                            <td><input type="text" className="tdInputReadonly" value={managerVO.agent_co } readOnly></input></td>                        
                        </tr>
                        <tr>
                        <th>부서</th>
                        <td>
                            <input
                            type="text"
                            className="tdInput"
                            value={managerVO.agent_dept || ""}
                            onChange={(e) => setManagerVO({ ...managerVO, agent_dept: e.target.value })}
                            />
                        </td>
                        </tr>
                        <tr>
                        <th>연락처</th>
                        <td>
                            <input
                            type="text"
                            className="tdInput"
                            value={managerVO.agent_phn || ""}
                            onChange={(e) => setManagerVO({ ...managerVO, agent_phn: e.target.value })}
                            />
                        </td>
                        </tr>
                        <tr style={{ display: "none" }}>
                        <th>수정일</th>
                            <td><input type="text" className="tdInput" value={managerVO.mgr_dt } readOnly></input></td>
                        </tr>
                </table>
                
                <div className="button-container">
                    <button className="modifyBtn" type="submit" onClick={modifyPersonalInfo}>수정</button>
                </div>
                </div>
            </div>         
        </>
    );

}

export default PersonalInfoModify;