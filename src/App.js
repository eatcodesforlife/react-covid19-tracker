import React, { useState, useEffect } from 'react';
import './App.css';
import InfoBox from './components/InfoBox';
import Map from './components/Map'
import CaseRankingTable from './components/CaseRankingTable'
import LineGraph from './components/LineGraph'
import { 
    Card, 
    CardContent, 
    MenuItem, 
    Select, 
    FormControl 
} from '@material-ui/core'
import { sortData } from './util'
import 'leaflet/dist/leaflet.css'
import numeral from 'numeral'



function App() {

    const [ countries, setCountries ] = useState([])
    const [ country, setCountry ] = useState('WW')
    const [ countryData, setCountryData ] = useState({})
    const [ countryTableData, setCountryTableData ] = useState([])
    const [ mapCenter, setMapCenter ] = useState([34.80746, -40.4796])
    const [ mapZoom, setMapZoom ] = useState(3)
    const [ dataName, setDataName ] = useState('cases')
    const [ mapCircles, setMapCircles ] = useState([])

    useEffect(() => {

        const getDataPerCountry = async () => {
            const res = await fetch('https://disease.sh/v3/covid-19/countries')
            const dataPerCountry = await res.json()
            return dataPerCountry
        }

        getDataPerCountry()
        .then( data => {
            const countries = data.map( ({ country, countryInfo }) => (
                {
                    country,
                    value: countryInfo.iso2
                }
            ))

            const sortedData = sortData(data)
            setCountryTableData(sortedData)
            setCountries(countries)

            // data to create circles on map
            setMapCircles(data)
        })

        getDataPerCountry()
    }, [])

    useEffect( () => {
        const getWorldData = async () => {
            const res = await fetch('https://disease.sh/v3/covid-19/all')
            const worldData = await res.json()
            return worldData
        }

        getWorldData()
        .then( data => {
            setCountryData(data)
        })

        getWorldData()
    }, [])

    const onCountryChange = async (e) => {
        const countryCode = e.target.value

        const url = countryCode === 'WW' 
            ? 'https://disease.sh/v3/covid-19/all' 
            : `https://disease.sh/v3/covid-19/countries/${countryCode}`
       
        const getCountryData = async () => {
            const response = await fetch(url)
            const data = await response.json()
            return data
        }
        
        getCountryData()
        .then( data => {
            setCountry(countryCode)
            setCountryData(data)
            
            
            // map control
            setMapZoom(4)
            return countryCode !== 'WW'
                ? setMapCenter([data.countryInfo.lat, data.countryInfo.long])
                : setMapCenter([ 34.80746, -40.4796 ])
            
           })
        
        getCountryData()
    }



  return (
    
    <div className="app">
     <div className='app__left__container'>
      <div className='app__left__header'>
        <h1>COVID19 Tracker</h1>
        <FormControl  className='app__left__header__dropdown'>
            <Select 
                variant='outlined'
                value={country}
                onChange={onCountryChange}
            >
                <MenuItem value='WW'>Worldwide</MenuItem>
                {
                countries.map( ({country, value}) => (
                    <MenuItem value={value}>
                    {country}
                    </MenuItem>
                ))
                }
            </Select>
        </FormControl>
      </div>
      <div className="app__stats">
        <InfoBox
            active={dataName === 'cases'}
            onClick={e => setDataName('cases')} 
            title='New Cases' 
            cases={numeral(countryData.todayCases).format('+0,0')} 
            total={numeral(countryData.cases).format('0,0')}         
        />
        <InfoBox
            active={dataName === 'recovered'}
            onClick={e => setDataName('recovered')}
            title='Recovered' 
            cases={numeral(countryData.todayRecovered).format('+0,0')} 
            total={numeral(countryData.recovered).format('0,0')}
        />
        <InfoBox
            active={dataName === 'deaths'}
            onClick={e => setDataName('deaths')} 
            title='Deaths' 
            cases={numeral(countryData.todayDeaths).format('+0,0')} 
            total={numeral(countryData.deaths).format('0,0')}
        />
      </div>
      <Map 
          dataName={dataName}    
          center={mapCenter}
          zoom={mapZoom}
          countries={mapCircles}
      />
     </div>
     <Card className="app__right__container">
      <CardContent>
        <div className="app__right__case__rankings">
          <h3>Live Cases By Country</h3>
          <CaseRankingTable countries={countryTableData}/>
        </div>
        <div className="app__right__graph">
          <h3>Worldwide new {dataName}</h3>
          <LineGraph className='app__graph' dataName={dataName}/>
        </div>
      </CardContent>
     </Card>
    </div>
  );
}

export default App;
