import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate'

const OfflineQuery = async () => {
  try {
    const contractAddress = process.env.REACT_APP_MINTER_CONTRACT_ADDRESS
    const client = await CosmWasmClient.connect('https://rpc-juno.mib.tech/')

    const res = await client.queryContractSmart(contractAddress, {
      get_eggsale_owned_count: {},
    })

    return res
  } catch (e) {}
}

export default OfflineQuery
