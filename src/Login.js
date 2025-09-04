import { useEffect, useState, useRef } from "react";
import SendAPI from "./utils/SendAPI";
import "./styles/common.css"

const Login = () => {

    const [status, setStatus] = useState(false) // 유효한 ID 체크

    const [ID, setID] = useState("")
    const [PW, setPW] = useState("")
    const [IP, setIP] = useState("");

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
                if (returnResponse.result) {
                    alert("인증번호를 입력하세요.")
                    setStatus(true)
                } else {
                    alert(returnResponse.message)
                    if (returnResponse.state !== '') {
                        SendAPI("https://home-api.leadcorp.co.kr:8080/agentHistManage", {ID : ID, menu : "LOG-IN(F)", note : returnResponse.message, IP : sessionStorage.getItem('IP')})
                            .then((returnResponse) => {
                                if (returnResponse) {
                                    console.log(returnResponse)
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
                                console.log(returnResponse)
                                if (returnResponse.result) {
                                    sessionStorage.setItem('ID', ID); // 사용자 ID session 저장
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

    return (
        <>
        <div className="login_wrap">
            <div>
                사원번호 : <input onChange={(e) => setID(e.target.value)} readOnly={status} className="loginInput"></input>
                <button className="loginBtn"  onClick={sendSMS}>인증번호 전송</button>
            </div>

            <div>
                인증번호 : <input readOnly={!status} onChange={(e) => setPW(e.target.value)} className="loginInput"></input>
                <button className="loginBtn" onClick={login}>로그인</button>
            </div>
        </div>
        </>
    )
}

export default Login;