const whitelistContract = (client) => {
  //const contractAddress = process.env.REACT_APP_WHITELIST_CONTRACT_ADDRESS

  //MAINNET
  let contractAddress = 'juno1kjtwd7jqs9yyfl5sfmqvvp9rwdzzra50qs6jjsc0gudrtuah0a3sxajah5'

  //QUERY
  const getTokens = async (owner) => {
    const res = await client.queryContractSmart(contractAddress, { Tokens: { owner: owner } })
    return res.tokens
  }

  const getAllTokens = async () => {
    const res = await client.queryContractSmart(contractAddress, { AllTokens: {} })
    return res
  }

  const getWhitelistInfo = async () => {
    const res = await client.queryContractSmart(contractAddress, {
      Whitelist: {},
    })
    return res
  }

  const getMembers = async () => {
    const res = await client.queryContractSmart(contractAddress, { Members: {} })
    return res
  }

  const isMember = async (address) => {
    const res = await client.queryContractSmart(contractAddress, {
      IsMember: { address: address },
    })
    return res
  }

  const getNftInfo = async (token_id) => {
    const res = await client.queryContractSmart(contractAddress, { NftInfo: { token_id } })
    return res
  }

  const addWhitelistMember = async (senderAddress, members) => {
    const msg = {
      add_members: { members: members },
    }
    const res = await client.execute(senderAddress, contractAddress, msg, 'auto')

    return res.transactionHash
  }

  const removeWhitelistMember = async (senderAddress, members) => {
    const msg = {
      remove_members: { members: members },
    }
    const res = await client.execute(senderAddress, contractAddress, msg, 'auto')
    return res.transactionHash
  }

  //   const instantiateWhitelistContract = async () => {
  //     const initMsg = {
  //       base: {
  //         name: 'Starter Dragon Collection',
  //         symbol: 'STRTR',
  //         minter: MINTER,
  //       },
  //       members: [],
  //     }
  //     try {
  //       const result = await wallet
  //         .getClient()
  //         .instantiate(wallet.address, 595, initMsg, 'label', 'auto')
  //       console.log(result)
  //       return {
  //         contractAddress: result.contractAddress,
  //         transactionHash: result.transactionHash,
  //       }
  //     } catch (err) {
  //       console.error(err)
  //     }
  //   }

  return {
    isMember,
    getWhitelistInfo,
    getAllTokens,
    getTokens,
    getMembers,
    getNftInfo,
    addWhitelistMember,
    removeWhitelistMember,
  }
}

export default whitelistContract
