import React, { useState, useEffect } from 'react'
import { Box, Grid, Typography } from '@mui/material'

import * as COLORS from 'util/ColorUtils'
import { getDragonPropertiesByKind } from '../../util/constants'

const StakeDragon = (props) => {
  const { item, onClick, price } = props

  const [background, setBackground] = useState('#72736D')
  const [width, setWidth] = useState('40%')
  const [dragon, setDragon] = useState(null)
  const [displayId, setDisplayId] = useState('')

  useEffect(() => {
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
    }
  }, [item.token_id])

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
        background:
          item && item.is_staked
            ? 'linear-gradient(61.27deg, rgba(171, 137, 100, 0.3) 8.5%, rgba(196, 177, 134, 0.3) 96.2%)'
            : '',
        height: '75px',
        maxWidth: '275px',
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
      <Grid container margin={2}>
        <Grid item xs={6}>
          {item && item.kind && (
            <Typography sx={{ color: COLORS.WHITE, textTransform: 'capitalize' }}>
              {item.kind}
            </Typography>
          )}
        </Grid>
        <Grid item xs={5}>
          <Typography sx={{ color: COLORS.DARK_YELLOW_1 }}>
            {item.token_id ? displayId : ''}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  )
}

export default StakeDragon
