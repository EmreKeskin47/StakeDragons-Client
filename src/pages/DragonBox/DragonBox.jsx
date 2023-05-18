import React, { useEffect, useState } from 'react'
import useStyles from 'styles'

import { Grid, Box } from '@mui/material'
import DragonBoxGIF from 'assets/dragonbox.gif.mp4'
import CustomOutlinedLabel from 'components/Label/CustomOutlinedLabel'
import { CustomOutlinedButton } from 'components/Button'
import { DenomPipe } from 'util/Pipes'
import { useWallet } from 'contexts/wallet'

import contract from 'contracts/box-minter/contract'
import cw20DRGN from 'contracts/cw20-drgn'
import boxContract from 'contracts/dragon-box/contract'
import { fetchWithToast, showFailToast } from '../../util/FetchUtil'

const DragonBox = () => {
  const classes = useStyles()
  const wallet = useWallet()

  //const [ownedList, setOwnedList] = useState([])
  const [selectedItem, setSelectedItem] = useState('')

  const [totalSize, setTotalSize] = useState(0)
  const [openedSize, setOpenedSize] = useState(0)

  const [price, setPrice] = useState(0)
  const [openPrice, setOpenPrice] = useState(0)
  const [refresh, setRefresh] = useState(false)

  const mint = async () => {
    try {
      if (!wallet.initialized || !contract) return

      const minterClient = contract(wallet.getClient())
      await fetchWithToast(minterClient.mintBox(wallet.address, price))

      await setRefresh(true)
      wallet.refreshBalance()
    } catch (err) {
      showFailToast('Transaction Failed', 'Transaction Rejected')
    }
  }

  const editState = async () => {
    try {
      const minterClient = contract(wallet.getClient())
      const res = minterClient.editState(wallet.address)
      console.log(res)
    } catch (e) {
      console.log(e)
    }
  }

  const openBox = async () => {
    try {
      if (!wallet.initialized || !contract || !boxContract) return
      // eslint-disable-next-line
      if (openPrice == 0) {
        const minterClient = contract(wallet.getClient())

        await fetchWithToast(minterClient.openBoxFree(wallet.address, selectedItem))
      } else {
        const client = cw20DRGN(wallet.getClient())
        await fetchWithToast(client.sendCw20OpenBox(wallet.address, openPrice, selectedItem))
      }

      await setRefresh(true)
      wallet.refreshBalance()
    } catch (err) {
      showFailToast('Transaction Failed', 'Transaction Rejected')
    }
  }

  useEffect(() => {
    const query = async () => {
      try {
        let boxClient = boxContract(wallet.getClient())
        const res = await boxClient.getTokens(wallet.address, null, 30)
        await setSelectedItem(res[res.length - 1])

        let minterClient = contract(wallet.getClient())
        let res2 = await minterClient.getBoxListInfo()
        await setPrice(res2.base_price)
        await setOpenPrice(res2.open_price)
        await setTotalSize(res2.total)
        await setOpenedSize(res.length)
        await setRefresh(false)
      } catch (e) { }
    }
    if (wallet.initialized && contract) {
      query()
    }
  }, [wallet, refresh])

  return (
    <Grid
      container
      className={classes.pageContainer}
      sx={{ py: { lg: 0, xs: 3 }, gap: { lg: 0, xs: 8 }, position: 'relative' }}
    >

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
          <source src={DragonBoxGIF} type="video/mp4" />
        </video>
      </Grid>

      <Grid
        item
        xs={12}
        md={7}
        sx={{
          justifyContent: 'center',
          height: 'auto',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 12, flexGrow: 1 }}>
          <Box
            className={classes.goldBox4}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              px: '32px',
              py: '40px',
              gap: '40px',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: { md: 'row', xs: 'column' },
                justifyContent: 'space-between',
                gap: '12vw',
              }}
            >
              <CustomOutlinedLabel
                title="Total Sold Boxes"
                amount={totalSize}
                styles={{ width: { sx: '100%' }, flex: '1 1 0' }}
              />
              <CustomOutlinedLabel
                title="Box Price"
                amount={DenomPipe(price) + ' Juno'}
                styles={{ width: { sx: '100%' }, flex: '1 1 0' }}
              />
            </Box>
            <CustomOutlinedButton
              title="Purchase"
              styles={{ width: '12vw', marginY: 1, paddingY: '10px', marginX: 'auto' }}
              onClick={mint}
            />
          </Box>
          <Box
            className={classes.goldBox4}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              px: '32px',
              py: '40px',
              gap: '40px',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: { md: 'row', xs: 'column' },
                gap: '12vw',
              }}
            >
              <CustomOutlinedLabel
                title="My Boxes"
                amount={openedSize}
                styles={{ width: { sx: '100%' }, flex: '1 1 0' }}
              />
              <CustomOutlinedLabel
                title="Box Opening Price"
                amount={DenomPipe(openPrice) + ' DRGN'}
                styles={{ width: { sx: '100%' }, flex: '1 1 0' }}
              />
            </Box>
            <CustomOutlinedButton
              title="Open"
              styles={{ width: '12vw', marginY: 1, paddingY: '10px' }}
              onClick={openBox}
            />
          </Box>
        </Box>
      </Grid>
    </Grid>
  )
}

export default DragonBox
