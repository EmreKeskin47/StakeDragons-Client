import React from 'react'
import { Box, Stack, Typography, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { AppStoreButton, GooglePlayButton } from 'components/Button'

const Footer = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <>
      <Box
        sx={{
          position: 'absolute',
          bottom: '20px',
          textAlign: isMobile && 'center',
          width: isMobile ? '100%' : 'initial',
        }}
        ml={!isMobile ? 1 : 0}
      >
        <Stack direction="row" justifyContent="center" marginLeft="56px" mb={3} spacing={3}>
          <GooglePlayButton />
          <AppStoreButton />
        </Stack>
      </Box>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', color: 'white', p: 1 }}>
        <Typography sx={{ fontSize: '12px' }}>©️ Copyright Stake Dragons - 2022 ©️</Typography>
      </Box>
    </>
  )
}

export default Footer
