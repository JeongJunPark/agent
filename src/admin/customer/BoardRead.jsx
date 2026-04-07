import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AiOutlineForm, AiOutlineCustomerService } from "react-icons/ai";
import SendAPI from "../../utils/SendAPI";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "../../styles/common.css"
import "../../styles/button.css"

const BoardRead = ({ menuItems }) => {
    const API_URL = "https://dev-home-api.leadcorp.co.kr:8080/";
    
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const { art_no, art_indx, art_id, art_thumb } = useParams();

    console.log("art_indx: read --> : ", art_indx)

    const [privacy_id, setPrivacyId] = useState('');
    const [data, setData] = useState([]);

    const [art_titl, setArtTitl] = useState("");
    const [art_cont, setArtCont] = useState("");
    const [art_ntc, setArtNtc] = useState("N");
    const [art_nm, setArtNm] = useState("");    
    const [file1, setFile1] = useState(null);
    const [file2, setFile2] = useState(null);
    const [file3, setFile3] = useState(null);

    useEffect(() => {
        const id = sessionStorage.getItem("ID") || "";
        const name = sessionStorage.getItem("userName") || "";
        
        setPrivacyId(id);
        setArtNm(name);
    }, []);    

    
        const loadBoard = async () => {
        try {
            setLoading(true);

            const response = await SendAPI(`${API_URL}getBoardRow`, {
                bbs: art_no,
                indx: art_indx,
            });

            if (response?.result) {
                const row = Array.isArray(response.result)
                    ? response.result[0]
                    : response.result;

                setArtTitl(row.art_titl || "");
                setArtCont(row.art_cont || "");
                setArtNtc(row.art_ntc || "N");
                setArtNm(row.art_nm || "");
            }
        } catch (error) {
            console.error("조회 실패:", error);
        } finally {
            setLoading(false);
        }
    };


  const modifyBoard = (art_indx) => {
    navigate(`/BoardModify/${art_no}`, { state: { art_indx } });
  }

    const deleteBoard = (art_no, art_indx) => {

    if(!window.confirm("삭제하시겠습니까?")) return;

    SendAPI(`API_URL${deleteBoard}`, { 
        bbs: art_no, 
        indx: art_indx 
    })
    .then(res => {
        if(res.result){
        alert("삭제되었습니다")

        setData(prev => prev.filter(item => item.art_indx !== art_indx))
        }
    })
    }


    
    useEffect(() => {
        loadBoard();
    }, []);

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
                            {art_titl}
                            </td>                        
                        </tr>
                        <tr>
                            <th>공지</th>
                            <td>
                            {art_ntc}                         
                            </td>
                        </tr>
                        
                        <tr>
                            <th>작성자</th>
                            <td>
                            {art_nm}
                            </td>                                  
                        </tr>
                        
                        <tr>
                            <th>내용</th>
                            <td>
                            <CKEditor
                            editor={ClassicEditor}
                            data={art_cont || ""}                     
                            disabled={true}          
                            />                            
                            </td>
                        </tr>

                        <tr>
                            <th rowSpan={3}>첨부파일</th>
                            <td>
                            {file1}
                            </td>
                        </tr>

                        <tr>
                            <td>
                            {file2}
                            </td>
                        </tr>

                        <tr>
                            <td>
                            {file3}                            
                            </td>
                        </tr>            
                    </tbody>
                </table>
                
                <div className="button_layout">
                    <button className="deleteBtn" type="submit" onClick={() => deleteBoard(art_no, art_indx)}>삭제</button>
                    <button className="modifyBtn" type="submit" onClick={() => modifyBoard(art_indx)}>수정</button>
                    <button className="listBtn" type="submit" onClick={() => navigate(`/BoardList/${art_no}`)}>목록</button>
                </div>
            </div>
        </>
    )    

}

export default BoardRead;