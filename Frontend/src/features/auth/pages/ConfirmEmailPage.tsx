import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import authService from "../services/authService";

export default function ConfirmEmailPage() {
    const [searchParams] = useSearchParams();
    const userId = searchParams.get("UserId") ?? "";
    const token = searchParams.get("Token") ?? "";

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!userId || !token) {
            setStatus("error");
            setMessage("Invalid confirmation link. Missing user ID or token.");
            return;
        }

        authService.confirmEmail(userId, token)
            .then(() => {
                setStatus("success");
                setMessage("Your email has been confirmed successfully. You can now log in.");
            })
            .catch((err: unknown) => {
                setStatus("error");
                setMessage(err instanceof Error ? err.message : "Email confirmation failed.");
            });
    }, [userId, token]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100">
            <div className="w-full max-w-md rounded-2xl bg-white !p-8 shadow-lg text-center">
                {status === "loading" && (
                    <>
                        <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
                        <h2 className="text-xl font-semibold text-slate-700">Confirming your email…</h2>
                    </>
                )}

                {status === "success" && (
                    <>
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Email Confirmed!</h2>
                        <p className="text-slate-600 mb-6">{message}</p>
                        <Link to="/login"
                            className="block w-full rounded-lg bg-blue-600 !py-3 font-semibold text-white hover:bg-blue-700 transition text-center">
                            Go to Login
                        </Link>
                    </>
                )}

                {status === "error" && (
                    <>
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                            <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Confirmation Failed</h2>
                        <p className="text-red-600 mb-6">{message}</p>
                        <Link to="/resend-email-confirmation"
                            className="block w-full rounded-lg bg-blue-600 !py-3 font-semibold text-white hover:bg-blue-700 transition text-center">
                            Resend Confirmation Email
                        </Link>
                        <Link to="/login" className="mt-3 block text-sm text-blue-600 hover:underline">← Back to Login</Link>
                    </>
                )}
            </div>
        </div>
    );
}
