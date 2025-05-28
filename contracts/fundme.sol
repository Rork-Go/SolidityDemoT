// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract fundme{

    AggregatorV3Interface internal dataFeed;

    constructor(uint256 _timego){
        dataFeed =AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);
        oner = msg.sender;   
        timestart = block.timestamp;
        timego = _timego;


    }

    //记录投资人信息
    mapping (address => uint256) public fundCollected;
    //最小的投资余额
    uint256 constant min_value =1*10**18;//usd
    //达到目标值生产商可以提款
    uint256 constant targer = 20*10**18;

    //合约的拥有者
    address public oner;

    //合约锁定期开始时间
    uint256 timestart;
    
    //合约锁定时间
    uint256 timego;

    address erc20addr;

    bool public  pdsu = false;




    //支付eth
    function receiveEther() external  payable{
        require(totalfundme(msg.value) >= min_value,"You need to send atleast 1 ETH");
        require(block.timestamp < timestart+timego,"no bucheng");
        fundCollected[msg.sender] = msg.value;

    }

     function getChainlinkDataFeedLatestAnswer() public view returns (int) {
        // prettier-ignore
        (
            /* uint80 roundId */,
            int256 answer,
            /*uint256 startedAt*/,
            /*uint256 updatedAt*/,
            /*uint80 answeredInRound*/
        ) = dataFeed.latestRoundData();
        return answer;
    }

    //USD-ETH的价格
    function totalfundme(uint256 eth_num) view  internal returns (uint256){
        uint256 eth_price = uint256(getChainlinkDataFeedLatestAnswer());
        return eth_num * eth_price / (10**8) ;

    }  

    //生产商是否提取余额
    function getfundme() external windowsclosed onlyOwner{
       //address(this).balance单位为wei，使用totalfundme将其转换成usd的单位
        require(totalfundme(address(this).balance) >= targer ,"1");
        //require(msg.sender == oner, "Only owner");
       // require(block.timestamp >= timestart+timego,"cheng");
        //transfer
        //payable(msg.sender).transfer(address(this).balance);

        //send
        // bool success = payable(msg.sender).send(address(this).balance);
        // require(success,"buchenggong");
        //call
        bool _sucess;
        (_sucess, ) =payable(msg.sender).call{value: address(this).balance}("");
        require(_sucess , "");
        pdsu = true;


    }

    //设置调用者地址，来进行跟换提款的地址
    function setoner(address newoner) public  onlyOwner{
        //判断当前的调用者是否是第一次合约创建者
        //require(msg.sender == oner, "Only owner");
        //设置新的合约的调用者
        oner = newoner;
    }

    //没有达到目标值，投资人用户进行退款
    function refundme() external windowsclosed{
    //
    //投资人判断是否达到目标值
    require(totalfundme(address(this).balance) < targer ,"meiyou");
    require(fundCollected[msg.sender] != 0, "You haven't fund me");
    
    bool _sucess;
    (_sucess, ) =payable(msg.sender).call{value: fundCollected[msg.sender]}("");
    require(_sucess , "You've already refunded me");
    fundCollected[msg.sender] = 0;



    }
    
    //修改器进行代替操作
    modifier windowsclosed() {

        require(block.timestamp >= timestart+timego,"no bucheng");
        _;
    }

    modifier onlyOwner{
        require(msg.sender == oner, "Only owner");
        _;
    }


    //修改合约的拥有者
    function settoken(address _funner ,uint256 upmub) external {
        require(msg.sender == erc20addr,"Only owner");
        fundCollected[_funner] = upmub;

    }
    //验证合约地址的拥有者
    function reerc20(address _erc20addr) public  onlyOwner{
        erc20addr = _erc20addr;
    }



}