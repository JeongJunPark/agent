import { useEffect, useState, useRef } from "react";
import moment from "moment";
import Calendar from 'react-calendar';
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.module.css";
import "./styles/datepicker.css";

import SendAPI from "./utils/SendAPI";
import * as XLSX from 'xlsx';
import MyPage from "./MyPage";

// import "./styles/borrower.css"
import "./styles/common.css"
// import "./styles/modify.css"

const Agent = () => {

    const today = moment();

    // HIST 저장
    useEffect(() => {
        SendAPI("https://home-api.leadcorp.co.kr:8080/agentHistManage", { ID: sessionStorage.getItem('ID'), menu: "에이전트조회", note: '', IP : sessionStorage.getItem('IP') })
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

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

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
    const [response, setResponse] = useState()

    // 날짜 초기화
    useEffect(() => {
        const today = moment();

        const todayDate = today.format("YYYYMMDD");
        setFileName("에이전트 신청 현황" + todayDate + ".xlsx");
    }, [])

    // 에이전트 리스트 체크
    useEffect(() => {
        if (status.auth !== '' && status.auth !== undefined) {
            SendAPI("https://home-api.leadcorp.co.kr:8080/checkAgentList", status)
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
            SendAPI('https://home-api.leadcorp.co.kr:8080/agentResult', postData)
                .then((returnResponse) => {
                    if (returnResponse) {
                        console.log(returnResponse)
                        setResponse(returnResponse.searchResult)
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
            <MyPage />
            <div className="content_body">
                <p className="menu_title">에이전트 신청 목록</p>
                <table className="result_table" border="1">
                    <tr>
                        <td className="table_td_title">에이전트</td>
                        <td className="table_td_value">
                            <select onChange={(e) => setSelectedAgent(e.target.value)}>
                                <option value="">선택</option>
                                {agentList && agentList.map((item, index) => (
                                    <option key={index} value={item.ad_medi} >{item.name}</option>
                                ))}
                            </select>
                        </td>
                        <td className="table_td_title">신청 상태</td>
                        <td className="table_td_value">
                            <select onChange={(e) => setSelectedReqSc(e.target.value)} value={selectedReqSc}>
                                {reqSc && reqSc.map((item, index) => (
                                    <option key={index} value={item.value}>{item.name}</option>
                                ))}
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td className="table_td_title">고객명</td>
                        <td className="table_td_value">
                            <input className="searchInput" onChange={(e) => setName(e.target.value)} />
                        </td>
                        <td className="table_td_title">신청일</td>
                        <td className="table_td_value">
                            <DatePicker
                                renderCustomHeader={renderCustomHeader}
                                id="datepicker1"
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                maxDate={endDate || new Date()}
                                dateFormat="yyyy-MM-dd"
                                disabledKeyboardNavigation
								locale="ko"
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
                                disabledKeyboardNavigation
								locale="ko"
                            />
                        </td>
                    </tr>
                </table>

                <div className="borrower_result_layout">
                    <p>Total : {response && response.length}건</p>
                    <div>
                        <button className="loginBtn" onClick={search}>검색</button>
                        <button className="loginBtn" onClick={exportToExcel}>Export to Excel</button>
                    </div>
                </div>

                <div style={{ marginLeft: "auto", marginRight: "auto", marginTop: "10px", height: "600px", overflow: "auto" }}>
                    <table border="1" id="tableData" className="mainTable">
                        <thead>
                            <tr>
                                <td>순번</td>
                                <td>신청번호</td>
                                <td>신청일시</td>
                                <td>주민번호</td>
                                <td>성명</td>
                                <td>기거래여부</td>
                                <td>상품명</td>
                                <td>상품구분</td>
                                <td>신청금액</td>
                                <td>신청상태</td>
                                <td>상담상세</td>
                                <td>거절사유</td>
                                <td>매체</td>
                                <td>심사팀명</td>
                                <td>관리지점전화</td>
                                <td>승인일시</td>
                                <td>가승인금액</td>
                                <td>실행금액</td>
                            </tr>
                        </thead>
                        <tbody>
                            {response && response.map((item, index) => (
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
                            ))}
                        </tbody>
                    </table>
                </div>

                {response && (
                    <div className="agent_result_summary">
                        <p>대출신청 : {response.length}</p>
                        <p>가접수 : {response.filter(item => item.req_stnm === '가접수').length}</p>
                        <p>거절 : {response.filter(item => item.req_stnm === '거절').length}</p>
                        <p>심사중 : {tlatkArr.reduce(
                            (total, name) => total + response.filter(item => item.req_stnm === name).length, 0)}</p>
                        <p>승인 : {tmddlsArr.reduce(
                            (total, name) => total + response.filter(item => item.req_stnm === name).length, 0)}</p>
                        <p>보류 : {response.filter(item => item.req_stnm === '보류').length}</p>
                    </div>

                )}
            </div>
        </>
    )
}

export default Agent