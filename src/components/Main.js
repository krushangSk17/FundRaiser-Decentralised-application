import React, { Component } from "react";

class Main extends Component {
  render() {
    return (
      <div id="content">
        <h1>Add Campaign</h1>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const _title = this.title.value;
            const _description = this.description.value;
            const _requiredamount = window.web3.utils.toWei(
              this.requiredamount.value.toString(),
              "Ether"
            );
            this.props.createCampaign(_title, _description, _requiredamount);
          }}
        >
          <div className="form-group mr-sm-2">
            <input
              id="Title"
              type="text"
              ref={(input) => {
                this.title = input;
              }}
              className="form-control"
              placeholder="Campaign title"
              required
            />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="Description"
              type="text"
              ref={(input) => {
                this.description = input;
              }}
              className="form-control"
              placeholder="Description"
              required
            />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="RequiredAmount"
              type="number"
              ref={(input) => {
                this.requiredamount = input;
              }}
              className="form-control"
              placeholder="Product Price"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Add Campaign
          </button>
        </form>
        <p>&nbsp;</p>
        <h2>Donate Here</h2>
        {/* <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Title</th>
              <th scope="col">Owner</th>
              <th scope="col">Required-Amount</th>
              <th scope="col">Received-Amount</th>
              <th scope="col">Donor Count</th>
            </tr>
          </thead>
          <tbody id="campaignList">
            {this.props.campaigns.map((campaign, key) => {
              return (
                <tr key={key}>
                  <th scope="row">{campaign.ApplicationId.toString()}</th>
                  <td>{campaign.Title}</td>
                  <td>{campaign.OwnerAddress}</td>
                  <td>
                    {window.web3.utils.fromWei(
                      campaign.RequiredAmount.toString(),
                      "Ether"
                    )}{" "}
                    ETH
                  </td>
                  <td>
                    {window.web3.utils.fromWei(
                      campaign.ReceivedAmount.toString(),
                      "Ether"
                    )}{" "}
                    ETH
                  </td>
                  <td>{campaign.donorCount}</td>
                  <td>
                    {campaign.OwnerAddress === this.props.account
                      ? "your product"
                      : campaign.OwnerAddress}
                  </td>

                  <td>
                    <button
                      value={campaign.ReceivedAmount}
                      name={campaign.id}
                      onClick={(event) => {
                        this.props.Donate(
                          event.target.name,
                          event.target.value
                        );
                      }}
                    >
                      Donate
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table> */}
      </div>
    );
  }
}

export default Main;
