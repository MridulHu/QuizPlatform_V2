import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '../firebase-config';

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
    <div style={loginStyles.container}>
      {isRegistering ? (
        <form onSubmit={handleRegister}>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={loginStyles.input}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={loginStyles.input}
            />
          </div>
          <div className="login-button-container">
            <button type="submit" className="login-button">Create Account</button>
          </div>
          <p onClick={() => setIsRegistering(false)} style={loginStyles.toggleLink}>
            Already have an account? Login
          </p>
        </form>
      ) : (
        <form onSubmit={handleLogin}>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={loginStyles.input}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={loginStyles.input}
            />
          </div>
          <div className="login-button-container">
            <button type="submit" className="login-button">Login</button>
          </div>
          <p onClick={() => setIsRegistering(true)} style={loginStyles.toggleLink}>
            Don't have an account? Create one
          </p>
        </form>
      )}
      {error && <p style={loginStyles.error}>{error}</p>}
    </div>
  );
};

const loginStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  },
  input: {
    width: '300px',
    padding: '12px',
    margin: '10px 0',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  error: {
    color: 'red',
  },
  toggleLink: {
    color: 'white',
    cursor: 'pointer',
    marginTop: '10px',
    textAlign: 'center',
    fontSize: '16px',
  },
};

export default LoginPage;
