import React, { useEffect, useState } from 'react'
import "./Dashboard.css"
import Table from '../Table/Table'
import Loader from "../Loader/Loader"
import MultiRangeSlider from "multi-range-slider-react";
import { supabase } from '../supabaseClient';
import stateCityMapOfCanadaAndUS from "../CitiesAndStates/CitiesAndStaetsApi"

export default function Dashboard() {
    const [loading, setLoading] = useState(false)
    const [state, setState] = useState(null)
    const [city, setCity] = useState(null);
    const [minCarMileage, setMinCarMileage] = useState(null)
    const [maxCarMileage, setMaxCarMileage] = useState(null)
    const [minMileageValue, set_minMileageValue] = useState(0);
    const [maxMileageValue, set_maxMileageValue] = useState(200000);
    const [minYear, setMinYear] = useState(1900);
    const [maxYear, setMaxYear] = useState(2025);
    const [tableData, setTableData] = useState(null);
    const [minCarModalYear, setMinCarModalYear] = useState(null)
    const [maxCarModalYear, setMaxCarModalYear] = useState(null)
    const [cities, setCities] = useState([])
    const [states, setStates] = useState([])
    const [minProfit, setMinProfit] = useState(0);
    const [maxProfit, setMaxProfit] = useState(70);

    const tableHeadings = ["Title", "Year", "Making", "Modal", "Mileage", "ListingPrice", "MarketValue", "Difference(%)", "Source", "Link"];

    const tableName = process.env.REACT_APP_TABLE_NAME

    useEffect(() => {
        const fetchYearRange = async () => {
            try {
                const { data, error } = await supabase
                    .from(tableName)
                    .select('year')
                    .not('year', 'is', null);

                if (error) {
                    console.error('Error fetching year data:', error);
                    return;
                }

                if (!data || data.length === 0) {
                    return;
                }

                const parseYear = (value) => {
                    const cleanedValue = value?.toString().replace(/[^0-9]/g, '');
                    return cleanedValue ? parseInt(cleanedValue, 10) : null;
                };

                const validYears = data
                    .map((item) => parseYear(item.year))
                    .filter((year) => year !== null && !isNaN(year));

                if (validYears.length === 0) {
                    return;
                }

                const minYear = Math.min(...validYears);
                const maxYear = Math.max(...validYears);

                setMinCarModalYear(minYear)
                setMaxCarModalYear(maxYear)
            } catch (error) {
                console.error('Unexpected error:', error);
            }
        };

        fetchYearRange();
    }, []);

    useEffect(() => {
        const fetchMileageRange = async () => {
            try {
                const { data, error } = await supabase
                    .from(tableName)
                    .select('mileage')
                    .not('mileage', 'is', null);

                if (error) {
                    console.error('Error fetching mileage data:', error);
                    return;
                }

                if (!data || data.length === 0) {

                    return;
                }

                const parseMileage = (value) => {
                    const cleanedValue = value?.toString().replace(/[^0-9.]/g, '');
                    return cleanedValue ? parseFloat(cleanedValue) : null;
                };

                const validMileages = data
                    .map((item) => parseMileage(item.mileage))
                    .filter((mileage) => mileage !== null && !isNaN(mileage));

                if (validMileages.length === 0) {

                    return;
                }

                const minMileage = Math.min(...validMileages);
                const maxMileage = Math.max(...validMileages);




                setMinCarMileage(minMileage)
                setMaxCarMileage(maxMileage)

            } catch (error) {
                console.error('Unexpected error:', error);
            }
        };

        fetchMileageRange();
    }, []);

    useEffect(() => {
        const fetchStates = async () => {
            const allStates = Object.keys(stateCityMapOfCanadaAndUS)
            const states = [...new Set(allStates)]
            const sortedStates = states.sort()
            setStates(sortedStates)

        };

        fetchStates();
    }, [])

    useEffect(() => {
        const fetchCities = () => {
            const allCities = stateCityMapOfCanadaAndUS[state]
            const cities = [...new Set(allCities)]
            const sortedCities = cities.sort()
            setCities(sortedCities)

        };

        fetchCities();
    }, [state])

    const handleMileageInput = (e) => {
        set_minMileageValue(e.minValue)
        set_maxMileageValue(e.maxValue)
    }
    const handleModelYearInput = (e) => {
        setMinYear(e.minValue)
        setMaxYear(e.maxValue)
    }
    const handlePriceInput = (e) => {
        setMinProfit(e.minValue)
        setMaxProfit(e.maxValue)
    }

    let percentDiff = (item) => {
        return Number(item?.replace("%", ""))
    }

    const searchHandler = async () => {
        setLoading(true)
        try {
            const { data: carsData, error: carsError } = await supabase
                .from(tableName)
                .select('*')
                .ilike("state", state)
                .ilike("city", city)

            if (carsError) {
                console.log("err:", carsError)
            }


            const filteredData = carsData.filter((car) => {
                const year = parseInt(car?.year);
                const mileage = parseInt(car?.mileage);
                let percentDiffVal = percentDiff(car?.difference_average)

                return (
                    year >= minYear &&
                    year <= maxYear &&
                    mileage >= minMileageValue &&
                    mileage <= maxMileageValue &&
                    percentDiffVal >= minProfit && percentDiffVal <= maxProfit
                )
            });

            const biggerMarketValueItems = filteredData?.filter((item) => {
                const marketPrice = Number(item?.marketPrice.replace(/[$,]/g, ""));
                const price = Number(item?.price.replace(/[$,]/g, ""));

                return marketPrice >= price;
            });

            setTableData(biggerMarketValueItems)

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
                        <select id='state-options'
                            onChange={(e) => setState(e.target.value)}>
                            <option value="" >--Choose an option--</option>
                            {states && states?.map((state) => {
                                return (<option value={state} key={state}>{state}</option>)
                            })}
                        </select>
                    </div>
                    <div className='dashboard-select-criteria'>
                        <div className='dashboard-select-heading'>Select City</div>
                        <select id='state-options'
                            onChange={(e) => setCity(e.target.value)}>
                            <option value="" >--Choose an option--</option>
                            {cities && cities?.map((city) => {
                                return (<option value={city} key={city}>{city}</option>)
                            })}
                        </select>
                    </div>
                    <div className='dashboard-select-criteria'>
                        <div className='dashboard-select-heading'>Car Model Year</div>
                        <div className="range-slider">
                            <MultiRangeSlider
                                min={minCarModalYear}
                                max={maxCarModalYear}
                                minValue={minYear}
                                maxValue={maxYear}
                                step={1}
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
                                min={minCarMileage}
                                max={maxCarMileage}
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
                        <Table TableHeadings={tableHeadings} TableData={tableData} percentDiff={percentDiff} />
                    </div>
                </div>

            </div>
        </div>
    )
}
