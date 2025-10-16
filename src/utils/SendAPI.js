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

        .catch((error) => {
            console.error('네트워크 오류:', error);
            throw error;
        });
}

export default SendAPI;