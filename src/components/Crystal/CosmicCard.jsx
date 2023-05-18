import React, { useEffect, useState } from 'react'
import { Box, Grid, Typography } from '@mui/material'

import * as COLORS from 'util/ColorUtils'
import Cosmic from 'assets/crystal/Cosmic.png'

const CosmicCard = (props) => {
  const { item } = props

  const [displayId, setDisplayId] = useState('')
  const [crystal, setCrystal] = useState(null)
  const [background, setBackground] = useState('')
  useEffect(() => {
    if (item.token_id) {
      setCrystal(Cosmic)
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

      if (item.is_staked) {
        setBackground(
          'linear-gradient(61.27deg, rgba(171, 137, 100, 0.3) 8.5%, rgba(196, 177, 134, 0.3) 96.2%)',
        )
      }
    }
  }, [item])

  return (
    <Box
      sx={{
        border: `1px solid ${COLORS.SMOOTH_YELLOW_30}`,
        borderRadius: '4px',
        cursor: 'pointer',
        background: background,
        height: props.height,
        width: props.maxWidth,
        position: 'relative',
        mr: 2,
        mb: 2,
        zIndex: 100
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
        <Grid item xs={12} md={8} sx={{ pr: 1 }} style={{ paddingRight: '0px' }}>
          {item && (
            <Typography
              sx={{
                color: COLORS.WHITE,
                textTransform: 'capitalize',
                float: { xs: 'left', md: 'right' },
              }}
            >
              Cosmic Crystal
            </Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  )
}

export default CosmicCard
