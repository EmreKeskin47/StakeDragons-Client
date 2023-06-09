import React from 'react'
import { Button } from '@mui/material'
import * as COLORS from 'util/ColorUtils'
import spiderWeb from 'assets/halloween/spider-web.svg'
import ghost from 'assets/halloween/ghost.svg'

const CustomOutlinedButton = ({ title, onClick, styles, img, disabled }) => (
  <Button
    variant="outlined"
    py={2}
    onClick={onClick}
    sx={{
      margin: 'auto',
      borderRadius: '4px',
      borderColor: disabled ? COLORS.DISABLED_BUTTON : COLORS.DARK_YELLOW_1,
      borderWidth: '2px',
      '&:hover': {
        borderWidth: '2px',
      },
      color: disabled ? COLORS.DISABLED_BUTTON : COLORS.WHITE,
      fontSize: { lg: '20px', md: '15px' },
      textTransform: 'none',
      lineHeight: '30px',
      position: 'relative',
      ...styles,
    }}
  >
    <>
      <img alt='spider-web' src={spiderWeb} style={{ width: 40, aspectRatio: '1', position: 'absolute', right: 0, top: 0, pointerEvents: 'none' }} />
      <img alt='ghost' src={ghost} style={{ position: 'absolute', left: 0, bottom: 0, rotate: '180deg', pointerEvents: 'none' }} />
    </>
    {img && <img src={img} alt="icon" width="16px" height="16px" style={{ marginRight: 8 }} />}
    {title}
  </Button>
)

export default CustomOutlinedButton
