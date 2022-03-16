const { assert } = require("chai");

require("chai")
    .use(require('chai-as-promised'))
    .should()

const FundRaiser = artifacts.require('./FundRaiser.sol');

contract('FundRaiser', ([deployer, Requester, donor]) => {
    let fundraiser;

    before(async () => {
        fundraiser = await FundRaiser.deployed()
    })

    describe('deployement', async () => {
        it('deployed succesfully', async () => {
            const address = await fundraiser.address;

            assert.notEqual(address, 0x0);
            assert.notEqual(address, '');
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);

        })

        it('has a good name', async () => {
            const name = await fundraiser.ContractName();

            assert.equal(name, 'Krushang Satani Fundraiser');
        })
    })


    describe('Campaigns', async () => {
        let result, CampaignCount, result_imp

        before(async () => {

            result = await fundraiser.createCampaign(
                'First_Campaign',
                'this is just a simple description for test purpose',
                web3.utils.toWei('10', 'Ether'),
                { from: Requester }
            )

            CampaignCount = await fundraiser.IdCount()


        })

        it('creates a campaign', async () => {

            //success
            assert.equal(CampaignCount, 1)

            const event1 = result.logs[0].args
            assert.equal(event1.Title, 'First_Campaign', 'here TIT problem')
            assert.equal(event1.Description, 'this is just a simple description for test purpose', 'here DES problem')
            assert.equal(event1.OwnerAddress, Requester, 'here OA problem')
            assert.equal(event1.RequiredAmount, web3.utils.toWei('10', 'Ether'), 'here RA1 problem')
            assert.equal(event1.ReceivedAmount, 0, 'here RA2 problem')
            assert.equal(event1.ApplicationId.toNumber(), CampaignCount.toNumber() - 1, 'here Aid problem')
            assert.equal(event1.donorCount, 0, 'here in dc problem')

            // 1 adress is inserted during the array making with 0 value
            assert.equal(event1.donors.length, 1, 'in this donors')
            assert.equal(event1.donors[event1.donorCount].DonorAddress, 0xAc22a77708329C1De72D75481C0c2689daebE6aD, 'in this donors address')
            assert.equal(event1.donors[event1.donorCount].DonorValue, 0, 'in this donors Value')

            //failure : must have a title and Required amount.
            await fundraiser.createCampaign('', 'this is just a simple description for test purpose', web3.utils.toWei('10', 'Ether'), { from: Requester }).should.be.rejected;
            await fundraiser.createCampaign('First_Campaign', 'this is just a simple description for test purpose', 0, { from: Requester }).should.be.rejected;

        })

        it('Lists a Campaign', async () => {

            result_imp = await fundraiser.emitValues(CampaignCount - 1)
            const event2 = result_imp.logs[0].args

            assert.equal(event2.Title, 'First_Campaign', 'here TIT problem')
            assert.equal(event2.Description, 'this is just a simple description for test purpose', 'here DES problem')
            assert.equal(event2.OwnerAddress, Requester, 'here OA problem')
            assert.equal(event2.RequiredAmount, web3.utils.toWei('10', 'Ether'), 'here RA1 problem')
            assert.equal(event2.ReceivedAmount, 0, 'here RA2 problem')
            assert.equal(event2.ApplicationId.toNumber(), CampaignCount.toNumber(), 'here Aid problem')
            assert.equal(event2.donorCount, 0, 'here in dc problem')

            // 1 adress is inserted during the array making with 0 value
            assert.equal(event2.donors.length, 1, 'in this donors')
            assert.equal(event2.donors[event2.donorCount].DonorAddress, 0xAc22a77708329C1De72D75481C0c2689daebE6aD, 'in this donors address')
            assert.equal(event2.donors[event2.donorCount].DonorValue, 0, 'in this donors Value')

        })

        it('Donates a amount', async () => {

            //track the requesters balance before Purchase
            let oldReqBal, newReqBal, donateAmount, oldDonCount, ReceivedAmount

            oldReqBal = await web3.eth.getBalance(Requester)
            oldReqBal = new web3.utils.BN(oldReqBal)

            donateAmount = web3.utils.toWei('0.33','Ether')
            
            result_imp = await fundraiser.emitValues(CampaignCount - 1)
            const event2 = result_imp.logs[0].args
            oldDonCount = event2.donorCount
            
            //success: donor makes a donation
            result = await fundraiser.Donate(0, { from: donor, value: donateAmount })
            
            //check logs
            const event3 = result.logs[0].args
            
            
            assert.equal(event3.Title, 'First_Campaign', 'here TIT problem')
            assert.equal(event3.Description, 'this is just a simple description for test purpose', 'here DES problem')
            assert.equal(event3.OwnerAddress, Requester, 'here OA problem')
            assert.equal(event3.RequiredAmount, web3.utils.toWei('10', 'Ether'), 'here RA1 problem')
            assert.equal(event3.ApplicationId.toNumber(), CampaignCount.toNumber(), 'here Aid problem')
            
            ReceivedAmount =  event3.ReceivedAmount
            ReceivedAmount = web3.utils.BN(ReceivedAmount)
            
            newReqBal = await web3.eth.getBalance(Requester)
            newReqBal = new web3.utils.BN(newReqBal)
            
            //BN addition for checking
            const expectedBal = oldReqBal.add(ReceivedAmount)

            //changed
            assert.equal(newReqBal, expectedBal.toString() , 'here RA2 problem')
            //changed
            assert.equal(event3.donorCount.toNumber(),oldDonCount.toNumber() + 1,'here in dc problem')

            // 1 adress is inserted during the array making with 0 value
            assert.equal(event3.donors.length, oldDonCount.toNumber() + 2, 'in this donors')
            assert.equal(event3.donors[oldDonCount.toNumber() + 1].DonorAddress, donor, 'in this donors address')
            
            let donorValue = event3.donors[oldDonCount.toNumber() + 1].DonorValue
            donorValue = new web3.utils.BN(donorValue)
            assert.equal(donorValue.toString(), donateAmount.toString(), 'in this donors Value')

            //failure: id is not valid (invalid id)
            await fundraiser.Donate(99, {from : donor, value : web3.utils.toWei('0.33','Ether')}).should.be.rejected

            //failure: value should be valid (invalid id)
            await fundraiser.Donate(0 , {from : donor, value : web3.utils.toWei('0','Ether')}).should.be.rejected

            //failure: value should be less than the space left (invalid id)
            await fundraiser.Donate(0, {from : donor, value : web3.utils.toWei('15','Ether')}).should.be.rejected
            
            //failure: dont donate to yourself
            await fundraiser.Donate(0, {from : Requester, value : web3.utils.toWei('0.33','Ether')}).should.be.rejected

        })

    })

})