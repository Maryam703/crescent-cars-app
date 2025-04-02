import React, { useEffect, useState } from 'react'
import "./Dashboard.css"
import Table from '../Table/Table'
import Loader from "../Loader/Loader"
import MultiRangeSlider from "multi-range-slider-react";
import { supabase } from '../supabaseClient';

export default function Dashboard() {
    const [loading, setLoading] = useState(false)
    const [state, setState] = useState(null)
    const [city, setCity] = useState(null);
    const [minCarMileage, setMinCarMileage] = useState(null)
    const [maxCarMileage, setMaxCarMileage] = useState(null)
    const [minMileageValue, set_minMileageValue] = useState(0);
    const [maxMileageValue, set_maxMileageValue] = useState(150000);
    const [minYear, setMinYear] = useState(1900);
    const [maxYear, setMaxYear] = useState(2025);
    const [tableData, setTableData] = useState([]);
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
                // Fetch year values, ignoring null and invalid entries
                const { data, error } = await supabase
                    .from('cars_data')
                    .select('year')
                    .not('year', 'is', null); // Ignore null year values

                if (error) {
                    console.error('Error fetching year data:', error);
                    return;
                }

                if (!data || data.length === 0) {
                    console.log('No valid year data available.');
                    return;
                }

                // Helper function to clean and parse year to number
                const parseYear = (value) => {
                    const cleanedValue = value?.toString().replace(/[^0-9]/g, '');
                    return cleanedValue ? parseInt(cleanedValue, 10) : null;
                };

                // Filter and parse valid year values
                const validYears = data
                    .map((item) => parseYear(item.year))
                    .filter((year) => year !== null && !isNaN(year));

                if (validYears.length === 0) {
                    console.log('No valid year values after filtering.');
                    return;
                }

                // Calculate minimum and maximum year
                const minYear = Math.min(...validYears);
                const maxYear = Math.max(...validYears);

                console.log('Minimum year:', minYear);
                console.log('Maximum year:', maxYear);

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
                // Fetch mileage values, ignoring null and invalid entries
                const { data, error } = await supabase
                    .from('cars_data')
                    .select('mileage')
                    .not('mileage', 'is', null); // Ignore null mileage values

                if (error) {
                    console.error('Error fetching mileage data:', error);
                    return;
                }

                if (!data || data.length === 0) {
                    console.log('No valid mileage data available.');
                    return;
                }

                // Helper function to clean and parse mileage to number
                const parseMileage = (value) => {
                    const cleanedValue = value?.toString().replace(/[^0-9.]/g, '');
                    return cleanedValue ? parseFloat(cleanedValue) : null;
                };

                // Filter and parse valid mileage values
                const validMileages = data
                    .map((item) => parseMileage(item.mileage))
                    .filter((mileage) => mileage !== null && !isNaN(mileage));

                if (validMileages.length === 0) {
                    console.log('No valid mileage values after filtering.');
                    return;
                }

                // Calculate minimum and maximum mileage
                const minMileage = Math.min(...validMileages);
                const maxMileage = Math.max(...validMileages);

                console.log('Minimum mileage:', minMileage);
                console.log('Maximum mileage:', maxMileage);

                setMinCarMileage(minMileage)
                setMaxCarMileage(maxMileage)

            } catch (error) {
                console.error('Unexpected error:', error);
            }
        };

        fetchMileageRange();
    }, []);

    useEffect(() => {
        const fetchCities = async () => {
            const { data, error } = await supabase
                .from(tableName) // Replace with your table name
                .select('city');

            if (error) {
                console.error('Error fetching cities:', error);
                return [];
            }

            // Extract city names from the result
            const allCities = data.map(item => item.city);
            const cities = [...new Set(allCities)]
            setCities(cities)
            console.log('Cities:', cities);
        };

        fetchCities();
    }, [])

    useEffect(() => {
        const fetchStates = async () => {
            const { data, error } = await supabase
                .from(tableName) // Replace with your table name
                .select('state');

            if (error) {
                console.error('Error fetching states:', error);
                return [];
            }

            // Extract city names from the result
            const allStates = data.map(item => item.state);
            const states = [...new Set(allStates)]
            setStates(states)
            console.log('States:', states);
        };

        fetchStates();
    }, [])

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


    const percentageDiff = (marketValue, listingPrice) => {
        let profit = marketValue - listingPrice
        let profitPercentage = ((profit / marketValue) * 100).toFixed(2)
        return profitPercentage
    }

    const searchHandler = async () => {
        setLoading(true)
        console.log(state)
        console.log(city)
        console.log(minMileageValue)
        console.log(maxMileageValue)
        console.log(minYear)
        console.log(maxYear)
        // console.log(minProfit)
        // console.log(maxProfit)
          // .select(`
                //     *,
                //     ((market_price - listing_price) / listing_price) * 100 as percentage_diff
                //   `)
                 // .gte('percentage_diff', minProfit)
                // .lte('percentage_diff', maxProfit);

        try {
            const { data, error } = await supabase
                .from(tableName)
                .select("*")
                .eq('state', state)
                .eq('city', city)
                .gte('year', minYear)
                .lte('year', maxYear)
                .gte('mileage', minMileageValue)
                .lte('mileage', maxMileageValue)
        
            console.log(data)
            setTableData(data)

            if (error) {
                console.error(error)
            }

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
                        <Table TableHeadings={tableHeadings} TableData={tableData} percentageDiff={percentageDiff} />
                    </div>
                </div>

            </div>
        </div>
    )
}
