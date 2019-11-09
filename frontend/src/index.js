import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Select from 'react-select';

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' },
];
document.body.style = 'background: #202040;';

const App = () => {
  const [selected, setSelected] = useState(null);

  const handleChange = (selectedOption) => {
    setSelected({ selectedOption })
    console.log(`Option selected: ${selected}`)
  }

  return (
      <div class="container">
          <div class="row">
              <div class="col align-self-center" stlye="color:#602080">
                    <Select
                      value={selected}
                      onChange={handleChange}
                      options={options}
                    />
               </div>
           </div>
      </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
