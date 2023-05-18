const crystalContract = (client) => {
  const contractAddress = process.env.REACT_APP_CRYSTAL_CONTRACT_ADDRESS

  const getState = async () => {
    const res = await client.queryContractSmart(contractAddress, {
      GetState: {},
    })

    return res
  }

  const queryUserCrystal = async (owner) => {
    const res = await client.queryContractSmart(contractAddress, {
      query_user_crystal: { owner },
    })

    return res
  }

  const queryCrystal = async (id) => {
    const res = await client.queryContractSmart(contractAddress, {
      CrystalInfo: {
        id: id,
      },
    })
    return res
  }

  const updateState = async (senderAddress) => {
    const msg = {
      update_state: {
        cosmic_contract: process.env.REACT_APP_COSMIC_CONTRACT_ADDRESS,
        drgn_recipient: 'juno1luw9kspq5dwrqrxgkvfwt443ue99umdaqmm57afg7ms5y0rkz3dsfeudxp',
        allowed_cw20: process.env.REACT_APP_CW20_CONTRACT_ADDRESS,
        attune_price: '300000000',
      },
    }
    try {
      const res = await client.execute(senderAddress, contractAddress, msg, 'auto')
      console.log(res)
    } catch (e) {
      console.log(e)
    }
  }

  const updateOwner = async (senderAddress, newOwner) => {
    const msg = {
      update_owner: {
        new_owner: newOwner,
      },
    }
    try {
      const res = await client.execute(senderAddress, contractAddress, msg, 'auto')
      console.log(res)
    } catch (e) {
      console.log(e)
    }
  }

  const rangeUserCrystals = async (owner, start_after, limit) => {
    let tokenRes = []
    let res = await client.queryContractSmart(contractAddress, {
      Tokens: { owner: owner, start_after: start_after, limit: limit },
    })
    if (res.tokens.length === 0) {
      return tokenRes
    }
    for (let i = 0; i < res.tokens.length; i++) {
      let res2 = await client.queryContractSmart(contractAddress, {
        NftInfo: { token_id: res.tokens[i] },
      })
      tokenRes.push({
        token_id: res.tokens[i],
        owner: owner,
        kind: res2.extension.attributes[0].value,
      })
    }
    return tokenRes
  }

  const editCosmicContract = async (senderAddress, cosmic) => {
    const msg = {
      update_cosmic_contract: {
        cosmic,
      },
    }
    const res = await client.execute(senderAddress, contractAddress, msg, 'auto')
    return res.transactionHash
  }

  const mintCosmic = async (senderAddress, fire_id, ice_id, storm_id, divine_id, udin_id) => {
    const msg = {
      generate_cosmic: {
        fire_id,
        ice_id,
        storm_id,
        divine_id,
        udin_id,
      },
    }
    const res = await client.execute(senderAddress, contractAddress, msg, 'auto')
    return res.transactionHash
  }

  //INSTANTIATE
  //   const instantiateCrystalContract = async () => {
  //     const initMsg = {
  //       base: {
  //         name: 'Crystal NFT Collection',
  //         symbol: 'CRYSTL',
  //         minter: process.env.REACT_APP_BOX_MINTER_CONTRACT_ADDRESS_TESTNET,
  //       },
  //       size: '2000',
  //       cosmic_contract: '',
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

  return {
    getState,
    queryUserCrystal,
    editCosmicContract,
    mintCosmic,
    rangeUserCrystals,
    transferNft,
    updateOwner,
    queryCrystal,
    updateState,
  }
}

export default crystalContract
