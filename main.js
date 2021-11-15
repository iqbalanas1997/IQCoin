const SHA256 = require("crypto-js/sha256");


class Transaction{
  constructor(fromAddress,toAddress,amount){
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}

class Block {
  //index: where the block is on the change
  //timestamp: when block is created
  //data : any type of data which you want to store in this block
  //previousHash : string that contains the hash of the block before this one

  constructor(timestamp, transaction, previousHash = "") {
    this.timestamp = timestamp;
    this.transaction = transaction;
    this.previousHash = previousHash;
    this.hash = "";
    this.nonce = 0;
  }
  calculateHash() {
    return SHA256(
      this.index +
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.data) +
        this.nonce
    ).toString();
  }

  
mineBlock(difficulty){
  while(this.hash.substring(0, difficulty) !== Array(difficulty+1).join("0")){
      this.nonce++;
      this.hash = this.calculateHash();
  }
  console.log("Block mined: "+this.hash);
}


}

class BlockChain {
  constructor() {
    this.chain = [this.creatGenesisBlock()];
    this.difficulty = 4;
    this.pendingTransations = [];
    this.miningReward = 100;
  }

  creatGenesisBlock() {
    return new Block("11/11/2021", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  // addBlock(newBlock) {
  //   newBlock.previousHash = this.getLatestBlock().hash;
  //   //newBlock.hash = newBlock.calculateHash();
  //   newBlock.mineBlock(this.difficulty);
  //   this.chain.push(newBlock);
  // }


minePendingTransactions(miningRewardAddress){
  let block = new Block(Date.now(), this.pendingTransations);
  block.mineBlock(this.difficulty);
  console.log('Block successfully mined'); 
  this.chain.push(block);

  this.pendingTransations = [
    new Transaction(null, miningRewardAddress,this.miningReward)
  ];

}

createTransaction(transaction){
  this.pendingTransations.push(transaction);
}

getBalanceOfAddress(address){
  let balance = 0;
  for(const block of this.chain){
    for(const trans of block.transaction){
      if(trans.fromAddress === address){
        balance -= trans.amount;
      }
      if(trans.toAddress === address){
        balance += trans.amount;
      }
    }

  }
  return balance;
}


  isChainValid(){
    for(let i=1; i<this.chain.length; i++){
      const currentBlock = this.chain[i];
      const previosBlock = this.chain[i-1];

      if(currentBlock.hash !== currentBlock.calculateHash()){
        return false;
      }

      if(currentBlock.previousHash !== previosBlock.hash){
        return false;
      }
    }
    return true;
  }
}




let IQCoin = new BlockChain();

//from 3
IQCoin.createTransaction(new Transaction('address1', 'address2',100));
IQCoin.createTransaction(new Transaction('address1', 'address2',50));

console.log('\n starting the miner....');
IQCoin.minePendingTransactions('Iqbal-address');

console.log('\nBalance of Iqbal is : ', IQCoin.getBalanceOfAddress('Iqbal-address'));

console.log('\n Starting the miner again ');
IQCoin.minePendingTransactions('Iqbal-address');

console.log('\nBalance of Iqbal is : ', IQCoin.getBalanceOfAddress('Iqbal-address'));

