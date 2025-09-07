# 🚀 Vault SDK - Vercel Deployment Guide

## Quick Deploy to Vercel

### **Option 1: One-Click Deploy (Recommended)**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vijaygopalbalasa/Avax-CPoE&project-name=vault-sdk&repository-name=vault-sdk&root-directory=frontend)

### **Option 2: Manual Deployment**

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Navigate to Frontend Directory**
   ```bash
   cd frontend
   ```

3. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

4. **Follow the prompts:**
   - Set up and deploy? **Y**
   - Which scope? **Your Vercel account**
   - Link to existing project? **N**
   - Project name: **vault-sdk**
   - Directory: **./frontend** (or just press Enter)

## 🔧 Configuration

### **Environment Variables (Set in Vercel Dashboard)**

Go to your Vercel project settings and add these environment variables:

```env
REACT_APP_CONTRACT_ADDRESS=0xDDaad7df1b101B8042792C7b54D2748C3220712f
REACT_APP_FUJI_RPC=https://api.avax-test.network/ext/bc/C/rpc
REACT_APP_FUJI_CHAIN_ID=43113
GENERATE_SOURCEMAP=false
```

### **Build Settings**

Vercel will automatically detect your React app, but you can manually configure:

- **Framework Preset**: Create React App
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

## 🎯 Post-Deployment

### **What You'll Get:**

1. **Live URL**: `https://crosslend-protocol-[random].vercel.app`
2. **Automatic HTTPS**: SSL certificate included
3. **Global CDN**: Fast loading worldwide
4. **Auto-deploys**: Updates when you push to GitHub

### **Features Available:**

- ✅ **Protocol Demo**: Full MetaMask integration and ZK proof generation
- ✅ **SDK Documentation**: Interactive developer guide
- ✅ **Real ZK Proofs**: 15ms generation with Groth16 cryptography
- ✅ **Cross-Subnet Privacy**: World's first implementation
- ✅ **Live Contract**: Connected to Avalanche Fuji testnet

## 🔗 Sharing Your Demo

### **For Hackathon Judges:**
- Share the Vercel URL directly
- Demo works instantly in any browser
- No local setup required

### **For Developers:**
- SDK Documentation tab shows integration examples
- Copy-paste ready code snippets
- Technical specifications and benchmarks

### **For Investors:**
- Professional presentation interface
- Live working demonstration
- Clear value proposition and market advantage

## 🛠 Troubleshooting

### **Common Issues:**

1. **MetaMask Connection**: Users need MetaMask browser extension
2. **Network Setup**: Guide users to add Avalanche Fuji testnet
3. **Test AVAX**: Users need testnet AVAX from faucet

### **Faucet Links:**
- [Avalanche Fuji Faucet](https://faucet.avax.network/)
- [ChainLink Faucet](https://faucets.chain.link/fuji)

## 📊 Analytics & Monitoring

Vercel provides built-in analytics:
- Page views and unique visitors
- Performance metrics
- Error tracking
- Geographic distribution

Perfect for tracking demo engagement and user interest!

## 🎉 Success!

Your CrossLend Protocol is now live and accessible worldwide! 

**Key Benefits:**
- 🌐 **Global Access**: Anyone can try your demo instantly
- ⚡ **Fast Loading**: Vercel's global CDN ensures quick load times
- 🔒 **Secure**: HTTPS by default with security headers
- 📱 **Mobile Friendly**: Responsive design works on all devices
- 🚀 **Professional**: Perfect for hackathon presentations and investor demos

Share your live demo URL with judges, developers, and potential users to showcase the world's first privacy-preserving cross-subnet DeFi protocol!
