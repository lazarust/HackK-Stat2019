import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Select from 'react-select';
import { Container, Row, Col } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const options = [
  { value: '2-0', label: 'stone' },
  { value: '1-0', label: 'grass' },
  { value: '3-0', label: 'dirt' },
];
document.body.style = 'background: #465881;';

const App = () => {
  const [selected, setSelected] = useState("");
  const [apiData, setApiData] = useState(null);

  useEffect(() => {
      if(selected) {
          const {value, label} = selected.selectedOption;
          fetch(`http://0.0.0.0:4000/colors?block=${value}`)
              .then(resp => resp.json())
              .then(data => {
                  setApiData(data)
              });
      }
  }, [selected]);
  const handleChange = (selectedOption) => {
    setSelected({ selectedOption })
  };

  return (
      <Container>
          <Row>
              <Col sm="12" md={{ size: 6, offset: 3 }}>
                <Select
                  value={selected && selected.label}
                  onChange={handleChange}
                  options={options}
                  isClearable={false}
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
          <Row>
              {apiData && Object.keys(apiData).map(item => {
                  return <Col style={{backgroundColor: `${apiData[item]}`}}><img src={`../static/${item}.png`}/></Col>
                    })
                  }
          </Row>
      </Container>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
