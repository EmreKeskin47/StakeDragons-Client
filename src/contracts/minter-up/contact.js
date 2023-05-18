import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx'
import { toUtf8 } from '@cosmjs/encoding'

export const MinterUp = (client) => {
  const contractAddress = process.env.REACT_APP_UPDATED_MINTER_CONTRACT_ADDRESS
  //QUERY
  const getState = async () => {
    try {
      const res = await client.queryContractSmart(contractAddress, {
        get_state: {},
      })
      return res
    } catch (e) {
      console.error(e)
    }
  }

  const getStats = async () => {
    try {
      const res = await client.queryContractSmart(contractAddress, {
        get_stats: {},
      })
      return res
    } catch (e) {
      console.error(e)
    }
  }

  const getMinMax = async () => {
    try {
      const res = await client.queryContractSmart(contractAddress, {
        get_min_max: {},
      })
      return res
    } catch (e) {
      console.error(e)
    }
  }

  /// EXECUTE

  const adminUpdate = async (senderAddress, id_1, id_2, id_3, rarity) => {
    let msg = {
      upgrade_admin: {
        owner: senderAddress,
        id_1,
        id_2,
        id_3,
        rarity,
      },
    }

    const txMsg = [
      {
        typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
        value: MsgExecuteContract.fromPartial({
          sender: senderAddress,
          contract: process.env.REACT_APP_DRAGON_CONTRACT_ADDRESS,
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
          msg: toUtf8(JSON.stringify(msg)),
          funds: [],
        }),
      },
    ]

    const response = await client.signAndBroadcast(senderAddress, txMsg, 'auto', '')
    return response.transactionHash
  }

  const editStats = async (
    senderAddress,
    common_reward = '2',
    common_ovulation = '120',
    uncommon_reward = '4',
    uncommon_ovulation = '120',
    rare_reward = '8',
    rare_ovulation = '120',
    epic_reward = '20',
    epic_ovulation = '120',
    legendary_reward = '40',
    legendary_ovulation = '120',
  ) => {
    const msg = {
      edit_stats: {
        common_reward,
        common_ovulation,
        uncommon_reward,
        uncommon_ovulation,
        rare_reward,
        rare_ovulation,
        epic_reward,
        epic_ovulation,
        legendary_reward,
        legendary_ovulation,
      },
    }
    try {
      const res = await client.execute(senderAddress, contractAddress, msg, 'auto')
      return res.transactionHash
    } catch (e) {
      console.error(e)
    }
  }

  const editContracts = async (
    senderAddress,
    dragon,
    updated_dragon,
    egg_minter,
    drgn_recipient,
    cw20_recipient,
  ) => {
    const msg = {
      edit_contracts: {
        dragon: dragon,
        updated_dragon: updated_dragon,
        egg_minter: egg_minter,
        drgn_recipient: drgn_recipient,
        cw20_recipient: cw20_recipient,
      },
    }
    try {
      const res = await client.execute(senderAddress, contractAddress, msg, 'auto')
      return res.transactionHash
    } catch (e) {
      console.error(e)
    }
  }

  //   common_max = '90000000'
  //   common_min = '22500000'
  //   epic_max = '900000000'
  //   epic_min = '225000000'
  //   legendary_max = '1800000000'
  //   legendary_min = '450000000'
  //   rare_max = '360000000'
  //   rare_min = '90000000'
  //   uncommon_max = '180000000'
  //   uncommon_min = '45000000'
  const editMinMax = async (
    senderAddress,
    common_min = '225000',
    common_max = '900000',
    uncommon_min = '450000',
    uncommon_max = '1800000',
    rare_min = '900000',
    rare_max = '3600000',
    epic_min = '2250000',
    epic_max = '9000000',
    legendary_min = '4500000',
    legendary_max = '18000000',
  ) => {
    const msg = {
      edit_min_max: {
        common_min,
        common_max,
        uncommon_min,
        uncommon_max,
        rare_min,
        rare_max,
        epic_min,
        epic_max,
        legendary_min,
        legendary_max,
      },
    }

    try {
      const res = await client.execute(senderAddress, contractAddress, msg, 'auto')
      return res
    } catch (e) {
      console.log(e)
    }
  }

  const editState = async (senderAddress) => {
    const msg = {
      edit_state: {
        owner: senderAddress,
        drgn_contract: process.env.REACT_APP_CW20_CONTRACT_ADDRESS,
        allowed_cw20: process.env.REACT_APP_RAC_CONTRACT_ADDRESS,
        allowed_operators: [
          senderAddress,
          'juno1pmhhjpymask6gzju33c4dg7z8x6tselkhw6enr',
          'juno102ez6q5vqgh0a56rttvl5hwx2adp7hn2lxnhygm93exkkac6hrkstlh5mw',
          'juno168ga2aysfxaz6tdd46grweu7zu5nwak5w22nl4',
          process.env.REACT_APP_UPDATED_DRAGON_CONTRACT_ADDRESS,
        ],
        random_key: 38861,
        drgn_rac: '237',
        season: '1',
      },
    }
    try {
      const res = await client.execute(senderAddress, contractAddress, msg, 'auto')
      return res.transactionHash
    } catch (e) {
      console.error(e)
    }
  }

  const editOldMinterState = async (senderAddress) => {
    let msg = {
      edit_old_minter_state: {
        edit_state: {
          new_owner: senderAddress,
          base_price: '5000000',
          hatch_price: '15000000',
          random_key: 79235,
          egg_sale_size: '2000',
          allowed_cw20: process.env.REACT_APP_CW20_CONTRACT_ADDRESS,
        },
      },
    }

    const res = await client.execute(senderAddress, contractAddress, msg, 'auto')
    return res.transactionHash
  }

  const editOldMinterContracts = async (senderAddress) => {
    let msg = {
      edit_old_minter_contracts: {
        edit_contracts: {
          egg: process.env.REACT_APP_EGG_CONTRACT_ADDRESS,
          dragon: process.env.REACT_APP_DRAGON_CONTRACT_ADDRESS,
          recipient: 'juno1luw9kspq5dwrqrxgkvfwt443ue99umdaqmm57afg7ms5y0rkz3dsfeudxp',
          multisig: 'juno1luw9kspq5dwrqrxgkvfwt443ue99umdaqmm57afg7ms5y0rkz3dsfeudxp',
        },
      },
    }

    const res = await client.execute(senderAddress, contractAddress, msg, 'auto')
    return res.transactionHash
  }

  const oldMinterDragonBirth = async (senderAddress, owner) => {
    const msg = {
      old_minter_dragon_birth: {
        dragon_birth: {
          id: '0000',
          owner,
        },
      },
    }

    const res = await client.execute(senderAddress, contractAddress, msg, 'auto')

    return res.transactionHash
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

  return {
    contractAddress,
    getStats,
    getMinMax,
    getState,
    adminUpdate,
    editMinMax,
    editContracts,
    editState,
    editStats,
    editOldMinterState,
    editOldMinterContracts,
    oldMinterDragonBirth,
    instantiate,
  }
}
