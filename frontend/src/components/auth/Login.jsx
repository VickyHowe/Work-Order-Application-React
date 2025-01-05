import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useApi from "../../hooks/useApi"; 

const Login = ({ setUser  }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { apiCall, loading } = useApi();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Make a POST request to the server to log in the user
      const data = await apiCall("/api/auth/login", "POST", { username, password });

      if (data.token) {
        setUser ({
          id: data.user.id,
          username,
          role: data.user.role,
        });
        localStorage.setItem("token", data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: data.user.id,
            username: data.user.username,
            role: data.user.role.name,
          })
        );
        navigate("/Dashboard");
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred. Please try again later.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <form onSubmit={handleSubmit} className="mb-4 bg-forms text-black border-black p-6 rounded-lg shadow-md">
        <h2 className="text-2xl mb-4">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label htmlFor="username" className="block mb-1">Username</label>
          <input
            id="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 mb-4 w-full rounded-md placeholder-gray-400 "
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-1">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 mb-4 w-full rounded-md placeholder-gray-400"
            required
          />
        </div>
        <button
          type="submit"
          className={`bg-secondary-light border border-black text-black p-2 w-full rounded-md ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="text-center mt-4">
        Don't have an account?{" "}
        <Link to="/register" className="text-blue-500 hover:underline">
          Register here
        </Link>
      </p>
    </div>
  );
};

export default Login;
