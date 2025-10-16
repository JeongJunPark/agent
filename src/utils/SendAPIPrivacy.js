const SendAPIPrivacy = (url, postData) => {
    console.log("ffaaaa");
    console.log("url: ", url)
    console.log("postData: ", postData)

    return fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
    })
    .then(async (response) => {
        const text = await response.text();
        console.log("ff");
        try {
        console.log("ffgg");
            
            return text ? JSON.parse(text) : {};  // 빈 문자열이면 빈 객체 반환
        } catch (err) {
            console.error('JSON 파싱 실패', err, '응답:', text);
            throw err;
        }
    })
}

export default SendAPIPrivacy;