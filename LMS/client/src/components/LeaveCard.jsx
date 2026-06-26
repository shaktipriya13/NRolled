const LeaveCard = ({ title, value, icon, color = "indigo" }) => {
  const colorMap = {
    indigo: {
      bg: "from-indigo-50 to-indigo-100/50",
      text: "text-indigo-600",
      border: "border-indigo-100",
      pill: "bg-indigo-500 text-white"
    },
    amber: {
      bg: "from-amber-50 to-amber-100/50",
      text: "text-amber-600",
      border: "border-amber-100",
      pill: "bg-amber-500 text-white"
    },
    emerald: {
      bg: "from-emerald-50 to-emerald-100/50",
      text: "text-emerald-600",
      border: "border-emerald-100",
      pill: "bg-emerald-500 text-white"
    },
    rose: {
      bg: "from-rose-50 to-rose-100/50",
      text: "text-rose-600",
      border: "border-rose-100",
      pill: "bg-rose-500 text-white"
    }
  };

  const currentStyles = colorMap[color] || colorMap.indigo;

  return (
    <div className={`relative overflow-hidden bg-white/70 backdrop-blur-md rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md hover:scale-[1.01] hover:border-slate-300 transition-all duration-300`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-slate-500 text-sm font-semibold tracking-wide uppercase">
            {title}
          </h3>
          <p className="text-4xl font-extrabold mt-3 tracking-tight bg-gradient-to-r from-slate-900 to-slate-800 bg-clip-text text-transparent">
            {value}
          </p>
        </div>
        {icon && (
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${currentStyles.pill} shadow-md shadow-slate-100`}>
            {icon}
          </div>
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20"></div>
    </div>
  );
};

export default LeaveCard;