import React from 'react'
import { Box, Grid, Stack, Typography } from '@mui/material'

import useStyles from 'styles'
import { useEffect } from 'react'
import { useRef } from 'react'
import { useState } from 'react'
import { formatTimeLeft, getTimeRemaining } from '../../util/DateUtil'

const DateCountDown = (props) => {
    const { title, finishDate, textStyles } = props
    const intervalRef = useRef(null);
    const classes = useStyles()
    const [timeLeft, setTimeLeft] = useState(undefined);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setTimeLeft(getTimeRemaining(finishDate))
        }, 1000)
        return () => {
            clearInterval(intervalRef.current);
        }
    }, [finishDate, setTimeLeft])

    return (
        <Grid item sx={{ height: '100%' }}>
            <Box
                className={classes.goldBox1}
                py={2}
                px={2}
                sx={{ height: '100%' }}
            >
                <Stack
                    direction={'column'}
                    sx={{ height: '100%' }}
                    justifyContent="center"
                    alignItems="center"
                    gap='8px'
                    spacing={1}
                >
                    <Typography className={classes.h3Grey} sx={{ ...textStyles }}>
                        {title}
                    </Typography>
                    <Typography className={classes.h3} sx={{ ...textStyles, wordSpacing: '6px' }}>
                        {formatTimeLeft(timeLeft)}
                    </Typography>
                </Stack>
            </Box>
        </Grid>
    )
}

export default DateCountDown