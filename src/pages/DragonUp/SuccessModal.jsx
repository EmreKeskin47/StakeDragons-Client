import * as React from 'react';
import useStyles from 'styles'

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

import { DRAGON_TYPE_NAMES } from 'util/constants'
import * as COLORS from 'util/ColorUtils'

import LegendaryDragon from 'assets/market/LegendaryDragon.png'
import EpicDragon from 'assets/market/EpicDragon.png'
import RareDragon from 'assets/market/RareDragon.png'
import UncommonDragon from 'assets/market/UncommonDragon.png'
import CommonDragon from 'assets/market/CommonDragon.png'
import star from 'assets/dragon-up-star.svg'

import './style.css'
import { Typography } from '@mui/material';

const DRAGON_ASSETS = {
    'rare': RareDragon,
    'uncommon': UncommonDragon,
    'common': CommonDragon,
    'epic': EpicDragon,
    'legendary': LegendaryDragon
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: '#141414',
    boxShadow: 24,
    p: 8,
    border: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px'
};

const SuccessModal = ({ open, handleClose, dragon }) => {
    const classes = useStyles()
    const dragonColor = DRAGON_TYPE_NAMES.find(typeName => typeName.name === dragon?.kind)?.color

    if (!open) return null;

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="success-modal-title"
            aria-describedby="success-modal-description"
        >
            <Box sx={style}>
                <Box sx={{ position: 'relative', width: 400, height: 400, border: '2px solid rgba(217, 174, 106, 0.5)', borderRadius: '50%', boxSizing: 'border-box' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', position: 'absolute', inset: 0, borderRadius: '50%', boxSizing: 'border-box' }}>
                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', flexGrow: .9 }}>
                            <img alt={`dragon-${dragon?.kind}`} src={DRAGON_ASSETS[dragon?.kind]} style={{ width: '100%', objectFit: 'contain' }} loading="lazy" />
                        </Box>
                        <Box className="delayed-show" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: .1, marginTop: '24px' }}>
                            <img alt='star' src={star} style={{ width: 24, height: 24 }} />
                        </Box>
                    </Box>
                    <Box className='success-spin' sx={{ position: 'absolute', inset: 0, borderTop: `8px solid ${dragonColor}`, borderRadius: '50%', boxSizing: 'border-box' }}>

                    </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px', gap: '16px' }} className={classes.goldBox2}>
                    <Typography sx={{ color: 'white', fontSize: '24px' }}>
                        Dragon Info
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <Box sx={{ width: '240px', height: '100%', p: '12px' }} className={classes.goldBox1}>
                            <Typography sx={{ color: COLORS.SECONDARY_TEXT_GREY, fontSize: '16px' }}>Rarity: </Typography>
                            <Typography sx={{ color: 'white', fontSize: '16px', textTransform: 'capitalize', marginTop: '4px' }}>
                                {dragon?.kind}
                            </Typography>
                        </Box>
                        <Box sx={{ width: '240px', height: '100%', p: '12px' }} className={classes.goldBox1}>
                            <Typography sx={{ color: COLORS.SECONDARY_TEXT_GREY, fontSize: '16px' }}>Daily (DRGN) Reward Amount: </Typography>
                            <Typography sx={{ color: 'white', fontSize: '16px', textTransform: 'capitalize', marginTop: '4px' }}>
                                {dragon?.daily_income * 4} DRGN
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
}

export default SuccessModal;