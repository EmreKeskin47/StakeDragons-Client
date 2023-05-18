import React, { useCallback, useEffect, useRef, useState } from 'react'
import useStyles from 'styles'
import * as COLORS from 'util/ColorUtils'
import { useWallet } from 'contexts/wallet'
import { useContracts } from 'contexts/contract'
import cw20DRGN from 'contracts/cw20-drgn'

import { CustomOutlinedButton } from 'components/Button'
import { Box, Grid, Typography } from '@mui/material'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import Checkbox from '../../components/Checkbox'

import dragonUpLogo from 'assets/dragon-up.svg'
import useOnScreen from '../../hooks/useOnScreen'
import OwnedDragon from './OwnedDragon'
import DragonSlot from './DragonSlot'
import DragonResultPreview from './DragonResultPreview'

import './style.css'
import DragonKindFilter from './DragonKindFilter'
import NumberInput from '../../components/Input/NumberInput'
import { showFailToast, showInsufficientFailToast } from '../../util/FetchUtil'
import SuccessModal from './SuccessModal'

import { MinterUp } from '../../contracts/minter-up/contact'
import MinMaxInfo from './MinMaxInfo'

const DRAGON_CONTRACT_ADDRESS = process.env.REACT_APP_DRAGON_CONTRACT_ADDRESS
const dragonLimit = 5
const MAX_SUCCESS_RATE_INCREASE = 40
const DEFAULT_SUCCESS_RATE = 50

const getExtraSuccessRate = (minMaxAmounts, amount, tokenRatio) => {
  if (minMaxAmounts.min <= 0 || minMaxAmounts.max <= 0) return 0
  const calculateAmount = amount * tokenRatio
  const successRate =
    ((calculateAmount - minMaxAmounts.min) / (minMaxAmounts.max - minMaxAmounts.min)) *
    MAX_SUCCESS_RATE_INCREASE
  return successRate > MAX_SUCCESS_RATE_INCREASE
    ? MAX_SUCCESS_RATE_INCREASE
    : successRate < 0
      ? 0
      : successRate
}

const DragonUp = () => {
  const classes = useStyles()
  const wallet = useWallet()
  const dragonContract = useContracts().dragon

  const [racToDrgn, setRacToDrgn] = useState(0)
  const [allMinMaxAmounts, setAllMinMaxAmounts] = useState({})

  const lastDragonId = useRef('0')
  const loadMoreRef = useRef(null)

  const [ownedDragonList, setOwnedDragonList] = useState([])
  const [dragonListStatus, setDragonListStatus] = useState({ isFetching: false, hasNext: true })
  const loadMoreVisible = useOnScreen(loadMoreRef)

  const [dragonSlots, setDragonSlots] = useState([null, null, null])
  const [buttonDisabled, setButtonDisabled] = useState(true)
  const [selectedFilterKinds, setSelectedFilterKinds] = useState([])

  const [dragonUpStatus, setDragonUpStatus] = useState({ isFetching: false, hasError: false })
  const [amount, setAmount] = useState(0)
  const [minMaxAmounts, setMinMaxAmount] = useState({ min: 0, max: 0 })
  const [dragonUpCost, setDragonUpCost] = useState(0)
  const [selectedTokenType, setSelectedTokenType] = useState('DRGN')
  const [tokenRatio, setTokenRatio] = useState(1)

  const [successRate, setSuccessRate] = useState(50)
  const [successModal, setSuccessModal] = useState({ open: false, dragon: null })

  //NEW MINTER FUNCTIONS !!!!!!!!!!!!!!!!!!!!!!!!
  const getNewMinterState = async () => {
    const client = MinterUp(wallet.getClient())
    const res = await client.getState()
    const DRGN_TO_RAC = parseInt(res.drgn_rac) / 100
    setRacToDrgn(1 / DRGN_TO_RAC)
  }

  const getMinMaxValues = async () => {
    if (wallet.initialized) {
      const client = MinterUp(wallet.getClient())
      const res = await client.getMinMax()
      setAllMinMaxAmounts(res)
    }
  }
  //   const editMinMax = async () => {
  //     if (wallet.initialized) {
  //       const client = MinterUp(wallet.getClient())
  //       const res = await client.editMinMax(wallet.address)
  //       console.log('min max values  \n', res)
  //     }
  //   }

  //   const editNewMinterState = async () => {
  //     const client = MinterUp(wallet.getClient())
  //     const res = await client.editState(wallet.address)
  //     console.log(res)
  //   }

  //   const editOldMinterState = async () => {
  //     try {
  //       const client = MinterUp(wallet.getClient())
  //       const res = await client.editOldMinterState(wallet.address)
  //       console.log(res)
  //     } catch (e) {
  //       console.log(e)
  //     }
  //   }

  //   const editOldMinterContracts = async (minterEditContractsMsg) => {
  //     const client = MinterUp(wallet.getClient())
  //     const res = await client.editState(wallet.address, minterEditContractsMsg)
  //     console.log(res)
  //   }

  //   const instantiate = async (codeId, initMsg) => {
  //     const client = MinterUp(wallet.getClient())
  //     const res = await client.instantiate(wallet.address, codeId, initMsg)
  //     console.log(res)
  //   }

  //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  const closeSuccessModal = () => {
    setSuccessModal({ open: false, dragon: null })
  }

  const initializePage = () => {
    lastDragonId.current = '0'
    setOwnedDragonList([])
    setDragonListStatus({ isFetching: false, hasNext: true })
    setDragonUpStatus({ isFetching: false, hasError: false })
    setDragonSlots([null, null, null])
    setButtonDisabled(true)
    setSelectedFilterKinds([])
    setAmount(0)
    setMinMaxAmount({ min: 0, max: 0 })
    setDragonUpCost(0)
    getNewMinterState()
    getMinMaxValues()
  }

  const switchToDRGN = () => {
    setTokenRatio(1)
    setSelectedTokenType('DRGN')
  }

  const switchToRAC = () => {
    setTokenRatio(racToDrgn)
    setSelectedTokenType('RAC')
  }

  const handleDragEnd = ({ draggableId, destination }) => {
    if (!draggableId || !destination) return
    const slotIndex = destination.droppableId.split('-')[1]
    const dragon = ownedDragonList.find((dragon) => dragon.token_id === draggableId)
    if (isNaN(slotIndex) || dragon === undefined) return
    let newSlots = [...dragonSlots]
    newSlots[slotIndex] = dragon
    setDragonSlots([...newSlots])
  }

  const removeDragonBySlot = useCallback(
    (slotIndex) => {
      let newSlots = [...dragonSlots]
      newSlots[slotIndex] = null
      setDragonSlots([...newSlots])
    },
    [dragonSlots],
  )

  const toggleKindFilter = useCallback(
    (kind) => {
      let newKinds = [...selectedFilterKinds]
      var index = newKinds.indexOf(kind)

      if (index === -1) {
        newKinds.push(kind)
      } else {
        newKinds.splice(index, 1)
      }
      setSelectedFilterKinds(newKinds)
    },
    [selectedFilterKinds],
  )

  const filterAvailableDragons = (dragon) => {
    const selectedDragonKind = dragonSlots.find((slotDragon) => slotDragon !== null)?.kind
    return (
      !dragonSlots.some((slotDragon) => slotDragon?.token_id === dragon.token_id) &&
      (!selectedDragonKind || dragon.kind === selectedDragonKind) &&
      !dragon.is_staked &&
      (selectedFilterKinds.length === 0 || selectedFilterKinds.includes(dragon.kind))
    )
  }

  const upgradeDragon = async () => {
    try {
      const allSlotsFull = dragonSlots.every((slot) => slot !== null)
      if (!wallet.initialized || !allSlotsFull) return
      if (amount * tokenRatio < minMaxAmounts.min || amount * tokenRatio > minMaxAmounts.max)
        return showFailToast(
          'Invalid Amount',
          `Dragonup cost must be between ${(minMaxAmounts.min / tokenRatio).toFixed(2)} and ${(
            minMaxAmounts.max / tokenRatio
          ).toFixed(2)}`,
        )
      setDragonUpStatus({ isFetching: true, hasError: false })
      const client = cw20DRGN(wallet.getClient())
      const rarity = dragonSlots[0].kind
      let res = await client.upgradeDragon(wallet.address, {
        dragonIds: dragonSlots.map((slot) => slot.token_id),
        rarity,
        amount:
          selectedTokenType == 'DRGN' ? (amount * 1000000).toString() : (amount * 1000000).toString(),
        amountType: selectedTokenType,
        extraSuccessRate: getExtraSuccessRate(minMaxAmounts, amount, tokenRatio),
      })

      if (res.str == 'true"') {
        setSuccessModal({ open: true, dragon: dragonSlots[0] })
        setDragonUpStatus({ isFetching: false, hasError: false })
      } else {
        setDragonUpStatus({ isFetching: false, hasError: true })
        showFailToast('Dragonup', 'Upgrade Failed')
      }

      initializePage()
    } catch (err) {
      showInsufficientFailToast(err.message, selectedTokenType)
      setDragonUpStatus({ isFetching: false, hasError: true })
    }
  }

  const loadDragon = async () => {
    try {
      const dragon_client = dragonContract?.use(DRAGON_CONTRACT_ADDRESS)
      if (!wallet.initialized || !dragonContract || !dragon_client?.rangeUserDragons) return
      setDragonListStatus({ isFetching: true, hasNext: false })
      const res_dragon = await dragon_client.rangeUserDragons(
        wallet.address,
        lastDragonId.current,
        dragonLimit,
      )
      const dragonList = await Promise.all(
        res_dragon.map(async (item) => {
          const dragonInfo = await dragon_client.retrieveUserDragons(item.token_id)
          return { ...item, is_staked: dragonInfo.is_staked }
        }),
      )
      lastDragonId.current = dragonList[dragonList.length - 1]?.token_id
      setOwnedDragonList((prev) => [...prev, ...dragonList])
      setDragonListStatus({ isFetching: false, hasNext: res_dragon.length >= dragonLimit })
    } catch (err) {
      setOwnedDragonList([])
      setDragonListStatus({ isFetching: false, hasNext: false })
    }
  }

  useEffect(() => {
    if (wallet && loadMoreVisible && !dragonListStatus.isFetching && dragonListStatus.hasNext) {
      loadDragon()
    }
  }, [wallet, dragonContract, loadMoreVisible, dragonListStatus])

  useEffect(() => {
    const allSlotsFull = dragonSlots.every((slot) => slot !== null)
    const dragonKind = dragonSlots[0]?.kind
    const min = allSlotsFull ? parseFloat(allMinMaxAmounts[`${dragonKind}_min`] ?? 0) / 1000000 : 0
    const max = allSlotsFull ? parseFloat(allMinMaxAmounts[`${dragonKind}_max`] ?? 0) / 1000000 : 0
    setDragonUpCost(min)
    setButtonDisabled(!allSlotsFull)
    setMinMaxAmount({ min, max })
    setAmount(min / tokenRatio)
  }, [allMinMaxAmounts, dragonSlots, tokenRatio])

  useEffect(() => {
    setSuccessRate(DEFAULT_SUCCESS_RATE + getExtraSuccessRate(minMaxAmounts, amount, tokenRatio))
  }, [minMaxAmounts, amount, tokenRatio])

  useEffect(() => {
    if (wallet && wallet.initialized) {
      getNewMinterState()
      getMinMaxValues()
    }
  }, [wallet])

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Grid
          container
          sx={{
            maxWidth: '1438px',
            maxHeight: '1200px',
            mx: 'auto',
            display: 'grid',
            gridTemplateColumns: '3fr 1fr 1fr',
            gridTemplateRows: '1.2fr minmax(250px,1fr)',
            rowGap: '24px',
          }}
          className={classes.pageContainer}
        >
          <Grid
            container
            item
            sx={{
              height: '100%',
              display: 'grid',
              gridTemplateColumns: 'repeat(3,1fr)',
              gridTemplateRows: '1fr auto',
              gap: '32px',
              alignItems: 'center',
            }}
          >
            {dragonSlots.map((dragonSlot, idx) => (
              <DragonSlot
                key={dragonSlot?.token_id}
                dragon={dragonSlot}
                slotIndex={idx}
                removeSlot={removeDragonBySlot}
              />
            ))}
            <Grid item>
              <Box sx={{ width: '100%', p: '8px' }} className={classes.goldBox1}>
                <Typography sx={{ color: COLORS.SECONDARY_TEXT_GREY }}>Success Rate: </Typography>
                <Typography sx={{ color: 'white' }}>{successRate.toFixed(2)}%</Typography>
              </Box>
            </Grid>
            <Grid item>
              <Box
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
              >
                <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <MinMaxInfo minMaxAmounts={allMinMaxAmounts} dragonSlots={dragonSlots} tokenRatio={tokenRatio} selectedTokenType={selectedTokenType} />
                  <Typography sx={{ color: COLORS.SECONDARY_TEXT_GREY }}>
                    Empower Your Success Rate:
                  </Typography>
                </Box>
                <NumberInput value={amount} onChange={setAmount} />
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '8px',
                  }}
                >
                  <Checkbox
                    label="RAC"
                    checked={selectedTokenType === 'RAC'}
                    onChange={switchToRAC}
                  />
                  <Checkbox
                    label="DRGN"
                    checked={selectedTokenType === 'DRGN'}
                    onChange={switchToDRGN}
                  />
                </Box>
              </Box>
            </Grid>
            <Grid item>
              <Box sx={{ width: '100%' }}>
                <CustomOutlinedButton
                  title="Dragonup"
                  styles={{ width: '100%', background: COLORS.DARK_YELLOW_1 }}
                  disabled={buttonDisabled || dragonUpStatus.isFetching}
                  onClick={upgradeDragon}
                />
                <Box sx={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <Typography sx={{ color: COLORS.SECONDARY_TEXT_GREY }}>Dragonup Cost:</Typography>
                  <Typography sx={{ color: 'white' }}>{dragonUpCost} DRGN</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
          <Grid item sx={{ height: '100%' }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                paddingTop: '64px',
              }}
            >
              <Box
                className={dragonUpStatus.isFetching ? 'spin-animation' : ''}
                sx={{
                  width: 'fit-content',
                  height: 'fit-content',
                  padding: '24px',
                  border: '1px solid',
                  borderColor: dragonUpStatus.hasError ? 'red' : COLORS.DARK_YELLOW_1,
                  borderRadius: '50%',
                }}
              >
                <img alt="dragon" src={dragonUpLogo} />
              </Box>
            </Box>
          </Grid>
          <Grid item sx={{ height: '100%' }}>
            <DragonResultPreview dragonSlots={dragonSlots} />
          </Grid>
          <Grid
            container
            item
            sx={{
              width: '100%',
              height: '100%',
              display: 'grid',
              gridColumn: 'span 5',
              gridTemplateColumns: '3fr 1fr 1fr',
              gridAutoRows: '1fr',
              paddingTop: '24px',
              borderTop: '1px solid',
              borderTopColor: COLORS.DARK_YELLOW_1,
            }}
          >
            <Droppable droppableId="content" direction="horizontal">
              {(provided, snapshot) => (
                <>
                  <Grid
                    item
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    isDraggingOver={snapshot.isDraggingOver}
                    sx={{
                      height: '100%',
                      overflow: 'auto',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3,1fr)',
                      gridTemplateRows: 'auto',
                      gap: '32px',
                    }}
                  >
                    {ownedDragonList.filter(filterAvailableDragons).map((dragon, idx) => (
                      <OwnedDragon key={dragon.token_id} dragon={dragon} idx={idx} />
                    ))}
                    <div ref={loadMoreRef} style={{ height: 24, gridColumn: 'span 3' }} />
                  </Grid>
                </>
              )}
            </Droppable>
            <Grid item />
            <Grid item sx={{ height: '100%' }}>
              <DragonKindFilter toggleKindFilter={toggleKindFilter} />
            </Grid>
          </Grid>
        </Grid>
      </DragDropContext>
      <SuccessModal
        open={successModal.open}
        handleClose={closeSuccessModal}
        dragon={successModal.dragon}
      />
    </>
  )
}

export default DragonUp
