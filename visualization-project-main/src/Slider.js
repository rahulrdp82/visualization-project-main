import React from 'react';

const Slider = ({ sliderValue, setSliderValue }) => {
  const handleSliderChange = (e) => {
    setSliderValue(Number(e.target.value));
  };

  return (
    <div style={{ margin: '20px 0' }}>
      <label>
        Filter by Discount Price (USD): 
        <input
          type="range"
          min="0"
          max="500"
          value={sliderValue}
          onChange={handleSliderChange}
        />
      </label>
      <span>{sliderValue}</span>
    </div>
  );
};

export default Slider;
