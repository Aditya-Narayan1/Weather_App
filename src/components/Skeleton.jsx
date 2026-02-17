export default function Skeleton() {
  return (
    <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_25px_70px_rgba(0,0,0,0.55)] backdrop-blur-xl">
      <div className="flex items-start justify-between gap-6">
        <div className="w-full">
          <div className="h-5 w-52 rounded-lg bg-white/10 animate-pulse" />
          <div className="mt-3 h-3 w-72 rounded-lg bg-white/10 animate-pulse" />
          <div className="mt-2 h-3 w-40 rounded-lg bg-white/10 animate-pulse" />
        </div>

        <div className="w-32">
          <div className="h-10 w-24 ml-auto rounded-xl bg-white/10 animate-pulse" />
          <div className="mt-3 h-3 w-28 ml-auto rounded-lg bg-white/10 animate-pulse" />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="h-16 rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
        <div className="h-16 rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
      </div>
    </div>
  );
}
