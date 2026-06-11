import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";

const OTP_DURATION = 5 * 60; // 5 minutes

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [errors, setErrors] = useState({
        email: "",
        otp: "",
        password: "",
        confirmPassword: "",
    });

    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);

    const [timeLeft, setTimeLeft] = useState(0);
    const [canResend, setCanResend] = useState(false);
    const [otpMessage, setOtpMessage] = useState("");

    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        if (!otpSent || timeLeft <= 0) {
            if (otpSent && timeLeft === 0) {
                setCanResend(true);
            }
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, otpSent]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;

        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const handleSendOtp = async () => {
        const newErrors = {
            email: "",
            otp: "",
            password: "",
            confirmPassword: "",
        };

        if (!email.trim()) {
            newErrors.email = "Email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Enter a valid email.";
        }

        setErrors(newErrors);

        if (newErrors.email) return;

        try {
            // await axios.post("/api/auth/send-otp", { email });

            setOtpSent(true);
            setOtpVerified(false);

            setOtp(["", "", "", "", "", ""]);

            setTimeLeft(OTP_DURATION);
            setCanResend(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const updatedOtp = [...otp];
        updatedOtp[index] = value.slice(-1);

        setOtp(updatedOtp);

        if (value && index < otp.length - 1) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (
        index: number,
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleVerifyOtp = async () => {
        const enteredOtp = otp.join("");

        const newErrors = {
            email: "",
            otp: "",
            password: "",
            confirmPassword: "",
        };

        if (enteredOtp.length !== 6) {
            newErrors.otp = "Enter a valid OTP.";
            setErrors(newErrors);
            return;
        }

        try {
            // await axios.post("/api/auth/verify-otp", {
            //   email,
            //   otp: enteredOtp,
            // });

            setOtpVerified(true);
            setTimeLeft(0);
            setCanResend(false);

            setOtpMessage("OTP verified successfully.");

            setErrors({
                email: "",
                otp: "",
                password: "",
                confirmPassword: "",
            });
        } catch (error) {
            setErrors({
                email: "",
                otp: "Invalid OTP.",
                password: "",
                confirmPassword: "",
            });
        }
    };

    const handleResendOtp = async () => {
        try {
            // await axios.post("/api/auth/resend-otp", { email });

            setOtp(["", "", "", "", "", ""]);
            setOtpVerified(false);

            setTimeLeft(OTP_DURATION);
            setCanResend(false);

            setOtpMessage("OTP resent successfully.");

            otpRefs.current[0]?.focus();
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async () => {
        const newErrors = {
            email: "",
            otp: "",
            password: "",
            confirmPassword: "",
        };

        if (!otpSent) {
            newErrors.email = "Send OTP first.";
        }

        if (!otpVerified) {
            newErrors.otp = "Verify OTP before changing password.";
        }

        if (!password.trim()) {
            newErrors.password = "New password is required.";
        } else if (password.length < 8) {
            newErrors.password =
                "Password must be at least 8 characters.";
        }

        if (!confirmPassword.trim()) {
            newErrors.confirmPassword =
                "Confirm password is required.";
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
        }

        setErrors(newErrors);

        if (
            newErrors.email ||
            newErrors.otp ||
            newErrors.password ||
            newErrors.confirmPassword
        ) {
            return;
        }

        try {
            // await axios.post("/api/auth/reset-password", {
            //   email,
            //   otp: otp.join(""),
            //   password,
            // });

            navigate("/");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#e9effb] text-slate-900">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.88),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.18),transparent_18%),linear-gradient(180deg,#f7fbff_0%,#e9effb_100%)]" />

            <div className="pointer-events-none absolute left-1/2 top-14 h-60 w-96 -translate-x-1/2 rounded-full bg-white/70 blur-3xl" />

            <div className="relative z-10 mx-auto flex min-h-screen max-w-[720px] flex-col px-4 py-10 sm:px-6 lg:px-8">
                <div className="mx-auto w-full rounded-[28px] bg-white/95 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.12)] ring-1 ring-slate-200 sm:p-10">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-slate-900">
                                Forgot Password
                            </h1>
                            <p className="mt-2 text-sm text-slate-600">
                                Recover access with OTP and a new password.
                            </p>
                        </div>

                        <Link
                            to="/"
                            className="text-sm font-medium text-blue-600 hover:text-blue-700"
                        >
                            Back to login
                        </Link>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Email ID <span className="text-red-500">*</span>
                            </label>

                            <input
                                type="email"
                                value={email}
                                disabled={otpSent}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter the registered email"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                            />

                            {errors.email && (
                                <p className="mt-2 text-xs text-red-500">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            {!otpSent ? (
                                <button
                                    type="button"
                                    onClick={handleSendOtp}
                                    className="rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
                                >
                                    Send OTP
                                </button>
                            ) : (
                                <span className="text-sm text-green-600 font-medium">
                                    OTP sent successfully
                                </span>
                            )}
                        </div>

                        {otpSent && (
                            <>
                                <div>
                                    <div className="mb-3 flex items-center justify-between text-sm text-slate-700">
                                        <span>
                                            Enter OTP{" "}
                                            <span className="text-red-500">*</span>
                                        </span>

                                        {!canResend ? (
                                            <span className="text-blue-600">
                                                Resend OTP in {formatTime(timeLeft)}
                                            </span>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={handleResendOtp}
                                                className="font-medium text-blue-600 hover:text-blue-700"
                                            >
                                                Resend OTP
                                            </button>
                                        )}
                                    </div>

                                    <div className="flex gap-3">
                                        {otp.map((value, index) => (
                                            <input
                                                key={index}
                                                ref={(el) => {
                                                    otpRefs.current[index] = el;
                                                }}
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={1}
                                                value={value}
                                                onChange={(e) =>
                                                    handleOtpChange(index, e.target.value)
                                                }
                                                onKeyDown={(e) =>
                                                    handleOtpKeyDown(index, e)
                                                }
                                                className="w-full min-w-[55px] rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-xl font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                            />
                                        ))}
                                    </div>

                                    {errors.otp && (
                                        <p className="mt-2 text-xs text-red-500">
                                            {errors.otp}
                                        </p>
                                    )}
                                </div>

                                {!otpVerified && (
                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            onClick={handleVerifyOtp}
                                            className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-950"
                                        >
                                            Verify OTP
                                        </button>
                                    </div>
                                )}

                                {otpVerified && (
                                    <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                                        OTP Verified Successfully
                                    </div>
                                )}
                            </>
                        )}


                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                New Password{" "}
                                <span className="text-red-500">*</span>
                            </label>

                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter new password"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                            {errors.password && (
                                <p className="mt-2 text-xs text-red-500">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Confirm Password{" "}
                                <span className="text-red-500">*</span>
                            </label>

                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                placeholder="Confirm password"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                            {errors.confirmPassword && (
                                <p className="mt-2 text-xs text-red-500">
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-950"
                        >
                            Create Password
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;