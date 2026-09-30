import api from './api';

export const fetchCourses = async () => {
  const { data } = await api.get('/courses');
  return data;
};

export const fetchCourseById = async (id) => {
  const { data } = await api.get(`/courses/${id}`);
  return data;
};

export const generateCertificate = async (courseId) => {
  const { data } = await api.post('/certificates/generate', { courseId });
  return data;
};

export const getCertificate = async (courseId) => {
  const { data } = await api.get(`/certificates/${courseId}`);
  return data;
};
