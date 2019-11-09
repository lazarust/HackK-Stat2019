import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Select from 'react-select';
import { Container, Row, Col } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' },
];
document.body.style = 'background: #465881;';

const App = () => {
  const [selected, setSelected] = useState(null);

  const handleChange = (selectedOption) => {
      console.log(selectedOption)
    setSelected({ selectedOption })
    console.log(`Option selected: ${selected}`)
  }

  return (
      <Container>
          <Row>
              <Col sm="12" md={{ size: 6, offset: 3 }}>
                <Select
                  value={selected && selected.label}
                  onChange={handleChange}
                  options={options}
                  isClearable={true}
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
               </Col>
           </Row>
      </Container>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
