import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import SendAPI from "../utils/SendAPI";
import "../styles/common.css"

import { AiOutlineShop, AiOutlineBackward, AiOutlineForward } from "react-icons/ai";
import NoDataRow from "../utils/NoDataRow";

import "../styles/button.css";
import Loading from '../utils/Loading';


const ManageCompany = () => {

  const location = useLocation()
  const navigate = useNavigate()

  const [data, setData] = useState("")
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

  // HIST 저장
  useEffect(() => {
    SendAPI("https://home-api.leadcorp.co.kr:8080/agentHistManage", { ID: sessionStorage.getItem('ID'), menu: "업체관리", note: '', IP : sessionStorage.getItem('IP') })
      .then((returnResponse) => {
        if (returnResponse) {
          console.log(returnResponse)
        }
      })
      .catch((error) => {
        console.log(error)
      })

  }, [])

  useEffect(() => {
    if (data === '') {
      setLoading(true);
      SendAPI('https://home-api.leadcorp.co.kr:8080/agentUserCompany')
        .then(returnResponse => {
          setData(returnResponse.companyData)
        })
        .catch(error => {
          console.error('API Error:', error);
        })
        .finally(() => {
            setLoading(false);
        });          
    }
  })


  const handleSearch = () => {
    setLoading(true);
    SendAPI('https://home-api.leadcorp.co.kr:8080/searchAgent', { search: keyword })
      .then(returnResponse => {
        setData(returnResponse.searchCompanyData)
      })
      .catch(error => {
        console.error('API Error:', error);
      })
      .finally(() => {
           setLoading(false);
      });       

  }

  const detailAgentCompany = (companyINDX) => {
    navigate("/ModifyCompany", {
      state: {
        companyINDX: companyINDX
      }
    })
  }

  const deleteAgentCompancy = (companyINDX) => {
    SendAPI('https://home-api.leadcorp.co.kr:8080/deleteAgentCompany', { companyINDX : companyINDX })
      .then(returnResponse => {
        if (returnResponse.result === 'Y') {
          alert("삭제 되었습니다.")
          window.location.reload()
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  const section = (e) => {
    if (e == '01') return "본사";
    if (e == '02') return "에이전트";
    if (e == '03') return "차입처";
  }

const [loading, setLoading] = useState(false);

  return (
    <>
            {loading && (
                <Loading />
            )}         
      <div className="content_body">
        <div className="result_header">
        <p className="menu_title"><AiOutlineShop/>  업체 관리

        <div className="search_layout">     
          <select
            name="condition"
            className="form-control"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
          >
            <option value="">전체</option>
            <option value="agent_co">업체명</option>
            <option value="agent_dlgt_id">대표아이디</option>
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
                <th>업체명</th>
                <th>업체구분</th>
                <th>대표아이디</th>
                <th>대표전화</th>
                <th>사용여부</th>
                <th>등록일</th>
                <th>수정</th>
                <th>삭제</th>
              </tr>
            </thead>
            <tbody>
              {data && data.length > 0 ? (
                currentPosts.map((item, index) => (
                  <tr key={item.co_indx}>
                    <td style={{ textAlign: "center" }}>{index + 1 + (currentPage - 1) * postsPerPage}</td>
                    <td>{item.agent_co}</td>
                    <td>{section(item.agent_co_div)}</td>
                    <td>{item.agent_dlgt_id}</td>
                    <td>{item.agent_phn}</td>
                    <td style={{ textAlign: "center" }}>{item.mgr_use_yn}</td>
                    <td>{item.mgr_dt}</td>
                    <td style={{ textAlign: "center" }}><button className="modifyBtn" type="submit" onClick={() => detailAgentCompany(item.co_indx)}>수정</button></td>
                    <td style={{ textAlign: "center" }}><button className="deleteBtn" type="submit" onClick={() => deleteAgentCompancy(item.co_indx)}>삭제</button></td>
                  </tr>
                ))) : 
                   <NoDataRow colSpan={9} height="400px" />
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
            <button className="registBtn" type="submit" onClick={() => navigate('/RegisterCompany')}>등록</button>          
          </div>

      </div>
    </>
  );
};

export default ManageCompany