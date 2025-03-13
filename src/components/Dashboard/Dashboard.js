import React, { useEffect, useState } from 'react'
import "./Dashboard.css"
import Table from '../Table/Table'
import axios from "axios"
import Loader from "../Loader/Loader"

export default function Dashboard() {
    const [tableData, setTableData] = useState([])
    const [showTable, setShowTable] = useState(false)
    const [loading, setLoading] = useState(false)

    const tableHeadings = ["Title", "Year", "Making", "Modal", "Mileage", "ListingPrice", "MarketValue", "Differences", "Source"];
    const states = ["lahore", "mandi"]

    useEffect(() => {
        const fetchStates = async () => {
            let stateOptions = document.getElementById("state-options");
            try {
                // let res = await axios.get("");
                // let states = res.data.states;

                states.forEach(state => {
                    let option = document.createElement("option");
                    option.text = state
                    option.value = state

                    stateOptions.appendChild(option)
                });

            } catch (err) {
                console.error(err)
            }
        }
        fetchStates()
    }, [])

    const searchHandler = async () => {
        setLoading(true)
        setShowTable(true)
        try {
            let res = await axios.get("/")
            let data = res.data
            setTableData(data)
        } catch (error) {
            console.error(error)
        }
        setLoading(false)
    }

    return (
        <div className='dashboard-container'>
            {loading && <Loader />}
            <div className='dashboard-inner-container'>
                <div className='dashboard-upper-box'>
                    <div className='dashboard-upper-box-1'>
                        <img src='https://media.licdn.com/dms/image/v2/D4E22AQErU4Koo1pj2Q/feedshare-shrink_800/B4EZVH55dUHcAg-/0/1740668115468?e=2147483647&v=beta&t=QS41O87R82t8GAbbagErN4qW7fyO4wTT0BR8Q2u8uU4' />
                    </div>
                    <div className='dashboard-upper-box-2'>
                        <div className='dashboard-heading'>Car Price Analysis Tool Bar</div>
                        <div className='dashboard-description'>
                            Looking to sell your car or find your next ride? We makes it simple, fast, and secure. Whether you're upgrading or letting go of your old vehicle,<br />
                            our platform connects you with verified buyers and sellers for a seamless experience.

                            <div>
                                <br />
                                <div>✔ Quick Listings - Search your car in minutes with easy-to-use tools.</div>
                                <div>✔ Smart Search - Browse thousands of vehicles by make, model, price, and location.</div>
                                <div>✔ Security - Trustworthy connections with verified users for safe deals.</div>
                                <div>✔ Instant Offers - Get real-time offers and negotiate easily through in-app messaging.</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='dashboard-select-container'>
                    <div className='dashboard-select-criteria'>
                        <div className='dashboard-select-heading'>Select State</div>
                        <select id='state-options'>
                            <option>hi</option>
                        </select>
                    </div>
                    <div className='dashboard-select-criteria'>
                        <div className='dashboard-select-heading'>Select City</div>
                        <select>
                        <option>hi</option>
                        </select>
                    </div>
                    <div className='dashboard-select-criteria'>
                        <div className='dashboard-select-heading'>Car Model</div>
                        <select></select>
                    </div>
                    <div className='dashboard-select-criteria'>
                        <div className='dashboard-select-heading'>Mileage</div>
                        <select></select>
                    </div>
                    <div className='dashboard-select-criteria'>
                        <div className='dashboard-select-heading'>Price</div>
                        <select></select>
                    </div>
                </div>


                <div className='dashboard-select-container'><div className='dashboard-search-btn' onClick={searchHandler}>Search</div></div>

                {showTable && <div className='dashboard-data-table-container'>
                    {tableData.length > 0 ? <Table TableHeadings={tableHeadings} TableData={tableData} />
                        :
                        <div className='table-data-not-found'>Data Not Found!</div>}
                </div>}

            </div>
        </div>
    )
}
