import { FormControlLabel, Checkbox as CheckboxMUI } from '@mui/material'
import React from 'react'

import * as COLORS from 'util/ColorUtils'

const Checkbox = ({ label, onChange, disabled, checked }) => {
    return (
        <FormControlLabel
            sx={{
                color: 'white',
                fontSize: '16px',
                textTransform: 'capitalize'
            }}
            label={label}
            control={
                <CheckboxMUI
                    sx={{
                        color: COLORS.SMOOTH_YELLOW_30,
                        '&.Mui-checked': {
                            color: COLORS.SMOOTH_YELLOW_30,
                        },
                    }}
                    checked={checked}
                    disabled={disabled}
                    onChange={onChange}
                />
            }
        />
    )
}

export default Checkbox