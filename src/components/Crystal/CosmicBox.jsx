import React from 'react'
import { Box } from '@mui/material'

import Cosmic from 'assets/crystal/Cosmic.png'

const CosmicBox = ({ styles, item }) => {
  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          ...styles,
        }}
      >
        <img src={Cosmic} alt="cosmic img" width={'100%'} />
      </Box>
    </Box>
  )
}

export default CosmicBox
