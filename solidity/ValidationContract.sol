pragma solidity ^0.4.9;
contract Validation {

    struct Client {
        address from;
        bool used;
    }

    struct ClientValidation {
        address from;
        bool accepted;
    }

    mapping(address => Client) public tab_client;
    mapping(address => mapping(uint => ClientValidation)) public map;

    function setClientValidation(address client, bool accepted) internal {
        Validation.map[client][block.timestamp] = ClientValidation(client, accepted);
    }

    function giveEther(address client) returns (bool) {
        if (Validation.isValid(client) == false) {
            return false;
        }

        Validation.tab_client[client] = Client(client, true);
        return true;
    }


    function isValid(address client) returns (bool) {
        if ((Validation.tab_client[client].from != 0) && Validation.tab_client[client].used == true) {
            return false;
        }

        return true;
    }

    function calculMounthly(uint amount, uint duration, uint rate) internal returns (uint) {
        return ((amount * rate / 12) / (1 - (1 + rate / 12) ** -duration));
    }

    function calculContractIntern(uint pay, uint accruedLiabilities, uint monthly) internal returns (bool) {
        uint indebtedness = (accruedLiabilities + monthly) / (pay / 12);
        if (indebtedness > 32) {
            return (false);
        }

        return (true);
    }

    function checkIfContractValid(address client, uint amount, uint duration, uint rate, uint pay, uint accruedLiabilities) returns (bool) {
        if (Validation.tab_client[client].from != 0) {
            Validation.tab_client[client].used = false;
        }

        uint monthly = calculMounthly(amount, duration, rate);

        if (calculContractIntern(pay, accruedLiabilities, monthly) == false) {
            Validation.setClientValidation(client, false);
            return false;
        }

        Validation.setClientValidation(client, true);
        return true;
    }

    function () {
        throw;
    }
}