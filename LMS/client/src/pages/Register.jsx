// import React from "react";

const Register = () => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        
        <h2 className="text-2xl font-bold text-center mb-6">
          Register
        </h2>

        <form className="space-y-4">
          
          <div>
            <label className="block text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Register
          </button>
          
        </form>

      </div>

    </div>
  );
};

export default Register;