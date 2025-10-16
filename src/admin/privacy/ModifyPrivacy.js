import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AiOutlineForm } from "react-icons/ai";
import SendAPI from "../../utils/SendAPI";
import SendAPIPrivacy from "../../utils/SendAPIPrivacy";


import "../../styles/common.css"
import "../../styles/button.css"
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const ModifyPrivacy = ({ menuItems }) => {
    const { indx } = useParams();
    const { bbs } = useParams();
    console.log("indx: ", indx)
    console.log("bbs: ", bbs)
    const currentTitle = menuItems.find(item => item.key === bbs)?.label || "";
    const navigate = useNavigate();

    const [privacyVO, setPrivacyVO] = useState({});
    
    const [privacy_titl, setPrivacyTitl] = useState('')
    const [privacy_nm, setPrivacyNm] = useState('')
    const [privacy_cont, setPrivacyCont] = useState('')
    

    useEffect(() => {
        SendAPIPrivacy("https://dev-home-api.leadcorp.co.kr:8080/getPrivacyRowMng", { indx : indx, bbs: bbs })
            .then((returnResponse) => {
                if (returnResponse) {
                    console.log('dd ', returnResponse.result)
                    setPrivacyVO(returnResponse.result);
                }
            })
            .catch((error) => {
                console.log(error)
            })

    }, [])    

    const updatePrivacy = () => {
        const payload = {      
            privacy_titl: privacy_nm || privacyVO.privacy_titl || "",      
            privacy_nm: privacy_nm || privacyVO.privacy_nm || "",
            privacy_cont: privacy_cont || privacyVO.privacy_cont || "",
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
                <p className="menu_title"><AiOutlineForm/> {currentTitle} 수정</p>
                
                <table className="result_table">
                    <colgroup>
                        <col width="10%" />
                        <col width="90%" />
                    </colgroup>
                    <tbody>
                        <tr>
                            <th>제목</th>
                            <td>
                                <input 
                                    className="searchInput" 
                                    value={privacy_titl || privacyVO.privacy_titl || ""} 
                                    onChange={(e) => setPrivacyTitl(e.target.value)} setPrivacyNm
                                />
                            </td>                        
                        </tr>
                        
                        <tr>
                            <th>작성자</th>
                            <td>
                                <input 
                                    className="searchInput" 
                                    value={privacy_nm || privacyVO.privacy_nm || ""} 
                                    onChange={(e) => setPrivacyNm(e.target.value)} 
                                />
                            </td>                                  
                        </tr>
                        
                        <tr>
                            <th>내용</th>
                            <td>
                                <input 
                                    className="searchInput" 
                                    value={privacy_cont || privacyVO.privacy_cont || ""}  
                                    onChange={(e) => setPrivacyCont(e.target.value)} 
                                />
                            </td>
                        </tr>              
                    </tbody>
                </table>
                
                <div className="button_layout">
                    <button className="modifyBtn" type="submit" onClick={updatePrivacy}>수정</button>
                    <button className="listBtn" type="submit" onClick={() => navigate("/PrivacyList")}>목록</button>
                </div>
            </div>
        </>
    )    

}

export default ModifyPrivacy;