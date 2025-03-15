import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '../firebase-config';
import './Login.css'; // New CSS file for styling

const LoginPage = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsAuthenticated(true);
      navigate('/');  
    } catch (error) {
      setError('Invalid email or password');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setIsRegistering(false); 
      setError(''); 
    } catch (error) {
      setError('Error creating account');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{isRegistering ? "Create Account" : "Login"}</h2>
        <form onSubmit={isRegistering ? handleRegister : handleLogin}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="login-button">{isRegistering ? "Sign Up" : "Login"}</button>
        </form>
        <p className="toggle-link" onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? "Already have an account? Login" : "Don't have an account? Sign Up"}
        </p>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
