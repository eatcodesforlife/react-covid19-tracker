import { Circle, Popup} from 'react-leaflet'
import React from 'react'
import numeral from 'numeral'

export const sortData = (data) => {
    const sortedData = [...data]
    return sortedData.sort((a, b) => b.cases - a.cases )
}

const circleTypeColors = {
  cases: {
    hex: "#CC1034",
    rgb: "rgb(204, 16, 52)",
    multiplier: 900,
  },
  recovered: {
    hex: "#7dd71d",
    rgb: "rgb(125, 215, 29)",
    multiplier: 900,
  },
  deaths: {
    hex: "#fb4443",
    rgb: "rgb(251, 68, 67)",
    multiplier: 900,
  },
};


// draw circles on map w/ interactive tooltip
export const drawCirclesOnMap = (data, dataName='cases') => (
   
  data.filter(({countryInfo}) => countryInfo._id )
   .map( country => {
     return (
      <Circle
          key={country.countryInfo._id}
          center={[country.countryInfo.lat, country.countryInfo.long]}
          fillOpacity={0.4}
          color={circleTypeColors[dataName].hex}
          fillColor={circleTypeColors[dataName].hex}
          radius={
              Math.sqrt(country[dataName]) * circleTypeColors[dataName].multiplier
          }
      >
        <Popup>
            <div className='tooltip__container'>
                <div
                    className='tooltip__country__flag' 
                    style={{backgroundImage: `url(${country.countryInfo.flag})`}} 
                />
                <div className='tooltip__country__name'>{country.country}</div>
                <div className='tooltip__country__cases'>Cases: {numeral(country.cases).format('0,0')}</div>
                <div className='tooltip__country__recovered'>Recovered: {numeral(country.recovered).format('0,0')}</div>
                <div className='tooltip__country__deaths'>Deaths: {numeral(country.deaths).format('0,0')}</div>
            </div>
        </Popup>
      </Circle>
    )
   }
  )
)

