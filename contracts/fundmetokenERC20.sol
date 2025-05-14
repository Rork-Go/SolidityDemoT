// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {fundme} from "./fundme.sol";

contract fundtokenERC20 is ERC20{
    fundme fundme01;
    constructor(address fundmeadd ) ERC20("fundToken", "FTK" ){
        fundme01 = fundme(fundmeadd);
    }

    function mint(uint256 amounttomint) public {
        require(fundme01.fundCollected(msg.sender) >= amounttomint, "s");
        require(fundme01.pdsu(),"123");
        _mint(msg.sender, amounttomint);
        fundme01.settoken(msg.sender,fundme01.fundCollected(msg.sender)-amounttomint);



    }

    function claim(uint256 amounttoclaim) public {
        require(balanceOf(msg.sender)>= amounttoclaim,"123");
        require(fundme01.pdsu(),"123");
        _burn(msg.sender, amounttoclaim);

    }


}
