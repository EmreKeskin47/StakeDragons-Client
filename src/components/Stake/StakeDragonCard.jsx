import React, { useState, useEffect } from 'react'
import { Box, Grid, Typography } from '@mui/material'

import star from 'assets/dragon-up-star.svg'
import * as COLORS from 'util/ColorUtils'

import { useContracts } from 'contexts/contract'
import { getDragonPropertiesByKind } from '../../util/constants'

const StakeDragonCard = (props) => {
  const { item, onClick, isSelected } = props

  const [background, setBackground] = useState('#72736D')
  const [width, setWidth] = useState('40%')
  const [dragon, setDragon] = useState(null)
  const [displayId, setDisplayId] = useState('')
  const [dragonBackground, setDragonBackground] = useState('')

  const contract = useContracts().dragon
  const DRAGON_CONTRACT_ADDRESS = process.env.REACT_APP_DRAGON_CONTRACT_ADDRESS
  const UPDATED_DRAGON_CONTRACT_ADDRESS = process.env.REACT_APP_UPDATED_DRAGON_CONTRACT_ADDRESS

  useEffect(() => {
    const retrieveDragon = async () => {
      const client = contract.use(item.isNewDragon ? UPDATED_DRAGON_CONTRACT_ADDRESS : DRAGON_CONTRACT_ADDRESS)
      const res = await client.retrieveUserDragons(item.token_id)
      if (res.is_staked) {
        setDragonBackground(
          'linear-gradient(61.27deg, rgba(171, 137, 100, 0.3) 8.5%, rgba(196, 177, 134, 0.3) 96.2%)',
        )
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
  }, [item])

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
        border: `${isSelected ? '4px solid #D9AE6A' : `1px solid ${COLORS.SMOOTH_YELLOW_30}`}`,
        borderRadius: '4px',
        cursor: 'pointer',
        background: dragonBackground,
        height: props.height,
        width: props.maxWidth,
        position: 'relative',
        mr: 2,
        mb: 2
      }}
      onClick={onClick}
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
        style={{ marginTop: '40px', marginBottom: '40px', objectFit: 'contain' }}
      />
      {
        item.isNewDragon &&
        <Box sx={{ display: 'flex', justifyContent: 'center', height: '20px', marginBottom: '10px' }}>
          <img
            src={star}
            alt='star'
            style={{ width: '20px', height: '100%' }}
          />
        </Box>
      }
      <Grid container width={'100%'} flexDirection={'row'} position={'absolute'} sx={{ bottom: '20px', left: '0px', px: 1 }}>
        <Grid item xs={12} md={4} sx={{ pl: 1 }}>
          {item && item.kind && (
            <Typography sx={{ color: COLORS.SECONDARY_TEXT_GREY }}>
              {item.token_id ? displayId : ''}
            </Typography>
          )}
        </Grid>
        <Grid item xs={12} md={8} sx={{ pr: 1 }}>
          {item && item.kind && (
            <Typography sx={{ color: COLORS.WHITE, textTransform: 'capitalize', float: { xs: 'left', md: 'right' } }}>
              {item.kind} Dragon
            </Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  )
}

export default StakeDragonCard
