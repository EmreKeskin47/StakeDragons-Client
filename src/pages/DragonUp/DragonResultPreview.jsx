import React from 'react'
import useStyles from 'styles'

import { Box } from '@mui/material'
import { DRAGON_TYPE_NAMES } from 'util/constants'

import LegendaryDragon from 'assets/market/LegendaryDragon.png'
import EpicDragon from 'assets/market/EpicDragon.png'
import RareDragon from 'assets/market/RareDragon.png'
import UncommonDragon from 'assets/market/UncommonDragon.png'
import CommonDragon from 'assets/market/CommonDragon.png'
import star from 'assets/dragon-up-star.svg'

const DRAGON_ASSETS = {
    'rare': RareDragon,
    'uncommon': UncommonDragon,
    'common': CommonDragon,
    'epic': EpicDragon,
    'legendary': LegendaryDragon
}

const DragonResultPreview = ({ dragonSlots }) => {
    const classes = useStyles()
    const areSlotsFull = dragonSlots.every(slot => slot !== null)
    const kind = dragonSlots[0]?.kind;
    const dragonColor = DRAGON_TYPE_NAMES.find(typeName => typeName.name === kind)?.color

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', p: '16px', position: 'relative' }} className={classes.goldBox4}>
            {
                areSlotsFull &&
                <>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: .9 }}>
                        <img alt={`dragon-${kind}`} src={DRAGON_ASSETS[kind]} style={{ width: '100%', height: '100%', objectFit: 'contain' }} loading="lazy" />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: .1 }}>
                        <img alt='star' src={star} style={{ width: 24, height: 24 }} />
                    </Box>
                    <Box sx={{ position: 'absolute', width: '33%', height: '12px', top: 0, left: 0, background: 'linear-gradient(90deg,#624B2C,#E6E1C1)', p: '2px' }}>
                        <Box sx={{ width: '100%', height: '100%', background: dragonColor }}></Box>
                    </Box>
                </>
            }
        </Box>
    )
}

export default DragonResultPreview