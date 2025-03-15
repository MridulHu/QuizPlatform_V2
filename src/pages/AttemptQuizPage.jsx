import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadQuizzesFromFirestore } from '../features/storageUtils';
import './AttemptQuizPage.css';
import { FacebookShareButton, TwitterShareButton } from 'react-share';
import { FaFacebook } from 'react-icons/fa';

const AttemptQuizPage = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState([]);
  const [score, setScore] = useState(0);
  const [error, setError] = useState(null);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const userId = 'currentUserId';
        const quizzes = await loadQuizzesFromFirestore(userId);

        if (!quizId) {
          setError('No quiz ID provided');
          navigate('/quizzes');
          return;
        }

        const selectedQuiz = quizzes.find(quiz => quiz.id === quizId);
        if (!selectedQuiz) {
          setError('Quiz not found');
          navigate('/quizzes');
          return;
        }

        setQuiz(selectedQuiz);
        setError(null);
      } catch (err) {
        console.error('Error loading quizzes:', err);
        setError('Error loading quizzes');
        navigate('/quizzes');
      }
    };

    fetchQuizzes();
  }, [quizId, navigate]);

  const handleAnswerChange = (questionIndex, selectedOption) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionIndex]: selectedOption,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!quiz || !quiz.questions) return;

    const feedbackArray = quiz.questions.map((question, index) => ({
      questionIndex: index,
      selectedOption: answers[index],
      isCorrect: question.options[question.correctOption] === answers[index],
    }));

    setFeedback(feedbackArray);
    setScore(feedbackArray.filter((item) => item.isCorrect).length);
    setShowShareOptions(true);
  };

  const shareMessage = `I scored ${score} out of ${quiz?.questions?.length || 0} on "${quiz?.title}" quiz! Try it out.`;

  if (error) {
    return <div className="quiz-container">{error}</div>;
  }

  if (!quiz) {
    return <div className="quiz-container">Loading quiz...</div>;
  }

  return (
    <div className="quiz-container">
      <div className="quiz-content">
        <h1>Attempt Quiz: {quiz.title}</h1>
        <form onSubmit={handleSubmit}>
          {quiz.questions && quiz.questions.length > 0 ? (
            quiz.questions.map((question, index) => (
              <div key={index} className="question-card">
                <h2>Question {index + 1}</h2>
                <p>{question.question}</p>
                {question.options.map((option, optionIndex) => (
                  <label key={optionIndex} className="option">
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      checked={answers[index] === option}
                      onChange={() => handleAnswerChange(index, option)}
                    />
                    {option}
                  </label>
                ))}
                {feedback.length > 0 && (
                  <p className={`feedback ${feedback[index]?.isCorrect ? 'correct' : 'incorrect'}`}>
                    {feedback[index]?.isCorrect ? '✅ Correct!' : '❌ Incorrect'}
                  </p>
                )}
              </div>
            ))
          ) : (
            <p>No questions available.</p>
          )}
          <button type="submit" className="submit-btn">Submit Answers</button>
        </form>

        {feedback.length > 0 && (
          <div className="result-summary">
            <p>Total Correct Answers: {feedback.filter(item => item.isCorrect).length} / {quiz.questions.length}</p>
            <p>Your Score: {score}</p>

            {showShareOptions && (
              <div className="share-options">
                <h3>Share your score!</h3>
                <div className="share-button">
                  <FacebookShareButton url={window.location.href} quote={shareMessage}>
                    <div className="share-icon">
                      <FaFacebook size={32} />
                    </div>
                    <span>Share on Facebook</span>
                  </FacebookShareButton>
                </div>
                <div className="share-button">
                  <TwitterShareButton url={window.location.href} title={shareMessage}>
                    <div className="share-icon">
                      <img src="/XIcon.svg" alt="Share on X" style={{ width: '50px', height: '50px' }} />
                    </div>
                    <span>Share on X</span>
                  </TwitterShareButton>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttemptQuizPage;
