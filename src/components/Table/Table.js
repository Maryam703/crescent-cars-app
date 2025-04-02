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
                <td>{item.make}</td>
                <td>{item.model}</td>
                <td>{item.mileage}</td>
                <td>${Number(item.price.replace("$", "").replace(",", ""))}</td>
                <td>$</td>
                <td>-</td>
                {/* <td>${Number(item.marketPrice.replace("$", "").replace(",", ""))}</td>
                {percentageDiff(Number(item.marketPrice.replace("$", "").replace(",", "")), Number(item.price.replace("$", "").replace(",", ""))) >= 20 ?
                  <td>{percentageDiff(Number(item.marketPrice.replace("$", "").replace(",", "")), Number(item.price.replace("$", "").replace(",", "")))}% ✅</td>
                  :
                  <td>{percentageDiff(Number(item.marketPrice.replace("$", "").replace(",", "")), Number(item.price.replace("$", "").replace(",", "")))}%</td>}
            */}
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