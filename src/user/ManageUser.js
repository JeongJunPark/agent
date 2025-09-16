import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import SendAPI from "../utils/SendAPI";
import "../styles/common.css"
import NoDataRow from "../utils/NoDataRow";
import { AiOutlineTeam } from "react-icons/ai";
import { AiOutlineBackward } from "react-icons/ai";
import { AiOutlineForward } from "react-icons/ai";
import "../styles/button.css"
const ManageUser = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const [data, setData] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(10);
    const [pageGroupStart, setPageGroupStart] = useState(1); // 10개 단위 시작 페이지

    const totalPages = Math.ceil(data.length / postsPerPage);

    // 현재 페이지에 해당하는 데이터 계산
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = data.slice(indexOfFirstPost, indexOfLastPost);

    // 페이지 번호 클릭 처리
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // 이전 10페이지
    const handlePrevGroup = () => {
    const newStart = Math.max(pageGroupStart - 10, 1);
    setPageGroupStart(newStart);
    setCurrentPage(newStart);
    };

    // 다음 10페이지
    const handleNextGroup = () => {
    const newStart = pageGroupStart + 10;
    if (newStart <= totalPages) {
        setPageGroupStart(newStart);
        setCurrentPage(newStart);
    }
    };
    const [keyword, setKeyword] = useState("");

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
                    setData(returnResponse.userData)
                })
                .catch(error => {
                    console.error('API Error:', error);
                });
        }
    })


    const handleSearch = () => {
        SendAPI('https://dev-home-api.leadcorp.co.kr:8080/searchAgent', { search: keyword })
            .then(returnResponse => {
                setData(returnResponse.searchUserData)
            })
            .catch(error => {
                console.error('API Error:', error);
            });

    }

    const detailAgentUser = (userINDX) => {
        navigate("/ModifyUser", {
            state: {
                userINDX: userINDX
            }
        })
    }

    const deleteAgentUser = (userINDX) => {
        SendAPI('https://dev-home-api.leadcorp.co.kr:8080/deleteAgentUser', { userINDX: userINDX })
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


    return (
        <>
            <div className="content_body">             
                <p className="menu_title"><AiOutlineTeam/> 사용자 관리
                <div className="search_layout">
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
                    <div className="grid-wrapper">   
                    <table className="grid" border="1">
                        <thead>
                            <tr>
                                <th>번호</th>
                                <th>아이디</th>
                                <th>이름</th>
                                <th>소속</th>
                                <th>부서</th>
                                <th>연락처</th>
                                <th>사용여부</th>
                                <th>접속 아이피</th>
                                <th>접속일</th>
                                <th>수정</th>
                                <th>삭제</th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.length > 0 ? (
                                currentPosts.map((item, index) => (
                                    <tr key={item.co_indx}>
                                        <td style={{ textAlign: "center" }}>{index + 1 + (currentPage - 1) * postsPerPage}</td>
                                        <td>{item.agent_id}</td>
                                        <td>{item.agent_nm}</td>
                                        <td>{item.agent_co}</td>
                                        <td>{item.agent_dept}</td>
                                        <td style={{ textAlign: "center" }}>{item.agent_phn}</td>
                                        <td style={{ textAlign: "center" }}>{item.mgr_use_yn}</td>
                                        <td>{item.mgr_ip}</td>
                                        <td>{item.mgr_last}</td>
                                        <td style={{ textAlign: "center" }}><button className="loginBtn" type="submit" onClick={() => detailAgentUser(item.agent_indx)}>수정</button></td>
                                        <td style={{ textAlign: "center" }}><button className="loginBtn" type="submit" onClick={() => deleteAgentUser(item.agent_indx)}>삭제</button></td>
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
                        <button className="loginBtn" type="submit" onClick={() => navigate('/RegisterUser')}>등록</button>          
                    </div>                         
            </div>
        </>
    );
};

export default ManageUser;