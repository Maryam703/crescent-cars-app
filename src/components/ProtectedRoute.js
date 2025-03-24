import { useNavigate } from 'react-router-dom';
import {useEffect, useState } from "react"

function ProtectedRoute({children}) {
    const navigate = useNavigate();
    const [currUser , setCurrUser ] = useState(null)

    useEffect(() => { 
        let userData = JSON.parse(localStorage.getItem("sb-kinwdpewewrluwhjwgdk-auth-token"));
        setCurrUser(userData.user)
    }, [])

    if (currUser && currUser?.role === ("authenticated")) {
        return children
    }else{
        navigate("/")
    }
}

export default ProtectedRoute;