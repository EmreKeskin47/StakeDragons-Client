import React, { useEffect, useState } from 'react'

import { Grid, Box, Typography } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import useStyles from 'styles'

import { CustomOutlinedButton } from 'components/Button'
import CustomOutlinedLabel from '../../components/Label/CustomOutlinedLabel'
import CrystalCountDown from '../../components/Countdown/CrystalCountDown'
import OvulationCountDown from 'components/Countdown/OvulationCountDown'
import * as COLORS from 'util/ColorUtils'

import cosmic from 'contracts/cosmic/contract'
import crystal from 'contracts/crystal/contract'
import cw20DRGN from 'contracts/cw20-drgn'
import { useWallet } from 'contexts/wallet'

import FireIcon from 'assets/crystal/Fire.png'
import IceIcon from 'assets/crystal/Ice.png'
import DivineIcon from 'assets/crystal/Divine.png'
import StormIcon from 'assets/crystal/Storm.png'
import UdinIcon from 'assets/crystal/Udin.png'
import CosmicIcon from 'assets/crystal/Cosmic.png'
import crystalContract from '../../contracts/crystal/contract'
import DateCountDown from '../../components/Countdown/DateCountDown'
import { fetchWithToast, showFailToast, showInsufficientFailToast } from '../../util/FetchUtil'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

const SEASON_1_FINISH_DATE = new Date('Fri Nov 14 2022 00:00:00 GMT+0300')

const CrystalAttunement = () => {
  const classes = useStyles()

  const wallet = useWallet()

  const [cosmics, setCosmics] = useState([])
  const [ice, setIce] = useState([])
  const [storm, setStorm] = useState([])
  const [fire, setFire] = useState([])
  const [divine, setDivine] = useState([])
  const [udin, setUdin] = useState([])
  const [hasCosmic, setHasCosmic] = useState(false)
  const [canBeUnstaked, setCanBeUnstaked] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [staked, setStaked] = useState(false)
  const [unstakeProcess, setUnstakeProcess] = useState(false)
  const [unstakingTimer, setUnstakingTimer] = useState([0, 0, 0])
  const [reward, setReward] = useState(0)

  const addWithNoDuplicates = (array, new_item) => {
    let all_items = array.concat(new_item)
    all_items = all_items.filter(
      (value, index, self) => index === self.findIndex((t) => t.token_id === value.token_id),
    )
    return all_items
  }

  useEffect(() => {
    const query = async () => {
      try {
        let cosmicClient = cosmic(wallet.getClient())
        let res = await cosmicClient.queryUserCosmic(wallet.address)

        res && res.length === 0 ? setHasCosmic(false) : setHasCosmic(true)
        await setCosmics(res)

        if (res && res[0]) {
          await calculateUnstakingPeriod(res[0])
          await setStaked(res[0].is_staked)
          const res4 = await cosmicClient.calculateReward(res[0].token_id)
          await setReward((res4 / 1000000).toFixed(2))
          await setUnstakeProcess(res[0].unstaking_process)
        }

        let crystalClient = crystal(wallet.getClient())
        let array = [{}]
        let start_after = '0'
        while (array.length !== 0) {
          array = await crystalClient.rangeUserCrystals(wallet.address, start_after, 10)
          array.forEach((element) => {
            if (element.kind) {
              let all_items
              switch (element.kind) {
                case 'ice':
                  all_items = addWithNoDuplicates(ice, element)
                  setIce(all_items)
                  break

                case 'storm':
                  all_items = addWithNoDuplicates(storm, element)
                  setStorm(all_items)
                  break

                case 'udin':
                  all_items = addWithNoDuplicates(udin, element)
                  setUdin(all_items)
                  break

                case 'divine':
                  all_items = addWithNoDuplicates(divine, element)
                  setDivine(all_items)
                  break

                case 'cosmics':
                  all_items = addWithNoDuplicates(cosmics, element)
                  setCosmics(all_items)
                  break

                default:
                  all_items = addWithNoDuplicates(fire, element)
                  setFire(all_items)
                  break
              }
            }
          })
          start_after = array[array.length - 1].token_id
        }

        setRefresh(false)
      } catch (e) {}
    }
    if (wallet.initialized && cosmic && crystal) {
      query()
    }
    // eslint-disable-next-line
  }, [wallet, refresh])

  const calculateUnstakingPeriod = (dragon) => {
    if (dragon.is_staked) {
      if (dragon.unstaking_process) {
        const dateInSeconds = Date.now() / 1000
        let secondDiff = Number(dragon.unstaking_start_time) + 14 * 86400 - dateInSeconds
        //calculate days
        const days = Math.floor(secondDiff / 86400)
        secondDiff = secondDiff - days * 86400
        //calculate hours
        const hours = Math.floor(secondDiff / 3600)
        secondDiff = secondDiff - hours * 3600
        //calculate minutes
        const minutes = Math.floor(secondDiff / 60)
        if (days < 0 || hours < 0 || minutes < 0) {
          setUnstakingTimer([0, 0, 0])
          setCanBeUnstaked(true)
        } else {
          setUnstakingTimer([days, hours, minutes])
        }
      }
    }
  }

  const attuneAdmin = async () => {
    try {
      if (!wallet.initialized || !crystal) return

      if (
        fire.length === 0 ||
        ice.length === 0 ||
        storm.length === 0 ||
        udin.length === 0 ||
        divine.length === 0
      ) {
        showFailToast('Transaction Failed', 'All crystal types are required for Attune')
      } else {
        const client = crystalContract(wallet.getClient())

        await fetchWithToast(
          client.mintCosmic(
            wallet.address,
            fire[fire.length - 1].token_id,
            ice[ice.length - 1].token_id,
            storm[storm.length - 1].token_id,
            divine[divine.length - 1].token_id,
            udin[udin.length - 1].token_id,
          ),
        )

        wallet.refreshBalance()
        setRefresh(true)
      }
    } catch (err) {
      showFailToast('Transaction Failed', 'Transaction Rejected')
    }
  }

  const attune = async () => {
    try {
      if (!wallet.initialized || !crystal) return

      if (
        fire.length === 0 ||
        ice.length === 0 ||
        storm.length === 0 ||
        udin.length === 0 ||
        divine.length === 0
      ) {
        showFailToast('Transaction Failed', 'All crystal types are required for Attune')
      } else {
        const client = cw20DRGN(wallet.getClient())

        await fetchWithToast(
          client.sendCw20AttuneCosmic(
            wallet.address,
            '300000000',
            fire[fire.length - 1].token_id,
            ice[ice.length - 1].token_id,
            storm[storm.length - 1].token_id,
            divine[divine.length - 1].token_id,
            udin[udin.length - 1].token_id,
          ),
        )
        wallet.refreshBalance()
        setRefresh(true)
      }
    } catch (err) {
      showInsufficientFailToast(err.message)
    }
  }

  const stake = async () => {
    try {
      if (!wallet || !cosmic || !hasCosmic) return
      if (staked) {
        showFailToast('Transaction Failed', 'Only one cosmic can be staked')
      } else {
        let cosmicClient = cosmic(wallet.getClient())

        await fetchWithToast(
          cosmicClient.stakeCosmic(wallet.address, cosmics[cosmics.length - 1].token_id),
        )

        setRefresh(true)
      }
    } catch (err) {
      showFailToast('Transaction Failed', 'Transaction Rejected')
    }
  }

  const claimReward = async () => {
    try {
      if (!wallet || !staked || !hasCosmic) return
      let client = cosmic(wallet.getClient())
      await fetchWithToast(client.claimReward(wallet.address, cosmics[0].token_id))
      setRefresh(true)
      wallet.refreshBalance()
    } catch (err) {
      showFailToast('Transaction Failed', 'Transaction Rejected')
    }
  }

  // const getState = async () => {
  //   const client = crystalContract(wallet.getClient())
  //   const res = await client.getState()
  //   console.log(res)
  // }

  // const editState = async () => {
  //   const client = boxMinter(wallet.getClient())
  //   const res = await client.editState(wallet.address)
  //   console.log(res)
  // }

  const unstake = async () => {
    try {
      if (!wallet || !cosmic || !staked || !hasCosmic) return
      let client = cosmic(wallet.getClient())

      await fetchWithToast(client.unstake(wallet.address, cosmics[0].token_id))

      setRefresh(true)
    } catch (err) {
      showFailToast('Transaction Failed', 'Transaction Rejected')
    }
  }

  const startUnstakingProcess = async () => {
    try {
      if (!wallet || !cosmic || !staked) return
      let client = cosmic(wallet.getClient())

      await fetchWithToast(client.startUnstakingProcess(wallet.address, cosmics[0].token_id))
      setRefresh(true)
    } catch (err) {
      showFailToast('Transaction Failed', 'Transaction Rejected')
    }
  }

  // const cosmicRewardState = async () => {
  //   const client = StakeReward(wallet.getClient())
  //   const res = await client.getStateCosmicReward()
  //   console.log(res)
  // }

  // const cosmicEditState = async () => {
  //   const client = StakeReward(wallet.getClient())
  //   const res = await client.cosmicEditState(
  //     wallet.address,
  //     'juno1luw9kspq5dwrqrxgkvfwt443ue99umdaqmm57afg7ms5y0rkz3dsfeudxp',
  //     process.env.REACT_APP_COSMIC_CONTRACT_ADDRESS,
  //     process.env.REACT_APP_CW20_CONTRACT_ADDRESS,
  //     'juno19rk57txgrhtjyfjppmdepws2h32rt3yq53wtue',
  //   )
  //   console.log(res)
  // }

  // const sendDrgnAdmin = async () => {
  //   try {
  //     const client = StakeReward(wallet.getClient())
  //     const res = await client.sendCosmicRewardDrgn(
  //       wallet.address,
  //       'juno1ll5jzyp9j2vt8chxgkkrzc9qcprfq4gr7sjert',
  //       '1',
  //     )
  //     console.log(res)
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }

  // const editCosmicRewardContract = async () => {
  //   const client = cosmic(wallet.getClient())
  //   try {
  //     const res = await client.updateRewardContractAddress(
  //       wallet.address,
  //       process.env.REACT_APP_COSMIC_REWARD_CONTRACT_ADDRESS,
  //     )
  //     console.log(res)
  //   } catch (e) {
  //     console.log(e)
  //   }
  // }

  // const increaseCosmicAllowance = async () => {
  //   try {
  //     const client = StakeReward(wallet.getClient())
  //     const res = await client.increaseCosmicAllowance(
  //       wallet.address,
  //     )
  //     console.log(res)
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }

  // const rewardState = async () => {
  //   const client = StakeReward(wallet.getClient())
  //   const res = await client.getState()
  //   console.log(res)
  // }

  const [open, setOpen] = React.useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Grid
      container
      className={classes.pageContainer}
      sx={{
        display: 'grid',
        gridTemplateColumns: { lg: '1fr 2.4fr', xs: '1fr' },
        gap: '40px',
        px: 8,
        alignContent: 'center',
        my: { lg: 'auto', md: '96px', xs: '400px' },
      }}
    >
      <Grid item>
        <Box
          sx={{
            width: { lg: '100%', md: '50%', xs: '100%' },
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 3,
            mx: 'auto',
          }}
        >
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', gap: '60px' }}
            >
              <Box sx={{ height: '110px', width: '100px' }} className={classes.goldBox4}>
                {fire.length > 0 && (
                  <img alt="ice" style={{ width: '100%', height: '100%' }} src={FireIcon} />
                )}
              </Box>
              <Box sx={{ height: '110px', width: '100px' }} className={classes.goldBox4}>
                {ice.length > 0 && (
                  <img alt="ice" style={{ width: '100%', height: '100%' }} src={IceIcon} />
                )}
              </Box>
            </Box>
            <Box sx={{ height: '110px', width: '100px' }} className={classes.goldBox4}>
              {divine.length > 0 && (
                <img alt="divine" style={{ width: '100%', height: '100%' }} src={DivineIcon} />
              )}
            </Box>
            <Box
              sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', gap: '60px' }}
            >
              <Box sx={{ height: '110px', width: '100px' }} className={classes.goldBox4}>
                {storm.length > 0 && (
                  <img alt="storm" style={{ width: '100%', height: '100%' }} src={StormIcon} />
                )}
              </Box>
              <Box sx={{ height: '110px', width: '100px' }} className={classes.goldBox4}>
                {udin.length > 0 && (
                  <img alt="udin" style={{ width: '100%', height: '100%' }} src={UdinIcon} />
                )}
              </Box>
            </Box>
          </Box>
          <Tooltip title="Attune price is 300 DRGN">
            <Box
              sx={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'end' }}
            >
              <CustomOutlinedButton
                title="Attune"
                styles={{ width: '12vw', paddingY: '10px' }}
                onClick={attune}
              />
            </Box>
          </Tooltip>
        </Box>
      </Grid>
      <Grid item className={classes.goldBox4} sx={{ px: '16px', py: '40px' }}>
        <Box
          sx={{
            display: 'flex',
            height: '100%',
            flexDirection: 'column',
            gap: '32px',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography sx={{ fontSize: '24px', color: COLORS.WHITE }}>
            Season 1 Crystal Farming
          </Typography>
          <DateCountDown
            title="Time Left Until Cosmic Season 1 End"
            finishDate={SEASON_1_FINISH_DATE}
            textStyles={{ fontSize: { xl: '16px !important', xs: '12px !important' } }}
          />
          <Grid
            container
            sx={{
              display: 'grid',
              gridTemplateColumns: { md: '196px 1fr', xs: '1fr' },
              gridAutoRows: '84px',
              gap: '60px',
            }}
          >
            <Grid
              item
              sx={{ gridRow: { md: 'span 2', xs: 'span 3' }, marginLeft: '10px' }}
              className={classes.goldBox1}
            >
              {cosmics.length > 0 && (
                <img alt="cosmics" style={{ width: '100%', height: '100%' }} src={CosmicIcon} />
              )}
            </Grid>
            <Grid item sx={{ gridRow: { md: 'span 1', xs: 'span 2' } }}>
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: { md: 'row', xs: 'column' },
                  justifyContent: 'space-between',
                  gap: '16px',
                }}
              >
                <CustomOutlinedLabel
                  title="Reward"
                  amount={'10 DRGN'}
                  styles={{ display: 'flex', flexGrow: 1, height: '100%', alignItems: 'center' }}
                  insideStyles={{ width: '100%' }}
                  textStyles={{ fontSize: { xl: '16px !important', xs: '12px !important' } }}
                />
                <CrystalCountDown title="Unstake Time:" days={14} />
              </Box>
            </Grid>
            <Grid item>
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '16px',
                }}
              >
                <CustomOutlinedLabel
                  title="Reward Amount"
                  amount={cosmics[0] && cosmics[0].is_staked ? reward + ' DRGN' : '0 DRGN'}
                  styles={{ display: 'flex', flexGrow: 1, height: '100%', alignItems: 'center' }}
                  insideStyles={{ width: '100%' }}
                  textStyles={{ fontSize: { xl: '16px !important', xs: '12px !important' } }}
                />
                <CustomOutlinedButton
                  title="Claim"
                  styles={{ width: '12vw', paddingY: '10px' }}
                  disabled={reward === 0}
                  onClick={claimReward}
                />
              </Box>
            </Grid>
          </Grid>
          {staked &&
            (!unstakeProcess ? (
              <Grid>
                <CustomOutlinedButton
                  title={'Unstake'}
                  onClick={handleClickOpen}
                  styles={{ width: '12vw', marginY: { xs: 1, lg: 2 }, paddingY: '10px' }}
                />
                <Dialog
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">
                    {'Are you sure you want to unstake your cosmic crystal?'}
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      Once you start the unstaking process for the cosmic crystal it will take 14
                      days to unstake it. You will not receive rewards during this process.
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={startUnstakingProcess} autoFocus>
                      Unstake
                    </Button>
                  </DialogActions>
                </Dialog>
              </Grid>
            ) : !canBeUnstaked ? (
              <OvulationCountDown
                title="Unstake:"
                days={unstakingTimer[0]}
                hours={unstakingTimer[1]}
                minutes={unstakingTimer[2]}
              />
            ) : (
              <CustomOutlinedButton
                title={'Unstake'}
                onClick={unstake}
                styles={{ width: '12vw', marginY: { xs: 1, lg: 2 }, paddingY: '10px' }}
              />
            ))}

          {!staked && (
            <CustomOutlinedButton
              title="Stake"
              onClick={stake}
              disabled={!hasCosmic}
              styles={{ width: '12vw', marginY: { xs: 1, lg: 2 }, paddingY: '10px' }}
            />
          )}
        </Box>
      </Grid>
    </Grid>
  )
}

export default CrystalAttunement
