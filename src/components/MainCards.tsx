export default function MiniCards() {
  return (
    <div className="grid grid-cols-2 gap-4 w-full">
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm h-[120px] flex items-center justify-center text-slate-400">
        🔥 [스트릭]
      </div>
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm h-[120px] flex items-center justify-center text-slate-400">
        💡 [명언]
      </div>
    </div>
  );
}
