import { useAuth } from "@/context/auth-context";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import boslogo from "@/assets/light_logo.png";

export default function Verify() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [otp, setOtp] = useState(Array(6).fill(""));
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(
        `Enter the 6-digit code sent to ${localStorage.getItem("pendingUserEmail")}`
    );
    const [resendTimer, setResendTimer] = useState(0);

    const inputRefs = useRef([]);

    // Get expiry on mount
    useEffect(() => {
        const expiry = localStorage.getItem("pendingOtpExpiry");
        if (expiry) {
            const remaining = Math.floor((new Date(expiry).getTime() - Date.now()) / 1000);
            setResendTimer(remaining > 0 ? remaining : 0);
        }
    }, []);

    // Countdown for resend
    useEffect(() => {
        if (resendTimer <= 0) return;
        const timer = setInterval(() => {
            setResendTimer((t) => (t > 0 ? t - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, [resendTimer]);

    // Auto-submit when all digits are filled
    useEffect(() => {
        if (otp.every((digit) => digit !== "")) {
            handleVerify();
        }
    }, [otp]);

    const handleChange = (e, index) => {
        const value = e.target.value.replace(/\D/g, "");
        if (!value) return;

        const updatedOtp = [...otp];
        updatedOtp[index] = value[0];
        setOtp(updatedOtp);

        if (index < 5 && value.length > 0) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace") {
            const updatedOtp = [...otp];
            if (updatedOtp[index]) {
                updatedOtp[index] = "";
                setOtp(updatedOtp);
            } else if (index > 0) {
                inputRefs.current[index - 1]?.focus();
            }
        } else if (e.key === "ArrowLeft" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === "ArrowRight" && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (pasted.length === 6) {
            setOtp(pasted.split(""));
            inputRefs.current[5]?.focus();
        }
    };

    const handleVerify = async () => {
        if (otp.some((digit) => digit === "")) return;

        setLoading(true);
        setError("");

        const user_id = localStorage.getItem("pendingUserId");
        if (!user_id) {
            setError("Session expired. Please log in again.");
            navigate("/login");
            return;
        }

        const code = otp.join("");

        try {
            const res = await fetch("http://localhost:3000/api/verify-2fa", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ user_id, code }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Invalid code.");
                setLoading(false);
                return;
            }

            login(data.user);
            localStorage.removeItem("pendingUserId");
            localStorage.removeItem("pendingUserEmail");
            localStorage.removeItem("pendingOtpExpiry");
            navigate("/");
        } catch (err) {
            console.error("Verification error:", err);
            setError("An error occurred during verification.");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setLoading(true);
        setError("");

        const user_id = localStorage.getItem("pendingUserId");
        if (!user_id) {
            setError("Session expired. Please log in again.");
            navigate("/login");
            return;
        }

        try {
            const res = await fetch("http://localhost:3000/api/resend-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ user_id }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Failed to resend code.");
            } else {
                setMessage(
                    `A new OTP was sent to ${localStorage.getItem("pendingUserEmail")}`
                );
                if (data.otpExpiry) {
                    localStorage.setItem("pendingOtpExpiry", data.otpExpiry);
                    const remaining = Math.floor(
                        (new Date(data.otpExpiry).getTime() - Date.now()) / 1000
                    );
                    setResendTimer(remaining > 0 ? remaining : 0);
                } else {
                    setResendTimer(60); // fallback
                }
                setOtp(Array(6).fill(""));
                inputRefs.current[0]?.focus();
            }
        } catch (err) {
            console.error("Resend OTP error:", err);
            setError("Something went wrong.");
        }

        setLoading(false);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-blue-50 px-4">
            <div className="flex w-full max-w-[1000px] flex-col items-center justify-center gap-10 md:flex-row">
                {/* Logo Section */}
                <div className="flex h-[300px] w-full items-center justify-center rounded-2xl bg-blue-100 shadow-lg md:h-[600px] md:w-full">
                    <img src={boslogo} alt="BOS Logo" className="w-60 md:w-[400px]" />
                </div>

                {/* OTP Form Section */}
                <div
                    className="flex h-auto w-full flex-col justify-center rounded-2xl p-8 text-white shadow-2xl md:h-[600px] md:w-[50%] md:p-10"
                    style={{ backgroundColor: "#173B7E" }}
                >
                    <h2 className="mb-2 text-center text-3xl font-bold md:text-left">
                        Two-Factor Authentication
                    </h2>

                    {error && (
                        <div className="mb-4 rounded-md bg-white px-4 py-2 text-sm font-medium text-red-600 shadow">
                            {error}
                        </div>
                    )}

                    <p className="mb-6 text-center text-sm text-blue-200 transition-all duration-300 ease-in-out md:text-left">
                        {message}
                    </p>

                    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                        <div
                            className="flex justify-between gap-2"
                            onPaste={handlePaste}
                        >
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    onChange={(e) => handleChange(e, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    className="w-10 rounded-md border border-blue-300 bg-white px-2 py-2 text-center text-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            ))}
                        </div>

                        <div className="mt-2 text-center text-sm text-blue-200">
                            Didn’t receive a code?{" "}
                            {resendTimer > 0 ? (
                                <span className="text-white underline opacity-60">
                                    Resend in {resendTimer}s
                                </span>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    disabled={loading}
                                    className="text-white underline hover:text-blue-100"
                                >
                                    Resend
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
