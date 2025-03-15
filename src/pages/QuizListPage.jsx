import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { loadQuizzesFromFirestore } from '../features/storageUtils';
import './QuizListPage.css';

const QuizListPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const userId = 'currentUserId'; // Replace with actual user ID logic
        const loadedQuizzes = await loadQuizzesFromFirestore(userId);
        setQuizzes(loadedQuizzes);
      } catch (err) {
        console.error("Error loading quizzes:", err);
        setError("Failed to load quizzes.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  if (loading) {
    return <p className="loading-text">Loading quizzes...</p>;
  }

  return (
    <div className="quiz-list-container">
      <h1>Available Quizzes</h1>
      {error && <p className="error-message">{error}</p>}
      
      {quizzes.length > 0 ? (
        <div className="quiz-grid">
          {quizzes.map((quiz) => (
            <Link to={`/attempt/${quiz.id}`} key={quiz.id} className="quiz-card">
              <h2>{quiz.title}</h2>
              <p>{quiz.description || "No description available."}</p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="no-quizzes">No quizzes available.</p>
      )}
    </div>
  );
};

export default QuizListPage;
