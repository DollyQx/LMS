import React from 'react';
import { PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CourseCard = ({ course }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/course/${course._id}`)}
      className="group relative flex-none w-[300px] h-[400px] rounded-xl overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105 hover:z-10 shadow-lg bg-white dark:bg-darkLayer border border-gray-100 dark:border-gray-800"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
      
      <img 
        src={course.thumbnail !== 'default-course.jpg' ? course.thumbnail : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop'} 
        alt={course.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      <div className="absolute inset-0 z-20 p-6 flex flex-col justify-end">
        <div className="flex items-center gap-2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
          <PlayCircle className="w-10 h-10 text-brand fill-white/10" />
          <span className="text-white font-medium">Start Learning</span>
        </div>
        
        <h3 className="text-2xl font-bold text-white mb-1 line-clamp-2">{course.title}</h3>
        <p className="text-gray-300 text-sm line-clamp-2 mb-3">{course.description}</p>
        
        <div className="flex items-center space-x-2">
          <span className="px-2 py-1 text-xs font-semibold bg-brand/20 text-brand rounded-md border border-brand/30">
            {course.level?.toUpperCase()}
          </span>
          <span className="text-xs text-gray-400">{course.modules?.length || 0} Modules</span>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
