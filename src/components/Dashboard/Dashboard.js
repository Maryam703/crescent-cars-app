import React, { useEffect, useState } from 'react'
import "./Dashboard.css"
import Table from '../Table/Table'
import Loader from "../Loader/Loader"
import MultiRangeSlider from "multi-range-slider-react";
import { createClient } from '@supabase/supabase-js';

export default function Dashboard() {
    const [apiData, setApiData] = useState([])
    const [loading, setLoading] = useState(false)
    const [state, setState] = useState(null)
    const [minMileageValue, set_minMileageValue] = useState(100);
    const [maxMileageValue, set_maxMileageValue] = useState(100000);
    const [minProfit, setMinProfit] = useState(0);
    const [maxProfit, setMaxProfit] = useState(70);
    const [minYear, setMinYear] = useState(2000);
    const [maxYear, setMaxYear] = useState(2010);
    const [city, setCity] = useState(null);
    const [tableData, setTableData] = useState([]);

    const tableHeadings = ["Title", "Year", "Making", "Modal", "Mileage", "ListingPrice", "MarketValue", "Differences", "Source", "Link"];

    const supabaseApi = 'https://kinwdpewewrluwhjwgdk.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpbndkcGV3ZXdybHV3aGp3Z2RrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwMTc4MTIsImV4cCI6MjA1NjU5MzgxMn0.X1p6xlE7XmPJaUI4SugucfmhmmNTCp_e_pu_Dq7-M7Q';
    const tableName = 'cars_data';
    const supabase = createClient(supabaseApi, supabaseKey);

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase
                .from(tableName)
                .select('*');

            if (error) {
                console.error(error);
            } else {
                setApiData(data);
            }
        };

        fetchData();
    }, [tableName]);
    //min and max value of mileage
    const mileageVal = apiData.map((item) => item.mileage)
    const minMileageFromApiData = Math.min(...mileageVal)
    const maxMileageFromApiData = Math.max(...mileageVal)
    //min and max value of car model in year
    const carModalYearVal = apiData.map((item) => item.year)
    const minCarModalYearVal = Math.min(...carModalYearVal)
    const maxCarModalYearVal = Math.max(...carModalYearVal)
      //cities and states
      const citiess = apiData.map((item) => item.city.toLowerCase())
      const staetsss = apiData.map((item) => item.state.toLowerCase())
      console.log(citiess, staetsss)


    const handleMileageInput = (e) => {
        set_minMileageValue(e.minValue)
        set_maxMileageValue(e.maxValue)
    }
    const handlePriceInput = (e) => {
        setMinProfit(e.minValue)
        setMaxProfit(e.maxValue)
    }
    const handleModelYearInput = (e) => {
        setMinYear(e.minValue)
        setMaxYear(e.maxValue)
    }

    const percentageDiff = (marketValue, listingPrice) => {
        let profit = marketValue - listingPrice
        let profitPercentage = ((profit / marketValue) * 100).toFixed(2)
        return profitPercentage
    }

    const searchHandler = () => {
        setLoading(true)
        console.log(apiData)
        const filteredData = apiData.filter((item) => {
            let profitPercentage = percentageDiff(item.marrketValue, item.price);
            // console.log(state)
            // console.log(city)
            // console.log(minMileageValue)
            // console.log(maxMileageValue)
            // console.log(minYear)
            // console.log(maxYear)
            // console.log(minProfit)
            // console.log(maxProfit)

            return (
                item.state.toLowerCase() === state.toLowerCase()
                // && item.city.toLowerCase() === city.toLowerCase()
                && item.year >= minYear
                && item.year <= maxYear
                && item.mileage >= minMileageValue
                && item.mileage <= maxMileageValue
                // && profitPercentage >= minProfit
                // && profitPercentage <= maxProfit
            );
        })
        setTableData(filteredData)
        setLoading(false)
    }
    console.log(tableData)


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
                        <select id='state-options'
                            onChange={(e) => setState(e.target.value)}>
                            <option value="" >--Choose an option--</option>
                            {apiData && apiData?.map((item) => {
                                return (<option value={item.state}>{item.state}</option>)
                            })}
                        </select>
                    </div>
                    <div className='dashboard-select-criteria'>
                        <div className='dashboard-select-heading'>Select City</div>
                        <select id='state-options'
                            onChange={(e) => setCity(e.target.value)}>
                            <option value="" >--Choose an option--</option>
                            {apiData && apiData?.map((item) => {
                                return (<option value={item.city}>{item.city}</option>)
                            })}
                        </select>
                    </div>
                    <div className='dashboard-select-criteria'>
                        <div className='dashboard-select-heading'>Car Model Year</div>
                        <div className="range-slider">
                            <MultiRangeSlider
                                min={minCarModalYearVal}
                                max={maxCarModalYearVal}
                                minValue={minYear}
                                maxValue={maxYear}
                                ruler={false}
                                barLeftColor="white"
                                barRightColor="white"
                                label={false}
                                barInnerColor="#1B5886"
                                thumbLeftColor="#1B5886"
                                thumbRightColor="#1B5886"
                                onInput={(e) => {
                                    handleModelYearInput(e);
                                }}
                            />
                        </div>
                    </div>
                    <div className='dashboard-select-criteria'>
                        <div className='dashboard-select-heading'>Mileage Range</div>
                        <div className="range-slider">
                            <MultiRangeSlider
                                min={minMileageFromApiData}
                                max={maxMileageFromApiData}
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
                                minValue={minProfit}
                                maxValue={maxProfit}
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
                        <Table TableHeadings={tableHeadings} TableData={tableData} percentageDiff={percentageDiff} />
                    </div>
                </div>

            </div>
        </div>
    )
}
