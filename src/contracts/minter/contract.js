import { coin } from '@cosmjs/proto-signing'
import { getRandomType } from '../../util/RandomArray'
import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx'
import { toUtf8 } from '@cosmjs/encoding'

export const Minter = (client) => {
  const use = (contractAddress) => {
    //QUERY
    const getState = async () => {
      const res = await client.queryContractSmart(contractAddress, {
        get_state: {},
      })

      return res
    }

    const getEggsaleInfo = async () => {
      const res = await client.queryContractSmart(contractAddress, {
        get_eggsale_owned_count: {},
      })

      return res
    }

    /// EXECUTE
    const editContracts = async (senderAddress, egg, dragon, recipient, multisig) => {
      const msg = {
        edit_contracts: {
          egg: egg + '',
          dragon: dragon + '',
          recipient: recipient + '',
          multisig: multisig + '',
          //recipient: 'juno1luw9kspq5dwrarxgkvfwt443ue99umdaqmm57afg7ms5yOrkz3dsfeudxp',
        },
      }
      const res = await client.execute(senderAddress, contractAddress, msg, 'auto')
      return res.transactionHash
    }

    const editState = async (senderAddress) => {
      const msg = {
        edit_state: {
          new_owner: senderAddress,
          base_price: '5000000',
          hatch_price: '15000000',
          random_key: 79235,
          egg_sale_size: '2000',
          allowed_cw20: process.env.REACT_APP_CW20_CONTRACT_ADDRESS,
        },
      }
      const res = await client.execute(senderAddress, contractAddress, msg, 'auto')
      return res.transactionHash
    }

    const mintEgg = async (senderAddress, price) => {
      const msg = {
        mint_egg: {},
      }

      const res = await client.execute(senderAddress, contractAddress, msg, 'auto', '', [
        coin(price.toString(), 'ujuno'),
      ])

      return res.transactionHash
    }

    ///HATCH EGG FREE
    const hatchEggFree = async (senderAddress, id) => {
      let type = getRandomType()

      const txMsg = [
        {
          typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
          value: MsgExecuteContract.fromPartial({
            sender: senderAddress,
            contract: process.env.REACT_APP_EGG_CONTRACT_ADDRESS,
            msg: toUtf8(
              JSON.stringify({
                approve_all: {
                  operator: process.env.REACT_APP_MINTER_CONTRACT_ADDRESS,
                },
              }),
            ),
            funds: [],
          }),
        },
        {
          typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
          value: MsgExecuteContract.fromPartial({
            sender: senderAddress,
            contract: process.env.REACT_APP_MINTER_CONTRACT_ADDRESS,
            msg: toUtf8(
              JSON.stringify({
                genesis_hatch: {
                  id: type,
                  egg_id: id,
                },
              }),
            ),
            funds: [],
          }),
        },
      ]

      const res = await client.signAndBroadcast(senderAddress, txMsg, 'auto')

      return res.transactionHash
    }

    const dragonBirth = async (senderAddress, ownedSize) => {
      let type = getRandomType()

      const msg = {
        dragon_birth: {
          id: type + '0000' + ownedSize,
        },
      }

      const res = await client.execute(senderAddress, contractAddress, msg, 'auto')

      return res.transactionHash
    }

    const dragonDrop = async (senderAddress) => {
      const msg = {
        dragon_drop: {},
      }
      const res = await client.execute(senderAddress, contractAddress, msg, 'auto')

      return res.transactionHash
    }

    return {
      contractAddress,
      mintEgg,
      hatchEggFree,
      dragonBirth,
      dragonDrop,
      editContracts,
      editState,
      getState,
      getEggsaleInfo,
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
