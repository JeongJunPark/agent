import { useEffect, useState, useRef } from "react";
import moment from "moment";
import Calendar from 'react-calendar';
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.module.css";
import "../styles/datepicker.css";

import SendAPI from "../utils/SendAPI";
import NumberFormatter from "../utils/NumberFormatter";
import RateFormatter from "../utils/RateFormatter";
import * as XLSX from 'xlsx';

import "../styles/icon.css"
import "../styles/common.css"
import NoDataRow from "../utils/NoDataRow";
import { AiOutlineForward,AiOutlineBackward,AiOutlineDollarCircle } from "react-icons/ai";
import { PiMicrosoftExcelLogoDuotone } from "react-icons/pi";
import "../styles/button.css"
const Borrower = () => {

    const [fileName, setFileName] = useState("");

    // HIST 저장
    useEffect(() => {
        SendAPI("https://dev-home-api.leadcorp.co.kr:8080/agentHistManage", { ID: sessionStorage.getItem('ID'), menu: "가상계좌 현황조회", note: '', IP : sessionStorage.getItem('IP') })
            .then((returnResponse) => {
                if (returnResponse) {
                    console.log(returnResponse)
                }
            })
            .catch((error) => {
                console.log(error)
            })

    }, [])
    const [data, setData] = useState([]);
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
    const today = new Date();
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);

    // 로그인 이후 상태값
    const [status, setStatus] = useState({
        auth: sessionStorage.getItem('auth'),
        ID: sessionStorage.getItem('ID'),
        agent_id: sessionStorage.getItem('agent_dlgt_id')        
    });

    // 날짜 초기화
    useEffect(() => {
        const excelToday = moment();        
        const todayDate = excelToday.format("YYYYMMDD");
        setFileName("가상계좌 현황" + todayDate + ".xlsx");
    }, [])

    // DB로부터 <option> 리스트 추출
    const [managerBranch, setManagerBranch] = useState();
    const [bank, setBank] = useState("");
    const [moAccount, setMoAccount] = useState("")
    const [matchMoAccount, setMatchMoAccount] = useState("")

    // 선택한 값
    const [selectedManagerBranch, setSelectedManagerBranch] = useState('');
    const [selectedBank, setSelectedBank] = useState('279');
    const [selectedMoAccount, setSelectedMoAccount] = useState('10161802501');
    const [selectedSect, setSelectedSect] = useState("0");

    // 검색 Data
    const [postData, setPostData] = useState("")
    const [response, setResponse] = useState("") // 표 부분 결과
    const [summaryData, setSummaryData] = useState("");

    // paging
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
    // alert(auth);

    useEffect(() => {
        SendAPI('https://dev-home-api.leadcorp.co.kr:8080/checkBorrowerList', status)
            .then((returnResponse) => {
                if (returnResponse) {
                    console.log("returnResponse_chk: ",returnResponse)
                    setManagerBranch(returnResponse.managerBranch)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])

    useEffect(() => {
        SendAPI('https://dev-home-api.leadcorp.co.kr:8080/selectBankList', status)
            .then((returnResponse) => {
                if (returnResponse) {
                    console.log("returnResponse_bank: ",returnResponse)
                    setBank(returnResponse.bank)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])

    useEffect(() => {
        SendAPI('https://dev-home-api.leadcorp.co.kr:8080/selectMoactList', status)
            .then((returnResponse) => {
                if (returnResponse) {
                    console.log("returnResponse_chk: ",returnResponse)
                    setMoAccount(returnResponse.moAccount)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])    

    useEffect(() => {
        if (moAccount.length > 0) {
            setMatchMoAccount(moAccount.filter(item => item.mo_bank_cd === selectedBank));
        }

    }, [selectedBank, moAccount])

    const searchBorrower = () => {
        setPostData({
            startDate: moment(startDate).format("YYYYMMDD"),
            endDate: moment(endDate).format("YYYYMMDD"),
            brNm: selectedManagerBranch,
            moActNum: selectedMoAccount,

            actSt: selectedSect,
            bankCd: selectedBank,
        })
    }

    useEffect(() => {
        if (postData.startDate !== '' && postData.startDate !== undefined) {
            SendAPI('https://dev-home-api.leadcorp.co.kr:8080/getAccountRows', postData)
                .then((returnResponse) => {
                    if (returnResponse) {
                        setResponse(returnResponse.result1);
                        setData(returnResponse.result1);
                        
                        if (!returnResponse.result1 || returnResponse.result1.length === 0) {
                            alert("조회 결과가 없습니다.");
                        }                        
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
                 
            SendAPI('https://dev-home-api.leadcorp.co.kr:8080/getAccountRowsSum', postData)
                .then((returnResponse) => {
                    if (returnResponse) {                       
                        setSummaryData(returnResponse.result2);
                        
                        if (!returnResponse.result2 || returnResponse.result2.length === 0) {
                            alert("합산 결과가 없습니다.");
                        }                        
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }, [postData])

    const renderCustomHeader = ({
        date,
        decreaseMonth,
        increaseMonth,
        prevMonthButtonDisabled,
        nextMonthButtonDisabled
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
                <p className="menu_title_container">                      
                <span className="menu_title">
                    <AiOutlineDollarCircle/> 차입처
                </span>                
                <span className="menu_title_right">
                        <button className="searchBtn" onClick={searchBorrower}>검색</button>
                        <button className="excelDownBtn" onClick={exportToExcel}><PiMicrosoftExcelLogoDuotone className="excelIcon"/> 다운로드</button>
                </span>
                </p>
                <table className="result_table" border="1">
                    <tr>
                        <th>대출일자</th>
                        <td colSpan={3}>
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
                        <th>관리 지점</th>
                        <td>
                            <select onChange={(e) => setSelectedManagerBranch(e.target.value)} value={selectedManagerBranch}>
                                <option value="">전지점</option>
                                {managerBranch && managerBranch.map((item, index) => (
                                    <option value={item.code}>{item.branch_name}</option>
                                ))}
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <th>은행</th>
                        <td>
                            <select onChange={(e) => setSelectedBank(e.target.value)} value={selectedBank}>
                                {bank && bank.map((item, index) => (
                                    <option value={item.code} >{item.name}</option>
                                ))}
                            </select>
                        </td>
                        <th>모계좌번호</th>
                        <td>
                            <select onChange={(e) => setSelectedMoAccount(e.target.value)} value={selectedMoAccount}>
                                {selectedBank && matchMoAccount.length > 0 && matchMoAccount.map((item, index) => (
                                    <option value={item.moActNum}>{item.mo_ssn}</option>
                                ))}
                            </select>
                        </td>
                        <th>구분</th>
                        <td>
                            <select onChange={(e) => setSelectedSect(e.target.value)} value={selectedSect}>
                                <option value="0">완제 제외</option>
                                <option value="1">완제 포함</option>
                            </select>
                        </td>
                    </tr>
                </table>

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
                                <th>가상계좌번호</th>
                                <th>고객명</th>
                                <th>계약 번호</th>
                                <th>활동 상태</th>
                                <th>등록 일자</th>
                                <th>활동 시작 일자</th>
                                <th>대출 잔액</th>
                                <th>대출 금액</th>
                                <th>상환 금액</th>                                
                                <th>대출 일자</th>
                                <th>대출 상품</th>
                                <th>만기 일자</th>
                                <th>최종 거래 일자</th>
                                <th>다음 이수 일자</th>
                                <th>이자율</th>
                                <th>약정일</th>
                                <th>연체 여부</th>
                                <th>연체 일수</th>
                                <th>도로명 주소</th>
                                <th>지번 주소</th>
                                <th>우편번호</th>
                                <th>실행지점</th>
                                <th>현지점</th>
                                <th>전자 공인 인증</th>
                                <th>공인 인증 값</th>
                            </tr>
                        </thead>
                        <tbody>
                            {response && response.length > 0 ? (currentPosts.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{Number(item.vir_act_no)}</td>
                                    <td>{item.kor_nm}</td>
                                    <td>{item.loan_no}</td>
                                    <td>{item.vir_act_no_st_yn_nm}</td>
                                    <td>{item.rgs_de}</td>
                                    <td>{item.actv_de}</td>
                                    <td>{NumberFormatter(item.ln_bln)}</td>
                                    <td>{NumberFormatter(item.ln_am)}</td>
                                    <td>{NumberFormatter(item.repay_money)}</td>
                                    <td>{item.ln_new_de}</td>
                                    <td>{item.gds_nm}</td>
                                    <td>{item.ln_xpr_de}</td>
                                    <td>{item.lst_trn_de}</td>
                                    <td>{item.nxt_intr_rcp_de}</td>
                                    <td>{RateFormatter(item.ln_intr)}</td>
                                    <td>{NumberFormatter(item.prms_dd)}</td>
                                    <td>{item.ldg_st_nm}</td>
                                    <td>{NumberFormatter(item.arr_dd_cn)}</td>
                                    <td>{item.addr}</td>
                                    <td>{item.addr2}</td>
                                    <td>{item.zipcode}</td>
                                    <td>{item.bf_mng_br_nm}</td>
                                    <td>{item.br_nm}</td>
                                    <td>{item.esign_yn}</td>
                                    <td>{item.esign_auth}</td>
                                 </tr>
                            ))): <NoDataRow colSpan={26} height="550px" /> 
                            }
                        </tbody>
                    </table>
                    </div>
                    <table className="result_table">
                        
                        <tbody>
                        <tr>
                            <th>유효채권개수</th>
                            <td><input type="text" className="tdInputReadonly" value={summaryData && NumberFormatter(summaryData[0].act_vir_act_cn)} readOnly></input></td>
                            <th>대출금액</th>
                            <td><input type="text" className="tdInputReadonly" value={summaryData && NumberFormatter(summaryData[0].ln_am)} readOnly></input></td>
                            <th>대출잔액</th>
                            <td><input type="text" className="tdInputReadonly" value={summaryData && NumberFormatter(summaryData[0].ln_bln)} readOnly></input></td>
                        </tr>
                        <tr>
                            <th>정상채권개수</th>
                            <td><input type="text" className="tdInputReadonly" value={summaryData && NumberFormatter(summaryData[0].act_vir_act_cn)} readOnly></input></td>
                            <th>정상채권금액</th>
                            <td><input type="text" className="tdInputReadonly" value={summaryData && NumberFormatter(summaryData[0].nrml_bond_am)} readOnly></input></td>
                            <th>연체채권개수</th>
                            <td><input type="text" className="tdInputReadonly" value={summaryData && NumberFormatter(summaryData[0].arr_bond_cn)} readOnly></input></td>
                        </tr>
                        <tr>
                            <th>연체채권금액</th>
                            <td><input type="text" className="tdInputReadonly" value={summaryData && NumberFormatter(summaryData[0].act_vir_act_cn)} readOnly></input></td>
                            <th>채권양수인</th>
                            <td><input type="text" className="tdInput"></input></td>
                            <th>채권양도일자</th>
                            <td><input type="text" className="tdInput"></input></td>
                        </tr>
                        </tbody>
                    </table>

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
    )
}

export default Borrower