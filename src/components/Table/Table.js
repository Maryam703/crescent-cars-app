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
                <td>{item.titel}</td>
                <td>{item.year}</td>
                <td>{item.make}</td>
                <td>{item.modal}</td>
                <td>{item.mileage}</td>
                <td>{item.listingPrice}</td>
                <td>{item.marketValue}</td>
                <td>{item.differences}</td>
                <td>{item.source}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}