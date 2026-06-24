import Navbar from "../components/Navbar";

const MyLeaves = () => {

  const leaves = [
    {
      id: 1,
      fromDate: "2026-07-10",
      toDate: "2026-07-12",
      days: 3,
      reason: "Family Function",
      status: "PENDING",
    },
    {
      id: 2,
      fromDate: "2026-07-20",
      toDate: "2026-07-21",
      days: 2,
      reason: "Medical Leave",
      status: "APPROVED",
    },
    {
      id: 3,
      fromDate: "2026-07-25",
      toDate: "2026-07-25",
      days: 1,
      reason: "Personal Work",
      status: "REJECTED",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-700";

      case "REJECTED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <div className="max-w-6xl mx-auto p-6">

        <h1 className="text-3xl font-bold mb-2">
          My Leaves
        </h1>

        <p className="text-gray-600 mb-8">
          View all your leave requests and their
          current status.
        </p>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-blue-600 text-white">

                <tr>

                  <th className="px-6 py-4 text-left">
                    From
                  </th>

                  <th className="px-6 py-4 text-left">
                    To
                  </th>

                  <th className="px-6 py-4 text-left">
                    Days
                  </th>

                  <th className="px-6 py-4 text-left">
                    Reason
                  </th>

                  <th className="px-6 py-4 text-left">
                    Status
                  </th>

                </tr>

              </thead>

              <tbody>

                {leaves.map((leave) => (

                  <tr
                    key={leave.id}
                    className="border-b hover:bg-gray-50"
                  >

                    <td className="px-6 py-4">
                      {leave.fromDate}
                    </td>

                    <td className="px-6 py-4">
                      {leave.toDate}
                    </td>

                    <td className="px-6 py-4">
                      {leave.days}
                    </td>

                    <td className="px-6 py-4">
                      {leave.reason}
                    </td>

                    <td className="px-6 py-4">

                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          leave.status
                        )}`}
                      >
                        {leave.status}
                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
};

export default MyLeaves;