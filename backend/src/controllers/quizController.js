const quizService = require('../services/quizService');
const asyncHandler = require('../middleware/asyncHandler');

exports.createQuiz = asyncHandler(async (req, res, next) => {
  const newQuiz = await quizService.createQuizAndQuestions(req.body);
  res.status(201).json({ status: 'success', data: { quiz: newQuiz } });
});

exports.getQuizzesForCourse = asyncHandler(async (req, res, next) => {
  const quizzes = await quizService.getQuizzesForCourse(req.params.courseId);
  res.status(200).json({ status: 'success', results: quizzes.length, data: { quizzes } });
});

exports.submitAttempt = asyncHandler(async (req, res, next) => {
  const { quizId, answers } = req.body;
  // Automatically bind the userID from the deeply embedded protect middleware schema
  const result = await quizService.submitAttempt(req.user._id, quizId, answers);
  
  res.status(201).json({ 
    status: 'success', 
    message: 'Quiz evaluated successfully',
    data: result 
  });
});

exports.getAttemptResults = asyncHandler(async (req, res, next) => {
  const results = await quizService.getAttemptResults(req.user._id, req.params.quizId);
  
  if (!results.length) {
    return res.status(200).json({ status: 'success', message: 'No attempts exist for this user on this quiz', data: { attempts: [], bestScore: null } });
  }

  res.status(200).json({ 
    status: 'success', 
    data: { 
      attempts: results,
      highestScore: results[0] // Guaranteed by mongo sorting in our Service layer logic!
    } 
  });
});
