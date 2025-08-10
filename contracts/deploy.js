// contracts/deploy.js
const { ethers } = require("hardhat");

async function main() {
    console.log("🚀 Deploying CrossLend Protocol to Avalanche Fuji...");

    // Get deployer account
    const [deployer] = await ethers.getSigners();
    console.log("📝 Deploying with account:", deployer.address);

    // Check balance
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("💰 Account balance:", ethers.formatEther(balance), "AVAX");

    if (balance < ethers.parseEther("0.1")) {
        throw new Error("❌ Insufficient AVAX for deployment. Need at least 0.1 AVAX");
    }

    // Deploy contract
    console.log("🏗️ Compiling and deploying contract...");
    const CrossLendProtocol = await ethers.getContractFactory("CrossLendProtocol");

    const contract = await CrossLendProtocol.deploy({
        gasLimit: 3000000 // Set gas limit for deployment
    });

    console.log("⏳ Waiting for deployment confirmation...");
    await contract.waitForDeployment();

    console.log("🎉 CrossLend Protocol deployed successfully!");
    console.log("📍 Contract address:", await contract.getAddress());
    console.log("🔍 Verify on explorer: https://testnet.snowtrace.io/address/" + await contract.getAddress());

    // Test basic functionality
    console.log("🧪 Testing basic contract functionality...");

    try {
        // Check initial state
        const totalStaked = await contract.totalStaked();
        const totalBorrowed = await contract.totalBorrowed();
        console.log("✅ Initial total staked:", ethers.utils.formatEther(totalStaked), "AVAX");
        console.log("✅ Initial total borrowed:", ethers.utils.formatEther(totalBorrowed), "AVAX");

        // Test stake function with small amount
        console.log("🏦 Testing stake function...");
        const stakeTx = await contract.stakeAVAX({
            value: ethers.parseEther("0.01"), // 0.01 AVAX
            gasLimit: 200000
        });

        console.log("⏳ Waiting for stake transaction...");
        const stakeReceipt = await stakeTx.wait();
        console.log("✅ Stake transaction confirmed!");
        console.log("📋 Transaction hash:", stakeReceipt.transactionHash);

        // Extract StakeEvent for proof generation
        const stakeEvent = stakeReceipt.events?.find(e => e.event === 'StakeEvent');
        if (stakeEvent) {
            console.log("🎯 Stake event emitted:");
            console.log("   👤 User:", stakeEvent.args.user);
            console.log("   💰 Amount:", ethers.formatEther(stakeEvent.args.amount), "AVAX");
            console.log("   🆔 Event ID:", stakeEvent.args.eventId);
            console.log("   🌐 Subnet:", stakeEvent.args.subnet);
        }

        console.log("🎉 Contract deployment and testing completed successfully!");

    } catch (error) {
        console.log("⚠️ Basic testing failed (contract still deployed):", error.message);
    }

    // Save deployment info
    const contractAddress = await contract.getAddress();
    const deploymentInfo = {
        contractAddress: contractAddress,
        deployer: deployer.address,
        network: "avalanche-fuji",
        deploymentHash: contract.deploymentTransaction().hash,
        blockNumber: contract.deploymentTransaction().blockNumber,
        timestamp: new Date().toISOString()
    };

    console.log("\n📋 DEPLOYMENT SUMMARY:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🏦 Contract: CrossLend Protocol");
    console.log("📍 Address:", deploymentInfo.contractAddress);
    console.log("🌐 Network: Avalanche Fuji Testnet");
    console.log("👤 Deployer:", deploymentInfo.deployer);
    console.log("🔍 Explorer: https://testnet.snowtrace.io/address/" + deploymentInfo.contractAddress);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // Save to file for frontend
    const fs = require('fs');
    fs.writeFileSync(
        '../frontend/src/contract-address.json',
        JSON.stringify(deploymentInfo, null, 2)
    );
    console.log("💾 Contract address saved to frontend/src/contract-address.json");

    return await contract.getAddress();
}

// Handle errors
main()
    .then((address) => {
        console.log("🚀 Deployment completed successfully!");
        console.log("📍 Contract deployed at:", address);
        process.exit(0);
    })
    .catch((error) => {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    });