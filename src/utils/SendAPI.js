const NO_TOKEN_URLS = ['checkAgentLoginID', 'checkAgentLogin', 'checkManagerLoginID', 'checkManagerLogin', 'agentMenu'];

const isNoTokenAPI = (url) => {
    return NO_TOKEN_URLS.some((noTokenUrl) => url.includes(noTokenUrl)) || !url.includes('leadcorp.co.kr');
};

const SendAPI = (url, postData) => {
    console.log(url, postData)

    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };

    let body = postData;
    if (!isNoTokenAPI(url)) {
        const token = sessionStorage.getItem('token');
        if (token && postData && typeof postData === 'object') {
            body = { ...postData, token };
        }
    }

    return fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
    })
        .then((response) => {
            if ([401, 402, 403, 419].includes(response.status)) {
                response.json().then((data) => {
                    console.error('인증 오류:', data);
                    alert(data.message || '인증 오류가 발생했습니다.');
                    sessionStorage.clear();
                    window.location.href = '/Login';
                }).catch((e) => {
                    console.error('인증 오류 (파싱 실패):', response.status, e);
                    alert('인증 오류가 발생했습니다.');
                    sessionStorage.clear();
                    window.location.href = '/Login';
                });
                return Promise.reject(new Error('인증 오류 ' + response.status));
            }
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