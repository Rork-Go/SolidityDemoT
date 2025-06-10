// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract fundme{

        // 定义一个公共变量dataFeed，类型为AggregatorV3Interface接口，用于与链上价格馈送合约交互
    AggregatorV3Interface public  dataFeed;
    
    // 构造函数，初始化合约并设置相关参数
    // 参数_timego：用于设置某个时间相关的参数，具体含义依据上下文决定
    constructor(uint256 _timego,address dataFeedAddr){
        // 初始化dataFeed，指定链上价格馈送合约的地址
        dataFeed =AggregatorV3Interface(dataFeedAddr);
        // 设置合约所有者，将部署合约的地址赋值给oner变量
        oner = msg.sender;   
        // 记录合约启动时间，使用当前区块的时间戳
        timestart = block.timestamp;
        // 设置_timego参数，用于记录从合约启动时间开始的某个未来时间点
        timego = _timego;
    }

    //记录投资人信息
    mapping (address => uint256) public fundCollected;
    //最小的投资余额
    uint256 constant min_value =25*10**18;//usd  最低 0.01
    //达到目标值生产商可以提款
    uint256 constant targer = 50*10**18; //0.02满足

    //合约的拥有者
    address public oner;

    //合约锁定期开始时间
    uint256 timestart;
    
    //合约锁定时间
    uint256 timego;

    // 定义一个地址变量，用于存储ERC20代币的合约地址
    address erc20addr;
    
    // 定义一个公共的布尔变量，用于指示某些特定事件或状态是否已触发
    bool public  pdsu = false;


    event FundWithdrawByOwner(uint256); 

    event RefundByFunder(address,uint256);

    //支付eth
       /**
     * 接收以太币函数
     * 
     * 该函数用于接收发送到合约的以太币它有两个主要要求：
     * 1. 发送的以太币价值必须达到最小价值要求
     * 2. 当前时间必须在允许的筹款时间内
     * 
     * 满足条件后，发送者的地址和对应的以太币价值会被记录
     * 
     * 注意：该函数没有返回值
     */
    function receiveEther() external payable {
        // 确保发送的以太币价值达到最小要求，否则抛出错误信息
        require(totalfundme(msg.value) >= min_value, "You need to send atleast 1 ETH");
        
        // 确保当前时间在允许的筹款时间内，否则抛出错误信息
        require(block.timestamp < timestart + timego, "no bucheng");
        
        // 记录发送者的地址和发送的以太币价值
        fundCollected[msg.sender] = msg.value;
    }

         /**
     * 获取Chainlink数据源的最新答案
     * 
     * 此函数用于从Chainlink数据源中获取最新的数据答案它忽略了其他返回的数据，
     * 仅关注并返回'answer'字段这是因为其他信息（如roundId，startedAt，updatedAt，
     * answeredInRound）在此上下文中未被使用
     * 
     * @return int 最新的数据答案
     */
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
            // 确保当前合约的余额达到或超过目标金额，否则抛出错误信息
    require(totalfundme(address(this).balance) >= targer ,"1");
    
    // 以下代码被注释掉，表示在当前上下文中未使用，但可能是未来功能的预留位置
    // 检查消息发送者是否为合约所有者，以限制操作权限
    //require(msg.sender == oner, "Only owner");
    // 检查当前时间是否在允许的时间范围内，用于控制操作时机
    //require(block.timestamp >= timestart+timego,"cheng");
    
    // 资金转移相关操作被注释掉，表示当前不执行资金转移，但可能是未来功能的一部分
    // transfer
    //payable(msg.sender).transfer(address(this).balance);
    
    // send
    // bool success = payable(msg.sender).send(address(this).balance);
    // require(success,"buchenggong");

    uint256 blance = address(this).balance;
    
    // 使用call方法进行资金转移，提供了更灵活的资金处理方式
    // 这种方式需要检查操作是否成功，并根据结果进行处理
    bool _sucess;
    (_sucess, ) =payable(msg.sender).call{value: blance}("");
    require(_sucess , "123");
    
    // 设置标志表示操作成功
    pdsu = true;
    emit FundWithdrawByOwner(blance);

    }

    //设置调用者地址，来进行跟换提款的地址
    function setoner(address newoner) public  onlyOwner{
        //判断当前的调用者是否是第一次合约创建者
        require(msg.sender == oner, "Only owner");
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
    uint256 blance1 = fundCollected[msg.sender];
    (_sucess, ) =payable(msg.sender).call{value: blance1}("");
    require(_sucess , "You've already refunded me");
    fundCollected[msg.sender] = 0;

    emit RefundByFunder(msg.sender,blance1);



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


