import React, { useEffect } from 'react'

import { Grid, Box, Typography, Tabs, Tab } from '@mui/material'
import { withSnackbar } from 'notistack'
import useStyles from 'styles'
import DashboardItem from './DashboardItem'
import { DRAGON_TYPE_NAMES, CRYSTAL_TYPE_NAME } from '../../util/constants'
import * as COLORS from 'util/ColorUtils'

import crystalContract from '../../contracts/crystal/contract'
import cosmicContract from '../../contracts/cosmic/contract'
import crystalMarket from '../../contracts/crystal-marketplace'
import contract from 'contracts/marketplace/contract'
import { useWallet } from 'contexts/wallet'
import { useContracts } from 'contexts/contract'
import { useState } from 'react'
import Checkbox from '../../components/Checkbox'

const DRAGON_CONTRACT_ADDRESS = process.env.REACT_APP_DRAGON_CONTRACT_ADDRESS
const UPDATED_DRAGON_CONTRACT_ADDRESS = process.env.REACT_APP_UPDATED_DRAGON_CONTRACT_ADDRESS
const CRYSTAL_CONTRACT_ADDRESS = process.env.REACT_APP_EGG_CONTRACT_ADDRESS

const dragonLimit = 5
const crystalLimit = 5

const DRAGON_TABS = [
  { label: 'Genesis', value: 'genesis' },
  { label: 'Season 1', value: 'season_1' },
]

const seasonContracts = {
  genesis: DRAGON_CONTRACT_ADDRESS,
  season_1: UPDATED_DRAGON_CONTRACT_ADDRESS,
}

const activeMarketSeasons = ['genesis']

const Dashboard = () => {
  const classes = useStyles()
  const wallet = useWallet()
  const dragonContract = useContracts().dragon
  const [selectedDragonSeason, setSelectedDragonSeason] = useState('genesis')
  const [selectedCrystalSeason, setSelectedCrystalSeason] = useState('genesis')
  const [dragonKinds, setDragonKinds] = useState(DRAGON_TYPE_NAMES)

  const [dragonKindCounts, setDragonKindCounts] = useState({})
  const [crystalKindCounts, setCrystalKindCounts] = useState({})
  const [cosmicInfo, setCosmicInfo] = useState({ hasStaked: false, hasCosmic: false })

  useEffect(() => {
    const getAndGroupDragons = async () => {
      if (wallet.initialized && dragonContract) {
        const dragon_client = dragonContract?.use(seasonContracts[selectedDragonSeason])
        const drgn_market = contract(wallet.getClient(), false)
        let hasNext = true
        let lastDragonId = '0'
        let dragonList = []
        let hasListedNext = true
        let lastListedDragonId = '0'
        if (dragon_client?.rangeUserDragons && drgn_market.getListedTokensByOwner) {
          while (hasNext) {
            const dragonRes = await dragon_client.rangeUserDragons(
              wallet.address,
              lastDragonId,
              dragonLimit,
            )
            dragonList = [...dragonList, ...dragonRes]
            lastDragonId = dragonRes[dragonRes.length - 1]?.token_id
            if (dragonRes.length < dragonLimit || lastDragonId === undefined) {
              hasNext = false
            }
          }

          while (hasListedNext && activeMarketSeasons.includes(selectedDragonSeason)) {
            const { tokens: listedDragons } = await drgn_market.getListedTokensByOwner(
              dragonLimit,
              lastListedDragonId,
              wallet.address,
            )
            dragonList = [
              ...dragonList,
              ...listedDragons.map((dragon) => ({
                token_id: dragon.id,
                kind: dragon.rarity,
                onSale: dragon.on_sale,
              })),
            ]
            lastListedDragonId = listedDragons[listedDragons.length - 1]?.id
            if (listedDragons.length < dragonLimit || lastListedDragonId === undefined) {
              hasListedNext = false
            }
          }

          dragonList = await Promise.all(
            dragonList.map(async (dragon) => {
              const { is_staked } = await dragon_client.retrieveUserDragons(dragon.token_id)
              return {
                ...dragon,
                onSale: dragon.onSale ? true : false,
                is_staked,
              }
            }),
          )
        }

        const kindCounts = dragonList.reduce((acc, curr) => {
          if (acc[curr.kind]) {
            acc[curr.kind] = {
              totalCount: acc[curr.kind].totalCount + 1,
              stakedCount: curr.is_staked
                ? acc[curr.kind].stakedCount + 1
                : acc[curr.kind].stakedCount,
              onSaleCount: curr.onSale
                ? acc[curr.kind].onSaleCount + 1
                : acc[curr.kind].onSaleCount,
            }
          } else {
            acc[curr.kind] = {
              totalCount: 1,
              stakedCount: curr.is_staked ? 1 : 0,
              onSaleCount: curr.onSale ? 1 : 0,
            }
          }
          return acc
        }, {})
        setDragonKindCounts(kindCounts)
        if (selectedDragonSeason !== 'genesis') {
          setDragonKinds(
            DRAGON_TYPE_NAMES.map((kind) => ({
              ...kind,
              name: kind.name + '+' + selectedDragonSeason.split('_')[1],
            })),
          )
        } else {
          setDragonKinds(DRAGON_TYPE_NAMES)
        }
      }
    }
    if (wallet) {
      getAndGroupDragons()
    }
  }, [wallet, dragonContract, selectedDragonSeason])

  useEffect(() => {
    const getAndGroupUserCrystals = async () => {
      try {
        if (!wallet.initialized) return
        const crystal_client = crystalContract(wallet.getClient())
        const cosmic_client = cosmicContract(wallet.getClient())
        const crystal_market = crystalMarket(wallet.getClient())

        let crystalHasNext = true
        let lastCrystalId = '0'
        let crystalList = []

        let cosmicHasNext = true
        let lastCosmicId = '0'
        let cosmicList = []

        let hasListedNext = true
        let lastListedCrystalId = '0'

        if (
          crystal_client?.rangeUserCrystals &&
          cosmic_client?.queryUserCosmic &&
          crystal_market.getListedTokensByOwner
        ) {
          while (crystalHasNext) {
            const res_crystal = await crystal_client.rangeUserCrystals(
              wallet.address,
              lastCrystalId,
              crystalLimit,
            )
            crystalList = [...crystalList, ...res_crystal]
            lastCrystalId = res_crystal[res_crystal.length - 1]?.token_id
            if (res_crystal.length < crystalLimit) {
              crystalHasNext = false
            }
          }

          const res_cosmic = await cosmic_client.queryUserCosmic(wallet.address)
          cosmicList = [...cosmicList, ...res_cosmic]

          while (hasListedNext && activeMarketSeasons.includes(selectedCrystalSeason)) {
            const { tokens: listedCrystals } = await crystal_market.getListedTokensByOwner(
              crystalLimit,
              lastListedCrystalId,
              wallet.address,
            )
            crystalList = [
              ...crystalList,
              ...listedCrystals.map((crystal) => ({
                token_id: crystal.id,
                kind: crystal.rarity,
                onSale: crystal.on_sale,
              })),
            ]
            lastListedCrystalId = listedCrystals[listedCrystals.length - 1]?.id
            if (listedCrystals.length < crystalLimit || lastListedCrystalId === undefined) {
              hasListedNext = false
            }
          }
        }

        //TODO: Change after crystal market is opened
        const kindCount = crystalList.reduce((acc, curr) => {
          if (acc[curr.kind]) {
            acc[curr.kind] = {
              totalCount: (acc[curr.kind]?.totalCount ?? 0) + 1,
              onSale: curr.onSale ? acc[curr.kind].onSaleCount + 1 : acc[curr.kind].onSaleCount,
              stakedCount: 0,
            }
          } else {
            acc[curr.kind] = {
              totalCount: 1,
              stakedCount: 0,
              onSaleCount: curr.onSale ? 1 : 0,
            }
          }
          return acc
        }, {})
        setCrystalKindCounts(kindCount)
        setCosmicInfo({
          hasStaked: cosmicList.length > 0 && cosmicList.some((cosmic) => cosmic.is_staked),
          hasCosmic: cosmicList.length > 0,
        })
      } catch (e) {
        console.log(e)
      }
    }
    if (wallet) {
      getAndGroupUserCrystals()
    }
    // eslint-disable-next-line
  }, [wallet, crystalContract])

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
              gridTemplateRows: '159px 1fr',
              columnGap: '40px',
              rowGap: '32px',
            }}
          >
            <Grid
              item
              order={1}
              justifyContent="center"
              alignItems="center"
              className={classes.goldBox4}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: 'fit-content',
                  height: '100%',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: '24px',
                }}
              >
                <Typography
                  sx={{
                    fontSize: {
                      lg: '24px',
                      xs: '20px',
                    },
                    lineHeight: '37px',
                    fontWeight: 400,
                    color: 'white',
                  }}
                >
                  Season 1 Cosmic Dragon
                </Typography>
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '16px',
                  }}
                >
                  <Checkbox checked={false} label="Acquired" />
                  <Checkbox checked={false} label="Staked" />
                </Box>
              </Box>
            </Grid>
            <Grid
              item
              order={{ md: 2, xs: 3 }}
              justifyContent="center"
              alignItems="center"
              className={classes.goldBox4}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: 'fit-content',
                  height: '100%',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: '24px',
                }}
              >
                <Typography
                  sx={{
                    fontSize: {
                      lg: '24px',
                      xs: '20px',
                    },
                    lineHeight: '37px',
                    fontWeight: 400,
                    color: 'white',
                  }}
                >
                  Season 1 Cosmic Crystal
                </Typography>
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '16px',
                  }}
                >
                  <Checkbox checked={cosmicInfo.hasCosmic} label="Acquired" />
                  <Checkbox checked={cosmicInfo.hasStaked} label="Staked" />
                </Box>
              </Box>
            </Grid>
            <Grid
              item
              order={{ md: 3, xs: 2 }}
              className={classes.goldBox4}
              sx={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                overflow: 'auto',
              }}
            >
              <Tabs
                indicatorColor="secondary"
                variant="fullWidth"
                sx={{ position: 'sticky', top: 0 }}
              >
                {DRAGON_TABS.map((tab) => (
                  <Tab
                    sx={{
                      color: selectedDragonSeason === tab.value ? COLORS.DARK_YELLOW_1 : 'white',
                      borderBottom: '2px solid',
                      borderColor:
                        selectedDragonSeason === tab.value
                          ? COLORS.SMOOTH_YELLOW_30
                          : 'rgba(255,255,255,.3)',
                      background: 'rgba(20, 20, 20, 1)',
                    }}
                    label={tab.label}
                    value={tab.value}
                    onClick={() => setSelectedDragonSeason(tab.value)}
                  />
                ))}
              </Tabs>
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
                {dragonKinds.map((dragonType) => (
                  <DashboardItem
                    key={dragonType.name}
                    item={dragonType}
                    kindCount={dragonKindCounts}
                  />
                ))}
              </Box>
            </Grid>
            <Grid
              item
              order={4}
              className={classes.goldBox4}
              sx={{
                display: 'flex',
                height: '100%',
                flexDirection: 'column',
                alignItems: 'center',
                overflow: 'auto',
                height: '100%',
                px: 4,
                py: '32px',
                gap: '64px',
              }}
            >
              {CRYSTAL_TYPE_NAME.map((crystalType) => (
                <DashboardItem
                  key={crystalType.name}
                  item={crystalType}
                  kindCount={crystalKindCounts}
                  type="crystals"
                  showStaked={false}
                />
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default withSnackbar(Dashboard)

/*

          <Box
            className={classes.goldBox4}
            sx={{
              width: '100%',
              paddingY: { xs: 0, lg: 3 },
              paddingX: { xs: 0, lg: 3 },
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
            }}
          >
            <Typography
              sx={{
                marginBottom: 3,
                fontSize: '24px',
                lineHeight: '37px',
                fontWeight: 400,
                color: 'white',
              }}
            >
              Dragon Dashboard
            </Typography>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                scale: { xl: '100%', lg: '90%', md: '60%', xs: '50%' },
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <DashboardItem
                  key={DRAGON_TYPE_NAMES[0].name}
                  dragonInfo={DRAGON_TYPE_NAMES[0]}
                  dragonKindCounts={dragonKindCounts}
                />
                <DashboardItem
                  key={DRAGON_TYPE_NAMES[1].name}
                  dragonInfo={DRAGON_TYPE_NAMES[1]}
                  dragonKindCounts={dragonKindCounts}
                />
                <DashboardItem
                  key={DRAGON_TYPE_NAMES[2].name}
                  dragonInfo={DRAGON_TYPE_NAMES[2]}
                  dragonKindCounts={dragonKindCounts}
                />
              </Box>
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: 10,
                }}
              >
                <DashboardItem
                  key={DRAGON_TYPE_NAMES[3].name}
                  dragonInfo={DRAGON_TYPE_NAMES[3]}
                  dragonKindCounts={dragonKindCounts}
                />
                <DashboardItem
                  key={DRAGON_TYPE_NAMES[4].name}
                  dragonInfo={DRAGON_TYPE_NAMES[4]}
                  dragonKindCounts={dragonKindCounts}
                />
              </Box>
            </Box>
          </Box>

 */
