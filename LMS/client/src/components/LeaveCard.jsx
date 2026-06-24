const LeaveCard = ({ title, value }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">

      <h3 className="text-gray-500 text-sm font-medium">
        {title}
      </h3>

      <p className="text-3xl font-bold mt-2 text-blue-600">
        {value}
      </p>

    </div>
  );
};

export default LeaveCard;