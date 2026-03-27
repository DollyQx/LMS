import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizzesForCourse, submitQuizAttempt } from '../services/progress.service';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import { CheckCircle } from 'lucide-react';

const Quiz = () => {
  const { id } = useParams(); // Matches courseId locally
  const navigate = useNavigate();
  
  const [quizData, setQuizData] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await getQuizzesForCourse(id);
        if (res.data.quizzes.length > 0) {
          const quiz = res.data.quizzes[0];
          setQuizData(quiz);
          setAnswers(new Array(quiz.questions.length).fill(null));
        }
      } catch (err) {
        console.error("Quiz Error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  const selectAnswer = (qIndex, optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[qIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    if (answers.includes(null)) {
      alert("Please answer all questions before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitQuizAttempt(quizData._id, answers);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to evaluate quiz");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="h-screen bg-dark flex justify-center items-center"><Loader /></div>;
  if (!quizData) return <div className="p-20 text-center dark:text-white">No active quiz assigned to this course.</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col dark:bg-dark text-gray-900 dark:text-white pb-20">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8">
        
        {!result ? (
          <div className="bg-white dark:bg-darkLayer p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <h1 className="text-3xl font-bold mb-8 text-center">{quizData.title}</h1>
            
            <div className="space-y-8">
              {quizData.questions.map((q, qIndex) => (
                <div key={q._id} className="p-6 bg-gray-50 dark:bg-darker rounded-xl border border-gray-100 dark:border-gray-800">
                  <h3 className="text-xl font-medium mb-4">{qIndex + 1}. {q.questionText}</h3>
                  
                  <div className="space-y-3">
                    {q.options.map((opt, oIndex) => (
                      <button
                        key={oIndex}
                        onClick={() => selectAnswer(qIndex, oIndex)}
                        className={`w-full text-left p-4 rounded-lg border transition-all ${
                          answers[qIndex] === oIndex 
                            ? 'bg-brand/10 border-brand text-brand dark:bg-brand/20 dark:text-white' 
                            : 'bg-white border-gray-200 dark:bg-darkLayer dark:border-gray-700 hover:border-brand/40'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex justify-end">
               <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-brand hover:bg-brandHover text-white font-bold rounded-lg transition"
               >
                 {isSubmitting ? <Loader className="w-5 h-5 text-white" /> : 'Submit Final Answers'}
               </button>
            </div>
          </div>
        ) : (
          <div className="text-center bg-white dark:bg-darkLayer p-10 rounded-2xl shadow-xl mt-10 border border-gray-100 dark:border-gray-800">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h2 className="text-3xl font-black mb-2">Quiz Completed!</h2>
            <p className="text-xl text-gray-500 dark:text-gray-400 mb-8">You scored {result.score} out of {result.totalMarks}</p>
            
            <div className="w-40 h-40 mx-auto bg-green-500/10 rounded-full flex items-center justify-center border-4 border-green-500 mb-8">
               <span className="text-4xl font-black text-green-500">{result.percentage}%</span>
            </div>

            <button 
               onClick={() => navigate(`/certificate/${id}`)}
               className="bg-brand hover:bg-brandHover text-white px-8 py-4 rounded-lg font-bold text-lg shadow-lg hover:shadow-brand/20 transition-all"
            >
               Claim Certificate
            </button>
          </div>
        )}

      </main>
    </div>
  );
};

export default Quiz;
