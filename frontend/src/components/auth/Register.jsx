import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useApi from "../../hooks/useApi";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityQuestionAnswer, setSecurityQuestionAnswer] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { apiCall, loading } = useApi();

  // Function to validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate email format
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Prepare the data to be sent to the server
    const userData = {
      username,
      email,
      password,
      securityQuestion,
      securityQuestionAnswer,
    };

    try {
      const data = await apiCall("/api/auth/register", "POST", userData);

      // Assuming the API returns a success message or user data
      navigate("/dashboard");
    } catch (err) {
      console.error("Registration failed:", err); // Log the error for debugging
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <form
        onSubmit={handleSubmit}
        className="mb-4 bg-forms text-black border-gray p-6 rounded-lg shadow-md"
      >
        <h2 className="text-2xl mb-4">Register</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label htmlFor="username" className="block mb-1">
            Username
          </label>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 mb-4 w-full rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 w-full rounded-md placeholder-gray-400"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 w-full rounded-md placeholder-gray-400"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="securityQuestion" className="block mb-1">
            Security Question
          </label>
          <input
            id="securityQuestion"
            type="text"
            placeholder="Security Question (e.g., What is your mother's maiden name?)"
            value={securityQuestion}
            onChange={(e) => setSecurityQuestion(e.target.value)}
            className="border p-2 w-full rounded-md placeholder-gray-400"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="securityQuestionAnswer" className="block mb-1">
            Security Question Answer
          </label>
          <input
            id="securityQuestionAnswer"
            type="text"
            placeholder="Security Question Answer"
            value={securityQuestionAnswer}
            onChange={(e) => setSecurityQuestionAnswer(e.target.value)}
            className="border p-2 w-full rounded-md placeholder-gray-400"
            required
          />
        </div>
        <button
          type="submit"
          className={`bg-secondary-light text-black border border-black p-2 w-full rounded-md ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
        <p className="text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
