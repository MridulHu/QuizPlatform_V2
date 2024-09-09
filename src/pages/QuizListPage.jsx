import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { loadQuizzesFromFirestore } from '../features/storageUtils';
import '../App.css';

const QuizListPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const userId = 'currentUserId'; // Replace with the actual user ID
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
    return <p>Loading quizzes...</p>;
  }

  return (
    <div>
      <h1>Select a Quiz to Attempt</h1>
      {error && <p>{error}</p>}
      <ul>
        {quizzes.length > 0 ? (
          quizzes.map((quiz) => (
            <li key={quiz.id}>
              <Link to={`/attempt/${quiz.id}`}>Attempt {quiz.title}</Link>
            </li>
          ))
        ) : (
          <p>No quizzes available.</p>
        )}
      </ul>
    </div>
  );
};

export default QuizListPage;
