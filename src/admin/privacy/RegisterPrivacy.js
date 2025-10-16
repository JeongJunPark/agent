import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AiOutlineForm } from "react-icons/ai";
import SendAPI from "../../utils/SendAPI";

import "../../styles/common.css"
import "../../styles/button.css"

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
const RegisterPrivacy = ({ menuItems }) => {
        
    const { bbs } = useParams();
    console.log("bbs: ", bbs)
    const currentTitle = menuItems.find(item => item.key === bbs)?.label || "";
    const navigate = useNavigate();

    const [privacy_titl, setPrivacyTitl ] = useState('');
    const [privacy_cont, setPrivacyCont ] = useState('');
    
    const privacy_id = sessionStorage.getItem("ID");
    const privacy_nm = sessionStorage.getItem("userName");

    const insertPrivacy = () => {
        const payload = {      
            privacy_no  : bbs,
            privacy_titl: privacy_titl || "",
            privacy_cont: privacy_cont || "",
            privacy_id  : privacy_id   || "",
            privacy_nm  : privacy_nm   || ""
        };
    
        SendAPI("https://dev-home-api.leadcorp.co.kr:8080/insertPrivacyMng", payload)
                .then((returnResponse) => {
                    console.log(returnResponse)
                    if (returnResponse.result) {
                        alert("등록이 완료 되었습니다.");
                       navigate(`/List/${bbs}`);
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
                                    value={privacy_titl || ""} 
                                    onChange={(e) => setPrivacyTitl(e.target.value)}
                                />
                            </td>                        
                        </tr>
                        
                        <tr>
                            <th>작성자</th>
                            <td>
                                <input 
                                    className="tdInputReadonly" 
                                    value={privacy_nm || ""} 
                                    readOnly
                                />
                            </td>                                  
                        </tr>
                        
                        <tr>
                            <th>내용</th>
                            <td>
                                <CKEditor
                                editor={ClassicEditor}
                                data={privacy_cont || ""}                       
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    setPrivacyCont(data);
                                }}
                                />
                            </td>
                        </tr>              
                    </tbody>
                </table>
                
                <div className="button_layout">
                    <button className="modifyBtn" type="submit" onClick={insertPrivacy}>등록</button>
                    <button className="listBtn" type="submit" onClick={() => navigate(`/List/${bbs}`)}>목록</button>
                </div>
            </div>
        </>
    )    

}

export default RegisterPrivacy;