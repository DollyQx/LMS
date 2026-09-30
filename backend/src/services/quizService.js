const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const Course = require('../models/Course');
const Attempt = require('../models/Attempt');
const AppError = require('../utils/AppError');
const mongoose = require('mongoose');

exports.createQuizAndQuestions = async (quizData) => {
  const { title, courseId, moduleId, questions } = quizData;

  // Validate parent Course
  const parentCourse = await Course.findById(courseId);
  if (!parentCourse) {
    throw new AppError('The specified Course ID does not exist', 404);
  }

  // Create the empty Quiz structural shell natively
  const newQuiz = await Quiz.create({
    title,
    courseId,
    moduleId: moduleId || undefined,
  });

  // Iteratively map and physically push the question arrays into the Database
  let totalMarksCalculated = 0;
  
  if (questions && questions.length > 0) {
    // Forcefully inject the newly created quizId into the incoming question payloads
    const mappedQuestions = questions.map(q => ({
      ...q,
      quizId: newQuiz._id
    }));

    // Inject massive block cleanly into MongoDB
    const insertedQuestions = await Question.insertMany(mappedQuestions);

    // Sum mathematically
    insertedQuestions.forEach(q => {
      totalMarksCalculated += q.marks;
      newQuiz.questions.push(q._id);
    });
  }

  // Save the calculated sum and the specific ObjectIds mapped back
  newQuiz.totalMarks = totalMarksCalculated;
  await newQuiz.save();

  return newQuiz;
};

exports.getQuizzesForCourse = async (courseId) => {
  return await Quiz.find({ courseId }).populate('questions', '-correctAnswer'); 
  // IMPORTANT: We explicitly REMOVE 'correctAnswer' from the GET response 
  // so students cannot inspect element and cheat!
};

exports.submitAttempt = async (userId, quizId, submittedAnswers) => {
  if (!Array.isArray(submittedAnswers)) {
    throw new AppError('Answers must be provided as a strict array of numbers', 400);
  }

  // 1. Fetch exactly what the structural Quiz and Database Answers look like concurrently
  const quiz = await Quiz.findById(quizId);
  if (!quiz) throw new AppError('No quiz found with that ID', 404);

  // Note: We need the actual Question schemas since Quiz.js only holds their _id references!
  const questions = await Question.find({ quizId: quiz._id }).sort({ _id: 1 });
  
  // Basic validation check to verify we aren't short or over the length
  if (submittedAnswers.length !== questions.length) {
    throw new AppError(`Invalid submission length. Expected ${questions.length} answers, got ${submittedAnswers.length}`, 400);
  }

  // 2. Iterate identically over the array indexes to automatically grade them securely
  let calculatedScore = 0;
  
  questions.forEach((question, index) => {
    // Did they submit the correct exact Index matching out mathematical validation structure?
    if (submittedAnswers[index] === question.correctAnswer) {
      calculatedScore += question.marks;
    }
  });

  // 3. Save Attempt Record immutable transaction
  const attempt = await Attempt.create({
    userId,
    quizId: quiz._id,
    answers: submittedAnswers,
    score: calculatedScore,
    totalMarks: quiz.totalMarks
  });

  return {
    score: attempt.score,
    totalMarks: attempt.totalMarks,
    percentage: ((attempt.score / attempt.totalMarks) * 100).toFixed(2),
    attemptId: attempt._id
  };
};

exports.getAttemptResults = async (userId, quizId) => {
  // Sort heavily by Score descending to pluck the 'Best Score' immediately at index 0.
  const attempts = await Attempt.find({ userId, quizId }).sort({ score: -1, submittedAt: -1 });
  return attempts;
};
