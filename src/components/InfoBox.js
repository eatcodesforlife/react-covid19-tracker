import React from 'react'
import { Card, Typography, CardContent } from '@material-ui/core'
import './InfoBox.css'

const InfoBox = ({ title, cases, total, active, ...props }) => {
    return (
        <Card 
            onClick={props.onClick}
            className={`infoBox__card ${active && "infoBox--selected"}`}
        >
            <CardContent className={'infoBox__card__content'} 
            >
                <Typography className='infoBox__card__content__title' color='textSecondary'>
                    {title}
                </Typography>
                    <h2 className='infoBox__card__content__cases'>{cases}</h2>
                <Typography className='infoBox__card__content__total' color='textSecondary'>
                    {total} <span>Total</span>
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox
