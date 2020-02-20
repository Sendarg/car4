pragma solidity ^0.5.9;

contract SecretLog {
    address owner;
    constructor () public {
        owner = msg.sender;
    }
    modifier onlyOwner() {
        require(owner == msg.sender);
        _;
    }

    struct vehicleInfo {
        bytes32[] Logs;
        uint256 index; // 1-based
    }    
    bytes32[] private vehicleIndexes;
    mapping(bytes32 => vehicleInfo) private registerVehicles;

    function vehicleExisted(bytes32 _vehicle) public view returns (bool) {
        require(_vehicle != "");
        if (vehicleIndexes.length == 0) {
            return false;
        }
        return (vehicleIndexes[registerVehicles[_vehicle].index - 1] == _vehicle);
    }

    /**
     * @param _index Starting from 1
     */
    function getvehicleHashbyIndex(uint256 _index) public view onlyOwner returns (bytes32) {
        require(_index > 0);
        return vehicleIndexes[_index - 1];
    }
    function getVehicleCount() public view onlyOwner returns (uint256) {
        return vehicleIndexes.length;
    }
    function getAllLogsCount() public view onlyOwner returns (uint256) {
        uint256 counter = 0;
        for (uint i = 0; i < vehicleIndexes.length; i++) {
            counter += registerVehicles[vehicleIndexes[i]].Logs.length;
        }        
        return counter;
    }

    function getLogbyVehicle(bytes32 _vehicle,uint256 _index) public view returns (bytes32) {
        require(_vehicle != "");
        require(_index >= 0);
        return registerVehicles[_vehicle].Logs[_index];
    }
    function getLogsCountbyVehicle(bytes32 _vehicle) public view returns (uint256) {
        require(_vehicle != "");        
        return registerVehicles[_vehicle].Logs.length;
    }

    /**
     * @dev For owner to store vehicle log
     * @param _vehicle The hash of vehicle
     * @param _log_hash The hash of log
     */
    function setLog(bytes32 _vehicle, bytes32 _log_hash) public onlyOwner payable {
        require(_vehicle != "");
        require(_log_hash != "");

        vehicleInfo storage vehicle  = registerVehicles[_vehicle];
        vehicle.Logs.push(_log_hash);

        if (vehicle.index == 0) {
            vehicleIndexes.push(_vehicle);
            vehicle.index = vehicleIndexes.length;
        }        
    }

    /**
     * @dev Destroy one vehicle
     */
    function destroyVehicle(bytes32 _vehicle) public onlyOwner returns (bool) {
        require(vehicleExisted(_vehicle));

        uint indexToDel = registerVehicles[_vehicle].index;
        bytes32 lastVehicle = vehicleIndexes[vehicleIndexes.length - 1];

        if (lastVehicle == _vehicle) {
            delete(registerVehicles[_vehicle]);
            vehicleIndexes.length = 0;
            return true;
        }

        vehicleIndexes[indexToDel - 1] = lastVehicle;        
        vehicleIndexes.length--;

        registerVehicles[lastVehicle].index = indexToDel;
        delete(registerVehicles[_vehicle]);
        return true;
    }
}