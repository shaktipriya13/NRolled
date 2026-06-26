const LeaveCard = ({ title, value, icon, color = "indigo" }) => {
  const colorMap = {
    indigo: {
      bg: "from-indigo-500/10 via-indigo-600/5 to-transparent",
      text: "text-indigo-400",
      border: "border-indigo-500/20 hover:border-indigo-500/40",
      pill: "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
    },
    amber: {
      bg: "from-amber-500/10 via-amber-600/5 to-transparent",
      text: "text-amber-400",
      border: "border-amber-500/20 hover:border-amber-500/40",
      pill: "bg-amber-600 text-white shadow-lg shadow-amber-500/20"
    },
    emerald: {
      bg: "from-emerald-500/10 via-emerald-600/5 to-transparent",
      text: "text-emerald-400",
      border: "border-emerald-500/20 hover:border-emerald-500/40",
      pill: "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
    },
    rose: {
      bg: "from-rose-500/10 via-rose-600/5 to-transparent",
      text: "text-rose-400",
      border: "border-rose-500/20 hover:border-rose-500/40",
      pill: "bg-rose-600 text-white shadow-lg shadow-rose-500/20"
    }
  };

  const currentStyles = colorMap[color] || colorMap.indigo;

  return (
    <div className={`relative overflow-hidden bg-slate-900/45 backdrop-blur-xl rounded-3xl border ${currentStyles.border} p-7 hover:scale-[1.01] transition-all duration-300 shadow-xl shadow-black/15`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/3 to-transparent pointer-events-none"></div>
      <div className="flex justify-between items-start relative z-10">
        <div>
          <h3 className="text-slate-400 text-xs font-black tracking-widest uppercase">
            {title}
          </h3>
          <p className={`text-4xl font-extrabold mt-3 tracking-tight ${currentStyles.text}`}>
            {value}
          </p>
        </div>
        {icon && (
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${currentStyles.pill}`}>
            {icon}
          </div>
        )}
      </div>
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${color === "indigo" ? "from-indigo-500 to-purple-500" : color === "amber" ? "from-amber-500 to-orange-500" : color === "emerald" ? "from-emerald-500 to-teal-500" : "from-rose-500 to-pink-500"}`}></div>
    </div>
  );
};

export default LeaveCard;