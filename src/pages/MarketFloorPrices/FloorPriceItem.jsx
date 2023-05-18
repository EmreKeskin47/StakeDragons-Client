import React from 'react'

import { Box, Typography } from '@mui/material';

const FloorPriceItem = ({ item, floorPrices, postfix = 'dragon' }) => {
    const { name, color } = item;
    const price = (parseInt(floorPrices[name] ?? 0)) / 1000000

    if (price <= 0) return null;

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                maxWidth: '270px',
                gap: '16px'
            }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: 48,
                border: `2px solid ${color}`,
                borderRadius: '4px'
            }}>
                <Typography sx={{
                    fontSize: {
                        lg: '20px',
                        xs: '14px'
                    },
                    lineHeight: '30px',
                    fontWeight: 500,
                    color: 'white',
                    textTransform: 'capitalize'
                }}>
                    {name === 'udin' ? 'idunn' : name} {postfix}
                </Typography>
            </Box>
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: 48,
                border: `1px solid ${color}`,
                borderRadius: '4px'
            }}>
                <Typography sx={{
                    fontSize: {
                        lg: '16px',
                        xs: '12px'
                    },
                    lineHeight: '23px',
                    fontWeight: 400,
                    color: 'white',
                    textTransform: 'capitalize'
                }}>
                    {price} DRGN
                </Typography>
            </Box>
        </Box>
    )
}

export default FloorPriceItem