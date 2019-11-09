import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import App from './App';
import * as serviceWorker from './serviceWorker';
import Select from 'react-select';

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' },
];

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
      <Select
        value={selectedOption}
        onChange={this.handleChange}
        options={options}
      />
    );
  }
}

/*
class List extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filtered: []
        }
        this.handleChange = this.handleChange.bind(this);


    }
    componentDidMount() {
      this.setState({
        filtered: this.props.items
      });
    }

    componentWillReceiveProps(nextProps) {
      this.setState({
        filtered: nextProps.items
      });
    }

    handleChange(e) {
            // Variable to hold the original version of the list
        let currentList = [];
            // Variable to hold the filtered list before putting into state
        let newList = [];

            // If the search bar isn't empty
        if (e.target.value !== "") {
                // Assign the original list to currentList
          currentList = this.props.items;

                // Use .filter() to determine which items should be displayed
                // based on the search terms
          newList = currentList.filter(item => {
                    // change current item to lowercase
            const lc = item.toLowerCase();
                    // change search term to lowercase
            const filter = e.target.value.toLowerCase();
                    // check to see if the current list item includes the search term
                    // If it does, it will be added to newList. Using lowercase eliminates
                    // issues with capitalization in search terms and search content
            return lc.includes(filter);
          });
        } else {
                // If the search bar is empty, set newList to original task list
          newList = this.props.items;
        }
            // Set the filtered state based on what our rules added to newList
        this.setState({
          filtered: newList
        });
      }
    render() {
        return (

             <div className="content">
                <div className="container">
                    <section className="section">
                        <div>
                            <input type="text" className="input" onChange={this.handleChange} placeholder="Search..." />
                            <select>
                                 {this.state.filtered.map(item => (
                                    <option key={item}>{item}</option>
                                    ))}
                            </select>
                            <SelectSearch options={options} value="sv" name="language" placeholder="Choose your language" />
                        </div>
\
                    </section>
                </div>
            </div>
        )
    }
}
*/

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            list :[
                "Air", "Stone","Granite","Polished Granite","Diorite","Polished Diorite","Andesite","Polished Andesite","Grass","Dirt","Coarse Dirt","Podzol","Cobblestone","Oak Wood Plank",
                "Spruce Wood Plank","Birch Wood Plank","Jungle Wood Plank","Acacia Wood Plank","Dark Oak Wood Plank","Oak Sapling","Spruce Sapling"]
        }
    };
   render() {
        return (
            <List items={this.state.list} />
        );
  }
}

class List extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filtered: []
        }
        this.handleChange = this.handleChange.bind(this);

    }
    componentDidMount() {
      this.setState({
        filtered: this.props.items
      });
    }

    componentWillReceiveProps(nextProps) {
      this.setState({
        filtered: nextProps.items
      });
    }

    handleChange(e) {
            // Variable to hold the original version of the list
        let currentList = [];
            // Variable to hold the filtered list before putting into state
        let newList = [];

            // If the search bar isn't empty
        if (e.target.value !== "") {
                // Assign the original list to currentList
          currentList = this.props.items;

                // Use .filter() to determine which items should be displayed
                // based on the search terms
          newList = currentList.filter(item => {
                    // change current item to lowercase
            const lc = item.toLowerCase();
                    // change search term to lowercase
            const filter = e.target.value.toLowerCase();
                    // check to see if the current list item includes the search term
                    // If it does, it will be added to newList. Using lowercase eliminates
                    // issues with capitalization in search terms and search content
            return lc.includes(filter);
          });
        } else {
                // If the search bar is empty, set newList to original task list
          newList = this.props.items;
        }
            // Set the filtered state based on what our rules added to newList
        this.setState({
          filtered: newList
        });
      }
    render() {
        return (

             <div className="content">
                <div className="container">
                    <section className="section">
                        <div>
                            <input type="text" className="input" onChange={this.handleChange} placeholder="Search..." />
                            <ul>
                                 {this.state.filtered.map(item => (
                                    <li key={item}>{item}</li>
                                    ))}
                            </ul>
                        </div>
\
                    </section>
                </div>
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('root'));



/*var options = {
  shouldSort: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [
    "name"
  ]
};


var fuse = new Fuse(list, options); // "list" is the item array
var result = fuse.search("Maine");*/



/*var options = {
  shouldSort: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [
    "name"
  ]
};


var fuse = new Fuse(list, options); // "list" is the item array
var result = fuse.search("Maine");*/

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
