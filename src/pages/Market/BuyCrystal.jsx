import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router'
import { Box, Grid, Typography } from '@mui/material'
import useStyles from 'styles'

import { CustomOutlinedButton } from 'components/Button'

import { useWallet } from 'contexts/wallet'
import contract from 'contracts/marketplace/contract'
import cw20DRGN from 'contracts/cw20-drgn'

import { fetchWithToast, showFailToast } from '../../util/FetchUtil'
import * as COLORS from 'util/ColorUtils'
import BuyIcon from 'assets/market/buy.svg'
import crystalMarket from '../../contracts/crystal-marketplace'

import Divine from 'assets/crystal/Divine.png'
import Fire from 'assets/crystal/Fire.png'
import Storm from 'assets/crystal/Storm.png'
import Ice from 'assets/crystal/Ice.png'
import Udin from 'assets/crystal/Udin.png'
import { DenomPipe } from '../../util/Pipes'

const BuyCrystal = () => {
  const classes = useStyles()
  const wallet = useWallet()
  const location = useLocation()
  const history = useHistory()

  const [id, setId] = useState('')
  const [image, setImage] = useState('')
  const [price, setPrice] = useState('')
  const [owner, setOwner] = useState('')
  const [rarity, setRarity] = useState('')

  useEffect(() => {
    const getPrice = async () => {
      try {
        if (!wallet.initialized || !crystalMarket || id === '') return
        const client = crystalMarket(wallet.getClient())
        let res = await client.getToken(id)
        await setPrice(res.token.price)

        if (res.token) {
          switch (res.token.rarity) {
            case 'udin':
              setImage(Udin)
              setRarity('Idunn ')
              break
            case 'storm':
              setImage(Storm)
              setRarity('Storm ')
              break
            case 'ice':
              setRarity('Ice ')
              setImage(Ice)
              break
            case 'fire':
              setRarity('Fire ')
              setImage(Fire)
              break
            case 'divine':
              setRarity('Divine ')
              setImage(Divine)
              break
            default:
              setRarity('Fire ')
              setImage(Fire)
          }
        }
        let res2 = await client.getToken(id)
        if (res2.token) {
          setOwner(res2.token.owner)
        }
      } catch (err) {
        console.log(err)
      }
    }
    setId(location.pathname.slice(13, location.pathname.length))
    getPrice()
  }, [id, location.pathname, wallet, rarity])

  const buyOnClick = async () => {
    try {
      if (!wallet.initialized || !contract) return
      if (owner !== '' && wallet.address === owner) {
        showFailToast('Transaction Failed', 'Crystal is already yours')
      } else {
        const client = cw20DRGN(wallet.getClient())
        await fetchWithToast(client.buyFromMarket(wallet.address, id, price, 3))
        wallet.refreshBalance()
        history.push('/market')
      }
    } catch (err) {
      showFailToast('Transaction Failed', 'Transaction Rejected')
      console.error(err)
    }
  }

  return (
    <Grid container direction={'row'} spacing={{ xs: 2, md: 10 }} className={classes.pageContainer}>
      <Grid item xs={12} md={5}>
        <Box className={classes.goldBox4}>
          <img src={image} alt="Egg Svg" width={'100%'} height={'auto'} />
        </Box>
      </Grid>

      <Grid item xs={12} md={5}>
        <Typography className={classes.h4}>{rarity + ' Crystal'} </Typography>
        <Box display={'flex'} marginY={5}>
          <Typography className={classes.h5Grey}>Price:</Typography>
          <Typography className={classes.h5} marginX={2}>
            {DenomPipe(price) + ' DRGN'}
          </Typography>
        </Box>

        <CustomOutlinedButton
          title="Buy Now"
          styles={{
            width: { xs: '140px', md: '12vw' },
            padding: 2,
            background: COLORS.DARK_YELLOW_1,
          }}
          img={BuyIcon}
          onClick={() => buyOnClick()}
        />
      </Grid>
    </Grid>
  )
}

export default BuyCrystal
