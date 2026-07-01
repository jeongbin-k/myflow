// src/pages/LoginPage.tsx
import { useState } from "react";
import { supabase } from "../supabaseClient";

type AuthMode = "login" | "signup";

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  const handleSwitchMode = (next: AuthMode) => {
    setMode(next);
    setErrorMsg(null);
    setInfoMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setInfoMsg(null);
    setIsSubmitting(true);

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          setErrorMsg(translateAuthError(error.message));
        }
        // 성공 시: onAuthStateChange를 구독하는 상위 컴포넌트가 자동으로 화면 전환 처리
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) {
          setErrorMsg(translateAuthError(error.message));
        } else {
          setInfoMsg("가입 확인 이메일을 보냈어요. 메일함을 확인해 주세요!");
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleClick = async () => {
    setErrorMsg(null);
    setInfoMsg(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      setErrorMsg(translateAuthError(error.message));
    }
    // 성공 시: 구글 로그인 페이지로 자동 리디렉션됨
    // 로그인 완료 후 redirectTo로 돌아오면 onAuthStateChange가 감지해서 자동으로 화면 전환
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* 좌측: 로그인/회원가입 폼 */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              MyFlow
            </h1>
            <p className="text-sm text-slate-400 mt-2">
              {mode === "login"
                ? "다시 만나서 반가워요"
                : "MyFlow와 함께 하루를 정리해보세요"}
            </p>
          </div>

          {/* 탭 전환 */}
          <div className="flex bg-slate-100 rounded-lg p-1 mb-6">
            <button
              onClick={() => handleSwitchMode("login")}
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors
                ${mode === "login" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}
              `}
            >
              로그인
            </button>
            <button
              onClick={() => handleSwitchMode("signup")}
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors
                ${mode === "signup" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}
              `}
            >
              회원가입
            </button>
          </div>

          {/* 구글 버튼 (UI만, 기능은 추후 연결) */}
          <button
            onClick={handleGoogleClick}
            className="w-full flex items-center justify-center gap-2 border border-slate-200 rounded-lg py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors mb-4"
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path
                fill="#4285F4"
                d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.13-.85 2.09-1.81 2.73v2.27h2.92c1.71-1.57 2.69-3.88 2.69-6.64z"
              />
              <path
                fill="#34A853"
                d="M9 18c2.43 0 4.47-.81 5.96-2.18l-2.92-2.27c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.71H.96v2.33C2.44 15.98 5.48 18 9 18z"
              />
              <path
                fill="#FBBC05"
                d="M3.97 10.71c-.18-.54-.28-1.11-.28-1.71s.1-1.17.28-1.71V4.96H.96A8.99 8.99 0 0 0 0 9c0 1.45.35 2.83.96 4.04l3.01-2.33z"
              />
              <path
                fill="#EA4335"
                d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"
              />
            </svg>
            Google로 계속하기
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-xs text-slate-400">또는</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          {/* 이메일/비밀번호 폼 */}
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-3">
              <input
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일을 입력하세요"
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-indigo-300 transition-colors"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-indigo-300 transition-colors"
              />

              {errorMsg && (
                <p className="text-xs font-medium text-rose-500">{errorMsg}</p>
              )}
              {infoMsg && (
                <p className="text-xs font-medium text-indigo-500">{infoMsg}</p>
              )}

              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !email || !password}
                className="w-full bg-indigo-600 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-1"
              >
                {isSubmitting
                  ? "처리 중..."
                  : mode === "login"
                    ? "로그인"
                    : "회원가입"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 우측: 비주얼 영역 (자리만 잡아둠, 추후 다듬을 부분) */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-500 to-indigo-700 items-center justify-center">
        <div className="text-center text-white px-12">
          <h2 className="text-3xl font-extrabold tracking-tight">
            할 일을, 흐르듯이
          </h2>
          <p className="text-indigo-100 mt-3 text-sm">
            MyFlow와 함께 하루를 정리해보세요
          </p>
        </div>
      </div>
    </div>
  );
}

function translateAuthError(message: string): string {
  if (message.includes("Invalid login credentials")) {
    return "이메일 또는 비밀번호가 올바르지 않아요.";
  }
  if (message.includes("User already registered")) {
    return "이미 가입된 이메일이에요.";
  }
  if (message.includes("Password should be at least")) {
    return "비밀번호는 6자 이상이어야 해요.";
  }
  return message;
}
