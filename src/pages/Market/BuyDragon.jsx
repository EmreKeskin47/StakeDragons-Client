import React, { useEffect, useState } from 'react'
import { Box, Grid, Typography, Stack } from '@mui/material'
import { useHistory, useLocation } from 'react-router'

import { CustomOutlinedButton } from 'components/Button'
import { CustomOutlinedLabel } from 'components/Label'
import { DayCountDown } from 'components/Countdown'
import DragonBox from 'components/DragonBox/DragonBox'

import BuyIcon from 'assets/market/buy.svg'
import * as COLORS from 'util/ColorUtils'
import useStyles from 'styles'

import { useWallet } from 'contexts/wallet'
import contract from 'contracts/marketplace/contract'
import { fetchWithToast, showFailToast, showInsufficientFailToast } from '../../util/FetchUtil'
import cw20DRGN from 'contracts/cw20-drgn'
import { DenomPipe } from '../../util/Pipes'

const BuyDragon = () => {
  const classes = useStyles()
  const wallet = useWallet()
  const location = useLocation()
  const history = useHistory()

  const [id, setId] = useState('')
  const [price, setPrice] = useState('')
  const [rarity, setRarity] = useState('')
  const [owner, setOwner] = useState('')
  const [ovulation, setOvulation] = useState('')
  const [dailyReward, setDailyReward] = useState('')

  useEffect(() => {
    const getPrice = async () => {
      try {
        if (!wallet.initialized || !contract || id === '') return

        const client = contract(wallet.getClient(), false)
        let res = await client.getToken(id)
        // console.log("dragon buy res is")
        // console.log(res)
        let nftInfo = await client.getTokenData(id)
        if (nftInfo.info.extension) {
          let extension = nftInfo.info.extension
          await setRarity(extension.attributes[0].value)
          await setOvulation(extension.attributes[1].value)
          await setDailyReward(extension.attributes[2].value)
        }
        let res2 = await client.getToken(id)
        if (res2.token) {
          setOwner(res2.token.owner)
        }
        // console.log("res2 is")
        // console.log(res2)
        await setPrice(res.token.price)
      } catch (err) {
        console.error(err)
      }
    }
    setId(location.pathname.slice(12, location.pathname.length))
    getPrice()
  }, [id, location.pathname, wallet])

  const buyOnClick = async () => {
    try {
      if (!wallet || !contract) return
      if (owner !== '' && wallet.address === owner) {
        showFailToast('Transaction Failed', 'Dragon is already yours')
      } else {
        const client = cw20DRGN(wallet.getClient())
        await fetchWithToast(client.buyFromMarket(wallet.address, id, price, 2))
        wallet.refreshBalance()
        history.push('/market')
      }
    } catch (err) {
      showInsufficientFailToast(err.message)
    }
  }

  return (
    <Grid container direction={'row'} spacing={4} className={classes.pageContainer}>
      <Grid item xs={12} md={5}>
        <DragonBox styles={{ paddingY: 12 }} dragonType={rarity} />
      </Grid>

      <Grid item xs={12} md={7}>
        <Typography className={classes.h4} sx={{ textTransform: 'capitalize' }}>
          {rarity + ' Dragon'}
        </Typography>
        <Box marginY={2}>
          <Box className={classes.goldBox4} py={1} px={2}>
            <Typography className={classes.h2}>Dragon Info</Typography>
            <Stack direction="row" justifyContent="center" spacing={4} marginTop={5}>
              <CustomOutlinedLabel
                title="Rarity"
                amount={rarity}
                styles={{ width: '250px', textTransform: 'capitalize' }}
              />

              <CustomOutlinedLabel
                title="Daily (DRGN) Reward Amount"
                amount={dailyReward}
                unit="DRGN"
                styles={{ width: '250px' }}
              />
            </Stack>

            <Box
              sx={{
                marginY: 2,
                display: { lg: 'flex', xs: 'block' },
                justifyContent: 'center',
                flexDirection: 'column',
              }}
            >
              <Box marginX={2}>
                <DayCountDown title={'Ovulation Period:'} day={ovulation} />
              </Box>
            </Box>
          </Box>
        </Box>

        <Box display={'flex'}>
          <Typography className={classes.h5Grey}>Price:</Typography>
          <Typography className={classes.h5} marginX={2}>
            {DenomPipe(price) + ' DRGN'}
          </Typography>
        </Box>

        <CustomOutlinedButton
          title="Buy Now"
          styles={{ width: '100%', marginTop: 4, background: COLORS.DARK_YELLOW_1 }}
          img={BuyIcon}
          onClick={() => buyOnClick()}
        />
      </Grid>
    </Grid>
  )
}

export default BuyDragon
