import React, { Component } from 'react';
import { isMobile } from 'react-device-detect';

class App extends Component {

  constructor(props) {
    super(props);
    // We set in our state the input keyword and the results from our service, as we expect them to change
    this.state = {
      keyword: '',
      results: []
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchResults = this.fetchResults.bind(this);
    this.handleResultClick = this.handleResultClick.bind(this);

    // We assume browser language and device type remain the same for each App instance, therefore we calculate their values only once here
    // We set english as default, therefore only check for greek language
    this.browserLanguage = (navigator.language || navigator.userLanguage) === 'el' ? 'el' : 'en';
    // We want to fetch 10 results for mobile, 20 for other devices (tablet, desktop)
    this.limit = isMobile ? 10 : 20;

    // Needed to implement the blank period timeout before sending the request to the server
    this.delay = 750;  // We can adjust the blank period here. Value is in ms
    this.timeoutID = null;
  }

  // Fetches the results for the input keyword, after constructing the appropriate url
  // Then sets the relative fields in the state
  fetchResults() {
    const url = 'http://35.180.182.8/Search?keywords=' + this.state.keyword + '&language=' + this.browserLanguage + '&limit=' + this.limit;

    console.log('url: ', url);

    fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
      }).then(response => {
        if (response.status === 200) {
          response.json().then(data => {
            this.setState({
                results: data.entries.map(entry => entry.name)
            });
            console.log('data: ', this.state.results);           
           })
        } else (console.log(response));
    }).catch(error => console.error('Error:', error));
  }

  // Handles changes in the input field
  // First it clears the current timeoutID (if any)
  // Then sets a new timeoutID for the current change
  // If it doesn't get cleared by a new change in the time period we have set (delay) it will
  // either execute the fetchResults to get new results from the service
  // or simply clear our results if we have less than 2 characters
  handleChange(event) {
    if (this.timeoutID) {
      clearTimeout(this.timeoutID);
    }
    this.setState({keyword: event.target.value
      }, () => this.state.keyword.length > 1 ? 
          this.timeoutID = setTimeout(this.fetchResults, this.delay)
        : this.setState({results: []}));
  }

  // Redirects to google.com making a search for the query
  handleSubmit(event) {
    window.open('https://google.com/search?q=' + this.state.keyword); //in new tab
    // window.location.assign('https://google.com/search?q=' + this.state.keyword); //in same tab alternatively
    event.preventDefault();
  }

  // When a result is selected (clicked), it sets it as the keyword in the state of our app
  handleResultClick(event) {
    console.log('selected result:', event.target.innerText);
    this.setState({keyword: event.target.innerText});
  }

  render() {
    const resultsExist = this.state.results.length > 0;

    return (
      <div className="container-fluid pt-3 pt-md-4">
        <div className="row">
          {/* <div className="desktopBannerSpace d-none d-lg-inline-block ml-3 col-1">
            <img src="/banner_space_150x400.png" alt="desktop banner" className="border border-dark"/>
          </div> */}
          {/* Left vertical banner visible in desktop */}
          <div className="desktopBannerSpace d-none d-lg-block ml-3 col-lg-3 col-xl-2">
            <img src="/banner_space_150x400.png" alt="desktop banner" className="border border-dark" height="400" width="150"/>
          {/* <img src="/banner_space_150x400.png" alt="desktop banner" className="d-none d-lg-inline-block ml-5 col-1 border border-dark" height="400" width="150"/> */}
          </div>
          <div className="container col-lg-9 ml-lg-n4">
            {/* <h1>User Language: {this.browserLanguage}</h1>
            <h2>Keyword: {this.state.keyword}</h2> */}
            <div className="row">
              {/* <div className="desktopBanner border border-dark d-block">Banner Space</div> */}
              <div className="col-lg-2 mb-3 ml-lg-n5 ml-xl-n3 ">
                <img src="/xe.png" alt="xe logo" className="mx-auto d-block" width="130"/>
              </div>
              {/* Form Section */}
              <form className="col-md-9 col-lg-8 mx-auto ml-lg-3 ml-xl-n2" onSubmit={this.handleSubmit}>
                <div className="form-group mb-0">
                  <label htmlFor="inputText">What place are you looking for?</label>
                  <input type="text" className="form-control" id="inputText" value={this.state.keyword} onChange={this.handleChange}/>
                </div>
                {/* Results Section */}
                <div className={'border border-dark px-2 py-1' + (!resultsExist ? ' d-none' : '')}>
                  {this.state.results.map((result, index) => <div className="text-truncate" key={index} onClick={this.handleResultClick}>{result}</div>)}
                </div>
                {/* Form Search Button */}
                <div className="d-flex justify-content-lg-start justify-content-center my-4">
                  <input type="submit" className="btn btn-warning" value="Click to Search" disabled={!resultsExist}/>
                </div>
              </form>
            </div>
            {/* <div className="tabletBannerSpace border border-dark d-none d-md-block d-lg-none mb-5 text-center p-4"> */}
            {/* <div className="tabletBannerSpace d-none d-md-block d-lg-none mb-5"> */}
            {/* Bottom horizontal banner visible in tablet */}
            <img src="/banner_space_700x100.png" alt="tablet banner" className="img-fluid d-none d-md-block d-lg-none border border-dark mb-4"/>
            {/* </div> */}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
