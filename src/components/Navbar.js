import React, { Component } from "react";
class Navbar extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand px-2" href="#">
          Blockchain FundRaiser
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item px-1">
              <a className="nav-link" href="\create">
                Create Campaign <span className="sr-only">(current)</span>
              </a>
            </li>
            <li className="nav-item px-1">
              <a className="nav-link" href="\donate">
                Donate
              </a>
            </li>
          </ul>
        </div>

        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block border">
            <small className="text-dark">
              <span id="account">Account : {this.props.account}</span>
            </small>
          </li>
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block border">
            <small className="text-dark">
              <span id="balance"> Balance: {this.props.balance} ETH </span>
            </small>
          </li>
        </ul>
      </nav>
    );
  }
}

export default Navbar;
