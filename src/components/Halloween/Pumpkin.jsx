import React from 'react'

import { Box } from '@mui/system'

import pumpkinIcon from 'assets/halloween/pumpkin.svg'

const Pumpkin = ({ styles, imgStyles, position }) => {
    return (
        <Box sx={{ position: 'fixed', pointerEvents: 'none', ...position }}>
            <Box sx={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                aspectRatio: '1',
                padding: '2px',
                pointerEvents: 'none',
                ...styles
            }}>
                <img alt='pumpkin' src={pumpkinIcon} style={{ width: '65%', aspectRatio: '1', zIndex: 20, pointerEvents: 'none', ...imgStyles }} />
                <Box sx={{
                    background: 'rgba(255, 154, 0, 0.8)',
                    filter: 'blur(16px)',
                    position: 'absolute',
                    pointerEvent: 'none',
                    inset: 0,
                    pointerEvents: 'none'
                }}>
                </Box>
            </Box>
        </Box>
    )
}

export default Pumpkin