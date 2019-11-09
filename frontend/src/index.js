import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css';

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' },
];
document.body.style = 'background: #202040;';

class App extends Component {
     state = {
    selectedOption: null,
  };
  handleChange = selectedOption => {
    this.setState(
      { selectedOption },
      () => console.log(`Option selected:`, this.state.selectedOption)
    );
  };
  render() {
    const { selectedOption } = this.state;

    return (
        <div class="container">
            <div class="row">
                <div class="col align-self-center" stlye="color:#602080">
                      <Select
                        value={selectedOption}
                        onChange={this.handleChange}
                        options={options}
                      />
                 </div>
             </div>
        </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
