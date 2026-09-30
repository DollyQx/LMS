import api from './api';

export const getProgress = async (courseId) => {
  const { data } = await api.get(`/progress/${courseId}`);
  return data;
};

export const markLessonComplete = async (courseId, lessonId) => {
  const { data } = await api.post(`/progress/${courseId}/lesson/${lessonId}`);
  return data;
};

export const getQuizzesForCourse = async (courseId) => {
  const { data } = await api.get(`/quiz/${courseId}`);
  return data;
};

export const submitQuizAttempt = async (quizId, answers) => {
  const { data } = await api.post('/quiz/attempt', { quizId, answers });
  return data;
};
