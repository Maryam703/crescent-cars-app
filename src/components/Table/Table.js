import React from "react";
import "./Table.css";
import { Link } from "react-router-dom"

export default function Table({
  TableHeadings,
  TableData,
  percentageDiff
}) {

  return (
    <div>
      <table>
        <thead>
          {TableHeadings?.map((item) => (
            <th>{item}</th>
          ))}
        </thead>
        <tbody>
          {TableData.length > 0 && TableData?.map((item) => {
            return (
              <tr>
                <td>{item.title}</td>
                <td>{item.year}</td>
                <td>{item.making}</td>
                <td>{item.model}</td>
                <td>{item.mileage}</td>
                <td>${item.listingPrice}</td>
                <td>${item.marrketValue}</td>
                {percentageDiff(item.marrketValue, item.listingPrice) >= 20 ?
                  <td>{percentageDiff(item.marrketValue, item.listingPrice)}% ✅</td>
                  :
                  <td>{percentageDiff(item.marrketValue, item.listingPrice)}%</td>}
                <td>{item.source}</td>
                <td><Link to={item.link}>visit🔗</Link></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}