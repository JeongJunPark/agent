import { useEffect, useState } from "react";
import SendAPI from "../utils/SendAPI";
import "../styles/login.css"
import "../styles/button.css"
import Logo from "../images/leadcorp_img.svg"

const Login = () => {

    const [status, setStatus] = useState(false) // 유효한 ID 체크

    const [ID, setID] = useState("")
    const [PW, setPW] = useState("1111")
    const [IP, setIP] = useState("");
    const [Name, setName] = useState("");

    const [coUse, setCoUse] = useState('agent')

    useEffect(() => {
        SendAPI('https://geolocation-db.com/json/')
          .then((returnResponse) => {
            console.log(returnResponse.IPv4)
            setIP(returnResponse.IPv4)
            sessionStorage.setItem('IP', returnResponse.IPv4);
          })
    }, [])
    

    const sendSMS = () => {
        // 초기에 ID 체크 (인증번호 전송)
        SendAPI("https://home-api.leadcorp.co.kr:8080/checkAgentLoginID", { ID : ID, IP : IP })
        .then((returnResponse) => {
            if (returnResponse) {
                console.log(returnResponse)
                console.log("test --> : ", returnResponse.result);
                if (returnResponse.result) {
                    alert("인증번호를 입력하세요.")
                    setStatus(true)
                } else {
                    alert(returnResponse.message)
                    if (returnResponse.state !== '') {
                        SendAPI("https://home-api.leadcorp.co.kr:8080/agentHistManage", {ID : ID, menu : "LOG-IN(F)", note : returnResponse.message, IP : sessionStorage.getItem('IP')})
                            .then((returnResponse) => {
                                if (returnResponse) {
                                    console.log("returnResponse ----> ", returnResponse);
                                    // alert(returnResponse.agent_nm);
                                    setName(returnResponse.agent_nm);
                                }
                            })
                            .catch((error) => {
                                console.log(error)
                            })
                            
                    }
                }
                
            }
        })
        .catch((error) => {
            console.log(error)
        })
    }

    const login = () => {
        // ID + PW 체크
        SendAPI("https://home-api.leadcorp.co.kr:8080/checkAgentLogin", { ID : ID, PW : PW })
        .then((returnResponse) => {
            if (returnResponse) {
                console.log(returnResponse)
                if (returnResponse.result) {
                    SendAPI("https://home-api.leadcorp.co.kr:8080/agentHistManage", {ID : ID, menu : "LOG-IN", note : '', IP : sessionStorage.getItem('IP')})
                        .then((returnResponse) => {
                            if (returnResponse) {
                                console.log("returnResponse:  ===> ", returnResponse);
                                if (returnResponse.result) {
                                    sessionStorage.setItem('ID', ID); // 사용자 ID session 저장
                                    sessionStorage.setItem('validToken', 'valid');
                                    sessionStorage.setItem('Name', Name);
                                    console.log("sessionStorage ==== > : ", sessionStorage);
                                    window.location.href = "/MyPage"
                                }   
                            }
                        })
                        .catch((error) => {
                            console.log(error)
                        })
                }
            }
        })
        .catch((error) => {
            console.log(error)
        })
    }

    const sendSMSManager = () => {
        // 초기에 ID 체크 (인증번호 전송)
        SendAPI("https://home-api.leadcorp.co.kr:8080/checkManagerLoginID", { ID : ID, IP : IP, PW : PW })
        .then((returnResponse) => {
            if (returnResponse) {
                console.log(returnResponse)
                console.log("test --> : ", returnResponse.result);
                if (returnResponse.result) {
                    alert("인증번호를 입력하세요.")
                    setStatus(true)
                } else {
                    alert(returnResponse.message)
                    if (returnResponse.state !== '') {
                        SendAPI("https://home-api.leadcorp.co.kr:8080/managerHistManage", {ID : ID, menu : "LOG-IN-MANAGER(F)", note : returnResponse.message, IP : sessionStorage.getItem('IP')})
                            .then((returnResponse) => {
                                if (returnResponse) {
                                    console.log("returnResponse ----> ", returnResponse);
                                    setName(returnResponse.agent_nm);
                                }
                            })
                            .catch((error) => {
                                console.log(error)
                            })
                            
                    }
                }
                
            }
        })
        .catch((error) => {
            console.log(error)
        })
    }


    const loginManager = () => {
        // ID + PW 체크
        SendAPI("https://home-api.leadcorp.co.kr:8080/checkManagerLogin", { ID : ID, PW : PW })
        .then((returnResponse) => {
            if (returnResponse) {
                console.log(returnResponse)
                if (returnResponse.result) {
                    SendAPI("https://home-api.leadcorp.co.kr:8080/managerHistManage", { ID : ID, menu : "LOG-IN-MANAGER", note : '', IP : sessionStorage.getItem('IP') })
                        .then((returnResponse) => {
                            if (returnResponse) {
                                console.log("returnResponse:  ===> ", returnResponse);
                                if (returnResponse.result) {
                                    sessionStorage.setItem('ID', ID); // 사용자 ID session 저장
                                    sessionStorage.setItem('validToken', 'valid');
                                    sessionStorage.setItem('Name', Name);
                                    console.log("sessionStorage ==== > : ", sessionStorage);
                                    window.location.href = "/List"
                                }   
                            }
                        })
                        .catch((error) => {
                            console.log(error)
                        })
                }
            }
        })
        .catch((error) => {
            console.log(error)
        })
    }    

    return (
        <>
        <div className="login_wrap">
            <div className="login_box">
                <div className="login_icon">
                    <img src={Logo} alt="logo" width={400} height={40}  />
                </div>
                <div className="login_radio">
                <label>
                    <input
                    type="radio"
                    value="agent"
                    checked={coUse === 'agent'}
                    onChange={(e) => setCoUse(e.target.value)}
                    />
                    <span>Agent / 차입처</span>
                </label>

                <label>
                    <input
                    type="radio"
                    value="manager"
                    checked={coUse === 'manager'}
                    onChange={(e) => setCoUse(e.target.value)}
                    />
                    <span>홈페이지 관리자</span>
                </label>
                </div>

            {coUse === 'agent' && (
            <>
                <div>
                <input
                    onChange={(e) => setID(e.target.value)}
                    readOnly={status}
                    className="loginInput"
                    placeholder="사원번호"
                />
                <button className="loginBtn" onClick={sendSMS}>
                    <b>인증번호 전송</b>
                </button>
                </div>

                <div>
                <input
                    readOnly={!status}
                    onChange={(e) => setPW(e.target.value)}
                    className="loginInput"
                    placeholder="인증번호"
                />
                <button className="loginBtn" onClick={login}>
                    <b>로그인</b>
                </button>
                </div>
            </>
            )}

            {coUse === 'manager' && (
            <>
                <div>
                <input
                    onChange={(e) => setID(e.target.value)}
                    readOnly={status}
                    className="loginInput"
                    placeholder="사원번호"
                />
                <button className="loginMngBtn" onClick={sendSMSManager}>
                    <b>인증번호 전송</b>
                </button>
                </div>

                <div>
                <input
                    readOnly={!status}
                    onChange={(e) => setPW(e.target.value)}
                    className="loginInput"
                    placeholder="인증번호"
                    // value="1111"
                />
                <button className="loginMngBtn" onClick={loginManager}>
                    <b>로그인</b>
                </button>
                </div>
            </>
            )}

            </div>
        </div>
        </>
    )
}

export default Login;