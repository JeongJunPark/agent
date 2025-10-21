    import React from 'react';
    import '../styles/Loading.css'; // Loader.css 파일을 생성하여 적용

    const Loading = () => {
      return (
        <div className="loading-overlay">      
            <div className="loader-container">
            <div className="spinner"></div>
            </div>
        </div>      
      );
    };

    export default Loading;