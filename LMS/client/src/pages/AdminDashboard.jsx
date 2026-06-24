import Navbar from "../components/Navbar";
import LeaveCard from "../components/LeaveCard";

const AdminDashboard = () => {

  const totalRequests = 15;
  const pendingRequests = 4;
  const approvedRequests = 8;
  const rejectedRequests = 3;

  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <div className="max-w-6xl mx-auto p-6">

        <h1 className="text-3xl font-bold mb-2">
          Admin Dashboard
        </h1>

        <p className="text-gray-600 mb-8">
          Manage leave requests and monitor
          employee leave activity.
        </p>

        <div className="grid md:grid-cols-4 gap-6">

          <LeaveCard
            title="Total Requests"
            value={totalRequests}
          />

          <LeaveCard
            title="Pending"
            value={pendingRequests}
          />

          <LeaveCard
            title="Approved"
            value={approvedRequests}
          />

          <LeaveCard
            title="Rejected"
            value={rejectedRequests}
          />

        </div>

        <div className="mt-10 bg-white p-6 rounded-xl shadow-md">

          <h2 className="text-xl font-semibold mb-4">
            Quick Summary
          </h2>

          <ul className="space-y-3 text-gray-700">

            <li>
              Total Leave Requests: {totalRequests}
            </li>

            <li>
              Pending Approvals: {pendingRequests}
            </li>

            <li>
              Approved Requests: {approvedRequests}
            </li>

            <li>
              Rejected Requests: {rejectedRequests}
            </li>

          </ul>

        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;