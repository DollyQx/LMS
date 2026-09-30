import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ className = 'w-10 h-10 text-brand' }) => {
  return (
    <div className="flex items-center justify-center p-4">
      <Loader2 className={`animate-spin ${className}`} />
    </div>
  );
};

export default Loader;
