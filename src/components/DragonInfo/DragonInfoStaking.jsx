import React from 'react'
import { Box, Grid, Typography } from '@mui/material'

import { CustomOutlinedLabel } from 'components/Label'
//import { CountDown } from 'components/Countdown'
import useStyles from 'styles'
import { DayCountDown } from '../Countdown'

const DragonInfoStaking = (props) => {
  const { item } = props
  const classes = useStyles()

  return (
    <Box className={classes.goldBox4} py={2} px={2}>
      <Typography className={classes.h2} sx={{ fontSize: '20px !important' }}>
        Dragon Info
      </Typography>
      <Grid container spacing={2} sx={{ marginTop: 2, width: '100%', gridAutoRows: '1fr' }}>
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
      <Grid container spacing={2} sx={{ marginTop: 2, width: '100%', gridAutoRows: '1fr' }}>
        <Grid item xs={6} justifyContent="start">
          <DayCountDown
            title={'Ovulation Period:'}
            day={item ? item.ovulation_period : 60}
            textStyles={{ fontSize: '16px !important' }}
          />
        </Grid>
        <Grid item xs={6}>
          <DayCountDown title={'Unstake: '} day={14} textStyles={{ fontSize: '16px !important' }} />
        </Grid>
      </Grid>
    </Box>
  )
}

export default DragonInfoStaking
