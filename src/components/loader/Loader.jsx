import React from 'react';
import { FaCircleNotch } from 'react-icons/fa';

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="icon-box">
        <FaCircleNotch className="loader-icon" />
      </div>
    </div>
  );
};

export default Loader;