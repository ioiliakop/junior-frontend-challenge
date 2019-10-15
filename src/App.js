import React, { Component } from 'react';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userLanguage: (navigator.language || navigator.userLanguage) === 'el' ? 'el' : 'en',
      keyword: '',
      results: []
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchResults = this.fetchResults.bind(this);
    this.handleResultClick = this.handleResultClick.bind(this);
    this.delay = 750;
    this.timeout = null;
  }

  fetchResults() {
    const url = 'http://35.180.182.8/Search?keywords=' + this.state.keyword + '&language=' + this.state.userLanguage + '&limit=20';

    console.log('url: ', url);

    fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
      }).then(response => {
        if (response.status === 200) {
          response.json().then(data => {
            this.setState({
                results: data.entries.map((entry) => entry.name)
            });
            console.log('data: ', this.state.results);           
           })
        } else (console.log(response));
    }).catch(error => console.error('Error:', error));
  }

  handleChange(event) {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.setState({keyword: event.target.value
      }, () => this.state.keyword.length > 1 ? 
          this.timeout = setTimeout(this.fetchResults, this.delay)
        : this.setState({results: []}));
    // this.setState({keyword: event.target.value
    //   }, () => this.state.keyword.length > 1 ? this.fetchResults() : this.setState({results: []}));
  }

  handleSubmit(event) {
    // window.location.assign('https://google.com/search?q=' + this.state.keyword);
    window.open('https://google.com/search?q=' + this.state.keyword);
    event.preventDefault();
  }

  handleResultClick(event) {
    console.log('selected result:', event.target.innerText);
    this.setState({keyword: event.target.innerText});
  }

  render() {
    const buttonIsEnabled = this.state.results.length > 0;;

    return (
      <div>
      <h1>User Language: {this.state.userLanguage}</h1>
      <h2>Keyword: {this.state.keyword}</h2>

      <form onSubmit={this.handleSubmit}>
        <label>
          What place are you looking for?
          <input type="text" value={this.state.keyword} onChange={this.handleChange} onSubmit={this.handleSubmit}/>
        </label>
        <input type="submit" value="Click to Search" disabled={!buttonIsEnabled}/>
      </form>
      <h2>Results:</h2>
      {this.state.results.map((result, index) => <div key={index} onClick={this.handleResultClick}>{result}</div>)}
      </div>
    );
  }
}

export default App;
