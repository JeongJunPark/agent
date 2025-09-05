import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import SendAPI from "../utils/SendAPI";
import "../styles/common.css"

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
      SendAPI('https://home-api.leadcorp.co.kr:8080/agentUserCompany')
        .then(returnResponse => {
          setData(returnResponse.companyData)
        })
        .catch(error => {
          console.error('API Error:', error);
        });
    }
  })


  const handleSearch = () => {
    SendAPI('https://home-api.leadcorp.co.kr:8080/searchAgent', { search: keyword })
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


  return (
    <>
      <div className="content_body">
        <p className="menu_title">업체 관리</p>
        <div className="search_layout">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="검색어"
            className="searchInput"
          />
          <button className="loginBtn" onClick={handleSearch}>검색</button>
        </div>

        <div className="manage_result_layout">
          <table className="result_table" border="1">
            <thead>
              <tr>
                <td>번호</td>
                <td>업체명</td>
                <td>업체구분</td>
                <td>대표아이디</td>
                <td>대표전화</td>
                <td>사용여부</td>
                <td>등록일</td>
                <td>수정</td>
                <td>삭제</td>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 && (
                currentPosts.map((item, index) => (
                  <tr key={item.co_indx}>
                    <td>{index + 1 + (currentPage - 1) * postsPerPage}</td>
                    <td>{item.agent_co}</td>
                    <td>{section(item.agent_co_div)}</td>
                    <td>{item.agent_dlgt_id}</td>
                    <td>{item.agent_phn}</td>
                    <td>{item.mgr_use_yn}</td>
                    <td>{item.mgr_dt}</td>
                    <td><button className="loginBtn" type="submit" onClick={() => detailAgentCompany(item.co_indx)}>수정</button></td>
                    <td><button className="loginBtn" type="submit" onClick={() => deleteAgentCompancy(item.co_indx)}>삭제</button></td>
                  </tr>
                )))}
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
    </>
  );
};

export default ManageCompany