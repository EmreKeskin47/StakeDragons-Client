import React, { useEffect, useState } from 'react'
import { Box, Stack, Grid, Typography } from '@mui/material'

import { CustomOutlinedButton } from 'components/Button'
import { CustomOutlinedLabel } from 'components/Label'
import NoDragon from './NoDragon'
import OvulationCountDown from '../../components/Countdown/OvulationCountDown'
import StakeDragonCard from '../../components/Stake/StakeDragonCard'

import useStyles from 'styles'
import { useWallet } from 'contexts/wallet'
import { useContracts } from 'contexts/contract'
import { useRef } from 'react'
import useOnScreen from '../../hooks/useOnScreen'
import { fetchWithToast, showFailToast } from '../../util/FetchUtil'

const dragonLimit = 5

const Stake = () => {
  const classes = useStyles()
  const wallet = useWallet()
  const contract = useContracts().dragon
  const DRAGON_CONTRACT_ADDRESS = process.env.REACT_APP_DRAGON_CONTRACT_ADDRESS
  const UPDATED_DRAGON_CONTRACT_ADDRESS = process.env.REACT_APP_UPDATED_DRAGON_CONTRACT_ADDRESS

  const [error, setError] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [ownedDragonList, setOwnedDragonList] = useState([])
  const [ownedNewDragonList, setOwnedNewDragonList] = useState([])
  const [selectedDragon, setSelectedDragon] = useState(undefined)
  const [displayDragon, setDisplayDragon] = useState({})
  // eslint-disable-next-line
  const [display, setDisplay] = useState(false)
  const [reward, setReward] = useState(0)
  const [ovulationTimer, setOvulationTimer] = useState([0, 0, 0])
  const [hasEggs, setHasEggs] = useState('0 Dragon Egg')
  const [noDragon, setNoDragon] = useState(false)
  const [claimAllFlag, setClaimAllFlag] = useState(false)

  const loadMoreRef = useRef(null)
  const loadMoreVisible = useOnScreen(loadMoreRef)
  const [isFetching, setIsFetching] = useState(false)
  const [hasNext, setHasNext] = useState(false)

  const [windowHeight, setWindowHeight] = useState(window.innerHeight)

  useEffect(() => {
    function handleResize() {
      setWindowHeight(window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const stake = async () => {
    try {
      if (!wallet || !contract || !selectedDragon) return
      const client = contract.use(
        selectedDragon.isNewDragon ? UPDATED_DRAGON_CONTRACT_ADDRESS : DRAGON_CONTRACT_ADDRESS,
      )
      await fetchWithToast(client.stakeDragon(wallet.address, selectedDragon.token_id))
      setRefresh(true)
    } catch (err) {
      showFailToast('Transaction Failed', 'Transaction Rejected')
    }
  }

  const unstake = async () => {
    try {
      if (!wallet || !contract || !selectedDragon) return
      const client = contract.use(
        selectedDragon.isNewDragon ? UPDATED_DRAGON_CONTRACT_ADDRESS : DRAGON_CONTRACT_ADDRESS,
      )
      await fetchWithToast(client.unstake(wallet.address, selectedDragon.token_id))
      setRefresh(true)
      setDisplayDragon(displayDragon)
    } catch (err) {
      showFailToast('Transaction Failed', 'Transaction Rejected')
    }
  }

  const unstakeOverride = async () => {
    try {
      if (!wallet || !contract || !selectedDragon) return
      const client = contract.use(
        selectedDragon.isNewDragon ? UPDATED_DRAGON_CONTRACT_ADDRESS : DRAGON_CONTRACT_ADDRESS,
      )

      await fetchWithToast(client.unstakeOverride(wallet.address, selectedDragon.token_id))
      wallet.refreshBalance()
      setRefresh(true)
      setDisplayDragon(displayDragon)
    } catch (err) {
      showFailToast('Transaction Failed', 'Transaction Rejected')
    }
  }

  const calculateReward = async (token_id, isNewDragon) => {
    try {
      if (!wallet || !contract) return
      const client = contract.use(
        isNewDragon ? UPDATED_DRAGON_CONTRACT_ADDRESS : DRAGON_CONTRACT_ADDRESS,
      )
      const dragon = await retrieveDragon(token_id, isNewDragon)
      if (!dragon.is_staked) {
        setReward(0)
      } else {
        const res = await client.calculateReward(token_id)
        setReward((res / 1000000).toFixed(2))
      }
    } catch (err) {}
  }

  const claimReward = async () => {
    try {
      if (!wallet || !contract || !selectedDragon) return
      const client = contract.use(
        selectedDragon.isNewDragon ? UPDATED_DRAGON_CONTRACT_ADDRESS : DRAGON_CONTRACT_ADDRESS,
      )
      await fetchWithToast(client.claimReward(wallet.address, selectedDragon.token_id))
      setRefresh(true)
      wallet.refreshBalance()
    } catch (err) {
      showFailToast('Transaction Failed', 'Transaction Rejected')
    }
  }

  const claimAllRewards = async () => {
    setClaimAllFlag(true)
    try {
      if (!wallet || !contract) return
      const client = contract.use(DRAGON_CONTRACT_ADDRESS)
      await fetchWithToast(client.claimAll(wallet.address))
      setRefresh(true)
      wallet.refreshBalance()
    } catch (err) {
      showFailToast('Transaction Failed', 'Transaction Rejected')
    }
    setClaimAllFlag(false)
  }

  const hatch = async () => {
    try {
      if (!wallet || !contract || !selectedDragon) return
      const client = contract.use(
        selectedDragon.isNewDragon ? UPDATED_DRAGON_CONTRACT_ADDRESS : DRAGON_CONTRACT_ADDRESS,
      )

      await client.hatch(wallet.address, selectedDragon.token_id)
    } catch (err) {}
  }

  const plantEgg = async () => {
    try {
      if (!wallet || !contract || !selectedDragon) return
      const client = contract.use(
        selectedDragon.isNewDragon ? UPDATED_DRAGON_CONTRACT_ADDRESS : DRAGON_CONTRACT_ADDRESS,
      )

      await client.plantEggOverride(wallet.address, selectedDragon.token_id)
      setHasEggs('0 Dragon Egg')
      setOvulationTimer([Number(displayDragon.ovulation_period) - 1, 23, 59])
    } catch (err) {}
  }

  const selectDragon = async (selected) => {
    setSelectedDragon(selected)
    const dragon = await retrieveDragon(selected.token_id, selected.isNewDragon)
    setDisplayDragon(dragon)
    if (dragon.is_staked) {
      calculateReward(selected.token_id, selected.isNewDragon)
    } else {
      setReward(0)
    }
  }

  useEffect(() => {
    const queryUserDragons = async () => {
      try {
        if (!contract || !wallet.initialized) return
        const client = contract?.use(DRAGON_CONTRACT_ADDRESS)
        const new_client = contract?.use(UPDATED_DRAGON_CONTRACT_ADDRESS)
        setIsFetching(true)
        const res = await client.rangeUserDragons(wallet.address, '0', dragonLimit)
        const new_res = await new_client.rangeUserDragons(wallet.address, '0', dragonLimit)
        setOwnedDragonList(res)
        setOwnedNewDragonList(new_res.map((dragon) => ({ ...dragon, isNewDragon: true })))
        if (res[0]) {
          const dragon = await retrieveDragon(res[0].token_id, false)
          setError(res.length === 0)
          if (!dragon.is_staked) {
            setReward(0)
          } else {
            calculateReward(res[0].token_id, false)
          }
          setSelectedDragon(dragon)
          setDisplayDragon(dragon)
        } else if (new_res[0]) {
          const dragon = await retrieveDragon(new_res[0].token_id, true)
          setError(new_res.length === 0)
          if (!dragon.is_staked) {
            setReward(0)
          } else {
            calculateReward(new_res[0].token_id, true)
          }
          setSelectedDragon(dragon)
          setDisplayDragon(dragon)
        }
        setIsFetching(false)
        setHasNext(res.length >= dragonLimit || new_res.length >= dragonLimit)
      } catch (e) {
        setIsFetching(false)
      }
    }
    queryUserDragons()
    setNoDragon(false)
    // eslint-disable-next-line
  }, [wallet, DRAGON_CONTRACT_ADDRESS, refresh])

  const retrieveDragon = async (id, isNewDragon) => {
    try {
      const client = contract?.use(
        isNewDragon ? UPDATED_DRAGON_CONTRACT_ADDRESS : DRAGON_CONTRACT_ADDRESS,
      )
      const res = await client.retrieveUserDragons(id)
      setDisplayDragon(res)
      calculateOvulationPeriod(res)
      checkEggs(res)
      return res
    } catch (e) {
      return null
    }
  }

  const calculateOvulationPeriod = (dragon) => {
    if (!dragon.is_staked) {
      setOvulationTimer([Number(dragon.ovulation_period) - 1, 23, 59])
    } else {
      const dateInSeconds = Date.now() / 1000
      let secondDiff = dragon.hatch - dateInSeconds
      //calculate days
      let days = Math.floor(secondDiff / 86400)
      if (days < 0) {
        setOvulationTimer([0, 0, 0])
        return
      }
      secondDiff = secondDiff - days * 86400
      //calculate hours
      let hours = Math.floor(secondDiff / 3600)
      secondDiff = secondDiff - hours * 3600
      //calculate minutes
      let minutes = Math.floor(secondDiff / 60)
      setOvulationTimer([days, hours, minutes])
    }
  }

  const checkEggs = (dragon) => {
    if (dragon.unstaking_process) {
      setHasEggs('0 Dragon Egg')
    } else {
      if (dragon.is_staked) {
        setHasEggs(
          dragon.hatch < Date.now() / 1000 && dragon.hatch !== 0 ? '1 Dragon Egg' : '0 Dragon Egg',
        )
      } else {
        setHasEggs('0 Dragon Egg')
      }
    }
  }

  const loadMore = async () => {
    if (noDragon) return
    const client = contract?.use(DRAGON_CONTRACT_ADDRESS)
    const new_client = contract?.use(UPDATED_DRAGON_CONTRACT_ADDRESS)
    setIsFetching(true)
    let res = []
    let new_res = []
    res = await client.rangeUserDragons(
      wallet.address,
      ownedDragonList[ownedDragonList.length - 1]?.token_id ?? null,
      dragonLimit,
    )
    new_res = await new_client.rangeUserDragons(
      wallet.address,
      ownedNewDragonList[ownedNewDragonList.length - 1]?.token_id ?? null,
      dragonLimit,
    )
    setIsFetching(false)
    setHasNext(res.length >= dragonLimit || new_res.length >= dragonLimit)
    if (res.length === 0 && new_res.length === 0) {
      setNoDragon(true)
    }
    const temp = ownedDragonList.concat(res)
    setOwnedDragonList(temp)
    const new_temp = ownedNewDragonList.concat(
      new_res.map((dragon) => ({ ...dragon, isNewDragon: true })),
    )
    setOwnedNewDragonList(new_temp)
  }

  useEffect(() => {
    if (!isFetching && loadMoreVisible && hasNext) {
      loadMore()
    }
    // eslint-disable-next-line
  }, [isFetching, loadMoreVisible, hasNext])

  if (error) {
    return display && <NoDragon />
  }

  return (
    <div
      style={{
        overflow: 'scroll',
        msOverflowStyle: '0px !important',
        scrollbarWidth: '0px !important',
        overflowX: 'hidden',
        height: '100%',
      }}
    >
      <Grid container spacing={4} sx={{ position: 'relative', paddingX: 2 }}>
        <Grid item xs={12} xl={7} lg={4} paddingBottom={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography className={classes.h2}>Dragons</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', marginTop: 3 }}>
              {ownedDragonList &&
                [...ownedDragonList, ...ownedNewDragonList].map((item, idx) => {
                  return (
                    <StakeDragonCard
                      height={'410px'}
                      maxWidth={'275px'}
                      imgHeight={'180px'}
                      item={item}
                      price={'0'}
                      onClick={() => selectDragon(item)}
                      isSelected={
                        selectedDragon?.token_id === item.token_id &&
                        selectedDragon?.isNewDragon === item.isNewDragon
                      }
                      key={idx}
                    />
                  )
                })}
              <div
                ref={loadMoreRef}
                style={{
                  width: '100%',
                  height: '20px',
                  visibility: hasNext ? 'visible' : 'hidden',
                }}
              ></div>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} xl={5} lg={8}>
          <Box
            sx={{
              pb: { lg: windowHeight >= 780 ? 0 : 8 },
              height: { xs: 'auto', lg: windowHeight >= 780 ? 685 : windowHeight - 195 },
              position: { lg: 'fixed', xs: 'sticky' },
              top: windowHeight >= 900 ? 210 : 210,
              right: 48,
              width: { xl: '32%', lg: '42%', xs: '100%' },
              overflowY: 'auto',
              marginTop: '13px',
            }}
          >
            {/* <DragonInfoStaking item={ownedDragonList[selectedDragon]} /> */}
            <Box className={classes.goldBox4} pt={1} px={4} marginTop={2}>
              <Typography className={classes.h2} sx={{ fontSize: '20px !important' }}>
                My Dragon Info (Staking and Ovulation)
              </Typography>
              <Stack direction="row" justifyContent="center" marginTop={2}>
                <CustomOutlinedLabel
                  title="Reward Amount:"
                  amount={reward + ' DRGN'}
                  styles={{ display: 'flex', justifyContent: 'space-between', width: '60%' }}
                  textStyles={{ fontSize: '16px !important' }}
                />
                <CustomOutlinedButton
                  title="Claim"
                  styles={{ width: '12vw', paddingY: '10px', marginLeft: 2 }}
                  disabled={reward === 0}
                  onClick={claimReward}
                />
              </Stack>
              <Stack direction="row" justifyContent="center" spacing={2} marginTop={2}>
                <Box>
                  <OvulationCountDown
                    title="Ovulation Timer:"
                    days={ovulationTimer[0]}
                    hours={ovulationTimer[1]}
                    minutes={ovulationTimer[2]}
                  />
                </Box>
              </Stack>
              <Stack direction="row" justifyContent="center" marginTop={2}>
                <CustomOutlinedLabel
                  title={'Dragon Egg Reward:'}
                  amount={hasEggs}
                  styles={{ display: 'flex', justifyContent: 'start', width: '60%' }}
                  textStyles={{ fontSize: '16px !important' }}
                />
                <CustomOutlinedButton
                  title="Claim"
                  onClick={plantEgg}
                  styles={{ width: '12vw', paddingY: '10px', marginLeft: 2 }}
                  disabled={hasEggs !== '1 Dragon Egg'}
                />
              </Stack>
              <Stack direction="column" alignItems="center" marginTop={2}>
                {displayDragon.is_staked ? (
                  <CustomOutlinedButton
                    title={'Unstake'}
                    onClick={displayDragon.unstaking_process ? unstake : unstakeOverride}
                    styles={{ width: '12vw', marginY: { xs: 1, lg: 2 }, paddingY: '10px' }}
                  />
                ) : (
                  <CustomOutlinedButton
                    title="Stake"
                    onClick={stake}
                    styles={{ width: '12vw', marginY: { xs: 1, lg: 2 }, paddingY: '10px' }}
                  />
                )}
              </Stack>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </div>
  )
}

export default Stake
