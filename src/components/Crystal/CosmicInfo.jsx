import React from 'react'
import { Box, Grid, Typography } from '@mui/material'

import { CustomOutlinedLabel } from 'components/Label'
//import { CountDown } from 'components/Countdown'
import useStyles from 'styles'
import { DayCountDown } from '../Countdown'

const CosmicInfo = (props) => {
  const { item } = props
  const classes = useStyles()

  return (
    <Box className={classes.goldBox4} py={1} px={2}>
      <Typography className={classes.h2}>Cosmic Crystal Info</Typography>
      <Grid container spacing={2} sx={{ marginTop: 5, width: '100%', gridAutoRows: '1fr' }}>
        <Grid item xs={6}>
          {item ? (
            <Box
              sx={{
                marginY: 2,
                display: { lg: 'flex', xs: 'block' },
                justifyContent: 'center',
                flexDirection: 'column',
                paddingBottom: '20px',
              }}
            >
              <Box marginRight={2}>
                <DayCountDown title={'Unstake: '} day={14} />
              </Box>
            </Box>
          ) : (
            <Box
              sx={{ marginY: 2, display: { lg: 'flex', xs: 'block' }, justifyContent: 'center' }}
            >
              <Box marginRight={2} paddingY={1}>
                <DayCountDown title={'Unstake: '} day={14} styles={{ paddingBottom: '10px' }} />
              </Box>
            </Box>
          )}
        </Grid>
        <Grid item xs={6}>
          {item && (
            <CustomOutlinedLabel
              title="Daily (DRGN) Reward Amount"
              amount="10"
              unit="DRGN"
              styles={{
                marginY: 2,
                display: { lg: 'flex', xs: 'block' },
                justifyContent: 'center',
              }}
            />
          )}
        </Grid>
        {item && item.is_staked && (
          <Grid container>
            <Grid item xs={12}>
              <Typography className={classes.h3} sx={{ marginY: 2, marginLeft: "20px" }}>
                Cosmic Crystal is staked
              </Typography>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Box>
  )
}

export default CosmicInfo
