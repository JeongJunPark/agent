import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate, Link, useParams } from 'react-router-dom';
import SendAPI from "../../utils/SendAPI";
import "./../../styles/common.css"

import { AiFillSetting, AiOutlineBackward, AiOutlineForward, AiOutlineCustomerService } from "react-icons/ai";
import NoDataRow from "../../utils/NoDataRow";

import "./../../styles/button.css";
import Loading from '../../utils/Loading';


const BoardList = () => {

  const API_URL = "https://dev-home-api.leadcorp.co.kr:8080/";

  const getBoardRows = `${API_URL}getBoardRows`;
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const [pageGroupStart, setPageGroupStart] = useState(1); // 10개 단위 시작 페이
  const totalPages = Math.ceil(data.length / postsPerPage)
  // 현재 페이지에 해당하는 데이터 계산
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = data.slice(indexOfFirstPost, indexOfLastPost)
  // 페이지 번호 클릭 처리
  const paginate = (pageNumber) => setCurrentPage(pageNumber)
  // 이전 10페이지
  const handlePrevGroup = () => {
  const newStart = Math.max(pageGroupStart - 10, 1);
  setPageGroupStart(newStart);
  setCurrentPage(newStart);
  }
  // 다음 10페이지
  const handleNextGroup = () => {
  const newStart = pageGroupStart + 10;
  if (newStart <= totalPages) {
      setPageGroupStart(newStart);
      setCurrentPage(newStart);
  }
  };
  const [keyword, setKeyword] = useState("");
  const [condition, setCondition] = useState("");

  const { art_no } = useParams();

const fetchBoardRows = async (API_URL, params) => {
  try {
    setLoading(true);

    const response = await SendAPI(API_URL, params);

    if (response) {
      setData(response.result);
    }
  } catch (error) {
    console.error("API Error:", error);
  } finally {
    setLoading(false);
  }
};

  // 공지/뉴스 게시판 Row
  useEffect(() => {
    fetchBoardRows(
      getBoardRows,
      {
        words: keyword,
        condition: condition,
        bbs: art_no,
      }
    );
  }, []);

  // 게시글 검색
  const handleSearch = () => {
    fetchBoardRows(
      getBoardRows,
      {
        words: keyword,
        condition: condition,
        bbs: art_no,
      }
    );
  };
  
  const modifyBoard = (art_indx) => {
    navigate(`/BoardModify/${art_no}`, { state: { art_indx } });
  }

  const deleteBoard = (art_no, art_indx) => {

  if(!window.confirm("삭제하시겠습니까?")) return;

  SendAPI('https://dev-home-api.leadcorp.co.kr:8080/deleteBoardRow', { 
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



  return (
    <>
            {loading && (
                <Loading />
            )}         
      <div className="content_body">
        <div className="result_header">
        <p className="menu_title"><AiOutlineCustomerService/> 공지/뉴스
        <div className="search_layout">     
          <select
            name="condition"
            className="form-control"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
          >
            <option value="">전체</option>
            <option value="art_cont">내용</option>
            <option value="art_nm">작성자</option>
            <option value="art_titl">제목</option>
          </select>         

          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="검색어"
            className="searchInput"
          />
          <button className="searchBtn" onClick={handleSearch}>검색</button>
        </div>
        </p>
      </div>

        <div className="pagination-info">
          {data.length > 0 ? (
            <span>Total : {data.length}건 [{currentPage}/{totalPages}] 페이지</span>
          ) : (
            <span>Total : 0건</span>
          )}
        </div>

          <div className="grid-wrapper"> 
          <table className="grid">
            <thead>
              <tr>
                <th>번호</th>
                <th>제목</th>
                <th>공지</th>
                <th>작성자</th>
                <th>조회수</th>
                <th>등록일</th>
                <th>수정</th>
                <th>삭제</th>
              </tr>
            </thead>
            <tbody>
              {data && data.length > 0 ? (
                data.map((item) =>
                  item.art_ntc === "Y" ? (
                    <tr key={item.art_indx}>
                      <td style={{ textAlign: "center" }}>[공지]</td>
                      <td style={{
                          textAlign: "center",
                          color: "#0069a6",
                          cursor: "pointer",
                          textDecoration: "underline"
                      }}
                     onClick={() => navigate(`/BoardRead/${item.art_indx}/${art_no}`)}>{item.art_titl}
                     </td>
                      <td style={{ textAlign: "center" }}>{item.art_ntc}</td>
                      <td style={{ textAlign: "center" }}>{item.art_nm}</td>
                      <td style={{ textAlign: "center" }}>{item.art_hit}</td>
                      <td style={{ textAlign: "center" }}>{item.art_dt}</td>
                      <td style={{ textAlign: "center" }}>
                        <button className="modifyBtn" onClick={() => modifyBoard(item.art_indx)}>수정</button>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <button className="deleteBtn" onClick={() => deleteBoard(item.art_no, item.art_indx)}>삭제</button>
                      </td>
                    </tr>
                  ) : null
                )
              ) : ("")
              }

              {data && data.length > 0 ? (
                currentPosts.map((item, index) => (
                  <tr key={item.art_indx}>
                    <td style={{ textAlign: "center" }}>{index + 1 + (currentPage - 1) * postsPerPage}</td>
                    <td style={{
                        textAlign: "center",
                        color: "#0069a6",
                        cursor: "pointer",
                        textDecoration: "underline"
                    }}
                     onClick={() => navigate(`/BoardRead/${item.art_indx}/${art_no}`)}>{item.art_titl}</td>                    
                    <td style={{ textAlign: "center" }}>{item.art_ntc}</td>
                    <td style={{ textAlign: "center" }}>{item.art_nm}</td>
                    <td style={{ textAlign: "center" }}>{item.art_hit}</td>
                    <td style={{ textAlign: "center" }}>{item.art_dt}</td>                
                    <td style={{ textAlign: "center" }}><button className="modifyBtn" type="submit" onClick={() => modifyBoard(item.art_indx)}>수정</button></td>
                    <td style={{ textAlign: "center" }}><button className="deleteBtn" type="submit" onClick={() => deleteBoard(item.art_no, item.art_indx)}>삭제</button></td>
                  </tr>
                ))) : 
                   <NoDataRow colSpan={8} height="400px" />
              }
            </tbody>
          </table>
          </div>
          <div className="pagenation">
          {pageGroupStart > 1 && <a onClick={handlePrevGroup}><AiOutlineBackward/></a>}

          {Array.from(
              { length: Math.min(10, totalPages - pageGroupStart + 1) },
              (_, i) => pageGroupStart + i
          ).map((number) => (
              <p key={number} className={number === currentPage ? "active" : null}>
              <a onClick={() => paginate(number)}>{number}</a>
              </p>
          ))}

          {pageGroupStart + 10 <= totalPages && <a onClick={handleNextGroup}><AiOutlineForward/></a>}
          </div>    

          <div className='right-button-container'>
            <button className="registBtn" type="submit" onClick={() => navigate(`/BoardWrite/${art_no}`)}>등록</button>          
          </div>

      </div>
    </>
  );
};

export default BoardList;