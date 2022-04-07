// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.1;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";
import { Base64 } from "./libraries/Base64.sol";


contract NFTMinter is ERC721URIStorage {
    // Counter will track tokenIds
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    string baseSvg = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='black' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";

    string tocha = "Tocha";
    string[] middleWords = ["TheCutest", "TheStrongest", "TheFastest", "TheBravest", "TheSmartest", "TheHappiest", "TheFluffiest", "The", "TheDeadliest", "TheFunniest"];
    string theDog = "Dog";
    string[] descriptions = [
        "Being cute is part of my nature", "Try to fight with me", "Speed. I am speed.", "Body of a dog, heart of a lion", "1 dog + 1 cat = 1 dog", "Just look at my tail", "Hug me", "The Dog", "I really like cats and postmans. They taste good.", "XD"
        ];

    event NewTochaNFT(address sender, uint256 tokenId);

    // ERC721 token with name and symbol
    constructor () ERC721 ("TochaNFT", "TOCHA") {
        console.log("NFT Minter!");
    }

    function pickRandom(uint256 tokenId) public view returns (uint256) {
        // Seed the random generator
        uint256 rand = random(string(abi.encodePacked("CHOOSE_TOCHA", Strings.toString(tokenId))));
        // Squash number between 0 and the length of the array
        rand = rand % middleWords.length;
        return rand;
    }

    function random(string memory input) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(input)));
    }

    function mintNFT() public {
        // get current tokenId, starts at 0
        uint256 newItemId = _tokenIds.current(); // current() is function of form Counters library

        // Choose random word
        uint256 randNum = pickRandom(newItemId);
        string memory middleWord = middleWords[randNum];
        string memory description = descriptions[randNum];


        // Concatenate words togeter with svg
        string memory finalSvg = string(abi.encodePacked(baseSvg, tocha, middleWord, theDog, "</text></svg>"));
        
        // Encode JSON
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        // Set title of NFT
                        abi.encodePacked(tocha, middleWord, theDog), 
                        '", "description": "', description, '",',
                        ' "image": "data:image/svg+xml;base64,',
                        Base64.encode(bytes(finalSvg)),
                        '"}'
                    )
                )
            )
        );

        // JSON data
        string memory finalTokenUri = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        string memory tokenLink = string(
            abi.encodePacked(
                    "https://nftpreview.0xdev.codes/?code=",
                    finalTokenUri
                )
        );
        
        console.log("=====================");
        console.log(tokenLink);
        console.log("=====================");

        // Minting NFT
        _safeMint(msg.sender, newItemId);

        // Set the NFTs data
        _setTokenURI(newItemId, finalTokenUri);

        console.log("An NFT with ID %s has been minted to %s ", newItemId, msg.sender);

        // Increment the counter for when the NFT is minted
        _tokenIds.increment();

        emit NewTochaNFT(msg.sender, newItemId);
    }

}