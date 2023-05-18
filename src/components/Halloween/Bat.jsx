import React from 'react'

import batIcon from 'assets/halloween/bat.svg'
import batDarkIcon from 'assets/halloween/bat-dark.svg'

const Bat = ({ styles, variant = 'gray' }) => {
    return <img alt='bat' style={{ position: 'absolute', pointerEvents: 'none', ...styles }} src={variant === 'gray' ? batIcon : batDarkIcon} />
}

export default Bat