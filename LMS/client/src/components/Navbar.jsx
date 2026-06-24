

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between">
      <h1 className="text-xl font-bold">
        Leave Management System
      </h1>

      <button className="bg-white text-blue-600 px-4 py-1 rounded">
        Logout
      </button>
    </nav>
  );
};

export default Navbar;