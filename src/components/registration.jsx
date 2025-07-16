import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth-context";

const Register = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user.user_role !== "Admin") {
            alert("You are not authorized to register!");
        }
    }, [user, alert]);

    return <div>Register</div>;
};

export default Register;
