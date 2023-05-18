import React, { useState, useEffect } from 'react'
import Header from 'containers/Header'
import Footer from 'containers/Footer'
import { Box } from '@mui/material'
import { useLocation } from 'react-router-dom'
import * as COLORS from 'util/ColorUtils'
import { WalletProvider } from 'contexts/wallet'
import { ContractsProvider } from 'contexts/contract'
import { NETWORK } from 'util/constants'
import { useKeplr } from 'services/keplr'
import bgOuter from 'assets/bg2.png'
import { isFullHeightPage } from '../../util/PageUtils'
import Halloween from '../../components/Halloween/Halloween'

const SideEffects = () => {
  const keplr = useKeplr()

  useEffect(() => {
    const walletAddress = localStorage.getItem('wallet_address')
    if (walletAddress) {
      keplr.connect()
    }
  }, [keplr])

  return null
}

const Layout = ({ children }) => {
  const location = useLocation()
  const [network, setNetwork] = useState(NETWORK)

  return (
    <Box
      sx={{
        width: '100vw',
        height: isFullHeightPage(location.pathname) ? undefined : '100vh',
        minHeight: isFullHeightPage(location.pathname) ? '100vh' : undefined,
        left: 0,
        top: 0,
        display: 'flex',
        overflow: 'hidden',
        flexDirection: 'column',
        backgroundColor: location.pathname !== '/' && COLORS.DARK_BLACK_1,
        backgroundImage: location.pathname !== '/' && `url(${bgOuter})`,
        backgroundBlendMode: location.pathname !== '/' && 'soft-light',
        backgroundAttachment: isFullHeightPage(location.pathname) && 'fixed',
        backgroundPosition: isFullHeightPage(location.pathname) && 'center'
      }}
    >
      <WalletProvider network={network} setNetwork={setNetwork}>
        <ContractsProvider>
          <SideEffects />
          {location.pathname !== '/' && <Halloween />}
          <Header children={children} />
          {location.pathname === '/' && children}
          {location.pathname === '/' && <Footer />}
        </ContractsProvider>
      </WalletProvider>
    </Box>
  )
}

export default Layout
