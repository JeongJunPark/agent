import { useEffect, useState, useRef } from "react";
import moment from "moment";
import Calendar from 'react-calendar';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.module.css";
import "../styles/datepicker.css";

import {AiOutlineSolution} from "react-icons/ai";
import { PiMicrosoftExcelLogoDuotone } from "react-icons/pi";

import SendAPI from "../utils/SendAPI";
import * as XLSX from 'xlsx';
import NoDataRow from "../utils/NoDataRow";

import "../styles/common.css";
import "../styles/icon.css";

import { AiOutlineBackward } from "react-icons/ai";
import { AiOutlineForward } from "react-icons/ai";
import "../styles/button.css"
const Agent = () => {

    const today = moment();

    // HIST 저장
    useEffect(() => {
        SendAPI("https://dev-home-api.leadcorp.co.kr:8080/agentHistManage", { ID: sessionStorage.getItem('ID'), menu: "에이전트조회", note: '', IP : sessionStorage.getItem('IP') })
            .then((returnResponse) => {
                if (returnResponse) {
                    console.log(returnResponse)
                }
            })
            .catch((error) => {
                console.log(error)
            })

    }, [])

    const [fileName, setFileName] = useState("");
    const [response, setResponse] = useState();
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

    const exportToExcel = () => {
        const table = document.getElementById('tableData'); // 테이블 요소 가져오기
        const ws = XLSX.utils.table_to_sheet(table); // 테이블을 Excel 시트로 변환
        const wb = XLSX.utils.book_new(); // 새 워크북 생성
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1'); // 시트를 워크북에 추가

        // Excel 파일 저장
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
        const s2ab = s => {
            const buf = new ArrayBuffer(s.length);
            const view = new Uint8Array(buf);
            for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
            return buf;
        };
        // const fileName = 'table_data.xlsx';
        const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const formattedData = (data) => {
        const changeData = Number(data).toLocaleString()
        return changeData
    }

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // 로그인 이후 상태값
    const [status, setStatus] = useState({
        auth: sessionStorage.getItem('auth'),
        ID: sessionStorage.getItem('ID')
    });

    // DB로부터 <option> 리스트 추출
    const [agentList, setAgentList] = useState()
    const reqSc = [
        { value: "", name: "전체" },
        { value: "Z", name: "가접수" },
        { value: "B", name: "심사" },
        { value: "C", name: "1차결재" },
        { value: "D", name: "고객확인" },
        { value: "E", name: "2차결재" },
        { value: "M", name: "섹터장결재" },
        { value: "N", name: "본부장결재" },
        { value: "F", name: "대출대상" },
        { value: "Y", name: "대출" },
        { value: "R", name: "보류" },
        { value: "X", name: "거절" },
        { value: "A", name: "접수" },
    ]

    const tlatkArr = ['심사', '1차결재', '고객확인', '2차결재', '섹터장결재', '본부장결재', '접수'];
    const tmddlsArr = ['대출대상', '대출'];

    // 선택한 값
    const [selectedAgent, setSelectedAgent] = useState()
    const [selectedReqSc, setSelectedReqSc] = useState("A")
    const [name, setName] = useState("");
    const [postData, setPostData] = useState({
        startDate: "",
        endDate: ""
    })

    // 날짜 초기화
    useEffect(() => {
        const today = moment();

        const todayDate = today.format("YYYYMMDD");
        setFileName("에이전트 신청 현황" + todayDate + ".xlsx");
    }, [])

    // 에이전트 리스트 체크
    useEffect(() => {
        if (status.auth !== '' && status.auth !== undefined) {
            SendAPI("https://dev-home-api.leadcorp.co.kr:8080/checkAgentList", status)
                .then((returnResponse) => {
                    if (returnResponse) {
                        console.log(returnResponse)
                        setAgentList(returnResponse.agentList)
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        }

    }, [status])


    // 검색 버튼 눌렀을 경우에 실행
    const search = () => {
        setPostData({
            startDate: moment(startDate).format("YYYYMMDD"),
            endDate: moment(endDate).format("YYYYMMDD"),
            name: name,
            reqSc: selectedReqSc,
            agent: selectedAgent === undefined ? '' : selectedAgent
        })
    }

    useEffect(() => {
        if (postData.startDate !== '' && postData.startDate !== undefined) {
            SendAPI('https://dev-home-api.leadcorp.co.kr:8080/agentResult', postData)
                .then((returnResponse) => {
                    if (returnResponse) {
                        console.log(returnResponse);
                        setResponse(returnResponse.searchResult);
                        setData(returnResponse.searchResult);
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }, [postData])

    // 초기 진입 시
    useEffect(() => {
        setPostData({
            startDate: startDate,
            endDate: endDate,
            name: '',
            reqSc: 'A',
            agent: ''

        })
    }, [startDate])

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

    return (
        <>
            <div className="content_body">
                <div className="table-wrapper">
                <div className="result_header">                                
                <p className="menu_title_container">
                <span className="menu_title">
                    <AiOutlineSolution/> 에이전트 신청 목록
                </span>
                <span className="menu_title_right">
                    <button className="excelDownBtn" onClick={exportToExcel}><PiMicrosoftExcelLogoDuotone className="excelIcon"/> 다운로드</button>
                    <button className="searchBtn" onClick={search}>검색</button>
                </span>
                </p>
                <table className="result_table">
                    <tr>
                        <th>에이전트</th>
                        <td>
                            <select onChange={(e) => setSelectedAgent(e.target.value)}>
                                <option value="">선택</option>
                                {agentList && agentList.map((item, index) => (
                                    <option key={index} value={item.ad_medi} >{item.name}</option>
                                ))}
                            </select>
                        </td>
                        <th>신청 상태</th>
                        <td>
                            <select onChange={(e) => setSelectedReqSc(e.target.value)} value={selectedReqSc}>
                                {reqSc && reqSc.map((item, index) => (
                                    <option key={index} value={item.value}>{item.name}</option>
                                ))}
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <th>고객명</th>
                        <td>
                            <input className="searchInput" onChange={(e) => setName(e.target.value)} />
                        </td>
                        <th>신청일</th>
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
                </table>
                </div> 
                <br/>
                <div className="pagination-info">
                    {data.length > 0 ? (
                        <span>Total : {response.length}건 [{currentPage}/{totalPages}] 페이지</span>
                    ) : (
                        <span>Total : 0건</span>
                    )}
                </div>    

                    <div className="grid-wrapper">   
                    <table id="tableData" className="grid">
                        <thead>
                            <tr>
                                <th>순번</th>
                                <th>신청번호</th>
                                <th>신청일시</th>
                                <th>주민번호</th>
                                <th>성명</th>
                                <th>기거래여부</th>
                                <th>상품명</th>
                                <th>상품구분</th>
                                <th>신청금액</th>
                                <th>신청상태</th>
                                <th>상담상세</th>
                                <th>거절사유</th>
                                <th>매체</th>
                                <th>심사팀명</th>
                                <th>관리지점전화</th>
                                <th>승인일시</th>
                                <th>가승인금액</th>
                                <th>실행금액</th>
                            </tr>
                        </thead>
                        <tbody>
                            {response && response.length > 0 ? (currentPosts.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.rnum}</td>
                                    <td>{item.req_no}</td>
                                    <td>{item.rgs_dt}</td>
                                    <td>{item.re_no1}</td>
                                    <td>{item.kor_nm}</td>
                                    <td>{item.cb_req_sect}</td>
                                    <td>{item.gds_nm}</td>
                                    <td>{item.gds_mi_nm}</td>
                                    <td>{item.req_am}</td>
                                    <td>{item.req_stnm}</td>
                                    <td>{item.cnst_dtl_st}</td>
                                    <td>{item.rfsl_rsn_nm}</td>
                                    <td>{item.rct_medinm}</td>
                                    <td>{item.agent_asign_br_nm}</td>
                                    <td>{item.br_tel_no}</td>
                                    <td>{item.apr_dt}</td>
                                    <td>{item.pre_apr_am}</td>
                                    <td>{item.apr_am}</td>
                                </tr>
                            ))) : <NoDataRow colSpan={18} height="550px" /> 
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

                {response && (
                <div className="agent_result_summary">
                {(() => {
                        const summaryData = [
                        { name: '대출신청', count: response?.length || 0, color: '#217346' },
                        { name: '가접수', count: response?.filter(i => i.req_stnm === '가접수').length || 0, color: '#f39c12' },
                        { name: '거절', count: response?.filter(i => i.req_stnm === '거절').length || 0, color: '#e74c3c' },
                        { name: '심사중', count: tlatkArr?.reduce((total, name) => total + response?.filter(i => i.req_stnm === name).length, 0) || 0, color: '#3498db' },
                        { name: '승인', count: tmddlsArr?.reduce((total, name) => total + response?.filter(i => i.req_stnm === name).length, 0) || 0, color: '#2ecc71' },
                        { name: '보류', count: response?.filter(i => i.req_stnm === '보류').length || 0, color: '#9b59b6' },
                        ];

                        const maxCount = Math.max(...summaryData.map(item => item.count), 1); // 0 방지

                        return summaryData.map(item => (
                        <div className="summary-row" key={item.name}>
                        <span className="summary-label">{item.name} ({item.count})</span>
                        <div
                            className="summary-bar"
                            style={{
                            width: `${Math.min(item.count * 10, 200)}px`, // 최대 200px
                            backgroundColor: item.color
                            }}
                        />
                        </div>
                        ));
                    })()}
                </div>                  
                )}
                
                </div>
            </div>
        </>
    )
}

export default Agent