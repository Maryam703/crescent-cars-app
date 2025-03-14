import React, { useEffect, useState } from 'react'
import "./Dashboard.css"
import Table from '../Table/Table'
import axios from "axios"
import Loader from "../Loader/Loader"
import MultiRangeSlider from "multi-range-slider-react";

export default function Dashboard() {
  //  const [tableData, setTableData] = useState([])
    const [loading, setLoading] = useState(false)
    const [states, setStates] = useState(null)
    const [minMileageValue, set_minMileageValue] = useState(10000);
    const [maxMileageValue, set_maxMileageValue] = useState(70000);
    const [minPrice, setMinPrice] = useState(40);
    const [maxPrice, setMaxPrice] = useState(70);
    const [cities, setCities] = useState(null);
    const [carModal, setCarModal] = useState(null);
   // const [data, setData] = useState(null);

    const tableHeadings = ["Title", "Year", "Making", "Modal", "Mileage", "ListingPrice", "MarketValue", "Differences", "Source"];
    const tableData = [
        {
        title : "Honda Car",
        year : 2014,
        making : "Toyota",
        model: "Model 3",
        mileage : 5.877,
        listingPrice : 301.50,
        marrketValue : 346.988,
        difference : "-10.5%",
        source : "Craigslist"
    },
    {
        title : "Honda Car",
        year : 2014,
        making : "Toyota",
        model: "Model 3",
        mileage : 5.877,
        listingPrice : 301.50,
        marrketValue : 346.988,
        difference : "-10.5%",
        source : "Craigslist"
    },
    {
        title : "Honda Car",
        year : 2014,
        making : "Toyota",
        model: "Model 3",
        mileage : 5.877,
        listingPrice : 301.50,
        marrketValue : 346.988,
        difference : "-10.5%",
        source : "Craigslist"
    },
    {
        title : "Honda Car",
        year : 2014,
        making : "Toyota",
        model: "Model 3",
        mileage : 5.877,
        listingPrice : 301.50,
        marrketValue : 346.988,
        difference : "-10.5%",
        source : "Craigslist"
    },
    {
        title : "Honda Car",
        year : 2014,
        making : "Toyota",
        model: "Model 3",
        mileage : 5.877,
        listingPrice : 301.50,
        marrketValue : 346.988,
        difference : "-10.5%",
        source : "Craigslist"
    }
]

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             let res = await axios.get("https://kinwdpewewrluwhjwgdk.supabase.co/rest/v1/jdpowercars");
    //             data = res.data
    //             setData(data)
    //         } catch (err) {
    //             console.error(err)
    //         }
    //     }
    //     fetchData()
    // }, [])
    // console.log(data)

    const searchHandler = async () => {
        setLoading(true)
       // setShowTable(true)
        try {
            let res = await axios.get("/")
            let data = res.data
           // setTableData(data)
        } catch (error) {
            console.error(error)
        }
        setLoading(false)
    }

    const handleMileageInput = (e) => {
        set_minMileageValue(e.minValue)
        set_maxMileageValue(e.maxValue)
    }
    const handlePriceInput = (e) => {
        setMinPrice(e.minValue)
        setMaxPrice(e.maxValue)
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
                            <option value="" >--Choose an option--</option>
                            {states?.map((item) => {
                                return (<option value={item}>{item}</option>)
                            })}
                        </select>
                    </div>
                    <div className='dashboard-select-criteria'>
                        <div className='dashboard-select-heading'>Select City</div>
                        <select id='state-options'>
                            <option value="" >--Choose an option--</option>
                            {cities?.map((item) => {
                                return (<option value={item}>{item}</option>)
                            })}
                        </select>
                    </div>
                    <div className='dashboard-select-criteria'>
                        <div className='dashboard-select-heading'>Car Model</div>
                        <select id='state-options'>
                            <option value="" >--Choose an option--</option>
                            {carModal?.map((item) => {
                                return (<option value={item}>{item}</option>)
                            })}
                        </select>
                    </div>
                    <div className='dashboard-select-criteria'>
                        <div className='dashboard-select-heading'>Mileage Range</div>
                        <div className="range-slider">
                            <MultiRangeSlider
                                min={0}
                                max={100000}
                                minValue={minMileageValue}
                                maxValue={maxMileageValue}
                                ruler={false}
                                barLeftColor="white"
                                barRightColor="white"
                                label={false}
                                barInnerColor="#1B5886"
                                thumbLeftColor="#1B5886"
                                thumbRightColor="#1B5886"
                                onInput={(e) => {
                                    handleMileageInput(e);
                                }}
                            />
                        </div>
                    </div>
                    <div className='dashboard-select-criteria'>
                        <div className='dashboard-select-heading'>Price Differences Percentage</div>
                        <div className="range-slider">
                            <MultiRangeSlider
                                min={0}
                                max={100}
                                minValue={minPrice}
                                maxValue={maxPrice}
                                ruler={false}
                                barLeftColor="white"
                                barRightColor="white"
                                label={false}
                                barInnerColor="#1B5886"
                                thumbLeftColor="#1B5886"
                                thumbRightColor="#1B5886"
                                onInput={(e) => {
                                    handlePriceInput(e);
                                }}
                            />
                        </div>
                    </div>
                </div>
                    <div className='dashboard-search-btn' onClick={searchHandler}>Search here</div>


                <div className='dashboard-data-table-container'>
                    <div className="dashboard-data-table-inner-container">
                   <Table TableHeadings={tableHeadings} TableData={tableData} />
                   </div>
                </div>

            </div>
        </div>
    )
}
