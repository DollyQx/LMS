import React from 'react';

const ProgressBar = ({ progress = 0 }) => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Course Progress</span>
        <span className="text-xs font-bold text-brand">{progress}%</span>
      </div>
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-brand transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
