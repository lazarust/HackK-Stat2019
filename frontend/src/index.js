import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Select from 'react-select';

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' },
];
document.body.style = 'background: #465881;';

const App = () => {
  const [selected, setSelected] = useState(null);

  const handleChange = (selectedOption) => {
    setSelected({ selectedOption })
    console.log(`Option selected: ${selected}`)
  }

  return (
      <div class="container">
          <div class="row">
              <div class="col align-self-center">
                    <Select
                      value={selected}
                      onChange={handleChange}
                      options={options}
                      theme={theme => ({
                          ...theme,
                          borderRadius: 0,
                          colors: {
                            ...theme.colors,
                            primary25: 'grey',
                            primary: '#00909e',
                          },
                        })}
                    />
               </div>
           </div>
      </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
