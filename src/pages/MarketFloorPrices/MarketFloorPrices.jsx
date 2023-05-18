import React, { useState, useEffect } from 'react'

import { Grid, Box, Typography, Tabs, Tab } from '@mui/material'
import useStyles from 'styles'
import { DRAGON_TYPE_NAMES, CRYSTAL_TYPE_NAME } from '../../util/constants'
import * as COLORS from 'util/ColorUtils'

import contract from 'contracts/marketplace/contract'
import crystalMarket from 'contracts/crystal-marketplace'
import { useWallet } from 'contexts/wallet'
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import FloorPriceItem from './FloorPriceItem'

const MarketFloorPrices = () => {
  const classes = useStyles()
  const wallet = useWallet()

  const [eggFloorPrice, setEggFloorPrice] = useState(0)
  const [dragonFloorPrices, setDragonFloorPrices] = useState({})
  const [crystalFloorPrices, setCrystalFloorPrices] = useState({})

  const loadDragonFloorPrices = async () => {
    try {
      if (contract) {
        let client
        if (wallet.initialized) {
          client = contract(wallet.getClient(), false)
        } else {
          let offline = await CosmWasmClient.connect('https://rpc-juno.mib.tech/')
          client = contract(offline, false)
        }

        let res = await client.getFloorPrices()
        setDragonFloorPrices(res)
      }
    } catch (e) { }
  }

  const loadEggFloorPrice = async () => {
    try {
      if (contract) {
        let client;
        if (wallet.initialized) {
          client = contract(wallet.getClient(), true)
        }
        else {
          let offline = await CosmWasmClient.connect('https://rpc-juno.mib.tech/')
          client = contract(offline, true)
        }
        const res = await client.getTokensByPriceDesc(1, '0')
        setEggFloorPrice(parseInt(res.tokens?.[0]?.price ?? 0) / 1000000)
      }
    } catch (e) { }
  }

  const loadCrystalFloorPrices = async () => {
    try {
      if (crystalMarket) {
        let crystal_client;
        if (wallet.initialized) {
          crystal_client = crystalMarket(wallet.getClient())
        }
        else {
          let offline = await CosmWasmClient.connect('https://rpc-juno.mib.tech/')
          crystal_client = crystalMarket(offline)
        }
        const floorPrices = await Promise.all(CRYSTAL_TYPE_NAME.map(async (crystalType) => {
          const res = await crystal_client.getTokensByRarityPriceDesc(1, null, [crystalType.name]);
          return res.tokens?.[0];
        }))
        const floorPricesFormatted = floorPrices.reduce((acc, curr) => ({
          ...acc,
          [curr.rarity]: curr.price
        }), {})
        setCrystalFloorPrices(floorPricesFormatted)
      }
    } catch (e) { }
  }

  useEffect(() => {
    loadDragonFloorPrices()
    loadEggFloorPrice()
    loadCrystalFloorPrices()
  }, [wallet])

  return (
    <Grid container className={classes.pageContainer}>
      <Grid
        item
        xs={12}
        sx={{ textAlign: '-webkit-center', height: { md: '100%', xs: 'auto' }, zIndex: 100 }}
      >
        <Grid
          item
          xs={12}
          lg={8}
          style={{ maxWidth: '90%' }}
          sx={{ height: { md: '100%', xs: 'auto' } }}
        >
          <Grid
            container
            sx={{
              display: 'grid',
              height: '100%',
              gridTemplateColumns: { md: '1fr 1fr', xs: '1fr' },
              gridTemplateRows: 'auto auto 1fr',
              columnGap: '40px',
              rowGap: '32px',
            }}
          >
            <Grid
              item
              sx={{ gridColumn: { md: 'span 2', xs: 'span 1' } }}
              justifyContent="center"
              alignItems="center"
            >
              <Typography
                sx={{
                  fontSize: {
                    lg: '32px',
                    xs: '24px',
                  },
                  lineHeight: '46px',
                  fontWeight: 500,
                  color: 'white',
                }}
              >
                Marketplace Floor Prices
              </Typography>
            </Grid>
            <Grid
              item
              sx={{ gridColumn: { md: 'span 2', xs: 'span 1' } }}
              justifyContent="center"
              alignItems="center"
            >
              <Box sx={{ display: 'flex', gap: '16px', justifyContent: 'center', mx: 'auto', px: '56px', py: '24px', width: { md: 'fit-content', xs: '100%' } }} className={classes.goldBox4}>
                <Typography
                  sx={{
                    fontSize: {
                      lg: '24px',
                      xs: '20px',
                    },
                    lineHeight: '37px',
                    fontWeight: 400,
                    color: COLORS.SECONDARY_TEXT_GREY
                  }}
                >
                  Dragon Egg Marketplace Floor Price:
                </Typography>
                <Typography
                  sx={{
                    fontSize: {
                      lg: '24px',
                      xs: '20px',
                    },
                    lineHeight: '37px',
                    fontWeight: 400,
                    color: 'white'
                  }}
                >
                  {eggFloorPrice} DRGN
                </Typography>
              </Box>
            </Grid>
            <Grid
              item
              className={classes.goldBox4}
              sx={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                overflow: 'auto',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flexGrow: 1,
                  px: 4,
                  py: '32px',
                  gap: '64px',
                }}
              >
                {
                  DRAGON_TYPE_NAMES.map(dragonType => <FloorPriceItem item={dragonType} floorPrices={dragonFloorPrices} />)
                }
              </Box>
            </Grid>
            <Grid
              item
              className={classes.goldBox4}
              sx={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                overflow: 'auto',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flexGrow: 1,
                  px: 4,
                  py: '32px',
                  gap: '64px',
                }}
              >
                {
                  CRYSTAL_TYPE_NAME.map(crystalType => <FloorPriceItem item={crystalType} floorPrices={crystalFloorPrices} postfix='Crystal' />)
                }
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default MarketFloorPrices
