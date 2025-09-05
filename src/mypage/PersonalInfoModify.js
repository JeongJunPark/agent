import React, { useState, useEffect } from "react";
import SendAPI from "../utils/SendAPI";
const PersonalInfoModify = () => {
    useEffect(() => {
        SendAPI("https://home-api.leadcorp.co.kr:8080/updateManagerInfo", { ID: sessionStorage.getItem('ID'), menu: "개인정보수정", note: '', IP : sessionStorage.getItem('IP') })
            .then((returnResponse) => {
                if (returnResponse) {
                    console.log(returnResponse)
                }
            })
            .catch((error) => {
                console.log(error)
            })

    }, [])
}

export default PersonalInfoModify;