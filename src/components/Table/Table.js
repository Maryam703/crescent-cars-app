import React from "react";
import "./Table.css";
import { Link } from "react-router-dom"

export default function Table({
  TableHeadings,
  TableData,
  percentageOflistingAndMarketValue
}) {

  return (
    <div>
      {TableData?.length === 0 ?
        <div className="no-data-table">Oops! No matching results. Try changing the filters to explore!</div> :
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
                  <td>{item.price}</td>
                  <td>{item.marketPrice}</td>
                  <td>{percentageOflistingAndMarketValue(item?.price, item?.marketPrice)}%</td>
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