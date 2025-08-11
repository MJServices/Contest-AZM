import React from 'react';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col justify-center items-center min-h-[50vh] gap-4">
      <div className="spinner w-12 h-12"></div>
      <p className="text-neutral-600 text-base font-medium">{message}</p>
    </div>
  );
};

export default LoadingSpinner;