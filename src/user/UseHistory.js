import { useEffect, useState } from "react";
import SendAPI from "../utils/SendAPI";
import "../styles/common.css"
import { AiOutlineTeam, AiOutlineBackward, AiOutlineForward } from "react-icons/ai";
import NoDataRow from "../utils/NoDataRow";
import DatePicker from "react-datepicker";
import moment from "moment";
const UseHistory = () => {

    const [userHistVO, setUserHist] = useState({});

    const tableRows = [
        { label: "순번"    },
        { label: "사용일시" },
        { label: "아이디"  },
        { label: "이름"    },
        { label: "소속"    },
        { label: "접근화면" },
        { label: "접근IP"  },
        { label: "비고"    }
    ];

    const today = new Date();
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
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);
    const [agentDlgtId, getAgentDlgtId] = useState(sessionStorage.getItem('agent_dlgt_id'));
    const [postData, setPostData] = useState({
        startDate: "",
        endDate: ""
    })

    const renderCustomHeader = ({
        date,
        decreaseMonth,
        increaseMonth,
        prevMonthButtonDisabled,
        nextMonthButtonDisabled,
    }) => {
        // 월을 두 자리 숫자로 포맷팅 (예: 2 -> 02)
        const month = date.getMonth() + 1; // getMonth()는 0부터 시작하므로 1을 더해줌
        const monthFormatted = month < 10 ? `0${month}` : month;

        return (
            <div className="react-datepicker_header">
                <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled} className="datepickerButton">
                    <img src="/images/datepicker_arrow_left.png" />
                </button>
                <span className="react-datepicker_header_span">
                    {date.getFullYear()}.{monthFormatted}
                </span>
                <button onClick={increaseMonth} disabled={nextMonthButtonDisabled} className="datepickerButton">
                    <img src="/images/datepicker_arrow_right.png" />
                </button>
            </div>
        );
    };
    
    useEffect(() => {
        setPostData({
            startDate: startDate,
            endDate: endDate,
            condition: '',
            words: '',
            agent_dlgt_id: ''

        })
    }, [startDate])    

    const search = () => {
        setPostData({
            startDate: moment(startDate).format("YYYYMMDD"),
            endDate: moment(endDate).format("YYYYMMDD"),
            condition: condition === undefined ? '' : condition,
            words: keyword,
            agent_dlgt_id: agentDlgtId
        })
    }

    useEffect(() => {
        if (postData.startDate !== '' && postData.startDate !== undefined) {
            SendAPI("https://dev-home-api.leadcorp.co.kr:8080/getHistRows", {
                ID: sessionStorage.getItem('ID'),
                menu: "사용이력조회",
                note: '',
                IP: sessionStorage.getItem('IP'),
                agent_dlgt_id: agentDlgtId,
                condition: condition === undefined ? '' : condition,
                words: keyword              
            })
                .then((returnResponse) => {
                    if (returnResponse) {
                        console.log(returnResponse);
                        setUserHist(returnResponse);
                        setData(returnResponse);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
            }
        }, [postData]);


    return (
        <>
            <div className="content_body">
                <p className="menu_title"><AiOutlineTeam/> 사용이력 조회</p>

                <table className="result_table">
                    <colgroup>
                        <col width="10%" />
                        <col width="90%" />
                    </colgroup>
                    <tr>
                        <th>조회일자</th>
                        <td>
                            <div className="datepicker-wrapper">
                                <DatePicker
                                renderCustomHeader={renderCustomHeader}
                                id="datepicker1"
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                maxDate={endDate || new Date()}
                                dateFormat="yyyy-MM-dd"
                                locale="ko"
                                placeholderText="시작일"
                                popperPlacement="bottom-start"
                                />
                                ~
                                <DatePicker
                                renderCustomHeader={renderCustomHeader}
                                id="datepicker2"
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                minDate={startDate}
                                maxDate={new Date()}
                                dateFormat="yyyy-MM-dd"
                                locale="ko"
                                placeholderText="종료일"
                                popperPlacement="bottom-start"
                                />
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th>조건검색</th>
                        <td>
                            <select
                                name="condition"
                                className="form-control"
                                value={condition}
                                onChange={(e) => setCondition(e.target.value)}
                            >
                                <option value="">전체</option>
                                <option value="menu_id">접근화면</option>
                                <option value="agent_co">소속</option>
                                <option value="agent_id">아이디</option>
                            </select>                               
                            <input
                                type="text"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                placeholder="검색어"
                                className="searchInput"
                            />
                        </td>
                    </tr>
                </table>

                <div className="pagination-info-wrapper">
                    <div className="pagination-info">
                    <div className="left">
                        {data.length > 0 ? (
                        <span>Total : {data.length}건 [{currentPage}/{totalPages}] 페이지</span>
                        ) : (
                        <span>Total : 0건</span>
                        )}
                    </div>
                    <div className="right">
                        <button className="searchBtn" onClick={search}>검색</button>
                    </div>
                    </div>
                </div>
                
                <div className="grid-wrapper"> 
                    <table className="grid">
                        <thead>
                            <tr>
                                {tableRows.map((row, index) => (
                                    <th>{row.label}</th>
                                 ))}
                            </tr>
                                              
                        </thead>
                        <tbody>
                            {currentPosts && currentPosts.length > 0 ? (
                                currentPosts.map((item, index) => (
                                <tr key={item.co_indx}>
                                    <td style={{ textAlign: "center" }}>{index + 1 + (currentPage - 1) * postsPerPage}</td>
                                    <td>item.access_time</td>
                                    <td>item.agent_id</td>
                                    <td>item.agent_nm</td>
                                    <td>item.agent_co</td>
                                    <td>item.menu_id</td>
                                    <td>item.ip_number</td>
                                    <td>item.note</td>                               
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

            </div>   
        </>
    );

}

export default UseHistory;