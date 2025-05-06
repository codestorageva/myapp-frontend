// @/app/component/Spinner.tsx

import React from 'react';

interface SpinnerProps {
  size?: string;  // Custom size for the spinner, default is '50px'
}

const Spinner: React.FC<SpinnerProps> = ({ size = '50px' }) => {
  return (
    <div
      className={`border-4 border-t-4 border-gray-300 border-t-blue-500 rounded-full animate-spin`}
      style={{ width: size, height: size }}
    >
      {/* Optionally, you can add text or an icon here */}
    </div>
  );
};

export default Spinner;
