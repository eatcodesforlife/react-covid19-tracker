import React from 'react'
import './CaseRankingTable.css'
import numeral from 'numeral'

const CaseRankingTable = ({ countries }) => {
    return (
        <div className='case__rankings'>
            {countries.map(({ country, cases}) => (
               <tr>
                   <td>{country}</td>
                   <td>{numeral(cases).format('0,0')}</td>
               </tr> 
                ))
            }
        </div>
    )
}

export default CaseRankingTable
