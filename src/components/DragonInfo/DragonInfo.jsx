import React from 'react'
import { Box, Grid, Typography } from '@mui/material'

import { CustomOutlinedLabel } from 'components/Label'
//import { CountDown } from 'components/Countdown'
import useStyles from 'styles'
import { DayCountDown } from '../Countdown'

const DragonInfo = (props) => {
  const { item, staked } = props
  const classes = useStyles()

  return (
    <Box className={classes.goldBox4} py={1} px={2}>
      <Typography className={classes.h2}>Dragon Info</Typography>
      <Grid container spacing={2} sx={{ marginTop: 5, width: '100%', gridAutoRows: '1fr' }}>
        <Grid item xs={6}>
          {item && (
            <CustomOutlinedLabel
              title="Rarity"
              amount={item.kind}
              styles={{ width: '100%', height: '100%', textTransform: 'capitalize' }}
            />
          )}
        </Grid>
        <Grid item xs={6}>
          {item && (
            <CustomOutlinedLabel
              title="Daily (DRGN) Reward Amount"
              amount={item.daily_income ? item.daily_income : '0'}
              unit="DRGN"
              styles={{ width: '100%', height: '100%' }}
            />
          )}
        </Grid>
      </Grid>
      {item ? (
        <Box
          sx={{
            marginY: 2,
            display: { lg: 'flex', xs: 'block' },
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <Box marginRight={2}>
            <DayCountDown title={'Ovulation Period:'} day={item.ovulation_period} />
          </Box>
          {staked && (
            <Box marginTop={2} sx={{ color: 'white', textAlign: 'center' }}>
              <Typography> Dragon is Staked </Typography>
            </Box>
          )}
        </Box>
      ) : (
        <Box sx={{ marginY: 2, display: { lg: 'flex', xs: 'block' }, justifyContent: 'center' }}>
          <Box marginRight={2}>
            <DayCountDown title={'Ovulation Period:'} day={60} />
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default DragonInfo
