import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav
      className="
      bg-blue-600
      text-white
      px-6
      py-4
      flex
      justify-between
      items-center
      "
    >
      <h1 className="font-bold text-xl">
        Leave Management
      </h1>

      <div className="flex gap-4">
        <Link to="/employee">
          Dashboard
        </Link>

        <Link to="/apply-leave">
          Apply Leave
        </Link>

        <Link to="/my-leaves">
          My Leaves
        </Link>

        <Link to="/admin">
          Admin
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;