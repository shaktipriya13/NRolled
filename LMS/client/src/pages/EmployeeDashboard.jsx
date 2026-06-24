import Navbar from "../components/Navbar";
import LeaveCard from "../components/LeaveCard";

const EmployeeDashboard = () => {

  const leaveBalance = 20;
  const pendingLeaves = 2;
  const approvedLeaves = 5;

  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <div className="max-w-6xl mx-auto p-6">

        <h1 className="text-3xl font-bold mb-2">
          Welcome Back 👋
        </h1>

        <p className="text-gray-600 mb-8">
          Here is your leave summary.
        </p>

        <div className="grid md:grid-cols-3 gap-6">

          <LeaveCard
            title="Leave Balance"
            value={leaveBalance}
          />

          <LeaveCard
            title="Pending Leaves"
            value={pendingLeaves}
          />

          <LeaveCard
            title="Approved Leaves"
            value={approvedLeaves}
          />

        </div>

      </div>

    </div>
  );
};

export default EmployeeDashboard;