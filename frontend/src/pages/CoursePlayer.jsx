import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProgressBar from '../components/ProgressBar';
import Loader from '../components/Loader';
import { fetchCourseById } from '../services/courses.service';
import { processLessonCompletion } from '../services/progress.service'; // Pseudo import mapped logically
import { CheckCircle, PlayCircle, FileText, FileQuestion } from 'lucide-react';

const CoursePlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetchCourseById(id);
        setCourse(res.data.course);
        
        // Auto-select first lesson securely
        if (res.data.course.modules?.length > 0 && res.data.course.modules[0].lessons?.length > 0) {
          setActiveLesson(res.data.course.modules[0].lessons[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [id]);

  const getIcon = (type) => {
    switch(type) {
      case 'video': return <PlayCircle className="w-5 h-5" />;
      case 'pdf': return <FileText className="w-5 h-5" />;
      case 'quiz': return <FileQuestion className="w-5 h-5 text-orange-400" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  if (loading) return <div className="min-h-screen bg-dark flex flex-col items-center justify-center text-white"><Loader /></div>;
  if (!course) return <div className="text-white text-center mt-20">Course Not Found!</div>;

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-darker overflow-hidden">
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT SIDEBAR: Modules & Lessons */}
        <aside className="w-80 bg-white dark:bg-darkLayer border-r border-gray-200 dark:border-gray-800 flex flex-col overflow-y-auto">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800">
            <h2 className="font-bold text-xl text-gray-900 dark:text-white mb-4 line-clamp-2">{course.title}</h2>
            <ProgressBar progress={15} /> {/* Static mock for player layout */}
          </div>

          <div className="flex-1 overflow-y-auto">
            {course.modules?.map((mod, mIdx) => (
              <div key={mod._id} className="border-b border-gray-100 dark:border-gray-800/50">
                <div className="px-6 py-4 bg-gray-50/50 dark:bg-darker/30 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Module {mIdx + 1}: {mod.title}
                </div>
                
                <div className="flex flex-col">
                  {mod.lessons?.map((les, lIdx) => {
                    const isActive = activeLesson?._id === les._id;
                    return (
                      <button 
                        key={les._id}
                        onClick={() => setActiveLesson(les)}
                        className={`flex items-start gap-3 px-6 py-4 text-left transition-colors ${
                          isActive 
                            ? 'bg-brand/10 border-l-4 border-brand dark:bg-brand/20' 
                            : 'hover:bg-gray-50 dark:hover:bg-darker/50 border-l-4 border-transparent'
                        }`}
                      >
                        <div className={`mt-0.5 ${isActive ? 'text-brand' : 'text-gray-400'}`}>
                          {getIcon(les.type)}
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium ${isActive ? 'text-brand dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                            {lIdx + 1}. {les.title}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">{les.duration} mins</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* CENTER PLAYER CANVAS */}
        <main className="flex-1 flex flex-col bg-black">
          <div className="flex-1 relative flex items-center justify-center bg-darker">
            {activeLesson?.type === 'video' && (
              <div className="w-full h-full max-w-5xl mx-auto flex items-center justify-center p-8">
                <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-800 flex items-center justify-center">
                  <PlayCircle className="w-20 h-20 text-gray-600" />
                  <span className="absolute text-gray-400 mt-32">Video Player Placeholder</span>
                </div>
              </div>
            )}
            
            {activeLesson?.type === 'quiz' && (
              <div className="w-full h-full flex items-center justify-center p-8 bg-gray-50 dark:bg-dark">
                 <button onClick={() => navigate(`/quiz/${course.quizId}`)} className="px-8 py-4 bg-brand hover:bg-brandHover text-white font-bold rounded-lg transition transform hover:scale-105">
                   Launch Final Configuration Quiz
                 </button>
              </div>
            )}
          </div>

          <div className="h-24 bg-white dark:bg-darkLayer border-t border-gray-200 dark:border-gray-800 px-8 flex items-center justify-between">
             <div className="text-gray-900 dark:text-white">
                <h3 className="font-bold text-lg">{activeLesson?.title || 'Select a lesson'}</h3>
                <p className="text-sm text-gray-500">Currently playing module tracking.</p>
             </div>
             <button className="px-6 py-3 bg-brand hover:bg-brandHover text-white font-medium rounded-lg transition-colors flex items-center gap-2">
               <CheckCircle className="w-5 h-5" />
               Complete & Continue
             </button>
          </div>
        </main>
        
      </div>
    </div>
  );
};

export default CoursePlayer;
