import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AiOutlineForm } from "react-icons/ai";
import SendAPI from "../../utils/SendAPI";


import "../../styles/common.css"
import "../../styles/button.css"
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const ReadPrivacy = ({ menuItems }) => {
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
        const editable = document.querySelector(".ck-editor__editable");
        if (editable) {
        editable.style.backgroundColor = "#e2e2e2ff";
        }
    }, []);

    useEffect(() => {
        SendAPI("https://dev-home-api.leadcorp.co.kr:8080/getPrivacyRowMng", { indx : indx, bbs: bbs })
            .then((returnResponse) => {
                if (returnResponse) {
                    console.log('dd ', returnResponse.result[0])
                    setPrivacyVO(returnResponse.result[0]);
                }
            })
            .catch((error) => {
                console.log(error)
            })

    }, [])    

    const modifyPrivacyList = (indx, bbs) => {
        navigate(`/ModifyPrivacy/${indx}/${bbs}`);
    }

  const deletePrivacyList = (indx, bbs) => {
    SendAPI('https://dev-home-api.leadcorp.co.kr:8080/deletePrivacyMng', { indx : indx, bbs: bbs })
      .then(returnResponse => {
        if (returnResponse.result === 'Y') {
          alert("삭제 되었습니다.")
          navigate(`/List/${bbs}`);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }


    return (
        <>
            <div className="content_body">
                <p className="menu_title"><AiOutlineForm/> {currentTitle}</p>
                
                <table className="result_table">
                    <colgroup>
                        <col width="10%" />
                        <col width="90%" />
                    </colgroup>
                    <tbody>
                        <tr>
                            <th>제목</th>
                            <td>
                            {privacyVO.privacy_titl}
                            </td>                        
                        </tr>
                        
                        <tr>
                            <th>작성자</th>
                            <td>
                            {privacyVO.privacy_nm}
                            </td>                                  
                        </tr>
                        
                        <tr>
                            <th>내용</th>
                            <td>
                                <CKEditor
                                editor={ClassicEditor}
                                data={privacy_cont || privacyVO.privacy_cont || ""}                     
                                disabled={true}          
                                />
                            </td>
                        </tr>              
                    </tbody>
                </table>
                
                <div className="button_layout">
                    <button className="deleteBtn" type="submit" onClick={() => deletePrivacyList(indx, bbs)}>삭제</button>
                    <button className="modifyBtn" type="submit" onClick={() => modifyPrivacyList(indx, bbs)}>수정</button>
                    <button className="listBtn" type="submit" onClick={() => navigate(`/List/${bbs}`)}>목록</button>
                </div>
            </div>
        </>
    )    

}

export default ReadPrivacy;