/* import React, { useEffect, useState } from 'react'
import { Grid, Typography, Stack } from '@mui/material'
import useStyles from 'styles'

import { CustomOutlinedButton } from 'components/Button'
import { CustomOutlinedLabel } from 'components/Label'

import { useWallet } from 'contexts/wallet'
import { useContracts } from 'contexts/contract'
import OfflineQuery from 'contracts/egg-mint/offlineQuery.js'
import { FormatDoubleValue } from 'util/FormatNumber'
import { DenomPipe } from 'util/Pipes'
import EggGIF from 'assets/eggs.gif.mp4'
import { fetchWithToast, showFailToast, showInsufficientFailToast } from '../../util/FetchUtil'
//import cosmicContract from '../../contracts/cosmic/contract'

const Eggsale = () => {
  const classes = useStyles()
  const wallet = useWallet()
  const minterContract = useContracts().minter
  const dragonContract = useContracts().dragon

  const [totalSize, setTotalSize] = useState(0)
  const [ownedSize, setOwnedSize] = useState(0)
  const [price, setPrice] = useState(0)
  const [refresh, setRefresh] = useState(false)

  const MINTER = process.env.REACT_APP_MINTER_CONTRACT_ADDRESS
  const DRAGON = process.env.REACT_APP_DRAGON_CONTRACT_ADDRESS

  //   const minter = 'juno1m5yvjl5wesgexqulhvxak9k7y4xuagm3xxw8aar25y6gx3t9vz3qkxhq3c'
  //   const updated_dragon = 'juno1fcresq244kksmletp30nmsmrx847mla93vls7zszv8zs5haam8qskw7363'
  //   const update_reward = 'juno1shsrjqjddeje3dcdq4fmkjmg5e6megcg26zg5m38uylysan76t8sxclvmu'

  //   const instantiateMinterContract = async () => {
  //     const initMsg = {
  //       drgn_contract: process.env.REACT_APP_CW20_CONTRACT_ADDRESS,
  //       allowed_cw20: process.env.REACT_APP_RAC_CONTRACT_ADDRESS,
  //       allowed_operators: [wallet.address],
  //       random_key: 38861,
  //       drgn_rac: '237',
  //       season: '1',
  //       dragon: DRAGON,
  //       updated_dragon: '',
  //       egg_minter: MINTER,
  //       drgn_recipient: process.env.REACT_APP_MULTISIG_CONTRACT_ADDRESS,
  //       cw20_recipient: process.env.REACT_APP_RAC_RECIPIENT_CONTRACT_ADDRESS,
  //     }
  //     try {
  //       const result = await wallet
  //         .getClient()
  //         .instantiate(wallet.address, 1211, initMsg, 'label', 'auto')
  //       console.log('MINTER CONTRACT -> ', result)
  //     } catch (err) {
  //       console.error(err)
  //     }
  //   }

  //   const instantiateDragonUpdateContract = async () => {
  //     const initMsg = {
  //       base: {
  //         name: 'StakeDragonUpdate S1',
  //         symbol: 'DRGN-S1',
  //         minter,
  //       },
  //       size: '2000',
  //       base_price: '2000',
  //       reward_contract_address: '',
  //     }
  //     try {
  //       const result = await wallet
  //         .getClient()
  //         .instantiate(wallet.address, 1210, initMsg, 'label', 'auto')
  //       console.log('DRAGON CONTRACT -> ', result)
  //     } catch (err) {
  //       console.error(err)
  //     }
  //   }

  //   const instantiateDragonUpgradeReward = async () => {
  //     const initMsg = {
  //       admin: process.env.REACT_APP_MULTISIG_CONTRACT_ADDRESS,
  //       dragon_contract: updated_dragon,
  //       cw20_contract: process.env.REACT_APP_CW20_CONTRACT_ADDRESS,
  //     }
  //     try {
  //       const result = await wallet
  //         .getClient()
  //         .instantiate(wallet.address, 1083, initMsg, 'label', 'auto')
  //       console.log('DRAGON UPDATE REWARD CONTRACT -> ', result)
  //     } catch (err) {
  //       console.error(err)
  //     }
  //   }

  //   const updateNewDragonReward = async () => {
  //     const msg = {
  //       update_reward_contract_address: {
  //         new_address: update_reward,
  //       },
  //     }
  //     const res = await wallet.getClient().execute(wallet.address, updated_dragon, msg, 'auto')
  //     console.log(res)
  //   }
  //   const editMinterContracts = async () => {
  //     const msg = {
  //       edit_contracts: {
  //         dragon: DRAGON,
  //         updated_dragon,
  //         egg_minter: MINTER,
  //         drgn_recipient: process.env.REACT_APP_MULTISIG_CONTRACT_ADDRESS,
  //         cw20_recipient: process.env.REACT_APP_RAC_RECIPIENT_CONTRACT_ADDRESS,
  //       },
  //     }
  //     const res = await wallet.getClient().execute(wallet.address, minter, msg, 'auto')
  //     console.log(res)
  //   }

  //   const editOldMinterState = async () => {
  //     const msg = {
  //       edit_state: {
  //         new_owner: minter,
  //         base_price: '5000000',
  //         hatch_price: '15000000',
  //         random_key: 79235,
  //         egg_sale_size: '2000',
  //         allowed_cw20: process.env.REACT_APP_CW20_CONTRACT_ADDRESS,
  //       },
  //     }
  //     const res = await wallet.getClient().execute(wallet.address, MINTER, msg, 'auto')
  //     console.log(res)
  //   }

  //   const increaseAllowance = async () => {
  //     try {
  //       let msg = {
  //         increase_allowance: {
  //           spender: update_reward,
  //           amount: '10000000',
  //         },
  //       }
  //       const res = await wallet
  //         .getClient()
  //         .execute(wallet.address, process.env.REACT_APP_CW20_CONTRACT_ADDRESS, msg, 'auto')
  //       console.log(res)
  //     } catch (err) {
  //       console.log(err)
  //     }
  //   }

  //   const editUnstakeTime = async () => {
  //     try {
  //       const msg = {
  //         update_min_stake_time: {
  //           time: '0',
  //         },
  //       }
  //       const res = await wallet.getClient().execute(wallet.address, updated_dragon, msg, 'auto')
  //       console.log(res)
  //     } catch (err) {
  //       console.log(err)
  //     }
  //   }

  const mint = async () => {
    try {
      if (!wallet.initialized || !minterContract) return

      const minterClient = minterContract.use(MINTER)

      await fetchWithToast(minterClient.mintEgg(wallet.address, price))

      await setRefresh(true)
      wallet.refreshBalance()
    } catch (err) {
      showInsufficientFailToast(err.message, 'JUNO')
    }
  }

  useEffect(() => {
    const offline = async () => {
      try {
        const res = await OfflineQuery()
        setPrice(res.base_price)
        setTotalSize(res.size)
        setOwnedSize(res.owned_eggsale)
      } catch (e) {}
    }
    const query = async () => {
      try {
        let minterClient = minterContract?.use(MINTER)
        let res = await minterClient.getEggsaleInfo()
        setPrice(res.base_price)
        setTotalSize(res.size)
        setOwnedSize(res.owned_eggsale)
        setRefresh(false)
      } catch (e) {}
    }
    if (wallet.initialized && minterContract) {
      query()
    } else {
      offline()
    }
  }, [wallet, refresh, minterContract, MINTER])

  return (
    <Grid container className={classes.pageContainer}>
      <Grid item xs={12} md={4} sx={{ marginX: { xs: 0, md: 5 } }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: '100%',
            height: 'auto',
          }}
          className={classes.goldBox4}
        >
          <source src={EggGIF} type="video/mp4" />
        </video>
      </Grid>

      <Grid
        item
        xs={12}
        md={7}
        className={classes.goldBox4}
        sx={{
          justifyContent: 'center',
          height: 'auto',
        }}
      >
        <Grid
          container
          sx={{ width: '100%', display: 'flex', justifyContent: 'space-around', paddingTop: 4 }}
        >
          <CustomOutlinedLabel
            title="Number of Eggs"
            amount={totalSize}
            styles={{ width: '150px' }}
          />

          <CustomOutlinedLabel
            title="Purchase Percent"
            amount={!ownedSize ? 0 : FormatDoubleValue((ownedSize / totalSize) * 100)}
            unit="%"
            styles={{ width: '150px' }}
          />

          <CustomOutlinedLabel
            title="Price"
            amount={!price ? 0 : DenomPipe(price)}
            unit="Juno"
            styles={{ width: '150px' }}
          />
        </Grid>

        <Stack direction="column" sx={{ alignItems: 'center' }} marginTop={{ xs: 4, md: 14 }} marginBottom={{ xs: 2, md: 10 }}>
          <Typography className={classes.h3}>No Eggs Left</Typography>
        </Stack>
      </Grid>
    </Grid>
  )
}

export default Eggsale
 */