import React, { useEffect, useState } from 'react'

import { Box, Tooltip, Typography } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

const MinMaxInfo = ({ minMaxAmounts, dragonSlots, selectedTokenType, tokenRatio }) => {
    const [amounts, setAmounts] = useState({})

    useEffect(() => {
        const dragonKind = dragonSlots.find(slot => slot !== null)?.kind
        const formattedMinMax = Object.entries(minMaxAmounts).reduce((acc, [key, value]) => {
            acc[key] = (parseInt(value) / 1000000) / tokenRatio
            return acc
        }, {})

        if (dragonKind) {
            const filteredAmounts = Object.fromEntries(Object.entries(formattedMinMax).filter(([key]) => key === `${dragonKind}_min` || key === `${dragonKind}_max`));
            setAmounts(filteredAmounts)
        }
        else {
            setAmounts(formattedMinMax)
        }
    }, [minMaxAmounts, dragonSlots, tokenRatio])

    return (
        <Tooltip title={
            <Box>
                {Object.entries(amounts).map(([kind, amount]) =>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '24px' }}>
                        <Typography sx={{ textTransform: 'capitalize', color: 'white' }}>{kind.split('_')[0]} {kind.split('_')[1]}.</Typography>
                        <Typography sx={{ textTransform: 'capitalize', color: 'white' }}>{amount} {selectedTokenType}</Typography>
                    </Box>
                )}
            </Box>
        } placement='top'>
            <InfoIcon color='primary' />
        </Tooltip>
    )
}

export default MinMaxInfo