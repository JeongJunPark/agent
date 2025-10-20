import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineForm, AiOutlineBackward, AiOutlineForward } from "react-icons/ai";

import SendAPI from "../../utils/SendAPI";

import "../../styles/common.css"
import NoDataRow from "../../utils/NoDataRow";
import "../../styles/button.css"
import Loading from '../../utils/Loading';



const PrivacyList = ({ menuItems }) => {
    const { pageId } = useParams();
    const currentTitle = menuItems.find(item => item.key === pageId)?.label || "";

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
    const [condition, setCondition] = useState("");  
    
    const [loading, setLoading] = useState(false);

    console.log("pageId --?", pageId)
    useEffect(() => {
            setLoading(true);
            SendAPI('https://dev-home-api.leadcorp.co.kr:8080/getPrivacyRowsMng', { bbs : pageId })
                .then(returnResponse => {
                    setData(returnResponse.result)
                })
                .catch(error => {
                    console.error('API Error:', error);
                })
                .finally(() => {
                    setLoading(false);
                });                      
    }, [pageId])



    const handleSearch = () => {
        setLoading(true);
        SendAPI('https://dev-home-api.leadcorp.co.kr:8080/getPrivacyRowsMng', { words: keyword, condition: condition, bbs : pageId })
            .then(returnResponse => {
                setData(returnResponse.result)
            })
            .catch(error => {
                console.error('API Error:', error);
            })
            .finally(() => {
                setLoading(false);
            });                      

    }

    const modifyPrivacyList = (indx, pageId) => {
        navigate(`/ModifyPrivacy/${indx}/${pageId}`);
    }

    const deletePrivacyList = (indx, bbs) => {
        SendAPI('https://dev-home-api.leadcorp.co.kr:8080/deletePrivacyMng', { indx : indx, bbs: pageId })
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
            {loading && (
                <Loading />
            )}                 
            <div className="content_body">
                    <div className="result_header">           
                <p className="menu_title"><AiOutlineForm/> {currentTitle}

                <div className="search_layout">     
                <select
                    name="condition"
                    className="form-control"
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                >
                    <option value="">전체</option>
                    <option value="privacy_cont">내용</option>
                    <option value="privacy_nm">작성자</option>
                    <option value="privacy_titl">제목</option>
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
                    <table className="grid" border="1">
                        <thead>
                            <tr>
                                <th>번호</th>
                                <th>제목</th>
                                <th>작성자</th>
                                <th>등록일</th>
                                <th>수정</th>
                                <th>삭제</th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.length > 0 ? (
                                currentPosts.map((item, index) => (
                                    <tr key={item.privacy_indx}>
                                        <td style={{ textAlign: "center" }}>{index + 1 + (currentPage - 1) * postsPerPage}</td>
                                        <td style={{
                                            textAlign: "center",
                                            color: "#0069a6",
                                            cursor: "pointer",
                                            textDecoration: "underline"
                                        }}
                                         onClick={() => navigate(`/ReadPrivacy/${item.privacy_indx}/${pageId}`)}>{item.privacy_titl}</td>
                                        <td style={{ textAlign: "center" }}>{item.privacy_nm}</td>
                                        <td style={{ textAlign: "center" }}>{item.privacy_dt}</td>
                                        <td style={{ textAlign: "center" }}><button className="loginBtn" type="submit" onClick={() => modifyPrivacyList(item.privacy_indx, pageId)}>수정</button></td>
                                        <td style={{ textAlign: "center" }}><button className="loginBtn" type="submit" onClick={() => deletePrivacyList(item.privacy_indx, pageId)}>삭제</button></td>
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
                        <button className="loginBtn" type="submit" onClick={() => navigate(`/RegisterPrivacy/${pageId}`)}>등록</button>          
                    </div>                         
            </div>
        </>

  );



}

export default PrivacyList;