import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AiOutlineForm, AiOutlineCustomerService } from "react-icons/ai";
import SendAPI from "../../utils/SendAPI";

import "../../styles/common.css"
import "../../styles/button.css"

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
const BoardModify = ({ menuItems }) => {
        
    const navigate = useNavigate();

    const [art_titl, setArtTitl ] = useState('');
    const [art_cont, setArtCont ] = useState('');

    const [privacy_id, setPrivacyId] = useState('');
    const [art_nm, setArtNm] = useState('');
    const [art_ntc, setArtNtc] = useState('N');
    
    const [file1, setFile1] = useState(null);
    const [file2, setFile2] = useState(null);
    const [file3, setFile3] = useState(null);

    useEffect(() => {
        const id = sessionStorage.getItem("ID") || "";
        const name = sessionStorage.getItem("userName") || "";
        setPrivacyId(id);
        setArtNm(name);
    }, []);    


    const insertWrite = () => {

        const formData = new FormData();

        formData.append("art_titl", art_titl || "");
        formData.append("art_cont", art_cont || "");
        formData.append("privacy_id", privacy_id || "");
        formData.append("art_nm", art_nm || "");
        formData.append("art_ntc", art_ntc || "");

        if(file1) formData.append("file1", file1);
        if(file2) formData.append("file2", file2);
        if(file3) formData.append("file3", file3);

        fetch("https://home-api.leadcorp.co.kr:8080/insertWrite", {
            method: "POST",
            body: formData
        })
        .then(res => res.json())
        .then((returnResponse) => {
            console.log(returnResponse)
            if (returnResponse.result) {
                alert("등록이 완료 되었습니다.");
                navigate(`/Board`);
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
                <p className="menu_title"><AiOutlineCustomerService/> 공지/뉴스 등록</p>
                
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
                                    value={art_titl || ""} 
                                    onChange={(e) => setArtTitl(e.target.value)}
                                />
                            </td>                        
                        </tr>
                        <tr>
                            <th>공지</th>
                            <td>
                                Y <input type="radio" value="Y" checked={art_ntc === 'Y'} onChange={(e) => setArtNtc(e.target.value)} /> &nbsp;
                                N <input type="radio" value="N" checked={art_ntc === 'N'} onChange={(e) => setArtNtc(e.target.value)} />                           
                            </td>
                        </tr>
                        
                        <tr>
                            <th>작성자</th>
                            <td>
                                <input 
                                    className="tdInputReadonly" 
                                    value={art_nm || ""} 
                                    readOnly
                                />
                            </td>                                  
                        </tr>
                        
                        <tr>
                            <th>내용</th>
                            <td>
                                <CKEditor
                                editor={ClassicEditor}
                                data={art_cont || ""}                                          
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    setArtCont(data);
                                }}
                                />
                            </td>
                        </tr>

                        <tr>
                            <th rowSpan={3}>첨부파일</th>
                            <td>
                                <input 
                                    type="file"
                                    onChange={(e) => setFile1(e.target.files[0])}
                                />
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <input 
                                    type="file"
                                    onChange={(e) => setFile2(e.target.files[0])}
                                />
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <input 
                                    type="file"
                                    onChange={(e) => setFile3(e.target.files[0])}
                                />
                            </td>
                        </tr>            
                    </tbody>
                </table>
                
                <div className="button_layout">
                    <button className="modifyBtn" type="submit" onClick={insertWrite}>등록</button>
                    <button className="listBtn" type="submit" onClick={() => navigate(`/Board`)}>목록</button>
                </div>
            </div>
        </>
    )    

}

export default BoardModify;