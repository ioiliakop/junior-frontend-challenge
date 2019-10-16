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
    this.timeoutID = null;
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
    if (this.timeoutID) {
      clearTimeout(this.timeoutID);
    }
    this.setState({keyword: event.target.value
      }, () => this.state.keyword.length > 1 ? 
          this.timeoutID = setTimeout(this.fetchResults, this.delay)
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
    const hasResults = this.state.results.length > 0;

    return (
      <div className="container pt-5">
        {/* <h1>User Language: {this.state.userLanguage}</h1>
        <h2>Keyword: {this.state.keyword}</h2> */}
        <div className="row">
          <div className="col"><img src="/xegr.jpg" alt="xe.gr logo" className="mx-auto d-block"/></div>
          <form className="col-12 col-lg-8 col-xl-9 mx-auto" onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label htmlFor="inputText">What place are you looking for?</label>
              <input type="text" className="form-control" id="inputText" value={this.state.keyword} onChange={this.handleChange} onSubmit={this.handleSubmit}/>
            </div>
            {/* <label>
              What place are you looking for?
              <input type="text" value={this.state.keyword} onChange={this.handleChange} onSubmit={this.handleSubmit}/>
            </label> */}
            <section className={'results border border-dark px-2 py-1 mb-3' + (!hasResults ? ' d-none' : '')}>
            {this.state.results.map((result, index) => <div className="text-truncate" key={index} onClick={this.handleResultClick}>{result}</div>)}
            </section>
            <div className="d-flex justify-content-xl-start justify-content-lg-start justify-content-center"><input type="submit" className="btn btn-warning" value="Click to Search" disabled={!hasResults}/></div>
          </form>
        </div>
      </div>
    );
  }
}

export default App;
