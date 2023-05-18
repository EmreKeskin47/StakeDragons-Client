import React, { useState, useEffect, useRef } from 'react'
import { useLocation, Link } from 'react-router-dom'

import IconButton from '@mui/material/IconButton'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { ArrowForward } from '@mui/icons-material'
import {
  Stack,
  useMediaQuery,
  Tooltip,
  AppBar,
  Slide,
  Typography,
  List,
  Box,
  Fade,
} from '@mui/material'
import { useTheme, withStyles } from '@mui/styles'

// Components
import { Logo } from 'components/Logo'
import { ConnectWalletButton } from 'components/Button'
import Disclaimer from 'components/Disclaimer'

// Util
import * as COLORS from 'util/ColorUtils'
import { walletBalancePipe } from 'util/Pipes'
import { useWallet } from 'contexts/wallet'
import { useKeplr } from 'services/keplr'
import useStyles from 'styles'
import Cw20DRGN from 'contracts/cw20-drgn'

//Assets
import drgn from 'assets/drawer/Halloween.png'
import hamburger from 'assets/drawer/hamburger.svg'
import hamburgerClose from 'assets/drawer/hamburger-close.svg'
import walletBtn from 'assets/drawer/wallet.svg'
import walletConnectedBtn from 'assets/drawer/wallet-connected.svg'
import arrowDown from 'assets/drawer/arrowdown.svg'
import arrowDownSelected from 'assets/drawer/arrowdown-selected.svg'
import bgOuter from 'assets/bg2.png'
import bg from 'assets/bg.png'
import title from 'assets/title1.png'
import { DRAWER_ITEMS } from './DrawerLinks'
import { getContainerProps, getDrawerProps } from '../../util/PageUtils'
import DrawerLinkWithSubmenu from './DrawerLinkWithSubmenu'
import Bat from '../../components/Halloween/Bat'

const TransparentToolTip = withStyles({
  tooltip: {
    backgroundColor: 'transparent',
  },
})(Tooltip)

export default function AppHeader(props) {
  const classes = useStyles()
  const theme = useTheme()
  const location = useLocation()
  const wallet = useWallet()
  const keplr = useKeplr()

  const [drawerOpen, setDrawerOpen] = useState(JSON.parse(localStorage.getItem('is-open')) || false)
  const [closed, setClosed] = useState(!drawerOpen)
  const [isMobileHeight, setIsMobileHeight] = useState(window.innerHeight < 800)
  const [junoBalance, setJunoBalance] = useState(0)
  const [drgnBalance, setDrgnBalance] = useState(0)
  const [drgnToJuno, setDrgnToJuno] = useState(0)

  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const containerRef = useRef(null)

  var drawerWidth = drawerOpen ? 360 : 260
  var drawerHeight = isMobile || isMobileHeight ? 120 : 150

  useEffect(() => {
    localStorage.setItem('is-open', JSON.stringify(drawerOpen))

    function handleResize() {
      setIsMobileHeight(window.innerHeight < 850)
    }

    window.addEventListener('resize', handleResize)
  }, [drawerOpen])

  const [shouldShowInformativeDialog, setShouldShowInformativeDialog] = useState('false')

  useEffect(() => {
    setShouldShowInformativeDialog(
      typeof window !== 'undefined' && localStorage.getItem('shouldShowInformativeDialog'),
    )
  }, [])

  useEffect(() => {
    const loadDrgnBalanceInfo = async () => {
      if (wallet.initialized) {
        try {
          let balances = wallet.balance
          if (balances !== []) {
            balances.forEach((item) => {
              if (item.denom === 'ujuno') {
                setJunoBalance(Number(item.amount / 1000000))
              }
              if (item.denom === 'DRGN') {
                setDrgnBalance(Number(item.amount))
              }
            })
          }
          const client = Cw20DRGN(wallet.getClient())
          let drgnJuno = await client.getDrgnJunoPoolInfo()
          setDrgnToJuno(drgnJuno)
        } catch (e) { }
      }
    }

    loadDrgnBalanceInfo()
  }, [wallet])

  const handleAcceptInformativeDialog = () => {
    localStorage.setItem('shouldShowInformativeDialog', 'false')
    setShouldShowInformativeDialog('false')
  }

  useEffect(() => {
    if (isMobile) {
      setClosed(true)
      setDrawerOpen(false)
    }
  }, [isMobile])

  const openDrawer = (
    <Box
      sx={{
        width: drawerWidth,
        paddingTop: isMobileHeight ? `${drawerHeight}px` : 16,
        borderRight: `2px solid ${COLORS.DARK_YELLOW_1}`,
        background: 'linear-gradient(180deg, rgba(52, 52, 52, 0) -13.06%, #343434 100%)',
        maxHeight: '100vh',
        ...getDrawerProps(location.pathname),
      }}
      ref={containerRef}
    >
      <>
        <Bat styles={{ width: 90, top: 190, left: 210 }} variant='dark' />
        <Bat styles={{ width: 50, top: 300, left: 190, rotate: '-75deg' }} variant='dark' />
        <Bat styles={{ width: 75, top: 480, left: 210, rotate: '-15deg' }} variant='dark' />
        {!isMobileHeight && <Bat styles={{ width: 50, top: 580, left: 250, rotate: '-75deg' }} variant='dark' />}
      </>
      <List
        className={classes.displayFlex}
        sx={{
          justifyContent: 'space-between',
          height: '100% ',
          paddingTop: `48px`,
          paddingBottom: '4px',
        }}
      >
        <div style={{ maxHeight: '80%', overflow: 'hidden auto' }}>
          {DRAWER_ITEMS.map((item, key) => {
            if (item.submenus?.length && item.submenus?.length > 0)
              return (
                <DrawerLinkWithSubmenu
                  key={key}
                  drawerItem={item}
                  isMobileHeight={isMobileHeight}
                />
              )
            return (
              <ListItem
                key={key}
                component={Link}
                to={item.link}
                sx={{
                  '&:hover': {
                    textDecoration: 'none',
                  },
                  maxWidth: '250px',
                  paddingTop: isMobileHeight ? '0px !important' : '4px',
                  paddingBottom: isMobileHeight ? '0px !important' : '4px',
                }}
              >
                <ListItemButton
                  sx={{
                    border:
                      location.pathname === item.link + ''
                        ? `3px solid ${COLORS.DARK_YELLOW_1}`
                        : 'none',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: 3,
                      justifyContent: 'center',
                    }}
                  >
                    <Box>
                      {item.link === '/dragon-up' && (
                        <Box display={'flex'} marginBottom={0.5}>
                          <img
                            src={
                              location.pathname === '/dragon-up' ? arrowDownSelected : arrowDown
                            }
                            alt="arrowup"
                            width={'12px'}
                            height={'12px'}
                            style={{ rotate: '180deg' }}
                          />
                          <img
                            src={
                              location.pathname === '/dragon-up' ? arrowDownSelected : arrowDown
                            }
                            alt="arrowup"
                            width={'12px'}
                            height={'12px'}
                            style={{ rotate: '180deg' }}
                          />

                          <img
                            src={
                              location.pathname === '/dragon-up' ? arrowDownSelected : arrowDown
                            }
                            alt="arrowup"
                            width={'12px'}
                            height={'12px'}
                            style={{ rotate: '180deg' }}
                          />
                        </Box>
                      )}
                      <img
                        src={location.pathname === item.link + '' ? item.selected : item.image}
                        alt="logo"
                        width="36px"
                        height="36px"
                      />
                      {item.link === '/dragondrop' && (
                        <Box display={'flex'} marginTop={0.5}>
                          <img
                            src={
                              location.pathname === '/dragondrop' ? arrowDownSelected : arrowDown
                            }
                            alt="arrowdown"
                            width={'12px'}
                            height={'12px'}
                          />
                          <img
                            src={
                              location.pathname === '/dragondrop' ? arrowDownSelected : arrowDown
                            }
                            alt="arrowdown"
                            width={'12px'}
                            height={'12px'}
                          />

                          <img
                            src={
                              location.pathname === '/dragondrop' ? arrowDownSelected : arrowDown
                            }
                            alt="arrowdown"
                            width={'12px'}
                            height={'12px'}
                          />
                        </Box>
                      )}
                    </Box>
                  </ListItemIcon>
                  <ListItemText primary={item.text} sx={{ color: COLORS.WHITE }} />
                </ListItemButton>
              </ListItem>
            )
          })}
        </div>
        <div>
          <ListItem sx={{ display: 'flex', marginLeft: -1 }}>
            <a href={'https://junoswap.com/'} target="_blank" rel="noopener noreferrer">
              <img src={drgn} alt="logo" width="60px" height="60px" style={{ margin: '10px' }} />{' '}
            </a>
            <ListItemText primary={'1 $DRGN'} sx={{ color: COLORS.WHITE }} />
            <ListItemText primary={'='} sx={{ color: COLORS.WHITE }} />
            <ListItemText
              primary={walletBalancePipe(drgnToJuno.toFixed(2)) + ' JUNO'}
              sx={{ color: COLORS.WHITE }}
            />
          </ListItem>
          <Box marginLeft={2} my={'3px'}>
            <a href={'https://stake-dragons.gitbook.io/stakedragons/'} target="_blank" rel="noopener noreferrer" style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '8px',
              color: '#FFF',
              width: 'fit-content'
            }}>
              <Typography sx={{ fontSize: '18px' }}>Docs</Typography>
              <ArrowForward sx={{ fontSize: '18px', rotate: '-45deg' }} />
            </a>
            <ConnectWalletButton />
          </Box>
        </div>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', color: 'white', p: 1, pb: 0 }}>
          <Typography sx={{ fontSize: '12px' }}>v1.2.4</Typography>
          <Typography sx={{ fontSize: '12px' }}>©️ Copyright Stake Dragons - 2022 ©️</Typography>
        </Box>
      </List>
    </Box>
  )
  const closedDrawer = (
    <Box
      marginLeft={{ xs: 0.5, lg: 3.5 }}
      sx={{
        width: { xs: '120px', sm: '260px' },
        paddingTop: `${drawerHeight}px`,
        ...getDrawerProps(location.pathname),
      }}
    >
      <>
        <Bat styles={{ width: 90, top: 190, left: 190 }} />
        <Bat styles={{ width: 50, top: 300, left: 170, rotate: '-75deg' }} />
        <Bat styles={{ width: 75, top: 480, left: 190, rotate: '-15deg' }} />
        {!isMobileHeight && <Bat styles={{ width: 50, top: 580, left: 230, rotate: '-75deg' }} />}
      </>
      <List
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          height: '100%',
          paddingTop: { lg: `24px`, xs: '48px' },
        }}
      >
        <div style={{ flexGrow: 1, overflow: 'hidden auto', width: 'fit-content' }}>
          {DRAWER_ITEMS.map((item, key) => {
            return (
              <TransparentToolTip
                disableFocusListener
                placement="right"
                key={key}
                title={
                  item.submenus ? (
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                      }}
                    >
                      {item.submenus.map((submenu, idx) => (
                        <ListItem
                          key={idx}
                          component={Link}
                          to={submenu.link}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            flexGrow: 1,
                            gap: '6px',
                            p: '6px',
                            background:
                              location.pathname === submenu.link
                                ? 'rgba(217, 174, 106, 0.3)'
                                : 'rgba(97, 97, 97, 0.3)',
                            borderRadius: '4px',
                            marginBottom: '4px',
                            cursor: 'pointer',
                            width: '150px',
                            ':hover': {
                              textDecoration: 'none',
                            },
                          }}
                        >
                          {location.pathname === submenu.link + '' ? (
                            <img src={submenu.selected} alt="logo" width={16} height={16} />
                          ) : (
                            <img src={submenu.image} alt="logo" width={16} height={16} />
                          )}
                          <Typography
                            sx={{
                              fontSize: '14px',
                              color:
                                location.pathname === submenu.link
                                  ? COLORS.DARK_YELLOW_1
                                  : COLORS.WHITE,
                            }}
                          >
                            {submenu.text}
                          </Typography>
                        </ListItem>
                      ))}
                    </Box>
                  ) : (
                    <Typography
                      variant="subtitle1"
                      component="h2"
                      p={1}
                      sx={{ backgroundColor: 'rgba(97,97,97,1)', borderRadius: '4px' }}
                    >
                      {item.text}
                    </Typography>
                  )
                }
              >
                <ListItem
                  component={Link}
                  to={item.link}
                  sx={{
                    maxWidth: '120px',
                    paddingTop: '0px',
                    paddingBottom: '0px',
                  }}
                >
                  <ListItemButton>
                    <Box
                      sx={{
                        border:
                          location.pathname === item.link + ''
                            ? `1px solid ${COLORS.DARK_YELLOW_1}`
                            : 'none',
                        borderRadius: '4px',
                        background: COLORS.GREY_30,
                      }}
                      p={isMobileHeight ? 1 : 2}
                    >
                      {item.link === '/dragon-up' && !isMobileHeight && (
                        <Box display={'flex'} marginBottom={0.5}>
                          <img
                            src={
                              location.pathname === '/dragon-up' ? arrowDownSelected : arrowDown
                            }
                            alt="arrowup"
                            width={'8px'}
                            height={'8px'}
                            style={{ rotate: '180deg' }}
                          />
                          <img
                            src={
                              location.pathname === '/dragon-up' ? arrowDownSelected : arrowDown
                            }
                            alt="arrowup"
                            width={'8px'}
                            height={'8px'}
                            style={{ rotate: '180deg' }}
                          />

                          <img
                            src={
                              location.pathname === '/dragon-up' ? arrowDownSelected : arrowDown
                            }
                            alt="arrowup"
                            width={'8px'}
                            height={'8px'}
                            style={{ rotate: '180deg' }}
                          />
                        </Box>
                      )}
                      {location.pathname === item.link + '' ||
                        item.submenus?.some((submenu) => submenu.link === location.pathname) ? (
                        <img
                          src={item.selected}
                          alt="logo"
                          width={isMobileHeight ? '20px' : '24px'}
                          height={isMobileHeight ? '20px' : '24px'}
                        />
                      ) : (
                        <img
                          src={item.image}
                          alt="logo"
                          width={isMobileHeight ? '20px' : '24px'}
                          height={isMobileHeight ? '20px' : '24px'}
                        />
                      )}
                      {item.link === '/dragondrop' && !isMobileHeight && (
                        <Box display={'flex'} marginTop={0.5}>
                          <img
                            src={
                              location.pathname === '/dragondrop' ? arrowDownSelected : arrowDown
                            }
                            alt="arrowdown"
                            width={'8px'}
                            height={'8px'}
                          />
                          <img
                            src={
                              location.pathname === '/dragondrop' ? arrowDownSelected : arrowDown
                            }
                            alt="arrowdown"
                            width={'8px'}
                            height={'8px'}
                          />

                          <img
                            src={
                              location.pathname === '/dragondrop' ? arrowDownSelected : arrowDown
                            }
                            alt="arrowdown"
                            width={'8px'}
                            height={'8px'}
                          />
                        </Box>
                      )}
                    </Box>
                  </ListItemButton>
                </ListItem>
              </TransparentToolTip>
            )
          })}
        </div>
        <div>
          <ListItem
            sx={{
              marginLeft: '0.2rem',
              paddingTop: '0px !important',
              paddingBottom: '0px !important',
            }}
          >
            <IconButton>
              <Tooltip
                placement="right"
                title={
                  <Box sx={{ display: 'flex' }}>
                    <Typography variant="subtitle1" component="h2" px={1}>
                      1 $DRGN
                    </Typography>
                    <Typography variant="subtitle1" component="h2" px={1}>
                      =
                    </Typography>
                    <Typography variant="subtitle1" component="h2" px={1}>
                      {walletBalancePipe(drgnToJuno.toFixed(2)) + ' JUNO'}
                    </Typography>
                  </Box>
                }
              >
                <a href={'https://junoswap.com/'} target="_blank" rel="noopener noreferrer">
                  <img
                    src={drgn}
                    alt="logo"
                    width={isMobileHeight ? '36px' : '48px'}
                    height={isMobileHeight ? '36px' : '48px'}
                    style={{ marginLeft: '0.6rem' }}
                  />
                </a>
              </Tooltip>
            </IconButton>
          </ListItem>

          <ListItem
            sx={{
              marginLeft: '0.5rem',
              paddingTop: isMobileHeight ? '0px !important' : '8px',
              paddingBottom: isMobileHeight ? '0px !important' : '8px',
            }}
            onClick={() => (wallet.initialized ? keplr.disconnect() : keplr.connect())}
          >
            <Tooltip
              placement="right"
              title={
                wallet.initialized ? (
                  <Box sx={{ display: 'flex', background: COLORS.GREY_30 }}>
                    <Typography variant="subtitle1" component="h2" sx={{ color: COLORS.GOLD }}>
                      {walletBalancePipe(junoBalance.toFixed(2)) +
                        ' Juno / ' +
                        walletBalancePipe(drgnBalance.toFixed(2)) +
                        ' DRGN'}
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex' }} p={1}>
                    <Typography variant="subtitle1" component="h2">
                      Connect Wallet
                    </Typography>
                  </Box>
                )
              }
            >
              <IconButton>
                <Box
                  sx={{
                    borderRadius: '4px',
                    background: wallet.initialized ? COLORS.SMOOTH_YELLOW_30 : COLORS.GREY_30,
                    display: 'flex',
                    height: isMobileHeight ? '50px' : '57px',
                    width: isMobileHeight ? '50px' : '57px',
                    placeContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {wallet.initialized ? (
                    <img
                      src={walletConnectedBtn}
                      alt="logo"
                      width={isMobileHeight ? '20px' : '24px'}
                      height={isMobileHeight ? '20px' : '24px'}
                    />
                  ) : (
                    <img
                      src={walletBtn}
                      alt="logo"
                      width={isMobileHeight ? '20px' : '24px'}
                      height={isMobileHeight ? '20px' : '24px'}
                    />
                  )}
                </Box>
              </IconButton>
            </Tooltip>
          </ListItem>
        </div>
      </List>
    </Box>
  )

  const handleDrawerToggle = () => {
    if (isMobile) return
    setDrawerOpen(!drawerOpen)
    setClosed(!closed)
  }
  const floorPricedDragonClicked = (kind) => {
    window.location.href = `/market?listType=dragon&kind=${kind}`
  }

  const floorPricedEggClicked = () => {
    window.location.href = `/market?listType=egg`
  }

  return (
    <Box sx={{ display: 'flex', height: '100%', overflow: 'auto' }}>
      <AppBar
        sx={{
          ' &.MuiAppBar-colorPrimary': {
            backgroundColor: COLORS.DARK_BLACK_1,
            backgroundImage: `url(${bgOuter})`,
            backgroundBlendMode: 'soft-light',
          },
        }}
      >
        <Box
          py={3}
          px={isMobile ? 4 : 7}
          sx={{ borderBottom: `2px solid ${COLORS.DARK_YELLOW_1}` }}
        >
          <Stack direction="row" justifyContent={'space-between'} alignItems="center">
            <Box>
              <IconButton
                onClick={handleDrawerToggle}
                sx={{
                  marginRight: 5,
                }}
              >
                {shouldShowInformativeDialog && (
                  <>
                    {!isMobile && drawerOpen ? (
                      <img src={hamburgerClose} alt="logo" width="48px" height="48px" />
                    ) : (
                      <img src={hamburger} alt="logo" width="48px" height="48px" />
                    )}
                  </>
                )}
              </IconButton>
              {!shouldShowInformativeDialog && location.pathname === '/app' && (
                <Logo isMobileView={isMobile} />
              )}
              {location.pathname !== '/app' && <Logo isMobileView={isMobile || isMobileHeight} />}
            </Box>

            {!shouldShowInformativeDialog && location.pathname === '/app' ? (
              <Box sx={{ width: '100%', textAlign: 'center' }}>
                <Typography sx={{ fontSize: { xs: '24px', lg: '40px' } }} className={classes.h1}>
                  Stake Dragons
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  width: { xs: `calc(100% - 170px)`, md: `calc(100% - ${drawerWidth + 320}px)` },
                  textAlign: 'center',
                }}
              >
                {location.pathname !== '/app' && (
                  <img src={title} alt="Stake Dragons" height="100px" width="auto" />
                )}
              </Box>
            )}
            <Box />
          </Stack>
        </Box>
      </AppBar>

      {!shouldShowInformativeDialog && (
        <Disclaimer onAcceptInformativeDialog={handleAcceptInformativeDialog} />
      )}

      {shouldShowInformativeDialog === 'false' && (
        <>
          {isMobile || closed ? (
            <Fade in={closed} timeout={1000}>
              {closedDrawer}
            </Fade>
          ) : (
            <Slide
              direction="right"
              in={drawerOpen}
              container={containerRef.current}
              unmountOnExit
              timeout={1000}
            >
              {openDrawer}
            </Slide>
          )}
          <Box
            component="main"
            sx={{
              overflow: 'auto',
              marginTop: ` ${drawerHeight}px`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover !important',
              padding: 4,
              ...getContainerProps({ page: location.pathname, bg, drawerOpen, drawerWidth }),
            }}
          >
            {props.children}
          </Box>
        </>
      )}
    </Box>
  )
}
