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

const Borrower = () => {

    const [fileName, setFileName] = useState("");

    // HIST 저장
    useEffect(() => {
        SendAPI("https://home-api.leadcorp.co.kr:8080/agentHistManage", { ID: sessionStorage.getItem('ID'), menu: "가상계좌현황", note: '', IP : sessionStorage.getItem('IP') })
            .then((returnResponse) => {
                if (returnResponse) {
                    console.log(returnResponse)
                }
            })
            .catch((error) => {
                console.log(error)
            })

    }, [])

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

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    // 로그인 이후 상태값
    const [status, setStatus] = useState({
        auth: sessionStorage.getItem('auth'),
        ID: sessionStorage.getItem('ID')
    });

    // 날짜 초기화
    useEffect(() => {
        const today = moment();

        const todayDate = today.format("YYYYMMDD");
        setFileName("가상계좌 현황" + todayDate + ".xlsx");
    }, [])

    // DB로부터 <option> 리스트 추출
    const [managerBranch, setManagerBranch] = useState();
    const [bank, setBank] = useState("");
    const [moAccount, setMoAccount] = useState("")
    const [matchMoAccount, setMatchMoAccount] = useState("")

    // 선택한 값
    const [selectedManagerBranch, setSelectedManagerBranch] = useState("0000")
    const [selectedBank, setSelectedBank] = useState("003")
    const [selectedMoAccount, setSelectedMoAccount] = useState("22129628304018")
    const [selectedSect, setSelectedSect] = useState("0");

    // 검색 Data
    const [postData, setPostData] = useState("")
    const [response, setResponse] = useState("") // 표 부분 결과
    const [summaryData, setSummaryData] = useState("");

    useEffect(() => {
        SendAPI('https://home-api.leadcorp.co.kr:8080/checkBorrowerList', status)
            .then((returnResponse) => {
                if (returnResponse) {
                    console.log(returnResponse)
                    setManagerBranch(returnResponse.managerBranch)
                    setBank(returnResponse.bank)
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

    const selectBank = (e) => {
        setSelectedBank(e.target.value)
    }

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

    const selectMoAccount = (e) => {
        setSelectedMoAccount(e.target.value)
    }

    useEffect(() => {
        if (postData.startDate !== '' && postData.startDate !== undefined) {
            SendAPI('https://home-api.leadcorp.co.kr:8080/borrowerResult', postData)
                .then((returnResponse) => {
                    if (returnResponse) {
                        console.log(returnResponse)
                        setResponse(returnResponse.query);
                        setSummaryData(returnResponse.query2);
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }, [postData])

    const formattedData = (data) => {
        const changeData = Number(data).toLocaleString()
        return changeData
    }

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
                <p className="menu_title">차입처</p>

                <table className="result_table" border="1">
                    <tr>
                        <td className="table_td_title">대출일자</td>
                        <td colSpan="3" className="table_td_value">
                            <DatePicker
                                renderCustomHeader={renderCustomHeader}
                                id="datepicker1"
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                maxDate={endDate || new Date()}
                                dateFormat="yyyy-MM-dd"
                                disabledKeyboardNavigation
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
                            />
                        </td>
                        <td className="table_td_title">관리 지점</td>
                        <td className="table_td_value">
                            <select onChange={(e) => setSelectedManagerBranch(e.target.value)} value={selectedManagerBranch}>
                                {managerBranch && managerBranch.map((item, index) => (
                                    <option value={item.code}>{item.branch_name}</option>
                                ))}
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td className="table_td_title">은행</td>
                        <td className="table_td_value">
                            <select onChange={selectBank} value={selectedBank}>
                                {bank && bank.map((item, index) => (
                                    <option value={item.code} >{item.name}</option>
                                ))}
                            </select>
                        </td>
                        <td className="table_td_title">모계좌번호</td>
                        <td className="table_td_value">
                            <select onChange={selectMoAccount} value={selectedMoAccount}>
                                {selectedBank && matchMoAccount.length > 0 && matchMoAccount.map((item, index) => (
                                    <option value={item.mo_ssn}>{item.mo_ssn}</option>
                                ))}
                            </select>
                        </td>
                        <td className="table_td_title">구분</td>
                        <td className="table_td_value">
                            <select onChange={(e) => setSelectedSect(e.target.value)} value={selectedSect}>
                                <option value="0">완제 제외</option>
                                <option value="1">완제 포함</option>
                            </select>
                        </td>
                    </tr>
                </table>

                <div className="borrower_result_layout">
                    <p>Total : {response && response.length}건</p>
                    <div>
                        <button className="loginBtn" onClick={searchBorrower}>검색</button>
                        <button className="loginBtn" onClick={exportToExcel}>Export to Excel</button>
                    </div>
                </div>

                <div style={{ marginLeft: "auto", marginRight: "auto", marginTop: "10px", height: "600px", overflow: "auto" }}>
                    <table border="1" id="tableData" className="mainTable">
                        <thead>
                            <tr>
                                <td>순번</td>
                                <td>가상계좌번호</td>
                                <td>고객명</td>
                                <td>계약 번호</td>
                                <td>활동 상태</td>
                                <td>등록 일자</td>
                                <td>활동 시작 일자</td>
                                <td>대출 잔액</td>
                                <td>대출 일자</td>
                                <td>대출 상품</td>
                                <td>만기 일자</td>
                                <td>최종 거래 일자</td>
                                <td>다음 이수 일자</td>
                                <td>이자율</td>
                                <td>약정일</td>
                                <td>연체 여부</td>
                                <td>연체 일수</td>
                                <td>도로명 주소</td>
                                <td>지번 주소</td>
                                <td>우편번호</td>
                                <td>실행지점</td>
                                <td>현지점</td>
                                <td>전자 공인 인증</td>
                                <td>공인 인증 값</td>
                                <td>대출 금액</td>
                                <td>상환 금액</td>
                            </tr>
                        </thead>
                        <tbody>
                            {response && response.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{Number(item.vir_act_no)}</td>
                                    <td>{item.kor_nm}</td>
                                    <td>{item.loan_no}</td>
                                    <td>{item.vir_act_no_st_yn_nm}</td>
                                    <td>{item.rgs_de}</td>
                                    <td>{item.actv_de}</td>
                                    <td>{formattedData(item.ln_bln)}</td>
                                    <td>{item.ln_new_de}</td>
                                    <td>{item.gds_nm}</td>
                                    <td>{item.ln_xpr_de}</td>
                                    <td>{item.lst_trn_de}</td>
                                    <td>{item.nxt_intr_rcp_de}</td>
                                    <td>{item.ln_intr}</td>
                                    <td>{item.prms_dd}</td>
                                    <td>{item.ldg_st_nm}</td>
                                    <td>{item.arr_dd_cn}</td>
                                    <td>{item.addr}</td>
                                    <td>{item.addr2}</td>
                                    <td>{item.zipcode}</td>
                                    <td>{item.bf_mng_br_nm}</td>
                                    <td>{item.br_nm}</td>
                                    <td>{item.esign_yn}</td>
                                    <td>{item.esign_auth}</td>
                                    <td>{item.ln_am}</td>
                                    <td>{item.repay_money}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div style={{ width: "1000px", marginTop: "10px" }}>
                    <table border="1" className="mainTable">
                        <tr>
                            <td>유효 채권 개수</td>
                            <td>{summaryData && summaryData[0].act_vir_act_cn}</td>
                            <td>대출 금액</td>
                            <td>{summaryData && formattedData(summaryData[0].ln_am)}</td>
                            <td>유효 채권 개수</td>
                            <td>{summaryData && formattedData(summaryData[0].ln_bln)}</td>
                        </tr>
                        <tr>
                            <td>정상 채권 개수</td>
                            <td>{summaryData && summaryData[0].act_vir_act_cn}</td>
                            <td>정상 채권 금액</td>
                            <td>{summaryData && formattedData(summaryData[0].nrml_bond_am)}</td>
                            <td>연체 채권 개수</td>
                            <td>{summaryData && summaryData[0].arr_bond_cn}</td>
                        </tr>
                        <tr>
                            <td>연체 채권 금액</td>
                            <td>{summaryData && formattedData(summaryData[0].act_vir_act_cn)}</td>
                            <td>채권 양수인</td>
                            <td>&nbsp;</td>
                            <td>채권 양도 일자</td>
                            <td>&nbsp;</td>
                        </tr>
                    </table>
                </div>
            </div>
        </>
    )
}

export default Borrower