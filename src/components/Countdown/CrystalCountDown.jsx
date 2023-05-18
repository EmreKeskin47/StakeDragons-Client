import React from 'react'
import { Box, Typography } from '@mui/material'
import useStyles from 'styles'

const CrystalCountDown = (props) => {
  const { title } = props
  const classes = useStyles()

  return (
    <Box
      className={classes.goldBox1}
      py={1}
      px={2}
      sx={{
        width: { md: '12vw', xs: '100%' },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'start',
      }}
    >
      <Typography
        className={classes.h3Grey}
        sx={{ fontSize: { xl: '16px !important', xs: '12px !important' }, paddingRight: '10px' }}
      >
        {title}
      </Typography>
      <Typography
        className={classes.h3}
        sx={{ fontSize: { xl: '16px !important', xs: '12px !important' } }}
      >
        {props.days} Days
      </Typography>
    </Box>
  )
}

export default CrystalCountDown
