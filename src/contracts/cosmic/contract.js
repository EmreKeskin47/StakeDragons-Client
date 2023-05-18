const cosmicContract = (client) => {
  const contractAddress = process.env.REACT_APP_COSMIC_CONTRACT_ADDRESS

  //QUERY
  const getNumTokens = async () => {
    const res = await client.queryContractSmart(contractAddress, {
      NumTokens: {},
    })
    return res
  }

  const getNftInfo = async (token_id) => {
    const res = await client.queryContractSmart(contractAddress, { NftInfo: { token_id } })
    return res
  }

  const getTokens = async (owner) => {
    const res = await client.queryContractSmart(contractAddress, { Tokens: { owner: owner } })
    return res.tokens
  }

  const getState = async () => {
    const res = await client.queryContractSmart(contractAddress, {
      get_state: {},
    })

    return res
  }

  const queryUserCosmic = async (owner, start_after, limit) => {
    const res = await client.queryContractSmart(contractAddress, {
      RangeUserCosmics: {
        start_after,
        limit,
        owner,
      },
    })
    if (res.length === 0 || res === undefined) {
      return []
    }
    return res.cosmics
  }

  // const rangeUserCosmics = async (owner, start_after, limit) => {
  //   let tokenRes = []
  //   let res = await client.queryContractSmart(contractAddress, {
  //     Tokens: { owner: owner, start_after: start_after, limit: limit },
  //   })
  //   if (res.tokens.length === 0) {
  //     return tokenRes
  //   }
  //   for (let i = 0; i < res.tokens.length; i++) {
  //     let res2 = await client.queryContractSmart(contractAddress, {
  //       NftInfo: { token_id: res.tokens[i] },
  //     })
  //     tokenRes.push({
  //       token_id: res.tokens[i],
  //       owner: owner,
  //       kind: res2.extension.attributes[0].value,
  //       ovulation_period: res2.extension.attributes[1].value,
  //       daily_income: res2.extension.attributes[2].value,
  //     })
  //   }
  //   return tokenRes
  // }

  const queryCosmic = async (id) => {
    const res = await client.queryContractSmart(contractAddress, {
      CosmicInfo: { id: id },
    })
    return res
  }

  // EXECUTE

  const updateDailyIncome = async (senderAddress, new_daily_income) => {
    const res = await client.execute(
      senderAddress,
      contractAddress,
      {
        update_daily_income: {
          new_daily_income: new_daily_income,
        },
      },
      'auto',
    )
    return res.transactionHash
  }

  const updateMinStakeTime = async (senderAddress, time) => {
    const res = await client.execute(
      senderAddress,
      contractAddress,
      {
        update_min_stake_time: {
          time: time,
        },
      },
      'auto',
    )
    return res.transactionHash
  }

  const transferNft = async (senderAddress, recipient, token_id) => {
    try {
      const res = await client.execute(
        senderAddress,
        contractAddress,
        { transfer_nft: { recipient: recipient, token_id: token_id } },
        'auto',
      )
      return res.transactionHash
    } catch (e) {
      console.log(e)
      return
    }
  }

  const stakeCosmic = async (senderAddress, token_id) => {
    var res = null
    let waiting = true
    res = await client.execute(
      senderAddress,
      contractAddress,
      { stake_cosmic: { token_id: token_id } },
      'auto',
    )
    while (waiting) {
      if (res) {
        waiting = false
      }
    }
    return res.transactionHash
  }

  const unstake = async (senderAddress, token_id) => {
    const res = await client.execute(
      senderAddress,
      contractAddress,
      { unstake_cosmic: { token_id: token_id } },
      'auto',
    )
    return res.transactionHash
  }

  const startUnstakingProcess = async (senderAddress, token_id) => {
    const res = await client.execute(
      senderAddress,
      contractAddress,
      { start_unstaking_process: { token_id: token_id } },
      'auto',
    )
    return res.transactionHash
  }

  const claimReward = async (senderAddress, token_id) => {
    const res = await client.execute(
      senderAddress,
      contractAddress,
      { claim_reward: { token_id: token_id } },
      'auto',
    )
    return res
  }

  const updateRewardContractAddress = async (senderAddress, new_address) => {
    const res = await client.execute(
      senderAddress,
      contractAddress,
      {
        update_reward_contract_address: {
          new_address,
        },
      },
      'auto',
    )
    return res.transactionHash
  }

  const calculateReward = async (token_id) => {
    const res = await client.queryContractSmart(contractAddress, {
      CalculateReward: { token_id: token_id },
    })
    return res
  }

  //INSTANTIATE
  //   const instantiateCosmicContract = async () => {
  //     const initMsg = {
  //       base: {
  //         name: 'Cosmic NFT Collection',
  //         symbol: 'COSMIC',
  //         minter: process.env.REACT_APP_BOX_MINTER_CONTRACT_ADDRESS_TESTNET,
  //       },
  //       size: '2000',
  //       reward_contract_address: process.env.REACT_APP_STAKE_REWARD_CONTRACT_ADDRESS,
  //       base_price: '0',
  //       daily_income: '0',
  //     }
  //     try {
  //       const result = await wallet
  //         .getClient()
  //         .instantiate(wallet.address, 595, initMsg, 'label', 'auto')
  //       console.log('CRYSTAL CONTRACT -> ', result)
  //     } catch (err) {
  //       console.error(err)
  //     }
  //   }

  return {
    getNumTokens,
    getNftInfo,
    getTokens,
    getState,
    queryUserCosmic,
    queryCosmic,
    stakeCosmic,
    unstake,
    startUnstakingProcess,
    claimReward,
    calculateReward,
    updateRewardContractAddress,
    updateDailyIncome,
    updateMinStakeTime,
    transferNft,
  }
}

export default cosmicContract
