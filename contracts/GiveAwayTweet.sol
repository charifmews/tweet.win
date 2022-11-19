// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

error GiveAwayTweet__NoMinimumPrize();
error GiveAwayTweet__AlreadyExists();
error GiveAwayTweet__TransferFailed();
error GiveAwayTweet__TransferFromFailed();
error GiveAwayTweet__OwnerCantPayoutPrizeToOwner();

/**
 * @title The GiveAwayTweet contract
 * @notice An GiveAwayTweet contract that retrieves the winner and pay out the prize
 */
contract GiveAwayTweet is ChainlinkClient, Ownable {
    using Chainlink for Chainlink.Request;

    address private immutable oracle;
    bytes32 private immutable jobId;
    uint256 private immutable fee;
    address private immutable s_owner;
    address constant linkAddress =  0x326C977E6efc84E512bB9C30f76E30c160eD06FB;
    uint256 constant giveawayFee = (5 * LINK_DIVISIBILITY) / 100;

    struct Giveaway {
        address token;
        uint256 prize;
    }

    mapping(string => Giveaway) public s_giveaways;
    mapping(address => mapping (address => uint256)) allowed;

    event AnnounceWinner(address winner, string giveaway);

    constructor() {
        setChainlinkToken(linkAddress);
        oracle = 0x816BA5612d744B01c36b0517B32b4FcCb9747009;
        jobId = "72bd0768b5c84706a548061c75c35ecc";
        fee = (1 * LINK_DIVISIBILITY) / 10;
        s_owner = msg.sender;
    }

    /**
     * @notice Creates a Chainlink request to retrieve API giveaways response that determines the winner with off-chain 
     * cryptographically generated random numbers and data that were commited to filecoin before doing this request, but we also use 
     * with block.timestamp to give it a little randomness from doing this request/transaction with the latency to add a this to the
     * off-chain randomness
     * @param _giveaway - giveaway name
     * @return requestId - id of the request, _winner address, _giveaway name
     */
    function requestGiveAwayWinner(string calldata _giveaway)
        external
        onlyOwner
        returns (bytes32 requestId)
    {
        Chainlink.Request memory request = buildChainlinkRequest(
            jobId,
            address(this),
            this.fulfillMultipleParameters.selector
        );

        request.add(
            "get",
            string.concat(
                string.concat("https://www.tweet.win/api/giveaway/", _giveaway),
                string.concat("/", Strings.toString(block.timestamp))
            )
        );

        return sendChainlinkRequestTo(oracle, request, fee);
    }

    /**
     * @notice Receives the response in the form of winner and giveaway
     *
     * @param _requestId - id of the request
     * @param _winner - winner address
     * @param _giveaway - giveaway name
     */
    function fulfillMultipleParameters(
        bytes32 _requestId,
        bytes calldata _winner,
        string calldata _giveaway
    ) public recordChainlinkFulfillment(_requestId) {
        payPrize(_giveaway, payable(bytesToAddress(_winner)));
        emit AnnounceWinner(bytesToAddress(_winner), _giveaway);
    }

    /**
     * @notice Payout Prize
     * @param _giveaway - giveaway name
     * @param _winner - winner address
     * @return success boolean
     */
    function payPrize(string calldata _giveaway, address payable _winner)
        private returns (bool)
    {
        bool success = IERC20(s_giveaways[_giveaway].token).transfer(
            _winner,
            s_giveaways[_giveaway].prize
        );
        if (!success) revert GiveAwayTweet__TransferFailed();
        delete s_giveaways[_giveaway];
        return success;
    }

    /**
     * @notice Payout Prize by Admin (workaround till fullfillMultipleParameters callback works correctly,
     * works locally but not from naas.link mumbai testnet node). Subscribed to https://github.com/smartcontractkit/chainlink/issues/7908
     * and after investigation and issue resolved test it again to see if I can make it work with fullfillMultipleParameters callback
     * @param _giveaway - giveaway name
     * @param _winner - winner address
     * @return success boolean
     */
    function payPrizeByOwner(string calldata _giveaway, address payable _winner)
        external onlyOwner returns (bool)
    {
        if (_winner == s_owner)
            revert GiveAwayTweet__OwnerCantPayoutPrizeToOwner();

        bool success = IERC20(s_giveaways[_giveaway].token).transfer(
            _winner,
            s_giveaways[_giveaway].prize
        );
        if (!success) revert GiveAwayTweet__TransferFailed();
        delete s_giveaways[_giveaway];
        return success;
    }

    /**
     * @notice Create Giveaway
     * @param _giveaway - giveaway name
     * @param prize - Link amount
     * @return success boolean
     */
    function createGiveaway(
        string calldata _giveaway,
        uint256 prize
    ) external returns (bool) {
        // Prize should be at least 1.0 LINK
        if (prize < LINK_DIVISIBILITY) revert GiveAwayTweet__NoMinimumPrize();
        // Giveaway already exist
        if (s_giveaways[_giveaway].prize >= LINK_DIVISIBILITY)
            revert GiveAwayTweet__AlreadyExists();
        s_giveaways[_giveaway] = Giveaway(linkAddress, prize);
        uint256 total_token_amount = prize + fee + giveawayFee;
        bool success = IERC20(linkAddress).transferFrom(
            msg.sender,
            address(this),
            total_token_amount
        );
        if (!success) revert GiveAwayTweet__TransferFromFailed();
        return success;
    }

    /**
     * @notice Witdraws LINK from the contract to the Owner
     */
    function withdrawLink() external onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(linkAddress);
        require(
            link.transfer(s_owner, link.balanceOf(address(this))),
            "Unable to transfer"
        );
    }

    /**
     * @notice Bytes -> Address
     * @param b - address in bytes
     * @return address
     */
    function bytesToAddress(bytes calldata b) private pure returns (address) {
        return address(uint160(bytes20(b)));
    }
}
