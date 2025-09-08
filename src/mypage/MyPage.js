import { useEffect, useState } from "react";
import SendAPI from "../utils/SendAPI";
import "../styles/common.css"

const MyPage = () => {

    const [managerVO, setManagerVO] = useState({});

    // alert(managerVO);
    useEffect(() => {
        SendAPI("https://dev-home-api.leadcorp.co.kr:8080/getManagerInfo", {
            ID: sessionStorage.getItem('ID'),
            menu: "My page",
            note: '',
            IP: sessionStorage.getItem('IP')
        })
            .then((returnResponse) => {
                if (returnResponse) {
                    console.log(returnResponse);
                    setManagerVO(returnResponse.result[0]);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <>
            <div className="content_body">
                <p className="menu_title">My Page</p>
                <table className="result_table_sm" border="1">
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
                        <tr>
                            <th>접속시간</th>
                            <td>{managerVO.mgr_last }</td>
                        </tr>
                        <tr>
                            <th>접속아이피</th>
                            <td>{managerVO.mgr_ip }</td>
                        </tr>
                </table>
            </div>
        </>
    )
}

export default MyPage