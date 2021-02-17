import React from 'react'
import './CaseRankingTable.css'
import numeral from 'numeral'


const CaseRankingTable = ({ countries }) => {
    return (
        <table className='case__rankings'>
            <tbody>
                {
                    countries.filter(({ countryInfo}) => countryInfo._id )
                        .map(({ country, cases, countryInfo }) => (
                            <tr key={countryInfo._id} >
                                <td>{country}</td>
                                <td>{numeral(cases).format('0,0')}</td>
                            </tr> 
                        )
                    )
                }
            </tbody>
        </table>
    )
}

export default CaseRankingTable
