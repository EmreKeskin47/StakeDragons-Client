import React from 'react'
import useStyles from 'styles'
import * as COLORS from 'util/ColorUtils'
import { DRAGON_TYPE_NAMES } from 'util/constants'

import { Box, Typography } from '@mui/material'
import { Droppable } from 'react-beautiful-dnd'

import LegendaryDragon from 'assets/market/LegendaryDragon.png'
import EpicDragon from 'assets/market/EpicDragon.png'
import RareDragon from 'assets/market/RareDragon.png'
import UncommonDragon from 'assets/market/UncommonDragon.png'
import CommonDragon from 'assets/market/CommonDragon.png'

const DRAGON_ASSETS = {
    'rare': RareDragon,
    'uncommon': UncommonDragon,
    'common': CommonDragon,
    'epic': EpicDragon,
    'legendary': LegendaryDragon
}

const DragonSlot = ({ dragon, slotIndex, removeSlot }) => {
    const classes = useStyles()
    const dragonColor = DRAGON_TYPE_NAMES.find(typeName => typeName.name === dragon?.kind)?.color

    const removeDragon = () => {
        removeSlot(slotIndex)
    }

    if (dragon === null) {
        return (
            <Droppable droppableId={`slot-${slotIndex}`} direction='vertical'>
                {
                    (provided, snapshot) => (
                        <>
                            <Box
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                isDraggingOver={snapshot.isDraggingOver}
                                sx={{ width: '100%', height: '100%' }}
                                className={classes.goldBox4}>
                                {provided.placeholder}
                            </Box>
                        </>
                    )
                }
            </Droppable>
        )
    }

    return (
        <Box
            sx={{ px: '10px', py: '16px', paddingTop: '24px', position: 'relative', cursor: 'pointer' }}
            className={classes.goldBox4}
            onClick={removeDragon}
        >
            <Box sx={{ width: '100%' }}>
                <img alt={`dragon-${dragon.token_id}`} src={DRAGON_ASSETS[dragon.kind]} style={{ width: '100%', objectFit: 'contain' }} loading="lazy" />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
                <Typography sx={{ fontSize: '12px', color: COLORS.SECONDARY_TEXT_GREY, textTransform: 'capitalize' }}>{dragon.kind} Dragon</Typography>
                <Typography sx={{ fontSize: '12px', color: COLORS.SECONDARY_TEXT_GREY }}>#{dragon.token_id}</Typography>
            </Box>
            <Box sx={{ position: 'absolute', width: '33%', height: '12px', top: 0, left: 0, background: 'linear-gradient(90deg,#624B2C,#E6E1C1)', p: '2px' }}>
                <Box sx={{ width: '100%', height: '100%', background: dragonColor }}></Box>
            </Box>
        </Box>
    )
}

export default React.memo(DragonSlot)