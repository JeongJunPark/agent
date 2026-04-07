import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AiOutlineCustomerService } from "react-icons/ai";
import SendAPI from "../../utils/SendAPI";

import "../../styles/common.css";
import "../../styles/button.css";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Loading from '../../utils/Loading';
const BoardModify = () => {
    const API_URL = "https://dev-home-api.leadcorp.co.kr:8080/";
    const navigate = useNavigate();
    const location = useLocation();

    const { art_no, art_id, art_thumb } = useParams();
    const art_indx = location.state?.art_indx;

    const [loading, setLoading] = useState(false);


    const [art_titl, setArtTitl] = useState("");
    const [art_cont, setArtCont] = useState("");
    const [art_ntc, setArtNtc] = useState("N");
    const [art_nm, setArtNm] = useState("");
    const [privacy_id, setPrivacyId] = useState("");

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

    useEffect(() => {
        loadBoard();
    }, []);

	
    const updateWrite = () => {
        const payload = {
            art_no: art_no || "",
            art_titl: art_titl || "",
            art_cont: art_cont || "",
            art_id: art_id || "",
            art_nm: art_nm || "",
            art_ntc: art_ntc || "",
            art_thumb: art_thumb || "",
            art_indx: art_indx || "",
            // art_dt
        };
        console.log("#################### kuks");
        console.log("art_no: ", art_no);

    //   if(file1) formData.append("file1", file1);
    //   if(file2) formData.append("file2", file2);
    //   if(file3) formData.append("file3", file3);
  
      SendAPI("https://dev-home-api.leadcorp.co.kr:8080/updateBoard", payload)
         .then((returnResponse) => {
          console.log(returnResponse)
  
          if (returnResponse.result) {
              alert("수정이 완료 되었습니다.");
              navigate(`/BoardList/${art_no}`);
          }
  
      })
      .catch((error) => {
          alert("입력정보를 확인해주세요.")
          console.log(error)
      })
  };	

    return (
        <div className="content_body">
            <p className="menu_title">
                <AiOutlineCustomerService /> 공지/뉴스 수정
            </p>

            {loading ? (
                <Loading />
            ) : (
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
                                    onChange={(e) =>
                                        setArtTitl(e.target.value)
                                    }
                                />
                            </td>
                        </tr>

                        <tr>
                            <th>공지</th>
                            <td>
                                Y{" "}
                                <input
                                    type="radio"
                                    value="Y"
                                    checked={art_ntc === "Y"}
                                    onChange={(e) =>
                                        setArtNtc(e.target.value)
                                    }
                                />
                                &nbsp; N{" "}
                                <input
                                    type="radio"
                                    value="N"
                                    checked={art_ntc === "N"}
                                    onChange={(e) =>
                                        setArtNtc(e.target.value)
                                    }
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
                                    onChange={(e) =>
                                        setFile1(e.target.files[0])
                                    }
                                />
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <input
                                    type="file"
                                    onChange={(e) =>
                                        setFile2(e.target.files[0])
                                    }
                                />
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <input
                                    type="file"
                                    onChange={(e) =>
                                        setFile3(e.target.files[0])
                                    }
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            )}

            <div className="button_layout">
                <button className="modifyBtn" onClick={updateWrite}>
                    수정
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

export default BoardModify;