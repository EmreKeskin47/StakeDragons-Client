import React, { useEffect, useState } from 'react'
import { Box, Grid, ListItem, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

import { CustomOutlinedButton } from 'components/Button'
import * as COLORS from 'util/ColorUtils'

import { DenomPipe } from '../../util/Pipes'
import Divine from 'assets/crystal/Divine.png'
import Fire from 'assets/crystal/Fire.png'
import Storm from 'assets/crystal/Storm.png'
import Ice from 'assets/crystal/Ice.png'
import Udin from 'assets/crystal/Udin.png'

const CrystalCard = (props) => {
  const { item } = props

  const [displayId, setDisplayId] = useState('')
  const [crystal, setCrystal] = useState(null)

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
      switch (item.kind) {
        case 'udin':
          setCrystal(Udin)
          break
        case 'storm':
          setCrystal(Storm)
          break
        case 'ice':
          setCrystal(Ice)
          break
        case 'fire':
          setCrystal(Fire)
          break
        case 'divine':
          setCrystal(Divine)
          break
        default:
          setCrystal(Fire)
      }
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
        zIndex: 100,
      }}
    >
      <Box
        sx={{
          border: '1px solid',
          borderImage: 'linear-gradient(90deg,#624B2C 0%, #E6E1C1 100%) 1',
        }}
      ></Box>
      <img
        src={crystal}
        alt="crystal img"
        height={'300px'}
        width={'100%'}
        style={{ marginBottom: '11px' }}
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
              {item.kind === 'udin' ? 'idunn' : item.kind} Crystal
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
          <ListItem component={Link} to={'/buy-crystal/' + item.id} sx={{ paddingTop: '0px' }}>
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

export default CrystalCard
