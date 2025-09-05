import { useEffect, useState } from "react";
import SendAPI from "../utils/SendAPI";
import "../styles/common.css"

const PersonalInfoModify = () => {

    const [managerVO, setManagerVO] = useState({});

    // alert(managerVO);
    useEffect(() => {
        SendAPI("https://dev-home-api.leadcorp.co.kr:8080/updateManagerInfo", {
            ID: sessionStorage.getItem('ID'),
            menu: "개인정보 수정",
            note: '',
            IP: sessionStorage.getItem('IP')
        })
            .then((returnResponse) => {
                if (returnResponse) {
                    console.log(returnResponse);
                    setManagerVO(returnResponse);  // ✅ 여기서 상태 갱신
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);


    return (
        <>
            <div className="content_body">
                <p className="menu_title">개인정보수정</p>
                <table className="result_table" border="1">
                    <colgroup>
                        <col width="20%" />
                        <col width="80%" />
                    </colgroup>
                        <tr>
                            <th>아이디</th>
                            <td>{managerVO.agent_id }</td>
                        </tr>
                        <tr>
                            <th>이름</th>
                            <td>{managerVO.agent_nm }</td>
                        </tr>
                        <tr>
                            <th>소속</th>
                            <td>{managerVO.agent_co }</td>
                        </tr>
                        <tr>
                            <th>부서</th>
                            <td>{managerVO.agent_dept }</td>
                        </tr>
                        <tr>
                            <th>연락처</th>
                            <td>{managerVO.agent_phn }</td>
                        </tr>
                </table>
            </div>        
        </>
    );

}

export default PersonalInfoModify;