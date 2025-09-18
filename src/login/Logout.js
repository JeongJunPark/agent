import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        sessionStorage.clear();
        navigate("/Login");
    }, [navigate]);

    return null;   
}

export default Logout;