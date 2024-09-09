import React, { useState, useEffect } from 'react';
import QuizForm from '../components/QuizForm';
import { saveQuizzesToFirestore, loadQuizzesFromFirestore, deleteQuizFromFirestore } from '../features/storageUtils';

const CreateQuizPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const userId = 'currentUserId'; // Replace with the actual user ID

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const loadedQuizzes = await loadQuizzesFromFirestore(userId);
        setQuizzes(loadedQuizzes);
      } catch (error) {
        console.error('Failed to load quizzes:', error);
      }
    };

    fetchQuizzes();
  }, [userId]);

  const handleCreateQuiz = async (quizData) => {
    const newQuizId = `quiz_${Date.now()}`; // Generate a unique ID for the new quiz
    const updatedQuizzes = [...quizzes, { id: newQuizId, ...quizData }];
    setQuizzes(updatedQuizzes);

    try {
      // Ensure userId and newQuizId are valid
      if (typeof userId !== 'string' || typeof newQuizId !== 'string') {
        throw new Error('Invalid userId or quizId');
      }

      await saveQuizzesToFirestore(userId, newQuizId, quizData);
    } catch (error) {
      console.error('Failed to save quiz:', error);
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    const updatedQuizzes = quizzes.filter(quiz => quiz.id !== quizId);
    setQuizzes(updatedQuizzes);

    try {
      // Ensure userId and quizId are valid
      if (typeof userId !== 'string' || typeof quizId !== 'string') {
        throw new Error('Invalid userId or quizId');
      }

      await deleteQuizFromFirestore(userId, quizId); // Call a separate function to delete the quiz
    } catch (error) {
      console.error('Failed to delete quiz:', error);
    }
  };

  return (
    <div>
      <h1>Create a New Quiz</h1>
      <QuizForm onCreate={handleCreateQuiz} />

      <h2>Created Quizzes</h2>
      {quizzes.length > 0 ? (
        <ul>
          {quizzes.map((quiz) => (
            <li key={quiz.id}>
              {quiz.title} - {Array.isArray(quiz.questions) ? quiz.questions.length : 0} Questions
              <button 
                onClick={() => handleDeleteQuiz(quiz.id)} 
                style={{ marginLeft: '10px', color: 'red' }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No quizzes created yet.</p>
      )}
    </div>
  );
};

export default CreateQuizPage;
