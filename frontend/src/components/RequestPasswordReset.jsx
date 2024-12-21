import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";

const RequestPasswordReset = () => {
  const [username, setUsername] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityQuestionAnswer, setSecurityQuestionAnswer] = useState("");
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/request-password-reset`,
        { username }
      );
      setSecurityQuestion(response.data.securityQuestion);
      setStep(2);
    } catch (error) {
      alert("Error retrieving security question");
    }
  };

  const handleSecurityQuestionSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/users/verify-security-question`,
        { username, securityQuestionAnswer }
      );
      // If the answer is correct, redirect to reset password
      if (
        response.data.message ===
        "Security question answered correctly. You can now reset your password."
      ) {
        navigate(`/reset-password/${response.data.token}`);
      }
    } catch (error) {
      alert("Error verifying security question answer");
    }
  };

  return (
    <div className="container mt-5">
      {step === 1 ? (
        <Form onSubmit={handleUsernameSubmit} className="mb-4">
          <h2>Retrieve Security Question</h2>
          <Form.Group controlId="formUsername">
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </Form.Group>
          <Button type="submit" variant="primary">
            Retrieve Security Question
          </Button>
        </Form>
      ) : (
        <Form onSubmit={handleSecurityQuestionSubmit} className="mb-4">
          <h2>Security Question</h2>
          <p>{securityQuestion}</p>
          <Form.Group controlId="formSecurityQuestionAnswer">
            <Form.Control
              type="text"
              value={securityQuestionAnswer}
              onChange={(e) => {
                setSecurityQuestionAnswer(e.target.value);
              }}
              placeholder="Enter your answer to the security question"
              required
            />
          </Form.Group>
          <Button type="submit" variant="success">
            Verify Answer
          </Button>
        </Form>
      )}
    </div>
  );
};

export default RequestPasswordReset;
