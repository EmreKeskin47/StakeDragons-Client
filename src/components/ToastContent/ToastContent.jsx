import { Box, Typography } from '@mui/material'
import React from 'react'

import successIcon from 'assets/success-icon.svg'
import failIcon from 'assets/fail-icon.svg'
import Loading from '../Loading'

const VARIANTS = {
    'success': {
        color: '#59AD00',
        title: 'Transaction Successful',
        icon: <img alt='success' src={successIcon} style={{ width: 24, height: 24 }} />
    },
    'fail': {
        color: '#C60202',
        title: 'Transaction Failed',
        icon: <img alt='fail' src={failIcon} style={{ width: 24, height: 24 }} />
    },
    'broadcasting': {
        color: '#FCD180',
        title: 'Transaction Broadcasting',
        icon: <Loading />
    }
}

const ToastContent = ({ variant, txHash, manualTitle, description }) => {
    const { color, title, icon } = VARIANTS[variant];
    return (
        <Box sx={{
            width: '278px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            border: '3px solid',
            borderColor: color,
            borderRadius: '4px',
            gap: '20px',
            py: '8px',
            px: '16px',
            backgroundColor: '#141414'
        }}>
            <Box sx={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                {icon}
                <Typography sx={{ fontSize: '16px', color }}>
                    {manualTitle || title}
                </Typography>
            </Box>
            {
                txHash ? <a href={`https://www.mintscan.io/juno/txs/${txHash}`} target='_blank' rel="noopener noreferrer">
                    <Typography sx={{ fontSize: '12px', color, textAlign: 'center' }}>
                        {description || 'Click here for TX'}
                    </Typography>
                </a> :
                    <Typography sx={{ fontSize: '12px', color, textAlign: 'center' }}>
                        {description || 'Please wait while the blockchain processing on your transaction.'}
                    </Typography>
            }
        </Box>
    )
}

export default ToastContent