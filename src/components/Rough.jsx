import React, { useState } from 'react';

const Rough = () => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleSelectChange = (e) => {
    const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedOptions(selectedValues);
  };

  return (
    <div>
      <label htmlFor="multi-select">Choose options:</label>
      <select 
        id="multi-select" 
        multiple 
        value={selectedOptions} 
        onChange={handleSelectChange}
        style={{ width: '200px', height: '100px' }}
      >
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
        <option value="option4">Option 4</option>
      </select>
      <p>Selected Options: {selectedOptions.join(', ')}</p>
    </div>
  );
};

export default Rough;
