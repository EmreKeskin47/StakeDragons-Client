import { ExpandMore } from '@mui/icons-material'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import { makeStyles, withStyles } from '@mui/styles'
import React from 'react'
import { useLocation } from 'react-router'
import { Link } from 'react-router-dom'

import * as COLORS from 'util/ColorUtils'

const StyledAccordion = withStyles({
  root: {
    backgroundColor: 'transparent',
    padding: 0,
    boxShadow: 'none',
  },
})(Accordion)

const useStyles = makeStyles(() => ({
  content: {
    margin: 0,
    '&$expanded': {
      margin: '0px !important',
    },
  },
  rootExpanded: {
    margin: '0px 8px !important',
  },
  summaryExpanded: {
    margin: '0px !important',
  }
}))

const DrawerLinkWithSubmenu = ({ drawerItem, isMobileHeight }) => {
  const location = useLocation()
  const classes = useStyles()

  const isSelected = drawerItem.submenus.some((submenu) => submenu.link === location.pathname)

  return (
    <StyledAccordion
      sx={{
        m: 0,
        p: 0,
        mx: isSelected ? '10px' : '0px',
        paddingRight: 2,
        border: isSelected ? `3px solid ${COLORS.DARK_YELLOW_1}` : 'none',
      }}
      classes={{ expanded: classes.rootExpanded }}
    >
      <AccordionSummary
        classes={{ content: classes.content, expanded: classes.summaryExpanded }}
        expandIcon={<ExpandMore sx={{ color: 'white' }} />}
        sx={{ m: 0, p: 0, paddingRight: isSelected ? '4px' : 2 }}
        aria-controls={drawerItem.text}
        id={drawerItem.text}
      >
        <ListItem
          sx={{
            '&:hover': {
              textDecoration: 'none',
            },
            maxWidth: '250px',
            paddingTop: isMobileHeight ? '0px !important' : '4px',
            paddingBottom: isMobileHeight ? '0px !important' : '4px',
            paddingLeft: isSelected ? '4px' : undefined,
          }}
        >
          <ListItemButton
            sx={{
              pr: 0,
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
                <img
                  src={isSelected ? drawerItem.selected : drawerItem.image}
                  alt="logo"
                  width="36px"
                  height="36px"
                />
              </Box>
            </ListItemIcon>
            <ListItemText primary={drawerItem.text} sx={{ color: COLORS.WHITE }} />
          </ListItemButton>
        </ListItem>
      </AccordionSummary>
      <AccordionDetails>
        {drawerItem.submenus?.map((submenu) => (
          <ListItem
            key={submenu.link}
            component={Link}
            to={submenu.link}
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
                border: 'none',
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
                  <img
                    src={location.pathname === submenu.link + '' ? submenu.selected : submenu.image}
                    alt="logo"
                    width="36px"
                    height="36px"
                  />
                </Box>
              </ListItemIcon>
              <ListItemText
                primary={submenu.text}
                sx={{
                  color:
                    location.pathname === submenu.link + '' ? COLORS.DARK_YELLOW_1 : COLORS.WHITE,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </AccordionDetails>
    </StyledAccordion>
  )
}

export default DrawerLinkWithSubmenu
