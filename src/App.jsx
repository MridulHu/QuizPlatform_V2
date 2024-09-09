import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import About from './pages/About';
import CreateQuiz from './pages/CreateQuizPage';
import AttemptQuizPage from './pages/AttemptQuizPage';
import QuizListPage from './pages/QuizListPage';
import Login from './pages/Login';
import { loadQuizzesFromFirestore } from './features/storageUtils';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const checkAuthStatus = () => {
      const authStatus = localStorage.getItem('isAuthenticated') === 'true';
      setIsAuthenticated(authStatus);
    };
    checkAuthStatus();
  }, []);

  useEffect(() => {
    const fetchQuizzes = async () => {
      if (isAuthenticated) {
        try {
          const userId = 'currentUserId';
          const loadedQuizzes = await loadQuizzesFromFirestore(userId);
          setQuizzes(loadedQuizzes);
        } catch (error) {
          console.error('Failed to load quizzes:', error);
        }
      }
    };

    fetchQuizzes();
  }, [isAuthenticated]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; 
  }

  return (
    <Router>
      <div>
        <Header isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} quizzes={quizzes} />
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/about" /> : <Navigate to="/login" />} />
          <Route path="/about" element={isAuthenticated ? <About /> : <Navigate to="/login" />} />
          <Route path="/create-quiz" element={isAuthenticated ? <CreateQuiz /> : <Navigate to="/login" />} />
          <Route path="/quizzes" element={isAuthenticated ? <QuizListPage /> : <Navigate to="/login" />} />
          <Route path="/attempt/:quizId" element={isAuthenticated ? <AttemptQuizPage /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
