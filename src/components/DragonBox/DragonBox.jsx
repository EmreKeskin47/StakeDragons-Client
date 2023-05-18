import React from 'react'
import { Box } from '@mui/material'

import star from 'assets/dragon-up-star.svg'
import useStyles from 'styles'
import { getDragonPropertiesByKind } from '../../util/constants'

const DragonBox = ({ dragonType, styles }) => {
  const classes = useStyles()

  const { background, width, img } = getDragonPropertiesByKind(dragonType)

  return (
    <Box className={classes.goldBox4}>
      <Box
        sx={{
          background: `${background}`,
          borderRadius: '3px',
          width: `${width}`,
          height: '11px',
          marginTop: '-4px',
          marginLeft: '-4px',
          borderImageSlice: 1,
          border: '1px solid',
          borderImage: 'linear-gradient(90deg,#624B2C 0%, #E6E1C1 100%) 1',
        }}
      ></Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          ...styles,
        }}
      >
        <img src={img} alt="dragon img" height={'auto'} width={'100%'} />
        {dragonType?.includes('+') && <Box sx={{ display: 'flex', justifyContent: 'center' }}><img alt='star' src={star} width={20} height={20} /></Box>}
      </Box>
    </Box>
  )
}

export default DragonBox
