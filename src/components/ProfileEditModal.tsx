import { useState, useRef, useEffect } from "react";
import {
  IconX,
  IconCamera,
  IconLoader2,
  IconDotsVertical,
} from "@tabler/icons-react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../hooks/useAuth";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

type Props = {
  onClose: () => void;
};

export default function ProfileEditModal({ onClose }: Props) {
  const { session } = useAuth();
  const user = session?.user;

  const currentName =
    (user?.user_metadata?.full_name as string | undefined) ??
    user?.email?.split("@")[0] ??
    "";
  const currentAvatarUrl =
    (user?.user_metadata?.avatar_url as string | undefined) ?? null;

  const [name, setName] = useState(currentName);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    currentAvatarUrl,
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRemovePhoto = () => {
    setSelectedFile(null);
    setAvatarPreview(null);
    setIsMenuOpen(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("이미지 파일만 업로드할 수 있습니다.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrorMsg("이미지 용량은 2MB 이하만 가능합니다.");
      return;
    }

    setErrorMsg(null);
    setSelectedFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    setErrorMsg(null);

    try {
      let avatarUrl: string | null = currentAvatarUrl;

      // 1. 사용자가 사진을 제거했다면 (새 파일도 없고, 미리보기도 비워졌다면)
      if (!selectedFile && !avatarPreview && currentAvatarUrl) {
        avatarUrl = null;
      }

      // 2. 새 이미지를 골랐다면 Storage에 업로드
      if (selectedFile) {
        const fileExt = selectedFile.name.split(".").pop();
        const filePath = `${user.id}/profile.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, selectedFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);

        // 캐시 무력화를 위해 timestamp 쿼리 추가
        avatarUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`;
      }

      // 3. 이름 + 이미지 URL을 user_metadata에 저장
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          full_name: name.trim() || currentName,
          avatar_url: avatarUrl,
        },
      });

      if (updateError) throw updateError;

      onClose();
    } catch (error) {
      console.error("프로필 저장 실패", error);
      setErrorMsg("저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-7 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
        >
          <IconX size={20} />
        </button>

        <h2 className="text-lg font-bold text-slate-900 mb-6">프로필 변경</h2>

        {/* 아바타 영역 */}
        <div className="flex flex-col items-center mb-7">
          <div className="relative">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="relative w-28 h-28 rounded-full overflow-hidden group"
            >
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="프로필 미리보기"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-500 font-bold text-3xl">
                  {(name || "?").slice(0, 1).toUpperCase()}
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <IconCamera size={24} className="text-white" />
              </div>
            </button>

            {/* 케밥 메뉴 (사진 삭제) */}
            <div className="absolute -right-1 -bottom-1" ref={menuRef}>
              <button
                type="button"
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className="w-7 h-7 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-500 hover:text-slate-800 hover:shadow-md transition-all"
                aria-label="사진 옵션"
              >
                <IconDotsVertical size={16} />
              </button>

              {isMenuOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 top-9 w-36 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-10">
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    disabled={!avatarPreview}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
                  >
                    프로필 사진 삭제
                  </button>
                </div>
              )}
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <p className="text-xs text-slate-400 mt-3">
            사진을 눌러 변경 (최대 2MB)
          </p>
        </div>

        {/* 이름 입력 */}
        <div className="mb-2">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            이름
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름을 입력하세요"
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {errorMsg && <p className="text-xs text-rose-500 mt-2">{errorMsg}</p>}

        <div className="flex gap-2 mt-7">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 rounded-lg transition-colors flex items-center justify-center gap-1.5 disabled:opacity-60"
          >
            {isSaving && <IconLoader2 size={14} className="animate-spin" />}
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
