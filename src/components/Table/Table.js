import React from "react";
import "./Table.css";
import { Link } from "react-router-dom"

export default function Table({
  TableHeadings,
  TableData,
  percentageDiff
}) {
//console.log(TableData)
  return (
    <div>
      {TableData?.length === 0 ? 
       <div className="no-data-table">Oops! No matching results. Try changing the filters to explore!</div>  : 
       <table>
       <thead>
         {TableHeadings?.map((item) => (
           <th>{item}</th>
         ))}
       </thead>
      {<tbody>
         {TableData?.length > 0 && TableData?.map((item) => {
           return (
             <tr>
               <td>{item.title}</td>
               <td>{item.year}</td>
               <td>{item.make}</td>
               <td>{item.model}</td>
               <td>{item.mileage}</td>
               <td>{item.listingPrice[0]}</td>
               <td>{item.marketPrice}</td>
               {percentageDiff(item.listingPrice[0], item.marketPrice) >= 20 ?
                 <td>{percentageDiff(item.listingPrice[0], item.marketPrice)}% ✅</td>
                 :
                 <td>{percentageDiff(item.listingPrice[0], item.marketPrice)}%</td>
                 }
          
            <td>{item.source}</td> 
               <td><Link to={item.link}>visit🔗</Link></td>
             </tr>
           );
         })}
       </tbody>}
     </table>
      }
    </div>
  );
}