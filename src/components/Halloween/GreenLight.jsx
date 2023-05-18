import React from 'react'
import { Box } from '@mui/system'

const GreenLight = () => {
    return (
        <Box sx={{
            width: '620px',
            height: '520px',
            background: 'rgba(9, 255, 0, 0.36)',
            filter: 'blur(126px)',
            position: 'fixed',
            bottom: 0,
            left: '50%',
            transform: 'translate(-50%,50%)',
            pointerEvents: 'none'
        }} />
    )
}

export default GreenLight