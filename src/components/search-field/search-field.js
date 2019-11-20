import React from "react";
import { SearchResult } from "../search-result/search-result";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export class SearchField extends React.Component {
  notify = () => toast("Wow so easy !");
  constructor() {
    super();
    this.state = {
      nobelLaureates: [],
      nobelLaureateName: "",
      nobelLaureateSurname: "",
      searchResults: [],
      loaderVisible: false
    };
    this.getNobelLaureate();
    this.searchNobelLaureate = this.searchNobelLaureate.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  getNobelLaureate() {
    return fetch(`http://api.nobelprize.org/v1/laureate.json`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        this.setState({
          nobelLaureates: responseJson["laureates"]
        });
        console.log(this.state.nobelLaureates);
      });
  }
  searchNobelLaureate(event) {
    event.preventDefault();
    const laureatez = this.state.nobelLaureates;
    const srchResult = [];
    console.log(laureatez);
    for (var key of laureatez) {
      if (key["firstname"] === this.state.nobelLaureateName) {
        if (this.state.nobelLaureateSurname.length > 0) {
          if (key["surname"] === this.state.nobelLaureateSurname) {
            srchResult.push(key);
          }
        } else {
          srchResult.push(key);
        }
      }
    }
    this.setState({ searchResults: srchResult });
    console.log(srchResult.length);
    if (srchResult.length === 0) {
      console.log(srchResult.length);
      toast.error(
        "No winners exist with this NAME. Make sure your search is CaseSensitive"
      );
    }
    console.log(srchResult);
  }
  handleChange({ target }) {
    this.setState({
      [target.name]: target.value
    });
  }

  render() {
    const headStyle = {
      marginTop: "3%"
    };
    const searchResult = this.state.searchResults;
    return (
      <div className="container">
        <div className="columns is-mobile">
          <div className="column">
            <h1
              style={headStyle}
              className="is-size-1 has-text-dark has-text-weight-bold has-text-centered"
            >
              Find Nobel Laureates
            </h1>
          </div>
        </div>

        <div className="columns is-mobile is-multiline is-vcentered is-centered">
          <div className="column is-one-third">
            <label className="label">Enter Winner's First Name</label>
            <div className="field">
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="nobelLaureateName"
                  placeholder="Enter First Name"
                  value={this.state.nobelLaureateName}
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <p className="is-size-7 has-text-danger">This should be filled*</p>
          </div>
          <div className="column is-one-third">
            <label className="label">Enter Winner's Surname</label>
            <div className="field">
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="nobelLaureateSurname"
                  placeholder="Enter Last Name"
                  value={this.state.nobelLaureateSurname}
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <p className="is-size-7">Optional</p>
          </div>
          <div className="column is-offset-half is-two-thirds">
            <a onClick={this.searchNobelLaureate} className="button is-primary">
              Search
            </a>
            <ToastContainer />
          </div>
          <div className="column is-full">
            {searchResult.length > 0 ? (
              <SearchResult nobelOutput={searchResult} />
            ) : (
              undefined
            )}
          </div>
        </div>
      </div>
    );
  }
}
