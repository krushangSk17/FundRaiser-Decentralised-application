// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.4.0 <0.9.0;

contract FundRaiser{

    string public ContractName;
    //general name for Application (contract)

    uint public IdCount = 0;
    //to track the number of applications

    Campaign[] public campaigns;
    //store the single value of <struct> in a <sturcts> array.

    struct Donor {
        address DonorAddress;
        uint DonorValue;
    }

    struct Campaign {
        string Title;
        string Description;
        address payable OwnerAddress;
        uint RequiredAmount;
        uint ReceivedAmount;
        uint ApplicationId;
        uint donorCount;
        Donor[] donors;
    }
    

    event CampaignCreated(
        string Title,
        string Description,
        address payable OwnerAddress,
        uint RequiredAmount,
        uint ReceivedAmount,
        uint ApplicationId,
        uint donorCount,
        Donor[] donors
    );

    event Donated(
        string Title,
        string Description,
        address payable OwnerAddress,
        uint RequiredAmount,
        uint ReceivedAmount,
        uint ApplicationId,
        uint donorCount,
        Donor[] donors
    );

    event Values(
        string Title,
        string Description,
        address payable OwnerAddress,
        uint RequiredAmount,
        uint ReceivedAmount,
        uint ApplicationId,
        uint donorCount,
        Donor[] donors
    );

    constructor(){
        ContractName = "Krushang Satani Fundraiser";
    }

    function createCampaign(string memory _Title, string memory _Description, uint _RequiredAmount) public{

        //making sure that title has enough lenght
        require(bytes(_Title).length > 0);

        //making sure that description has enough lenght
        require(bytes(_Description).length > 0);

        //making sure that enough money request is raised
        require(_RequiredAmount > 0);

        //create a campaign
        campaigns.push();
        uint256 newIndex = campaigns.length - 1;

        //access the hirarchy 1 level struct (campaigns)
        campaigns[newIndex].Title = _Title;
        campaigns[newIndex].Description = _Description;
        campaigns[newIndex].OwnerAddress = payable(msg.sender);
        campaigns[newIndex].RequiredAmount = _RequiredAmount;
        campaigns[newIndex].ReceivedAmount = 0;
        campaigns[newIndex].ApplicationId = IdCount;
        campaigns[newIndex].donorCount = 0;

        //access the hirarchy 2 level struct (donors)
        campaigns[newIndex].donors.push();
        uint256 newIndex1 = campaigns[newIndex].donors.length - 1;
        campaigns[newIndex].donors[newIndex1].DonorAddress = payable (0xAc22a77708329C1De72D75481C0c2689daebE6aD);
        campaigns[newIndex].donors[newIndex1].DonorValue = 0;
        
        //trigger an event
        emit CampaignCreated(
            _Title,
            _Description,
            payable (msg.sender),
            _RequiredAmount,
            0,
            IdCount,
            0,
            campaigns[newIndex].donors
        );
        
        //increase count of application
        IdCount ++;

    }


    function Donate(uint _ApplicationId) public payable{
        
        //making sure that id is valid
        require(_ApplicationId >= 0 && _ApplicationId < IdCount,"cccc");

        //make sure that your donation is <= donation space left
        uint _donationSpaceLeft = campaigns[_ApplicationId].RequiredAmount - campaigns[_ApplicationId].ReceivedAmount;
        require(msg.value <= _donationSpaceLeft,"aaaa");

        //check that donor is not requester
        require(campaigns[_ApplicationId].OwnerAddress != msg.sender,"bbbb");
        
        require(msg.value > 0);

        //change values in the campaigns section.
        campaigns[_ApplicationId].OwnerAddress.transfer(msg.value);
        campaigns[_ApplicationId].ReceivedAmount += msg.value;
        campaigns[_ApplicationId].donorCount ++;

        //stop here..............................

        Donor memory temp = Donor(msg.sender,msg.value);
        campaigns[_ApplicationId].donors.push(temp);

        //trigger an event
        emit Donated(
            campaigns[_ApplicationId].Title,
            campaigns[_ApplicationId].Description,
            campaigns[_ApplicationId].OwnerAddress,
            campaigns[_ApplicationId].RequiredAmount,
            campaigns[_ApplicationId].ReceivedAmount,
            IdCount,
            campaigns[_ApplicationId].donorCount,
            campaigns[_ApplicationId].donors
        );
    }

    function emitValues(uint _ApplicationId) public{
        emit Values(
            campaigns[_ApplicationId].Title,
            campaigns[_ApplicationId].Description,
            campaigns[_ApplicationId].OwnerAddress,
            campaigns[_ApplicationId].RequiredAmount,
            campaigns[_ApplicationId].ReceivedAmount,
            IdCount,
            campaigns[_ApplicationId].donorCount,
            campaigns[_ApplicationId].donors
        );
    }

}