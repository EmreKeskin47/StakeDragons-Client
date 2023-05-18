import React, { useEffect, useState } from 'react'
import { Box, Grid, Typography } from '@mui/material'

import * as COLORS from 'util/ColorUtils'
import { DenomPipe } from 'util/Pipes'

import Divine from 'assets/crystal/Divine.png'
import Fire from 'assets/crystal/Fire.png'
import Storm from 'assets/crystal/Storm.png'
import Ice from 'assets/crystal/Ice.png'
import Udin from 'assets/crystal/Udin.png'

const CrystalCard = (props) => {
  const { item, price } = props
  const [displayId, setDisplayId] = useState('')
  const [crystal, setCrystal] = useState(null)

  useEffect(() => {
    if (item.token_id) {
      let length = item.token_id.toString().length

      let id = '#'
      if (length < 5) {
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
        cursor: 'pointer',
        height: props.height,
        width: props.maxWidth,
        position: 'relative',
        mr: 2,
        mb: 2,
        zIndex: 100,
      }}
      //   onClick={onClick}
    >
      <img
        src={crystal}
        alt="crystal img"
        height={'300px'}
        width={'100%'}
        style={{ marginBottom: '11px' }}
      />
      <Grid
        container
        width={'100%'}
        flexDirection={'row'}
        position={'absolute'}
        sx={{ bottom: '20px', left: '0px', px: 1 }}
      >
        {price == '0' ? (
          <Grid item xs={12} md={8} sx={{ pr: 1 }}>
            {item && item.kind && (
              <Typography
                sx={{
                  color: COLORS.WHITE,
                  textTransform: 'capitalize',
                  float: { xs: 'left', md: 'right' },
                }}
              >
                {item.kind === 'udin' ? 'idunn' : item.kind} Crystal
              </Typography>
            )}
          </Grid>
        ) : (
          <Grid container mx={2}>
            <Grid item xs={7}>
              {item && item.kind && (
                <Typography
                  sx={{
                    color: COLORS.WHITE,
                    textTransform: 'capitalize',
                  }}
                >
                  {item.kind === 'udin' ? 'idunn' : item.kind} Crystal
                </Typography>
              )}
            </Grid>

            <Grid item xs={5}>
              <Typography sx={{ color: COLORS.DARK_YELLOW_1, textAlign: 'right' }}>
                {DenomPipe(price)} DRGN
              </Typography>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Box>
  )
}

export default CrystalCard
