import React, { useEffect, useState } from "react";

const SendAPI = (url, postData) => {
    console.log(url, postData)

    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: JSON.stringify(postData)
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("HTTP 오류 " + response.status);
            } 
            return response.json();
        })
        // .then((data) => {
            // console.log(data)
            // if (data.code === "Y") {
            //     console.log(data);
            //     return data;
            // } else {
            //     console.error('POST 요청 실패!!!');
            //     throw new Error("API 요청 실패!")
            // }
            // return data;
        // })
        .catch((error) => {
            console.error('네트워크 오류:', error);
            throw error;
        });
}

export default SendAPI;