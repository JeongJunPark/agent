import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import SendAPI from "../utils/SendAPI";
import "../styles/common.css"

const ManageUser = () => {

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
                    setData(returnResponse.userData)
                })
                .catch(error => {
                    console.error('API Error:', error);
                });
        }
    })


    const handleSearch = () => {
        SendAPI('https://home-api.leadcorp.co.kr:8080/searchAgent', { search: keyword })
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
                <p className="menu_title">사용자 관리</p>
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
                                <td>아이디</td>
                                <td>이름</td>
                                <td>소속</td>
                                <td>부서</td>
                                <td>연락처</td>
                                <td>사용여부</td>
                                <td>접속 아이피</td>
                                <td>접속일</td>
                                <td>수정</td>
                                <td>삭제</td>
                            </tr>
                        </thead>

                        <tbody>
                            {data.length > 0 && (
                                currentPosts.map((item, index) => (
                                    <tr key={item.co_indx}>
                                        <td>{index + 1 + (currentPage - 1) * postsPerPage}</td>
                                        <td>{item.agent_id}</td>
                                        <td>{item.agent_nm}</td>
                                        <td>{item.agent_co}</td>
                                        <td>{item.agent_dept}</td>
                                        <td>{item.agent_phn}</td>
                                        <td>{item.mgr_use_yn}</td>
                                        <td>{item.mgr_ip}</td>
                                        <td>{item.mgr_last}</td>
                                        <td><button className="loginBtn" type="submit" onClick={() => detailAgentUser(item.agent_indx)}>수정</button></td>
                                        <td><button className="loginBtn" type="submit" onClick={() => deleteAgentUser(item.agent_indx)}>삭제</button></td>
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

export default ManageUser