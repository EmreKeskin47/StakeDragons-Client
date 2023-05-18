import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx'
import { toUtf8 } from '@cosmjs/encoding'

const Marketplace = (client, isEgg) => {
  const eggMarketplaceAddress = process.env.REACT_APP_EGG_MARKET_CONTRACT_ADDRESS
  const eggTokenAddress = process.env.REACT_APP_EGG_CONTRACT_ADDRESS

  const dragonMarketplaceAddress = process.env.REACT_APP_DRAGON_MARKET_CONTRACT_ADDRESS
  const dragonTokenAddress = process.env.REACT_APP_DRAGON_CONTRACT_ADDRESS

  const marketplaceAddress = isEgg ? eggMarketplaceAddress : dragonMarketplaceAddress
  const tokenAddress = isEgg ? eggTokenAddress : dragonTokenAddress

  const getToken = async (tokenId) => {
    try {
      const res = await client.queryContractSmart(marketplaceAddress, {
        token: { id: tokenId.toString() },
      })
      return res
    } catch (e) {}
  }

  const getTokenData = async (tokenId) => {
    return client.queryContractSmart(tokenAddress, {
      AllNftInfo: { token_id: tokenId.toString() },
    })
  }

  const getAllTokens = async (start_after = '0') => {
    return client.queryContractSmart(marketplaceAddress, {
      range_tokens: { start_after, limit: 30 },
    })
  }

  const getTokensByOwner = async (owner) => {
    return await client.queryContractSmart(tokenAddress, {
      Tokens: { owner: owner, limit: 1000 },
    })
  }

  const getMarketplaceConfig = async () => {
    return client.queryContractSmart(marketplaceAddress, {
      config: { config: {} },
    })
  }

  const getListedTokens = async (limit, start_after) => {
    return client.queryContractSmart(marketplaceAddress, {
      list_tokens_on_sale: {
        limit,
        start_after,
      },
    })
  }

  const getMarketSize = async () => {
    return client.queryContractSmart(marketplaceAddress, {
      get_listed_size: {},
    })
  }

  const getTokensByPriceAsc = async (limit, start_after) => {
    return client.queryContractSmart(marketplaceAddress, {
      list_by_price_asc: {
        limit,
        start_after,
      },
    })
  }

  const getTokensByPriceDesc = async (limit, start_after) => {
    return client.queryContractSmart(marketplaceAddress, {
      list_by_price_desc: {
        limit,
        start_after,
      },
    })
  }

  const getTokensByRarity = async (limit, start_after, rarity) => {
    return client.queryContractSmart(marketplaceAddress, {
      list_by_rarity: {
        limit,
        start_after,
        rarity,
      },
    })
  }
  const getTokensByRarityPriceAsc = async (limit, start_after, rarity) => {
    return client.queryContractSmart(marketplaceAddress, {
      list_by_rarity_asc: {
        limit,
        start_after,
        rarity,
      },
    })
  }
  const getTokensByRarityPriceDesc = async (limit, start_after, rarity) => {
    return client.queryContractSmart(marketplaceAddress, {
      list_by_rarity_desc: {
        limit,
        start_after,
        rarity,
      },
    })
  }

  const getListedTokensByOwner = async (limit, start_after, owner) => {
    return client.queryContractSmart(marketplaceAddress, {
      list_by_owner: {
        limit,
        start_after,
        owner: owner.toString(),
      },
    })
  }
  const getFloorPrices = async () => {
    return client.queryContractSmart(marketplaceAddress, {
      get_floor_prices: {},
    })
  }

  const getListedOwnerListed = async (owner) => {
    return client.queryContractSmart(marketplaceAddress, {
      get_listed_tokens_by_owner: { owner },
    })
  }

  const updateMarketConfig = async (senderAddress) => {
    const res = await client.execute(
      senderAddress,
      marketplaceAddress,
      {
        update_config: {
          admin: 'juno168ga2aysfxaz6tdd46grweu7zu5nwak5w22nl4',
          allowed_cw20: 'juno147t4fd3tny6hws6rha9xs5gah9qa6g7hrjv9tuvv6ce6m25sy39sq6yv52',
          allowed_native: null,
          collector_addr: 'juno1luw9kspq5dwrqrxgkvfwt443ue99umdaqmm57afg7ms5y0rkz3dsfeudxp',
          fee_percentage: '0.05',
          nft_contract_addr: 'juno102ez6q5vqgh0a56rttvl5hwx2adp7hn2lxnhygm93exkkac6hrkstlh5mw',
        },
      },
      'auto',
    )
    return res.transactionHash
  }

  const listToken = async (senderAddress, tokenId, price, rarity, ovulation, reward) => {
    const txMsg = [
      {
        typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
        value: MsgExecuteContract.fromPartial({
          sender: senderAddress,
          contract: marketplaceAddress,
          msg: toUtf8(
            JSON.stringify({
              list_tokens: {
                tokens: [
                  {
                    id: tokenId.toString(),
                    on_sale: true,
                    owner: senderAddress,
                    price: price * Math.pow(10, 6) + ''.toString(),
                    rarity: rarity.toString(),
                    ovulation_period: ovulation.toString(),
                    daily_reward: reward.toString(),
                  },
                ],
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
          contract: tokenAddress,
          msg: toUtf8(
            JSON.stringify({
              transfer_nft: { recipient: marketplaceAddress + '', token_id: tokenId },
            }),
          ),
          funds: [],
        }),
      },
    ]
    const res = await client.signAndBroadcast(senderAddress, txMsg, 'auto')
    return res.transactionHash
  }

  const delistTokens = async (senderAddress, tokenId) => {
    const res = await client.execute(
      senderAddress,
      marketplaceAddress,
      {
        delist_tokens: {
          tokens: [tokenId.toString()],
        },
      },
      'auto',
    )
    return res.transactionHash
  }

  const updatePrice = async (senderAddress, tokenId, price) => {
    const txMsg = [
      {
        typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
        value: MsgExecuteContract.fromPartial({
          sender: senderAddress,
          contract: marketplaceAddress,
          msg: toUtf8(
            JSON.stringify({
              update_price: {
                price: price * Math.pow(10, 6) + ''.toString(),
                token: tokenId.toString(),
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

  return {
    listToken,
    delistTokens,
    updatePrice,
    getToken,
    getTokenData,
    getAllTokens,
    getMarketplaceConfig,
    getTokensByOwner,
    getListedTokens,
    getTokensByPriceAsc,
    getTokensByPriceDesc,
    getTokensByRarity,
    getListedTokensByOwner,
    getTokensByRarityPriceAsc,
    getTokensByRarityPriceDesc,
    updateMarketConfig,
    getFloorPrices,
    getListedOwnerListed,
    getMarketSize,
  }
}

export default Marketplace

// eslint-disable-next-line
//   const instantiateDragonMarket = async () => {
//     const initMsg = {
//       admin: wallet.address,
//       nft_addr: process.env.REACT_APP_DRAGON_CONTRACT_ADDRESS,
//       allowed_cw20: process.env.REACT_APP_CW20_CONTRACT_ADDRESS,
//       fee_percentage: '0.05',
//       collector_addr: wallet.address,
//     }

//     try {
//       const result = await wallet
//         .getClient()
//         .instantiate(wallet.address, 883, initMsg, 'label', 'auto')
//       console.log('DRAGON market contract address -> ', result)
//       return {
//         contractAddress: result.contractAddress,
//         transactionHash: result.transactionHash,
//       }
//     } catch (err) {
//       console.error(err)
//     }
//   }
