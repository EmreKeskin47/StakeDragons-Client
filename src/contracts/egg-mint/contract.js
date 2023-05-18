//const CONTRACT_ADDRESS = 'juno1lew7wdx4cm3kf9gpleecucjnnl890wj9hdz624ef6uugpadjmtgqqqjqxj'

export const EggMint = (client) => {
  const use = (contractAddress) => {
    //const encode = (str) => Buffer.from(str, 'binary').toString('base64')
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

    const getTokens = async (owner, start_after, limit) => {
      let res = await client.queryContractSmart(contractAddress, {
        Tokens: { owner, start_after, limit },
      })
      return res.tokens
    }

    const getMinter = async () => {
      const res = await client.queryContractSmart(contractAddress, { Minter: {} })
      return res
    }

    const getAllTokens = async () => {
      const res = await client.queryContractSmart(contractAddress, { AllTokens: {} })
      return res
    }

    const getApprovals = async (token_id) => {
      const res = await client.queryContractSmart(contractAddress, {
        Approvals: { token_id: token_id },
      })
      return res
    }

    const getCollectionInfo = async () => {
      const res = await client.queryContractSmart(contractAddress, {
        CollectionInfo: {},
      })
      return res
    }

    const getOwnedEggCount = async () => {
      const res = await client.queryContractSmart(contractAddress, {
        OwnedEggCount: {},
      })
      return res
    }

    /// EXECUTE

    const mint = async (senderAddress, id) => {
      const msg = {
        mint: {
          base: {
            token_id: id.toString(),
            owner: senderAddress,
            token_uri: 'url',
            extension: null,
          },
        },
      }

      const res = await client.execute(senderAddress, contractAddress, msg, 'auto')
      return res.transactionHash
    }

    const mintFromDragon = async (senderAddress) => {
      const msg = {
        mint_from_dragon: {
          base: {
            token_id: '4',
            owner: senderAddress,
            token_uri: 'url',
            extension: null,
          },
        },
      }

      const res = await client.execute(senderAddress, contractAddress, msg, 'auto')
      return res.transactionHash
    }

    const approveAll = async (senderAddress) => {
      const msg = {
        approve_all: {
          operator: process.env.REACT_APP_MINTER_CONTRACT_ADDRESS,
        },
      }
      const res = await client.execute(senderAddress, contractAddress, msg, 'auto')
      return res
    }

    const approveMarket = async (senderAddress) => {
      const msg = {
        approve_all: {
          operator: 'juno1xva6yn6gzgcfvfmaxzky9tjf8sg8s7d5wkertg9emaagkd64zgzqa6eme6',
        },
      }
      const res = await client.execute(senderAddress, contractAddress, msg, 'auto')
      return res
    }

    const transferNft = async (senderAddress, recipient, token_id) => {
      const res = await client.execute(
        senderAddress,
        contractAddress,
        { transfer_nft: { recipient: recipient, token_id: token_id } },
        'auto',
      )
      return res.transactionHash
    }

    const hatch = async (senderAddress, token_id) => {
      const res = await client.execute(
        senderAddress,
        contractAddress,
        { hatch: { token_id } },
        'auto',
      )
      return res.transactionHash
    }

    const increaseCollectionSize = async (senderAddress, new_size) => {
      const res = await client.execute(
        senderAddress,
        contractAddress,
        { IncreaseSize: { new_size: new_size + '' } },
        'auto',
      )
      return res.transactionHash
    }

    const burn = async (senderAddress, token_id) => {
      const res = await client.execute(
        senderAddress,
        contractAddress,
        { burn: { token_id: token_id + '' } },
        'auto',
      )
      return res.transactionHash
    }

    const test = async (senderAddress) => {
      const msg = {
        dragon_mint_test: {
          dragon_mint_test: {
            base: {
              token_id: '4',
              owner: senderAddress,
              token_uri: 'url',
              extension: null,
            },
          },
        },
      }

      const res = await client.execute(senderAddress, contractAddress, msg, 'auto')
      return res.transactionHash
    }

    return {
      contractAddress,
      getAllTokens,
      getApprovals,
      getMinter,
      getCollectionInfo,
      getNumTokens,
      getTokens,
      getNftInfo,
      getOwnedEggCount,
      approveMarket,
      mint,
      increaseCollectionSize,
      transferNft,
      hatch,
      mintFromDragon,
      approveAll,
      burn,
      test,
    }
  }

  const instantiate = async (senderAddress, codeId, initMsg) => {
    try {
      const result = await client.instantiate(senderAddress, codeId, initMsg, 'label', 'auto')
      return {
        contractAddress: result.contractAddress,
        transactionHash: result.transactionHash,
      }
    } catch (err) {
      console.error(err)
    }
  }

  return { use, instantiate }
}

// const instantiateEggContract = async () => {
//     try {
//       if (!wallet || !contract) return
//       console.log(env.MINTER_CONTRACT)
//       const initMsg = {
//         base: {
//           name: 'Egg Collection Minter Test',
//           symbol: 'EGG2',
//           minter: 'juno19tvjxwgckvazfceqwu324a2g0umx8xt8zv5tsd8r5d02hkw570fqg69fse',
//         },
//         size: '2000',
//         base_price: '1000000',
//       }
//       const response = await contract.instantiate(1428, initMsg, wallet.address)
//       console.log('instantiate egg collection response : ', response)
//     } catch (err) {
//       console.log(err)
//     }
//   }
// const test = async () => {
//     try {
//       const client = contract.use(CONTRACT_ADDRESS)
//       const res3 = await client.getNumTokens()

//         const res4 = await client.getTokens(wallet.address)
//         const res5 = await client.getCollectionInfo()
//         const res = await client.getOwnedEggCount()
//         const res2 = await client.getMinter()
//         const res6 = await client.getAllTokens()
//         const res7 = await client.getNftInfo('2')
//         const res41 = await client.getTokens(wallet.address)
//     } catch (err) {
//       console.error(err)
//     }
//   }
