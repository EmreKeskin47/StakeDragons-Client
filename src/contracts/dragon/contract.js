import { useState } from 'react'
import { toBase64, toUtf8 } from '@cosmjs/encoding'
import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx'

export const Dragon = (client) => {
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

    const getTokens = async (owner) => {
      const res = await client.queryContractSmart(contractAddress, { Tokens: { owner: owner } })
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

    const getCollectionInfo = async () => {
      const res = await client.queryContractSmart(contractAddress, { CollectionInfo: {} })
      return res
    }

    const getDragonInfo = async (id) => {
      const res = await client.queryContractSmart(contractAddress, { DragonInfo: { id: id } })
      return res
    }
    const getDragonInfoList = async () => {
      const res = await client.queryContractSmart(contractAddress, { DragonInfoList: {} })
      return res
    }

    const getUserDragons = async (num) => {
      const res = await client.queryContractSmart(contractAddress, {
        RangeDragons: { start_after: num },
      })
      return res
    }

    const queryState = async () => {
      const res = await client.queryContractSmart(contractAddress, {
        State: {},
      })
      return res
    }

    const rangeDragons = async (start_after, owner) => {
      const res = await client.queryContractSmart(contractAddress, {
        RangeUserDragons: { start_after: start_after, limit: 5, owner: owner },
      })
      return res.dragons
    }

    const rangeUserDragons = async (owner, start_after, limit) => {
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
          ovulation_period: res2.extension.attributes[1].value,
          daily_income: res2.extension.attributes[2].value,
        })
      }
      return tokenRes
    }

    const retrieveUserDragons = async (id) => {
      let res = await client.queryContractSmart(contractAddress, {
        DragonInfo: { id: id },
      })
      const dragon = {
        token_id: res.token_id,
        owner: res.owner,
        kind: res.kind,
        ovulation_period: res.ovulation_period,
        hatch: res.hatch,
        daily_income: res.daily_income,
        is_staked: res.is_staked,
        stake_start_time: res.stake_start_time,
        reward_start_time: res.reward_start_time,
        unstaking_start_time: res.unstaking_start_time,
        unstaking_process: res.unstaking_process,
        reward_end_time: res.reward_end_time,
      }
      return dragon
    }

    /// EXECUTE

    const mint = async (senderAddress, id) => {
      const msg = {
        mint: {
          base: {
            token_id: id + '',
            owner: senderAddress,
            token_uri: 'url',
            extension: null,
          },
          extension: [
            {
              kind: 'Uncommon',
              display_type: 'None',
              trait_type: 'daily_income',
              value: '2',
              ovulation_perid: '0',
            },
          ],
        },
      }
      const res = await client.execute(senderAddress, contractAddress, msg, 'auto')
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

    const jsonToBinary = (json) => {
      return toBase64(toUtf8(JSON.stringify(json)))
    }

    const sendNft = async (senderAddress, recipient, token_id) => {
      try {
        const res = await client.execute(
          senderAddress,
          contractAddress,
          {
            send_nft: {
              contract: 'juno1w2t2ttlyf3yk09mtr7vh7eucvgagmmdh3hc62u',
              token_id: token_id,
              msg: jsonToBinary({}),
            },
          },
          'auto',
        )
        return res.transactionHash
      } catch (e) {
        console.log(e)
        return
      }
    }

    const burn = async (senderAddress, token_id) => {
      const res = await client.execute(
        senderAddress,
        contractAddress,
        { burn: { token_id: token_id } },
        'auto',
      )
      return res.transactionHash
    }

    const plantEgg = async (senderAddress, token_id) => {
      const res = await client.execute(
        senderAddress,
        contractAddress,
        { plant_egg: { token_id: token_id } },
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

    const stakeDragon = async (senderAddress, token_id) => {
      var res = null
      let waiting = true
      res = await client.execute(
        senderAddress,
        contractAddress,
        { stake_dragon: { token_id: token_id } },
        'auto',
      )
      while (waiting) {
        if (res) {
          waiting = false
        }
      }
      return res.transactionHash
    }

    const unstakeDragon = async (senderAddress, token_id) => {
      const res = await client.execute(
        senderAddress,
        contractAddress,
        { unstake_dragon: { token_id: token_id } },
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
      return res.transactionHash
    }

    const updateRewardContractAddress = async (senderAddress) => {
      const res = await client.execute(
        senderAddress,
        contractAddress,
        {
          update_reward_contract_address: {
            new_address: process.env.REACT_APP_STAKE_REWARD_CONTRACT_ADDRESS,
          },
        },
        'auto',
      )
      return res.transactionHash
    }

    const updateMinStakeTime = async (senderAddress) => {
      const res = await client.execute(
        senderAddress,
        contractAddress,
        {
          update_min_stake_time: {
            time: '0',
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

    const claimAll = async (senderAddress) => {
      let hasNext = true
      let dragons = []
      let lastDragonId = '0'
      while (hasNext) {
        let dragonRes = []
        dragonRes = await rangeUserDragons(senderAddress, lastDragonId, 5)
        if (dragonRes.length === 0 || dragonRes === undefined) {
          hasNext = false
        } else {
          dragons = [...dragons, ...dragonRes]
          lastDragonId = dragons[dragons.length - 1].token_id
        }
      }
      if (dragons.length === 0) {
        return
      }
      let msg = []
      let res = ''
      await Promise.all(
        dragons.map(async (dragon) => {
          const dragonInfo = await retrieveUserDragons(dragon.token_id)
          if (dragonInfo.is_staked) {
            msg.push({
              typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
              value: MsgExecuteContract.fromPartial({
                sender: senderAddress,
                contract: contractAddress,
                msg: toUtf8(
                  JSON.stringify({
                    claim_reward: { token_id: dragonInfo.token_id },
                  }),
                ),
                funds: [],
              }),
            })
          }
        }),
      )
      if (msg.length === 0) {
        return
      }
      res = await client.signAndBroadcast(senderAddress, msg, 'auto')
      return res.transactionHash
    }

    const plantEggOverride = async (senderAddress, token_id) => {
      let msg = []
      msg.push({
        typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
        value: MsgExecuteContract.fromPartial({
          sender: senderAddress,
          contract: contractAddress,
          msg: toUtf8(
            JSON.stringify({
              plant_egg: { token_id: token_id },
            }),
          ),
          funds: [],
        }),
      })
      msg.push({
        typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
        value: MsgExecuteContract.fromPartial({
          sender: senderAddress,
          contract: contractAddress,
          msg: toUtf8(
            JSON.stringify({
              claim_reward: { token_id: token_id },
            }),
          ),
          funds: [],
        }),
      })
      msg.push({
        typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
        value: MsgExecuteContract.fromPartial({
          sender: senderAddress,
          contract: contractAddress,
          msg: toUtf8(
            JSON.stringify({
              start_unstaking_process: { token_id: token_id },
            }),
          ),
          funds: [],
        }),
      })
      msg.push({
        typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
        value: MsgExecuteContract.fromPartial({
          sender: senderAddress,
          contract: contractAddress,
          msg: toUtf8(
            JSON.stringify({
              unstake_dragon: { token_id: token_id },
            }),
          ),
          funds: [],
        }),
      })
      msg.push({
        typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
        value: MsgExecuteContract.fromPartial({
          sender: senderAddress,
          contract: contractAddress,
          msg: toUtf8(
            JSON.stringify({
              stake_dragon: { token_id: token_id },
            }),
          ),
          funds: [],
        }),
      })
      if (msg.length === 0) {
        return
      }
      const res = await client.signAndBroadcast(senderAddress, msg, 'auto')
      return res.transactionHash
    }
    const unstake = async (senderAddress, token_id) => {
      let msg = []
      msg.push({
        typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
        value: MsgExecuteContract.fromPartial({
          sender: senderAddress,
          contract: contractAddress,
          msg: toUtf8(
            JSON.stringify({
              claim_reward: { token_id: token_id },
            }),
          ),
          funds: [],
        }),
      })
      msg.push({
        typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
        value: MsgExecuteContract.fromPartial({
          sender: senderAddress,
          contract: contractAddress,
          msg: toUtf8(
            JSON.stringify({
              unstake_dragon: { token_id: token_id },
            }),
          ),
          funds: [],
        }),
      })
      if (msg.length === 0) {
        return
      }
      const res = await client.signAndBroadcast(senderAddress, msg, 'auto')
      return res.transactionHash
    }

    const unstakeOverride = async (senderAddress, token_id) => {
      let msg = []
      msg.push({
        typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
        value: MsgExecuteContract.fromPartial({
          sender: senderAddress,
          contract: contractAddress,
          msg: toUtf8(
            JSON.stringify({
              claim_reward: { token_id: token_id },
            }),
          ),
          funds: [],
        }),
      })
      msg.push({
        typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
        value: MsgExecuteContract.fromPartial({
          sender: senderAddress,
          contract: contractAddress,
          msg: toUtf8(
            JSON.stringify({
              start_unstaking_process: { token_id: token_id },
            }),
          ),
          funds: [],
        }),
      })
      msg.push({
        typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
        value: MsgExecuteContract.fromPartial({
          sender: senderAddress,
          contract: contractAddress,
          msg: toUtf8(
            JSON.stringify({
              unstake_dragon: { token_id: token_id },
            }),
          ),
          funds: [],
        }),
      })
      if (msg.length === 0) {
        return
      }
      const res = await client.signAndBroadcast(senderAddress, msg, 'auto')
      return res.transactionHash
    }

    // const hatchEggFree = async (senderAddress, id) => {
    //   let type = getRandomType()

    //   const txMsg = [
    //     {
    //       typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
    //       value: MsgExecuteContract.fromPartial({
    //         sender: senderAddress,
    //         contract: process.env.REACT_APP_EGG_CONTRACT_ADDRESS,
    //         msg: toUtf8(
    //           JSON.stringify({
    //             approve_all: {
    //               operator: process.env.REACT_APP_MINTER_CONTRACT_ADDRESS,
    //             },
    //           }),
    //         ),
    //         funds: [],
    //       }),
    //     },
    //     {
    //       typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
    //       value: MsgExecuteContract.fromPartial({
    //         sender: senderAddress,
    //         contract: process.env.REACT_APP_MINTER_CONTRACT_ADDRESS,
    //         msg: toUtf8(
    //           JSON.stringify({
    //             genesis_hatch: {
    //               id: type,
    //               egg_id: id,
    //             },
    //           }),
    //         ),
    //         funds: [],
    //       }),
    //     },
    //   ]
    // }

    return {
      contractAddress,
      getAllTokens,
      rangeDragons,
      rangeUserDragons,
      getMinter,
      getNumTokens,
      getTokens,
      getNftInfo,
      getCollectionInfo,
      getDragonInfo,
      getDragonInfoList,
      queryState,
      mint,
      transferNft,
      sendNft,
      burn,
      hatch,
      plantEgg,
      stakeDragon,
      unstakeDragon,
      startUnstakingProcess,
      claimReward,
      updateRewardContractAddress,
      calculateReward,
      getUserDragons,
      retrieveUserDragons,
      claimAll,
      updateMinStakeTime,
      unstakeOverride,
      plantEggOverride,
      unstake,
    }
  }

  const instantiate = async (senderAddress, codeId, initMsg) => {
    try {
      const result = await client.instantiate(senderAddress, codeId, initMsg, 'label', 'auto')
      return {
        contractAddress: result.contractAddress,
        transactionHash: result.transactionHash,
      }
    } catch (err) {}
  }

  return { use, instantiate }
}

// const instantiateDragonContract = async () => {
//     try {
//       if (!wallet || !contract) return

//       const initMsg = {
//         base: {
//           name: 'Dragon Collection Test',
//           symbol: 'DRGN1',
//           minter: 'juno19tvjxwgckvazfceqwu324a2g0umx8xt8zv5tsd8r5d02hkw570fqg69fse',
//         },
//         size: '2000',
//         base_price: '1000000',
//       }
//       const response = await contract.instantiate(1596, initMsg, wallet.address)
//       console.log('instantiate  response : ', response)
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

//   const transferNft = async () => {
//     try {
//       if (!wallet.initialized || !contract) return
//       const client = contract.use(process.env.REACT_APP_DRAGON_CONTRACT_ADDRESS)
//       const res = await client.transferNft(
//         wallet.address,
//         'juno1f8xjcz4v6hmy59u9jyfwav7cuglzulha30cwmj',
//         '7',
//       )
//       const res1 = await client.transferNft(
//         wallet.address,
//         'juno1f8xjcz4v6hmy59u9jyfwav7cuglzulha30cwmj',
//         '4',
//       )
//       const res2 = await client.transferNft(
//         wallet.address,
//         'juno1f8xjcz4v6hmy59u9jyfwav7cuglzulha30cwmj',
//         '6',
//       )
//       console.log(res)
//     } catch (err) {
//       console.log(err)
//     }
//   }
