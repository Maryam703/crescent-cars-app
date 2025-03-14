import React from "react";
import "./Table.css";

export default function Table({
    TableHeadings, 
    TableData
}) {
  console.log(TableData)

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
                <td>{item.difference}</td>
                <td>{item.source}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}