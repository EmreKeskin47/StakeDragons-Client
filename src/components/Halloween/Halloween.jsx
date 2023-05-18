import React from 'react'

import spiderWeb from 'assets/halloween/spider-web.svg'
import GreenLight from 'components/Halloween/GreenLight'
import Pumpkin from 'components/Halloween/Pumpkin'

const Halloween = () => {
    return (
        <>
            <GreenLight />
            <Pumpkin position={{ top: '25%', right: 36 }} />
            <Pumpkin imgStyles={{ width: 28 }} position={{ top: '75%', right: 24 }} />
            <Pumpkin imgStyles={{ width: 28 }} position={{ top: '15%', left: 0 }} />
            <Pumpkin position={{ top: '25%', left: 390 }} />
            <Pumpkin imgStyles={{ width: 28 }} position={{ top: '75%', left: 375 }} />
            <img alt='spider-web' src={spiderWeb} style={{ position: 'fixed', right: 0, top: 150 }} />
        </>
    )
}

export default Halloween