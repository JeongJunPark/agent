import { useEffect, useState } from "react";
import SendAPI from "../utils/SendAPI";
import "../styles/common.css"

const UseHistory = () => {

    const [managerVO, setManagerVO] = useState({});

    const tableRows = [
        { label: "순번", value: managerVO.agent_id },
        { label: "사용일시", value: managerVO.used_date },
        { label: "아이디", value: managerVO.agent_id },
        { label: "이름", value: managerVO.agent_nm },
        { label: "소속", value: managerVO.agent_dept },
        { label: "접근화면", value: managerVO.access_menu },
        { label: "접근IP", value: managerVO.agent_ip },
        { label: "비고", value: managerVO.agent_co },
    ];
    // alert(managerVO);
    useEffect(() => {
        SendAPI("https://dev-home-api.leadcorp.co.kr:8080/", {
            ID: sessionStorage.getItem('ID'),
            menu: "사용이력조회",
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
                <div className="table-wrapper">
                <p className="menu_title">사용이력 조회</p>
                <table className="result_table" border="1">
                    <colgroup>
                        <col width="10%" />
                        <col width="90%" />
                    </colgroup>
                    <tbody>
                        {tableRows.map((row, index) => (
                        <tr key={index}>
                            <th>{row.label}</th>
                            <td>{row.value}</td>
                        </tr>
                        ))}
                    </tbody>
                </table>
                </div>
            </div>        
        </>
    );

}

export default UseHistory;