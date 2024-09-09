import { db, doc, setDoc } from '../firebase-config'; // Ensure correct imports
import { collection, getDocs, deleteDoc } from 'firebase/firestore'; // Import these from firebase/firestore

export const saveQuizzesToFirestore = async (userId, quizId, quizData) => {
  try {
    await setDoc(doc(db, 'users', userId, 'quizzes', quizId), quizData);
  } catch (error) {
    console.error('Error saving quiz:', error);
  }
};

export const loadQuizzesFromFirestore = async (userId) => {
  try {
    const quizzesCollection = collection(db, 'users', userId, 'quizzes');
    const quizzesSnapshot = await getDocs(quizzesCollection);
    const quizzesData = quizzesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return quizzesData;
  } catch (error) {
    console.error('Error loading quizzes:', error);
    return []; // Return an empty array in case of error
  }
};

export const deleteQuizFromFirestore = async (userId, quizId) => {
  try {
    await deleteDoc(doc(db, 'users', userId, 'quizzes', quizId));
  } catch (error) {
    console.error('Error deleting quiz:', error);
  }
};
