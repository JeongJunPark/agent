import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useHistory } from "react-router-dom";
import { AiOutlineShop } from "react-icons/ai";
import SendAPI from "../../utils/SendAPI";
import "../../styles/common.css"
import "../../styles/button.css"

const ModifyList = () => {

    const location = useLocation()
    const navigate = useNavigate();
    const locationState = location.state
    console.log("locationState: ", locationState)
    const [coID, setcoID] = useState(locationState.HIS_INDX)
    const [his_year, setHisYear] = useState('')
    const [his_mth, setHisMth] = useState()

    const [his_titl, setHisTitl] = useState()

    const [historyVO, setHistoryVO] = useState({});

    useEffect(() => {
        SendAPI("https://home-api.leadcorp.co.kr:8080/getHistoryRow", { indx : coID })
            .then((returnResponse) => {
                if (returnResponse) {
                    console.log('dd ', returnResponse.result[0])
                    setHistoryVO(returnResponse.result[0]);
                    // setHisYear(returnResponse.result[0].his_year)
                    // setHisMth(returnResponse.result[0].his_mth)
                    // setCoManagerID(returnResponse.result[0].his_titl)
                }
            })
            .catch((error) => {
                console.log(error)
            })

    }, [])
    
    const modifyHistoryList = () => {
        const payload = {            
            his_titl: his_titl || historyVO.his_titl || "",
            his_year: his_year || historyVO.his_year || "",
            his_mth: his_mth || historyVO.his_mth || "",
            his_id: historyVO.his_id || "",
            his_indx: coID || historyVO.his_indx || "",
            his_dt: new Date().toISOString().split("T")[0]
        };
    
        SendAPI("https://home-api.leadcorp.co.kr:8080/updateHistory", payload)
            .then((returnResponse) => {
                if (returnResponse.result === "Y") {
                    alert("수정이 완료 되었습니다.");
                    navigate("/List");
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };
    

    return (
        <>
            <div className="content_body">
                <p className="menu_title"><AiOutlineShop/> 연혁관리 수정</p>
                
                <table className="result_table">
                    <colgroup>
                        <col width="10%" />
                        <col width="90%" />
                    </colgroup>
                    <tbody>
                    <tr>
                        <th>연도</th>
                        <td>
                            <input 
                                className="searchInput" 
                                value={his_year || historyVO.his_year || ""} 
                                onChange={(e) => setHisYear(e.target.value)} 
                            />
                        </td>
                    </tr>

                    <tr>
                        <th>월</th>
                        <td>
                            <select 
                                className="searchInput" 
                                value={his_mth || historyVO.his_mth || ""} 
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
                        <th>제목</th>
                        <td>
                            <input 
                                className="searchInput" 
                                value={his_titl || historyVO.his_titl || ""} 
                                onChange={(e) => setHisTitl(e.target.value)} 
                            />
                        </td>
                    </tr>
                    </tbody>
                </table>
                
                <div className="button_layout">
                    <button className="modifyBtn" type="submit" onClick={modifyHistoryList}>수정</button>
                    <button className="listBtn" type="submit" onClick={() => navigate("/List")}>목록</button>
                </div>
            </div>
        </>
    )
}

export default ModifyList;