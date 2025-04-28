import React, { useEffect, useState } from 'react';
import "./Dashboard.css";
import Table from '../Table/Table';
import Loader from "../Loader/Loader";
import MultiRangeSlider from "multi-range-slider-react";
import { supabase } from '../supabaseClient';
import stateCityMapOfCanadaAndUS from "../CitiesAndStates/CitiesAndStaetsApi";

export default function Dashboard() {
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState("");
    const [city, setCity] = useState("");
    const [make, setMake] = useState("");
    const [model, setModel] = useState("");
    const [year, setYear] = useState(""); // Added year state
    const [minCarMileage, setMinCarMileage] = useState(0);
    const [maxCarMileage, setMaxCarMileage] = useState(200000);
    const [minMileageValue, set_minMileageValue] = useState(0);
    const [maxMileageValue, set_maxMileageValue] = useState(200000);
    const [minYear, setMinYear] = useState(1900);
    const [maxYear, setMaxYear] = useState(2025);
    const [tableData, setTableData] = useState([]);
    const [minCarModalYear, setMinCarModalYear] = useState(1900);
    const [maxCarModalYear, setMaxCarModalYear] = useState(2025);
    const [cities, setCities] = useState([]);
    const [states, setStates] = useState([]);
    const [makes, setMakes] = useState([]);
    const [models, setModels] = useState([]);
    const [years, setYears] = useState([]); // Added years state for dropdown
    const [minProfit, setMinProfit] = useState(0);
    const [maxProfit, setMaxProfit] = useState(70);
    const [showTable, setShowTable] = useState(false);
    const tableHeadings = ["Title", "Year", "Make", "Model", "Mileage", "ListingPrice", "MarketValue", "Difference(%)", "Source", "Link"];

    // Load states and car makes on component mount
    useEffect(() => {
        const fetchStates = async () => {
            const allStates = Object.keys(stateCityMapOfCanadaAndUS);
            const states = [...new Set(allStates)];
            const sortedStates = states.sort();
            setStates(sortedStates);
        };

        const fetchMakes = async () => {
            try {
                const { data, error } = await supabase
                    .from('cars_data_duplicate')
                    .select('make')
                    .not('make', 'is', null);

                if (error) {
                    console.error('Error fetching makes:', error);
                    return;
                }

                if (data && data.length > 0) {
                    const uniqueMakes = [...new Set(data.map(item => item.make))];
                    setMakes(uniqueMakes.sort());
                }
            } catch (error) {
                console.error('Error fetching makes:', error);
            }
        };

        fetchStates();
        fetchMakes();
        fetchYearRange();
        fetchMileageRange();
        fetchAvailableYears(); // Add this new function to fetch years
    }, []);

    // Fetch available years from the database
    const fetchAvailableYears = async () => {
        try {
            const { data, error } = await supabase
                .from('cars_data_duplicate')
                .select('year')
                .not('year', 'is', null);

            if (error) {
                console.error('Error fetching years:', error);
                return;
            }

            if (data && data.length > 0) {
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

                const uniqueYears = [...new Set(validYears)];
                setYears(uniqueYears.sort((a, b) => b - a)); // Sort years in descending order
            }
        } catch (error) {
            console.error('Error fetching years:', error);
        }
    };

    // Load cities when state changes
    useEffect(() => {
        if (state) {
            const allCities = stateCityMapOfCanadaAndUS[state] || [];
            const cities = [...new Set(allCities)];
            const sortedCities = cities.sort();
            setCities(sortedCities);
        } else {
            setCities([]);
        }
    }, [state]);

    // Load models when make changes
    useEffect(() => {
        if (make) {
            const fetchModels = async () => {
                try {
                    const { data, error } = await supabase
                        .from('cars_data_duplicate')
                        .select('model')
                        .eq('make', make)
                        .not('model', 'is', null);

                    if (error) {
                        console.error('Error fetching models:', error);
                        return;
                    }

                    if (data && data.length > 0) {
                        const uniqueModels = [...new Set(data.map(item => item.model))];
                        setModels(uniqueModels.sort());
                    }
                } catch (error) {
                    console.error('Error fetching models:', error);
                }
            };

            fetchModels();
        } else {
            setModels([]);
        }
    }, [make]);

    // Fetch min and max year values from database
    const fetchYearRange = async () => {
        try {
            const { data, error } = await supabase
                .from('cars_data_duplicate')
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

            setMinCarModalYear(minYear);
            setMaxCarModalYear(maxYear);
            setMinYear(minYear);
            setMaxYear(maxYear);
        } catch (error) {
            console.error('Unexpected error:', error);
        }
    };

    // Fetch min and max mileage values from database
    const fetchMileageRange = async () => {
        try {
            const { data, error } = await supabase
                .from('cars_data_duplicate')
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

            setMinCarMileage(minMileage);
            setMaxCarMileage(maxMileage);
            set_minMileageValue(minMileage);
            set_maxMileageValue(maxMileage);
        } catch (error) {
            console.error('Unexpected error:', error);
        }
    };

    // Handler for mileage slider
    const handleMileageInput = (e) => {
        set_minMileageValue(e.minValue);
        set_maxMileageValue(e.maxValue);
    };

    // Handler for year slider
    const handleModelYearInput = (e) => {
        setMinYear(e.minValue);
        setMaxYear(e.maxValue);
    };

    // Handler for price difference slider
    const handlePriceInput = (e) => {
        setMinProfit(e.minValue);
        setMaxProfit(e.maxValue);
    };

    // Calculate percentage difference between listing and market price
    const percentageOflistingAndMarketValue = (listingPrice, marketPrice) => {
        if (!listingPrice || !marketPrice) return 0;
        
        let listing = Number(listingPrice.replace(/[$,]/g, ""));
        let market = Number(marketPrice.replace(/[$,]/g, ""));
        
        if (market === 0) return 0;
        
        let profit = Math.abs(market - listing);
        const percentageDifference = (profit / market) * 100;
        return Number(percentageDifference.toFixed(2));
    };

    // Build query filters based on selected inputs
    const buildQueryFilters = () => {
        const filters = {};
        
        if (state) filters.state = state;
        if (city) filters.city = city;
        if (make) filters.make = make;
        if (model) filters.model = model;
        if (year) filters.year = year; // Added year to filters
        
        return filters;
    };

    // Validate required fields
    const validateInputs = () => {
        if (!state || !city) {
            alert("Please select both state and city");
            return false;
        }
        return true;
    };

    // Search handler for cars above market price
    const searchHandlerAboveMarket = async () => {
        if (!validateInputs()) return;
        
        setLoading(true);
        
        try {
            const filters = buildQueryFilters();
            
            // Fetch data from cars_data table with filters
            const { data: carsData, error: carsError } = await supabase
                .from('cars_data_duplicate')
                .select('*')
                .match(filters);

            if (carsError) {
                console.error("Error fetching cars data:", carsError);
                setLoading(false);
                return;
            }

            // Process each car to find matching market data
            const processedData = await Promise.all(carsData.map(async (car) => {
                // Find matching market data using all five criteria
                const { data: marketData, error: marketError } = await supabase
                    .from('cars_market')
                    .select('*')
                    .eq('make', car.make)
                    .eq('model', car.model)
                    .eq('state', car.state)
                    .eq('city', car.city);
                    // Year is not used in market data lookup as it's a listing-specific attribute

                if (marketError && marketError.code !== 'PGRST116') {
                    console.error("Error fetching market data:", marketError);
                    return null;
                }

                // If market data found, combine with car data
                if (marketData && marketData.length > 0) {
                    // Use the first market data result (or you could implement logic to choose the best match)
                    return {
                        ...car,
                        marketPrice: marketData[0].marketPrice || "$0"
                    };
                }
                
                return null;
            }));

            // Filter out nulls and apply front-end filters
            const validData = processedData.filter(item => item !== null);
            console.log(`Found ${validData.length} matching cars with market data`);
            
            const filteredData = validData.filter((car) => {
                const carYear = parseInt(car?.year);
                const mileage = Number(car?.mileage.replace(/[^\d]/g, "")); 
                let percentDiffVal = percentageOflistingAndMarketValue(car?.price, car?.marketPrice);

                return (
                    carYear >= minYear &&
                    carYear <= maxYear &&
                    mileage >= minMileageValue &&
                    mileage <= maxMileageValue &&
                    percentDiffVal >= minProfit && 
                    percentDiffVal <= maxProfit
                );
            });

            // Filter for above market price
            const aboveMarketItems = filteredData.filter((item) => {
                const marketPrice = Number(item?.marketPrice.replace(/[$,]/g, ""));
                const price = Number(item?.price.replace(/[$,]/g, ""));
                return marketPrice > price;
            });

            setTableData(aboveMarketItems);
        } catch (error) {
            console.error("Unexpected error:", error);
        }
        
        setLoading(false);
    };

    // Search handler for cars below market price
    const searchHandlerBelowMarket = async () => {
        if (!validateInputs()) return;
        
        setLoading(true);
        
        try {
            const filters = buildQueryFilters();
            
            // Fetch data from cars_data table with filters
            const { data: carsData, error: carsError } = await supabase
                .from('cars_data_duplicate')
                .select('*')
                .match(filters);

            if (carsError) {
                console.error("Error fetching cars data:", carsError);
                setLoading(false);
                return;
            }

            // Process each car to find matching market data
            const processedData = await Promise.all(carsData.map(async (car) => {
                // Find matching market data using all four criteria
                const { data: marketData, error: marketError } = await supabase
                    .from('cars_market')
                    .select('*')
                    .eq('make', car.make)
                    .eq('model', car.model)
                    .eq('state', car.state)
                    .eq('city', car.city);

                if (marketError && marketError.code !== 'PGRST116') {
                    console.error("Error fetching market data:", marketError);
                    return null;
                }

                // If market data found, combine with car data
                if (marketData && marketData.length > 0) {
                    return {
                        ...car,
                        marketPrice: marketData[0].marketPrice || "$0"
                    };
                }
                
                return null;
            }));

            // Filter out nulls and apply front-end filters
            const validData = processedData.filter(item => item !== null);
            console.log(`Found ${validData.length} matching cars with market data`);
            
            const filteredData = validData.filter((car) => {
                const carYear = parseInt(car?.year);
                const mileage = Number(car?.mileage.replace(/[^\d]/g, "")); 
                let percentDiffVal = percentageOflistingAndMarketValue(car?.price, car?.marketPrice);
                
                return (
                    carYear >= minYear &&
                    carYear <= maxYear &&
                    mileage >= minMileageValue &&
                    mileage <= maxMileageValue &&
                    percentDiffVal >= minProfit && 
                    percentDiffVal <= maxProfit
                );
            });

            // Filter for below market price
            const belowMarketItems = filteredData.filter((item) => {
                const marketPrice = Number(item?.marketPrice.replace(/[$,]/g, ""));
                const price = Number(item?.price.replace(/[$,]/g, ""));
                return marketPrice <= price;
            });

            setTableData(belowMarketItems);
        } catch (error) {
            console.error("Unexpected error:", error);
        }
        
        setLoading(false);
    };

    return (
        <div className='dashboard-container'>
            {loading && <Loader />}
            <div className='dashboard-inner-container'>
                <div className='dashboard-upper-box'>
                    <div className='dashboard-upper-box-1'>
                        <img src='https://media.licdn.com/dms/image/v2/D4E22AQErU4Koo1pj2Q/feedshare-shrink_800/B4EZVH55dUHcAg-/0/1740668115468?e=2147483647&v=beta&t=QS41O87R82t8GAbbagErN4qW7fyO4wTT0BR8Q2u8uU4' alt="Car Price Analysis" />
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
                            {states && states?.map((state) => (
                                <option value={state} key={state}>{state}</option>
                            ))}
                        </select>
                    </div>
                    <div className='dashboard-select-criteria'>
                        <div className='dashboard-select-heading'>Select City</div>
                        <select id='city-options'
                            onChange={(e) => setCity(e.target.value)}
                            disabled={!state}>
                            <option value="" >--Choose an option--</option>
                            {cities && cities?.map((city) => (
                                <option value={city} key={city}>{city}</option>
                            ))}
                        </select>
                    </div>
                    {/* <div className='dashboard-select-criteria'>
                        <div className='dashboard-select-heading'>Select Make</div>
                        <select id='make-options'
                            onChange={(e) => setMake(e.target.value)}>
                            <option value="" >--Choose an option--</option>
                            {makes && makes?.map((make) => (
                                <option value={make} key={make}>{make}</option>
                            ))}
                        </select>
                    </div>
                    <div className='dashboard-select-criteria'>
                        <div className='dashboard-select-heading'>Select Model</div>
                        <select id='model-options'
                            onChange={(e) => setModel(e.target.value)}
                            disabled={!make}>
                            <option value="" >--Choose an option--</option>
                            {models && models?.map((model) => (
                                <option value={model} key={model}>{model}</option>
                            ))}
                        </select>
                    </div> */}
                </div>

                <div className='dashboard-select-container'>
                    {/* Added Year dropdown */}
                    <div className='dashboard-select-criteria'>
                        <div className='dashboard-select-heading'>Select Year</div>
                        <select id='year-options'
                            onChange={(e) => setYear(e.target.value)}>
                            <option value="" >--Choose an option--</option>
                            {years && years?.map((year) => (
                                <option value={year} key={year}>{year}</option>
                            ))}
                        </select>
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
                                step={1}
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
                </div>
                
                <div className='dashboard-select-container'>
                    <div className='dashboard-select-criteria'>
                        <div className='dashboard-select-heading'>Price Differences Percentage</div>
                        <div className="range-slider">
                            <MultiRangeSlider
                                min={0}
                                max={100}
                                minValue={minProfit}
                                maxValue={maxProfit}
                                ruler={false}
                                step={1}
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
                
                <div className='dashboard-search-btn' onClick={searchHandlerAboveMarket}>Search Above Market Price</div>
                <div className='dashboard-search-btn' onClick={searchHandlerBelowMarket}>Search Below Market Price</div>

                <div className='dashboard-data-table-container'>
                    <div className="dashboard-data-table-inner-container">
                        <Table 
                            TableHeadings={tableHeadings} 
                            TableData={tableData} 
                            percentageOflistingAndMarketValue={percentageOflistingAndMarketValue} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}