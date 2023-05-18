const StakeReward = (client) => {
  const contractAddress = process.env.REACT_APP_STAKE_REWARD_CONTRACT_ADDRESS

  const getState = async () => {
    return client.queryContractSmart(contractAddress, {
      get_state: {},
    })
  }

  const getStateCosmicReward = async () => {
    return client.queryContractSmart(process.env.REACT_APP_COSMIC_REWARD_CONTRACT_ADDRESS, {
      get_state: {},
    })
  }

  const editState = async (senderAddress, admin, dragon_contract, cw20_contract, owner) => {
    let msg = {
      edit_state: { admin, dragon_contract, cw20_contract, owner },
    }

    const res = await client.execute(senderAddress, contractAddress, msg, 'auto')
    return res.transactionHash
  }

  const cosmicEditState = async (senderAddress, admin, dragon_contract, cw20_contract, owner) => {
    let msg = {
      edit_state: { admin, dragon_contract, cw20_contract, owner },
    }

    const res = await client.execute(
      senderAddress,
      process.env.REACT_APP_COSMIC_REWARD_CONTRACT_ADDRESS,
      msg,
      'auto',
    )
    return res.transactionHash
  }

  const sendRewardDrgn = async (senderAddress, recipient, amount) => {
    let msg = {
      claim: {
        recipient,
        amount,
      },
    }
    const res = await client.execute(senderAddress, contractAddress, msg, 'auto')
    return res.transactionHash
  }

  const sendCosmicRewardDrgn = async (senderAddress, recipient, amount) => {
    let msg = {
      claim: {
        recipient,
        amount,
      },
    }
    const res = await client.execute(
      senderAddress,
      process.env.REACT_APP_COSMIC_REWARD_CONTRACT_ADDRESS,
      msg,
      'auto',
    )
    return res.transactionHash
  }

  const increaseCosmicAllowance = async (senderAddress) => {
    const res = await client.execute(
      senderAddress,
      process.env.REACT_APP_CW20_CONTRACT_ADDRESS,
      {
        increase_allowance: {
          amount: '20000000000',
          spender: process.env.REACT_APP_COSMIC_REWARD_CONTRACT_ADDRESS,
        },
      },
      'auto',
    )
    return res.transactionHash
  }

  // const instantiateStakeReward = async () => {
  //   const initMsg = {
  //     admin: 'juno1ju5k4qcpwgh2ex8svctvszlz9yffp62rr6kdst',
  //     dragon_contract: process.env.REACT_APP_DRAGON_CONTRACT_ADDRESS,
  //     cw20_contract: process.env.REACT_APP_CW20_CONTRACT_ADDRESS,
  //   }

  //   try {
  //     const result = await wallet
  //       .getClient()
  //       .instantiate(
  //         'juno1ju5k4qcpwgh2ex8svctvszlz9yffp62rr6kdst',
  //         3659,
  //         initMsg,
  //         'label',
  //         'auto',
  //       )
  //     console.log('stake reward contract address -> ', result)
  //     return {
  //       contractAddress: result.contractAddress,
  //       transactionHash: result.transactionHash,
  //     }
  //   } catch (err) {
  //     console.error(err)
  //   }
  // }

  return {
    getState,
    editState,
    sendRewardDrgn,
    sendCosmicRewardDrgn,
    getStateCosmicReward,
    cosmicEditState,
    increaseCosmicAllowance,
    // instantiateStakeReward,
  }
}

export default StakeReward
