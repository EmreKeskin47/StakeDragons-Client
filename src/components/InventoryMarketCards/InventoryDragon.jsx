import React, { useState, useEffect } from 'react'
import { Box, Grid, Typography } from '@mui/material'

import star from 'assets/dragon-up-star.svg'
import * as COLORS from 'util/ColorUtils'
import { DenomPipe } from 'util/Pipes'
import { useContracts } from 'contexts/contract'
import { getDragonPropertiesByKind } from '../../util/constants'

const InventoryDragon = (props) => {
  const { item, onClick, price, isNewDragon = false } = props

  const [background, setBackground] = useState('#72736D')
  const [width, setWidth] = useState('40%')
  const [dragon, setDragon] = useState(null)
  const [displayId, setDisplayId] = useState('')
  const [isStaked, setIsStaked] = useState(false)
  const [dragonBackground, setDragonBackground] = useState('')

  const contract = useContracts().dragon
  const DRAGON_CONTRACT_ADDRESS = process.env.REACT_APP_DRAGON_CONTRACT_ADDRESS
  const UPDATED_DRAGON_CONTRACT_ADDRESS = process.env.REACT_APP_UPDATED_DRAGON_CONTRACT_ADDRESS

  useEffect(() => {
    const retrieveDragon = async () => {
      const client = contract.use(isNewDragon ? UPDATED_DRAGON_CONTRACT_ADDRESS : DRAGON_CONTRACT_ADDRESS)
      const res = await client.retrieveUserDragons(item.token_id)
      await setIsStaked(res.is_staked)
      if (res.is_staked) {
        setDragonBackground(
          'linear-gradient(61.27deg, rgba(171, 137, 100, 0.3) 8.5%, rgba(196, 177, 134, 0.3) 96.2%)',
        )
      } else {
        setDragonBackground('')
      }
    }
    if (item.token_id) {
      let length = item.token_id.toString().length

      let id = '#'
      if (length < 6) {
        let idLeadingZero = 5 - length
        for (let i = 0; i < idLeadingZero; i++) {
          id = id + '0'
        }
      }
      id = id + item.token_id.toString()
      setDisplayId(id)
      retrieveDragon()
    }
  }, [item, DRAGON_CONTRACT_ADDRESS, contract, isNewDragon])

  useEffect(() => {
    if (item) {
      const { background, width, img } = getDragonPropertiesByKind(item.kind)
      setBackground(background)
      setWidth(width)
      setDragon(img)
    }
  }, [item])

  return (
    <Box
      sx={{
        border: `1px solid ${COLORS.SMOOTH_YELLOW_30}`,
        borderRadius: '4px',
        cursor: 'pointer',
        background: dragonBackground,
        height: '410px',
        maxWidth: '275px',
      }}
      onClick={() => onClick(item, false, item.token_id, '0', isStaked)}
    >
      <Box
        sx={{
          background: `${background}`,
          borderRadius: '3px',
          width: `${width}`,
          height: '11px',
          borderImageSlice: 1,
          border: '1px solid',
          borderImage: 'linear-gradient(90deg,#624B2C 0%, #E6E1C1 100%) 1',
        }}
      ></Box>
      <img
        src={dragon}
        alt="dragon img"
        height={props.imgHeight}
        width={'100%'}
        style={{ marginTop: '40px', marginBottom: '10px' }}
      />
      {
        isNewDragon &&
        <Box sx={{ display: 'flex', justifyContent: 'center', height: '20px', marginBottom: '10px' }}>
          <img
            src={star}
            alt='star'
            style={{ width: '20px', height: '100%' }}
          />
        </Box>
      }
      <Grid container margin={2}>
        <Grid item xs={6}>
          {item && item.kind && (
            <Typography sx={{ color: COLORS.SECONDARY_TEXT_GREY, textTransform: 'capitalize' }}>
              Rarity
            </Typography>
          )}
        </Grid>
        {price !== '0' && (
          <Grid item xs={6}>
            <Typography sx={{ color: COLORS.SECONDARY_TEXT_GREY }}>Price</Typography>
          </Grid>
        )}
      </Grid>
      <Grid container margin={2}>
        <Grid item xs={6}>
          {item && item.kind && (
            <Typography sx={{ color: COLORS.WHITE, textTransform: 'capitalize' }}>
              {item.kind} Dragon
            </Typography>
          )}
        </Grid>
        {price !== '0' && (
          <Grid item xs={5}>
            <Typography sx={{ color: COLORS.DARK_YELLOW_1 }}>{DenomPipe(price)} DRGN</Typography>
          </Grid>
        )}
      </Grid>
      <Grid container margin={2}>
        <Grid item xs={3.7}>
          <Typography sx={{ color: COLORS.SECONDARY_TEXT_GREY }}>
            {item.token_id ? displayId : ''}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  )
}

export default InventoryDragon
