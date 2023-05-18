import React, { useEffect, useState } from 'react'
import { Box, Grid, ListItem, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

import { CustomOutlinedButton } from 'components/Button'
import * as COLORS from 'util/ColorUtils'

import { DenomPipe } from '../../util/Pipes'
import { getDragonPropertiesByKind } from '../../util/constants'

const DragonCard = (props) => {
  const { item } = props

  const [displayId, setDisplayId] = useState('')
  const [background, setBackground] = useState('#72736D')
  const [width, setWidth] = useState('40%')
  const [dragon, setDragon] = useState(null)

  useEffect(() => {
    if (item.id) {
      let length = item.id.toString().length

      let id = '#'
      if (length < 5) {
        let idLeadingZero = 5 - length
        for (let i = 0; i < idLeadingZero; i++) {
          id = id + '0'
        }
      }
      id = id + item.id.toString()
      setDisplayId(id)
    }
  }, [item.id])

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
        height: '510px',
        width: '100%',
        maxWidth: '275px',
        mr: 2,
        mb: 2,
        zIndex: 100
      }}
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
        height={'180px'}
        width={'100%'}
        style={{ marginTop: '60px', marginBottom: '60px', objectFit: 'contain' }}
      />
      <Grid container marginX={4}>
        <Grid item xs={6}>
          {item.type && (
            <Typography sx={{ color: COLORS.SECONDARY_TEXT_GREY, fontWeight: 'bold' }}>
              Rarity
            </Typography>
          )}
        </Grid>
        <Grid item xs={6}>
          <Typography sx={{ color: COLORS.SECONDARY_TEXT_GREY, fontWeight: 'bold' }}>
            Price
          </Typography>
        </Grid>
      </Grid>
      <Grid container margin={4}>
        <Grid item xs={6}>
          {item.type && (
            <Typography sx={{ color: COLORS.WHITE, textTransform: 'capitalize' }}>
              {item.kind} Dragon
            </Typography>
          )}
        </Grid>
        <Grid item xs={5}>
          <Typography sx={{ color: COLORS.DARK_YELLOW_1 }}>{DenomPipe(item.price)} DRGN</Typography>
        </Grid>
      </Grid>
      <Grid container margin={4}>
        <Grid item xs={3.7}>
          <Typography sx={{ color: COLORS.SECONDARY_TEXT_GREY }}>{displayId}</Typography>
        </Grid>
        <Grid item xs={7}>
          <ListItem component={Link} to={'/buy-dragon/' + item.id} sx={{ paddingTop: '0px' }}>
            <CustomOutlinedButton
              title="Buy"
              styles={{ background: COLORS.DARK_YELLOW_1, padding: 1, marginTop: '0px' }}
            />
          </ListItem>
        </Grid>
      </Grid>
    </Box>
  )
}

export default DragonCard
