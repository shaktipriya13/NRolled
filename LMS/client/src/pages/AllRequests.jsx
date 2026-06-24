import Navbar from "../components/Navbar";

const AllRequests = () => {
  const requests = [
    {
      id: 1,
      employee: "Rahul Sharma",
      fromDate: "2026-07-10",
      toDate: "2026-07-12",
      days: 3,
      reason: "Family Function",
      status: "PENDING",
    },
    {
      id: 2,
      employee: "Priya Singh",
      fromDate: "2026-07-20",
      toDate: "2026-07-21",
      days: 2,
      reason: "Medical Leave",
      status: "APPROVED",
    },
    {
      id: 3,
      employee: "Amit Kumar",
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

      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-2">
          All Leave Requests
        </h1>

        <p className="text-gray-600 mb-8">
          Review and manage employee leave requests.
        </p>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-4 text-left">
                    Employee
                  </th>

                  <th className="px-4 py-4 text-left">
                    From
                  </th>

                  <th className="px-4 py-4 text-left">
                    To
                  </th>

                  <th className="px-4 py-4 text-left">
                    Days
                  </th>

                  <th className="px-4 py-4 text-left">
                    Reason
                  </th>

                  <th className="px-4 py-4 text-left">
                    Status
                  </th>

                  <th className="px-4 py-4 text-left">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {requests.map((request) => (
                  <tr
                    key={request.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="px-4 py-4">
                      {request.employee}
                    </td>

                    <td className="px-4 py-4">
                      {request.fromDate}
                    </td>

                    <td className="px-4 py-4">
                      {request.toDate}
                    </td>

                    <td className="px-4 py-4">
                      {request.days}
                    </td>

                    <td className="px-4 py-4">
                      {request.reason}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          request.status
                        )}`}
                      >
                        {request.status}
                      </span>
                    </td>

                    <td className="px-4 py-4 space-x-2">
                      <button
                        className="
                        bg-green-600
                        text-white
                        px-3
                        py-2
                        rounded-lg
                        hover:bg-green-700
                        "
                      >
                        Approve
                      </button>

                      <button
                        className="
                        bg-red-600
                        text-white
                        px-3
                        py-2
                        rounded-lg
                        hover:bg-red-700
                        "
                      >
                        Reject
                      </button>
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

export default AllRequests;