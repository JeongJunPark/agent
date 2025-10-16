import axios from "axios";

const SendAPIPrivacy = (url, postData) => {
    // postData 객체를 x-www-form-urlencoded 형태로 변환
    const formBody = Object.keys(postData)
        .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(postData[key]))
        .join("&");

    return fetch(url, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' 
        },
        body: formBody
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("HTTP 오류 " + response.status);
        }
        return response.json();  // JSON 반환
    })
    .catch(error => {
        console.error('네트워크 오류:', error);
        throw error;
    });
}

export default SendAPIPrivacy;
