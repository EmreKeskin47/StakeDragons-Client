import { coin } from '@cosmjs/proto-signing'
import { getRandomCrystal } from 'util/RandomArray'
import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx'
import { toUtf8 } from '@cosmjs/encoding'

const boxMinter = (client) => {
  //const contractAddress = process.env.REACT_APP_BOX_MINTER_CONTRACT_ADDRESS_TESTNET
  const contractAddress = process.env.REACT_APP_BOX_MINTER_CONTRACT_ADDRESS

  //QUERY
  const getState = async () => {
    const res = await client.queryContractSmart(contractAddress, {
      get_state: {},
    })

    return res
  }

  const getBoxListInfo = async () => {
    const res = await client.queryContractSmart(contractAddress, {
      get_box_list_info: {},
    })
    return res
  }

  /// EXECUTE
  const editContracts = async (senderAddress, dragon_box, crystal, multisig) => {
    const msg = {
      edit_contracts: {
        dragon_box: dragon_box + '',
        crystal: crystal + '',
        multisig: multisig + '',
      },
    }
    const res = await client.execute(senderAddress, contractAddress, msg, 'auto')
    return res.transactionHash
  }

  const editState = async (senderAddress) => {
    const msg = {
      edit_state: {
        new_owner: senderAddress,
        base_price: '2000000',
        open_price: '1000000',
        random_key: 292319,
        allowed_cw20: process.env.REACT_APP_CW20_CONTRACT_ADDRESS,
      },
    }
    const res = await client.execute(senderAddress, contractAddress, msg, 'auto')
    return res.transactionHash
  }

  const mintBox = async (senderAddress, price) => {
    const msg = {
      mint_box: {},
    }

    const res = await client.execute(senderAddress, contractAddress, msg, 'auto', '', [
      coin(price.toString(), 'ujuno'),
    ])

    return res.transactionHash
  }

  const genesisMintBox = async (senderAddress) => {
    const msg = {
      genesis_mint: {},
    }

    const res = await client.execute(senderAddress, contractAddress, msg, 'auto', '', [])

    return res.transactionHash
  }

  ///OPEN BOX FREE
  const openBoxFree = async (senderAddress, id) => {
    let type = getRandomCrystal()
    const txMsg = [
      {
        typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
        value: MsgExecuteContract.fromPartial({
          sender: senderAddress,
          contract: process.env.REACT_APP_DRAGON_BOX_CONTRACT_ADDRESS,
          msg: toUtf8(
            JSON.stringify({
              approve_all: {
                operator: contractAddress,
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
          contract: contractAddress,
          msg: toUtf8(
            JSON.stringify({
              open_box: {
                id: type,
                //box_id: id,
                box_id: type,
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

  //INSTANTIATE
  //   const instantiateBoxMinterContract = async () => {
  //     const initMsg = {
  //       new_owner: wallet.address,
  //       base_price: '500000',
  //       open_price: '0',
  //       random_key: 38861,
  //       allowed_cw20: process.env.REACT_APP_CW20_CONTRACT_ADDRESS,
  //     }
  //     try {
  //       const result = await wallet
  //         .getClient()
  //         .instantiate(wallet.address, 595, initMsg, 'label', 'auto')
  //       console.log('BOX MINTER CONTRACT -> ', result)
  //     } catch (err) {
  //       console.error(err)
  //     }
  //   }

  return {
    getState,
    getBoxListInfo,
    editContracts,
    editState,
    mintBox,
    genesisMintBox,
    openBoxFree,
  }
}

export default boxMinter
