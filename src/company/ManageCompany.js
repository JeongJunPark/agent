import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import SendAPI from "../utils/SendAPI";
import "../styles/common.css"

import { AiOutlineShop } from "react-icons/ai";
import NoDataRow from "../utils/NoDataRow";


const ManageCompany = () => {

  const location = useLocation()
  const navigate = useNavigate()

  const [data, setData] = useState("")
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);

  // 현재 페이지에 해당하는 데이터 계산
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = data.slice(indexOfFirstPost, indexOfLastPost);

  // 페이지 번호 클릭 처리
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const [keyword, setKeyword] = useState("");
  const [condition, setCondition] = useState("");

  // HIST 저장
  useEffect(() => {
    SendAPI("https://dev-home-api.leadcorp.co.kr:8080/agentHistManage", { ID: sessionStorage.getItem('ID'), menu: "업체관리", note: '', IP : sessionStorage.getItem('IP') })
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
      SendAPI('https://dev-home-api.leadcorp.co.kr:8080/agentUserCompany')
        .then(returnResponse => {
          setData(returnResponse.companyData)
        })
        .catch(error => {
          console.error('API Error:', error);
        });
    }
  })


  const handleSearch = () => {
    SendAPI('https://dev-home-api.leadcorp.co.kr:8080/searchAgent', { search: keyword })
      .then(returnResponse => {
        setData(returnResponse.searchCompanyData)
      })
      .catch(error => {
        console.error('API Error:', error);
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
    SendAPI('https://dev-home-api.leadcorp.co.kr:8080/deleteAgentCompany', { companyINDX : companyINDX })
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


  return (
    <>
      <div className="content_body">
        <div className="table-wrapper">
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
          <button className="loginBtn" onClick={handleSearch}>검색</button>
        </div>
        </p>

        <div className="manage_result_layout">
          <table className="result_table" border="1">
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
              {data.length > 0 ? (
                currentPosts.map((item, index) => (
                  <tr key={item.co_indx}>
                    <td style={{ textAlign: "center" }}>{index + 1 + (currentPage - 1) * postsPerPage}</td>
                    <td>{item.agent_co}</td>
                    <td>{section(item.agent_co_div)}</td>
                    <td>{item.agent_dlgt_id}</td>
                    <td>{item.agent_phn}</td>
                    <td style={{ textAlign: "center" }}>{item.mgr_use_yn}</td>
                    <td>{item.mgr_dt}</td>
                    <td><button className="loginBtn" type="submit" onClick={() => detailAgentCompany(item.co_indx)}>수정</button></td>
                    <td><button className="loginBtn" type="submit" onClick={() => deleteAgentCompancy(item.co_indx)}>삭제</button></td>
                  </tr>
                ))) : 
                   <NoDataRow colSpan={9} height="400px" />
              }
            </tbody>
          </table>
          </div>

        <div className="pagenation">
          {Array.from({ length: Math.ceil(data.length / postsPerPage) }, (_, i) => i + 1).map(number => (
            <span key={number}>
              <p className={number === currentPage ? "active" : null}>
                <a onClick={() => paginate(number)}>{number}</a>
              </p>
            </span>
          ))}
        </div>
        </div>
      </div>
    </>
  );
};

export default ManageCompany