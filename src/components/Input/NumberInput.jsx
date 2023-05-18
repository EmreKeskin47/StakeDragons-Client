import React, { useEffect, useState } from 'react'
import useStyles from 'styles'

import { Box, Button, Input, Typography } from '@mui/material'

const NumberInput = ({ value, onChange }) => {
    const classes = useStyles()
    const [inputValue, setInputValue] = useState(0)

    const decreaseValue = () => {
        setInputValue(prev => prev - 1)
        onChange && onChange(value - 1)
    }

    const increaseValue = () => {
        setInputValue(prev => prev + 1)
        onChange && onChange(value + 1)
    }

    const handleChange = (e) => {
        const newValue = e.target.value
        setInputValue(parseFloat(newValue))
        onChange && onChange(parseFloat(newValue))
    }

    useEffect(() => {
        if (value !== undefined) {
            setInputValue(value)
        }
    }, [value])

    return (
        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }} className={classes.goldBox1}>
            <Button onClick={decreaseValue} sx={{ color: 'white' }}>-</Button>
            <Input disableUnderline value={inputValue} onChange={handleChange} inputProps={{ style: { textAlign: 'center' } }} sx={{ color: 'white', flexGrow: 1, textAlign: 'center' }} type='number' />
            <Button onClick={increaseValue} sx={{ color: 'white' }}>+</Button>
        </Box>
    )
}

export default NumberInput