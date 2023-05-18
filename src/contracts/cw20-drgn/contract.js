import { getRandomCrystal, getRandomType, getRandomUpgradeSuccess } from '../../util/RandomArray'
import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx'
import { toBase64, toUtf8 } from '@cosmjs/encoding'

const jsonToBinary = (json) => {
  return toBase64(toUtf8(JSON.stringify(json)))
}

const Cw20DRGN = (client) => {
  const contractAddress = process.env.REACT_APP_CW20_CONTRACT_ADDRESS
  const poolContract = process.env.REACT_APP_DRGN_JUNO_POOL_CONTRACT_ADDRESS

  const minter = process.env.REACT_APP_MINTER_CONTRACT_ADDRESS

  const getBalance = async (walletAddress) => {
    return client.queryContractSmart(contractAddress, {
      balance: { address: walletAddress },
    })
  }

  const getDrgnJunoPoolInfo = async () => {
    let poolInfo = await client.queryContractSmart(poolContract, {
      info: {},
    })
    let numerator = poolInfo.token1_reserve
    let denominator = poolInfo.token2_reserve
    let res = numerator / denominator
    return res
  }

  const sendCw20OpenBox = async (senderAddress, amount, id) => {
    let type = getRandomCrystal()
    let msg = {
      hatch: {
        id: type,
        box_id: id,
      },
    }
    const txMsg = [
      {
        typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
        value: MsgExecuteContract.fromPartial({
          sender: senderAddress,
          contract: process.env.REACT_APP_DRAGON_BOX_CONTRACT_ADDRESS,
          msg: toUtf8(
            JSON.stringify({
              approve_all: {
                operator: process.env.REACT_APP_BOX_MINTER_CONTRACT_ADDRESS,
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
              send: {
                amount: amount,
                contract: process.env.REACT_APP_BOX_MINTER_CONTRACT_ADDRESS,
                msg: jsonToBinary(msg),
              },
            }),
          ),
          funds: [],
        }),
      },
    ]

    const res = await client.signAndBroadcast(senderAddress, txMsg, 'auto', '')
    return res.transactionHash
  }

  const sendCw20AttuneCosmic = async (
    senderAddress,
    amount,
    fire_id,
    ice_id,
    storm_id,
    divine_id,
    udin_id,
  ) => {
    let msg = {
      GenerateCosmic: {
        fire_id,
        ice_id,
        storm_id,
        divine_id,
        udin_id,
        owner: senderAddress,
      },
    }
    const txMsg = [
      {
        typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
        value: MsgExecuteContract.fromPartial({
          sender: senderAddress,
          contract: process.env.REACT_APP_CRYSTAL_CONTRACT_ADDRESS,
          msg: toUtf8(
            JSON.stringify({
              approve_all: {
                operator: process.env.REACT_APP_CW20_CONTRACT_ADDRESS,
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
              send: {
                amount: amount,
                contract: process.env.REACT_APP_CRYSTAL_CONTRACT_ADDRESS,
                msg: jsonToBinary(msg),
              },
            }),
          ),
          funds: [],
        }),
      },
    ]

    const res = await client.signAndBroadcast(senderAddress, txMsg, 'auto', '')
    return res.transactionHash
  }

  const send = async (senderAddress, amount, egg_id) => {
    let type = getRandomType()

    let msg = {
      hatch: {
        id: type,
        egg_id: egg_id,
      },
    }

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
          contract: contractAddress,
          msg: toUtf8(
            JSON.stringify({
              send: {
                amount: amount,
                contract: minter,
                msg: jsonToBinary(msg),
              },
            }),
          ),
          funds: [],
        }),
      },
    ]

    const res = await client.signAndBroadcast(senderAddress, txMsg, 'auto', '')
    return res.transactionHash
  }

  // const increaseAllowance = async (senderAddress) => {
  //   const res = await client.execute(
  //     senderAddress,
  //     contractAddress,
  //     {
  //       increase_allowance: {
  //         amount: "1000000",
  //         spender: process.env.REACT_APP_CW20_CONTRACT_ADDRESS,
  //       },
  //     },
  //     'auto',
  //   )
  //   return res
  // }

  const increaseAllowance = async (senderAddress, spender, amount, expires = null) => {
    let msg = {
      increase_allowance: {
        spender,
        amount,
        expires,
      },
    }
    const res = await client.execute(senderAddress, contractAddress, msg, 'auto')
    return res
  }

  const buyFromMarket = async (senderAddress, id, amount, type) => {
    let marketAddress
    switch (type) {
      case 3:
        marketAddress = process.env.REACT_APP_CRYSTAL_MARKET_CONTRACT_ADDRESS
        break
      case 2:
        marketAddress = process.env.REACT_APP_DRAGON_MARKET_CONTRACT_ADDRESS
        break

      case 1:
        marketAddress = process.env.REACT_APP_EGG_MARKET_CONTRACT_ADDRESS
        break

      default:
        marketAddress = process.env.REACT_APP_DRAGON_MARKET_CONTRACT_ADDRESS
    }

    let msg = {
      buy: {
        recipient: senderAddress.toString(),
        token_id: id.toString(),
      },
    }

    const txMsg = [
      {
        typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
        value: MsgExecuteContract.fromPartial({
          sender: senderAddress,
          contract: contractAddress,
          msg: toUtf8(
            JSON.stringify({
              send: {
                amount: amount,
                contract: marketAddress,
                msg: jsonToBinary(msg),
              },
            }),
          ),
          funds: [],
        }),
      },
    ]

    const res = await client.signAndBroadcast(senderAddress, txMsg, 'auto', '')

    return res.transactionHash
  }

  const upgradeDragon = async (
    senderAddress,
    { dragonIds, rarity, amount, extraSuccessRate, amountType },
  ) => {
    const minter = process.env.REACT_APP_UPDATED_MINTER_CONTRACT_ADDRESS
    const [id_1, id_2, id_3] = dragonIds
    let res = getRandomUpgradeSuccess(extraSuccessRate)
    const txMsg = [
      {
        typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
        value: MsgExecuteContract.fromPartial({
          sender: senderAddress,
          contract: process.env.REACT_APP_DRAGON_CONTRACT_ADDRESS,
          msg: toUtf8(
            JSON.stringify({
              approve_all: {
                operator: minter,
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
          contract:
            amountType === 'DRGN' ? contractAddress : process.env.REACT_APP_RAC_CONTRACT_ADDRESS,
          msg: toUtf8(
            JSON.stringify({
              send: {
                amount,
                contract: minter,
                msg: jsonToBinary({
                  upgrade: {
                    owner: senderAddress,
                    id_1,
                    id_2,
                    id_3,
                    rarity,
                    res,
                  },
                }),
              },
            }),
          ),
          funds: [],
        }),
      },
    ]

    const response = await client.signAndBroadcast(senderAddress, txMsg, 'auto', '')
    let log = response.rawLog + ''
    let pos = log.search('success')
    let str = log.slice(pos + 18, pos + 23)
    return { response, str }
  }

  return {
    send,
    sendCw20OpenBox,
    sendCw20AttuneCosmic,
    getBalance,
    getDrgnJunoPoolInfo,
    buyFromMarket,
    increaseAllowance,
    upgradeDragon,
  }
}

export default Cw20DRGN
