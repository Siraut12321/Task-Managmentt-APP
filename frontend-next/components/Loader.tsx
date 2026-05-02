const SkeletonCard = () => (
  <div className="bg-slate-800/60 rounded-2xl p-4 mb-3 animate-pulse">
    <div className="h-4 bg-slate-700 rounded w-3/4 mb-3" />
    <div className="h-3 bg-slate-700 rounded w-1/2 mb-3" />
    <div className="flex gap-2 justify-end">
      <div className="h-7 w-16 bg-slate-700 rounded-lg" />
      <div className="h-7 w-16 bg-slate-700 rounded-lg" />
    </div>
  </div>
);

const Loader = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
    {[0, 1, 2].map((col) => (
      <div key={col} className="bg-slate-900/50 rounded-2xl p-4">
        <div className="h-5 bg-slate-700 rounded w-1/3 mb-4 animate-pulse" />
        {[0, 1, 2].map((i) => <SkeletonCard key={i} />)}
      </div>
    ))}
  </div>
);

export default Loader;
