import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AiOutlineCustomerService } from "react-icons/ai";
import SendAPI from "../../utils/SendAPI";
import SendFileAPI from "../../utils/SendFileAPI";

import "../../styles/common.css";
import "../../styles/button.css";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const BoardWrite = () => {

    const API_URL = "https://home-api.leadcorp.co.kr:8080/";

    const navigate = useNavigate();
    const location = useLocation();
    const { art_no } = useParams();

    const [art_titl, setArtTitl] = useState('');
    const [art_cont, setArtCont] = useState('');
    const [art_id, setArtId] = useState('');
    const [art_nm, setArtNm] = useState('');
    const [art_ntc, setArtNtc] = useState('N');
    const [art_thumb, setArtThumb] = useState('');

    const [file1, setFile1] = useState(null);
    const [file2, setFile2] = useState(null);
    const [file3, setFile3] = useState(null);

    useEffect(() => {
        const id = sessionStorage.getItem("ID") || "";
        const name = sessionStorage.getItem("userName") || "";
        setArtId(id);
        setArtNm(name);
    }, []);

    // 🔥 게시글 등록
    const insertWrite = async () => {
        try {
            const payload = {
                art_no: art_no || "",
                art_titl: art_titl || "",
                art_cont: art_cont || "",
                art_id: art_id || "",
                art_nm: art_nm || "",
                art_ntc: art_ntc || "",
                art_thumb: art_thumb || "",
            };

            const res = await SendAPI(`${API_URL}insertBoard`, payload);

            console.log("insert res:", res);

            if (res?.result) {
                const new_indx = res.art_indx;
                console.log("file1: ", file1);
                // 파일 있을 때만 업로드
                if (file1 || file2 || file3) {
                    await addFile(new_indx);
                }

                alert("등록 완료");
                navigate(`/BoardList/${art_no}`);
            } else {
                alert("등록 실패");
            }

        } catch (error) {
            console.error(error);
            alert("입력정보를 확인해주세요.");
        }
    };

    // 🔥 파일 업로드
  const addFile = async (paramIndx) => {
    try {
        const files = [file1, file2, file3];
        console.log("file1: ", file1);
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (!file) continue;

            const formData = new FormData();

            formData.append("file_art", paramIndx);
            formData.append("file_no", i + 1);
            formData.append("file_filenm", file.name);
            formData.append("file_orgnm", file.name);
            formData.append("file_dt", new Date().toISOString());
            formData.append("file1", file);

            const res = await SendFileAPI(
                `${API_URL}insertBoardFiles`,
                formData
            );

            console.log("file upload:", res);
        }

    } catch (error) {
        console.error(error);
        alert("파일 업로드 실패");
    }
};

    return (
        <div className="content_body">
            <p className="menu_title">
                <AiOutlineCustomerService /> 공지/뉴스 등록
            </p>

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
                                value={art_titl}
                                onChange={(e) => setArtTitl(e.target.value)}
                            />
                        </td>
                    </tr>

                    <tr>
                        <th>공지</th>
                        <td>
                            Y
                            <input
                                type="radio"
                                value="Y"
                                checked={art_ntc === 'Y'}
                                onChange={(e) => setArtNtc(e.target.value)}
                            />
                            &nbsp;
                            N
                            <input
                                type="radio"
                                value="N"
                                checked={art_ntc === 'N'}
                                onChange={(e) => setArtNtc(e.target.value)}
                            />
                        </td>
                    </tr>

                    <tr>
                        <th>작성자</th>
                        <td>
                            <input
                                className="tdInputReadonly"
                                value={art_nm}
                                readOnly
                            />
                        </td>
                    </tr>

                    <tr>
                        <th>내용</th>
                        <td>
                            <CKEditor
                                editor={ClassicEditor}
                                data={art_cont}
                                onChange={(event, editor) => {
                                    setArtCont(editor.getData());
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
                <button className="modifyBtn" onClick={insertWrite}>
                    등록
                </button>
                <button
                    className="listBtn"
                    onClick={() => navigate(`/BoardList/${art_no}`)}
                >
                    목록
                </button>
            </div>
        </div>
    );
};

export default BoardWrite;