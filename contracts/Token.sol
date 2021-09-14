pragma solidity 0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
// Contract creation
contract Token is ERC721, Ownable {

    struct Pet {
        uint8 damage;
        uint8 magic;
        uint256 lastMeal;
        uint256 endurance; //24h
    }

    // Variable for mint
    uint256 nextId = 0;
    
    // Mapping == HashTable to create unique ids for pets
    mapping(uint256 => Pet) private _tokenDetails;


    // Contructor create pet
    constructor(string memory name, string memory symbol) ERC721(name, symbol){

    }
    // Details
    function getTokenDetails(uint256 tokenId) public view returns (Pet memory){
        return _tokenDetails[tokenId];
    }

    // Pet creation that only the owner can interact with
    function mint(uint8 damage, uint8 magic, uint256 endurance) public onlyOwner {
        _tokenDetails[nextId] = Pet(damage, magic, block.timestamp, endurance);
        _safeMint(msg.sender, nextId);
        nextId++;
    }

    // Create feed function to the pet
    function feed(uint256 tokenId) public{
        Pet storage pet = _tokenDetails[nextId];
        // Equivalent to if
        require(pet.lastMeal + pet.endurance > block.timestamp);
        pet.lastMeal = block.timestamp; 
    }
    // Before all done it has to pass the check in, if not the token will be "deleted"
    function _beforeTokenTransfer(address from,address to, uint256 tokenId) internal override {
        Pet storage pet = _tokenDetails[nextId];
        require(pet.lastMeal + pet.endurance > block.timestamp);
    }

}
