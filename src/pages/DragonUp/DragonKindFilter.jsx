import React from 'react'
import useStyles from 'styles'
import { Box } from '@mui/material'
import Checkbox from '../../components/Checkbox'

import { DRAGON_TYPE_NAMES } from 'util/constants'

const DragonKindFilter = ({ toggleKindFilter }) => {
    const classes = useStyles()
    const dragonTypes = DRAGON_TYPE_NAMES.map(dragon => dragon.name)

    return (
        <Box
            sx={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', height: '95%', px: '32px', py: '16px', overflow: 'auto', background: 'linear-gradient(180deg, rgba(52, 52, 52, 0) 0%, #343434 100%);' }}
            className={classes.goldBox1}>
            {
                dragonTypes.map(kind => <Checkbox key={kind} label={kind} onChange={() => toggleKindFilter(kind)} />)
            }
        </Box>
    )
}

export default React.memo(DragonKindFilter)