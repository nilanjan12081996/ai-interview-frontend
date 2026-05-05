import React from "react";
import { useRouteError, useNavigate } from "react-router-dom";
import { Button } from "flowbite-react";

const ErrorPage = () => {
    const error = useRouteError();
    const navigate = useNavigate();

    console.error(error);

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6 relative overflow-hidden font-sans">
            {/* Background Glow */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-600/10 blur-[150px] rounded-full pointer-events-none"></div>

            <div className="max-w-md w-full text-center relative z-10">
                <div className="mb-8 relative inline-block">
                    <div className="w-24 h-24 bg-gradient-to-tr from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center mx-auto shadow-[0_0_60px_rgba(168,85,247,0.4)] transform hover:rotate-6 transition-transform duration-500">
                        <span className="material-symbols-outlined text-white text-5xl">warning</span>
                    </div>
                    {/* Floating Orbs */}
                    <div className="absolute -top-4 -right-4 w-8 h-8 bg-purple-500/20 rounded-full blur-xl animate-bounce"></div>
                    <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-pink-500/20 rounded-full blur-lg animate-pulse"></div>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tighter leading-tight">
                    Oops! Something <br />
                    <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-black">went wrong</span>
                </h1>

                <p className="text-gray-400 text-lg mb-10 leading-relaxed font-light">
                    {error?.statusText || error?.message || "An unexpected error occurred. Don't worry, even the smartest systems have moments like this."}
                </p>

                <div className="flex flex-col gap-6">
                    <Button
                        onClick={() => navigate("/")}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-none h-14 rounded-2xl font-bold text-lg hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] transition-all duration-300 transform active:scale-95 group overflow-hidden relative"
                    >
                        <span className="relative z-10">Back to Dashboard</span>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    </Button>
                    
                    <div className="flex items-center justify-center gap-8">
                        <button
                            onClick={() => window.location.reload()}
                            className="text-gray-400 hover:text-white transition-colors text-xs uppercase tracking-[0.2em] font-bold py-2 border-b-2 border-transparent hover:border-purple-500"
                        >
                            Try Again
                        </button>
                        <button
                            onClick={() => navigate(-1)}
                            className="text-gray-400 hover:text-white transition-colors text-xs uppercase tracking-[0.2em] font-bold py-2 border-b-2 border-transparent hover:border-pink-500"
                        >
                            Go Back
                        </button>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-white/5 flex flex-col items-center gap-2">
                    <div className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">
                        Trace ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}
                    </div>
                    <div className="flex items-center gap-2 font-bold text-purple-500/50 text-[12px] uppercase tracking-widest">
                        <span>Interview</span>
                        <span className="text-pink-500/50">Fold</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;
