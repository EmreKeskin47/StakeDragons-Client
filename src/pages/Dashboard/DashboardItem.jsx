import React from 'react'

import { Box, Typography } from '@mui/material';


const DashboardItem = ({ item, kindCount, showStaked = true, type = 'dragons' }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: {
                    lg: '235px',
                    xs: '100%'
                },
                height: showStaked ? 208 : 160,
            }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: 48,
                border: `2px solid ${item.color}`,
                borderRadius: '4px'
            }}>
                <Typography sx={{
                    fontSize: {
                        lg: '20px',
                        xs: '14px'
                    },
                    lineHeight: '30px',
                    fontWeight: 500,
                    color: 'white',
                    textTransform: 'capitalize'
                }}>
                    {item.name === 'udin' ? 'idunn' : item.name} {type}
                </Typography>
            </Box>
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 3
            }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 160,
                    height: 40,
                    border: `1px solid ${item.color}`,
                    fontSize: {
                        lg: '16px',
                        xs: '12px'
                    },
                    color: 'white',
                    marginRight: 1
                }}>
                    Total
                </Box>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 40,
                    height: 40,
                    border: `1px solid ${item.color}`,
                    fontSize: {
                        lg: '16px',
                        xs: '12px'
                    },
                    color: 'white',
                    background: 'rgba(97, 97, 97, 0.3)'
                }}>
                    {kindCount[item.name]?.totalCount ?? 0}
                </Box>
            </Box>
            {showStaked &&
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 1
                }}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 160,
                        height: 40,
                        border: `1px solid ${item.color}`,
                        fontSize: {
                            lg: '16px',
                            xs: '12px'
                        },
                        color: 'white',
                        marginRight: 1
                    }}>
                        Staked
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 40,
                        height: 40,
                        border: `1px solid ${item.color}`,
                        fontSize: {
                            lg: '16px',
                            xs: '12px'
                        },
                        color: 'white',
                        background: 'rgba(97, 97, 97, 0.3)'
                    }}>
                        {kindCount[item.name]?.stakedCount ?? 0}
                    </Box>
                </Box>
            }
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 1
            }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 160,
                    height: 40,
                    border: `1px solid ${item.color}`,
                    fontSize: {
                        lg: '16px',
                        xs: '12px'
                    },
                    color: 'white',
                    marginRight: 1
                }}>
                    On Sale
                </Box>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 40,
                    height: 40,
                    border: `1px solid ${item.color}`,
                    fontSize: {
                        lg: '16px',
                        xs: '12px'
                    },
                    color: 'white',
                    background: 'rgba(97, 97, 97, 0.3)'
                }}>
                    {kindCount[item.name]?.onSaleCount ?? 0}
                </Box>
            </Box>
        </Box>)
}

export default DashboardItem