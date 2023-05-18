import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router'
import { Box, Grid, Typography } from '@mui/material'
import useStyles from 'styles'

import { CustomOutlinedButton } from 'components/Button'

import { useWallet } from 'contexts/wallet'
import contract from 'contracts/marketplace/contract'
import cw20DRGN from 'contracts/cw20-drgn'
import { DenomPipe } from '../../util/Pipes'

import { fetchWithToast, showFailToast } from '../../util/FetchUtil'
import { getImageUrl } from 'util/ImageUrl'
import * as COLORS from 'util/ColorUtils'
import BuyIcon from 'assets/market/buy.svg'

const BuyEgg = () => {
  const classes = useStyles()
  const wallet = useWallet()
  const location = useLocation()
  const history = useHistory()

  const [id, setId] = useState('')
  const [image, setImage] = useState('')
  const [price, setPrice] = useState('')
  const [owner, setOwner] = useState('')

  useEffect(() => {
    const getPrice = async () => {
      console.log(id)
      try {
        if (!wallet.initialized || !contract) return
        const client = contract(wallet.getClient(), true)
        let res2 = await client.getToken(id)
        setPrice(res2.token.price)
        let res = await client.getTokenData(id)

        setImage(res.info.extension.image)

        if (res2.token) {
          setOwner(res2.token.owner)
        }
      } catch (err) {
        console.log(err)
      }
    }
    setId(location.pathname.slice(9, location.pathname.length))
    getPrice()
  }, [id, location.pathname, wallet])

  const buyOnClick = async () => {
    try {
      if (!wallet.initialized || !contract) return
      if (owner !== '' && wallet.address === owner) {
        showFailToast('Transaction Failed', 'Egg is already yours')
      } else {
        const client = cw20DRGN(wallet.getClient())
        await fetchWithToast(client.buyFromMarket(wallet.address, id, price, 1))
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
        <Typography className={classes.h4}>Mysterious Dragon Egg</Typography>
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

export default BuyEgg
