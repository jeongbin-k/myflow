import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase 환경 변수가 세팅되지 않았습니다. .env.local 파일을 확인해 주세요!",
  );
}

// 전역에서 사용할 Supabase 클라이언트 인스턴스 내보내기
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
