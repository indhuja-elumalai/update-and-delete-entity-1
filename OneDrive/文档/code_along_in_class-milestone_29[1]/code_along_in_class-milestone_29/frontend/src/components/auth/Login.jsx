import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError(""); // Clear previous errors

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v2/user/login",
        { email: email.toLowerCase(), password }, // Convert email to lowercase
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Login Success:", response.data);
      localStorage.setItem("token", response.data.token); // Save token if needed
      alert("Login successful!");
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Login to your account
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                autoComplete="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border rounded-md"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Submit
            </button>
            {error && <p className="text-center text-red-500">{error}</p>}
            <p className="text-center">
              Don't have an account? <Link to="/signup" className="text-blue-600">Sign up</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
