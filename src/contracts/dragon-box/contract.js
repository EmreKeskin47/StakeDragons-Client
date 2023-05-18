const dragonBoxContract = (client) => {
  const contractAddress = process.env.REACT_APP_DRAGON_BOX_CONTRACT_ADDRESS

  //QUERY
  const getTokens = async (owner) => {
    const res = await client.queryContractSmart(contractAddress, { Tokens: { owner: owner } })
    return res.tokens
  }

  const getAllTokens = async () => {
    const res = await client.queryContractSmart(contractAddress, { AllTokens: {} })
    return res
  }

  const getNftInfo = async (token_id) => {
    const res = await client.queryContractSmart(contractAddress, { NftInfo: { token_id } })
    return res
  }

  //INSTANTIATE
  //   const instantiateDragonBoxContract = async () => {
  //     const initMsg = {
  //       base: {
  //         name: 'Dragon Box NFT Collection',
  //         symbol: 'DRGNBX',
  //         minter: process.env.REACT_APP_BOX_MINTER_CONTRACT_ADDRESS_TESTNET,
  //       },
  //     }
  //     try {
  //       const result = await wallet
  //         .getClient()
  //         .instantiate(wallet.address, 595, initMsg, 'label', 'auto')
  //       console.log('DRAGON BOX CONTRACT -> ', result)
  //     } catch (err) {
  //       console.error(err)
  //     }
  //   }

  return {
    getAllTokens,
    getTokens,
    getNftInfo,
  }
}

export default dragonBoxContract
