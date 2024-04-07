// Inside App.js or your relevant parent component
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import AddressForm from './components/AddressForm';
import StatsSection from './components/StatsSection';
import DetailsSection from './components/DetailsSection';

function App() {
  const [services, setServices] = useState([]); // State to hold fetched data
  const [selectedServices, setSelectedServices] = useState(null); // State to hold the selected service details
  const [originAddress, setOriginAddress] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);


  const onDetailsRequested = useCallback((category) => {
    const servicesByCategory = services[category];
    if (servicesByCategory) {
      setSelectedCategory(category);
      // Now you can use selectedCategory for further logic
      console.log(`Selected Category: ${category}`);
      const sortedServices = servicesByCategory.sort((a, b) => {
        const timeA = parseInt(a.drivingTime.split(' ')[0], 10);
        const timeB = parseInt(b.drivingTime.split(' ')[0], 10);
        return timeA - timeB;
      });

      setSelectedServices(sortedServices);

    }
  }, [services]); // No dependencies, function doesn't capture changing values

  useEffect(() => {
    if (services) {
      onDetailsRequested(selectedCategory);
    }
  }, [services, selectedCategory, onDetailsRequested]);



  // Function to fetch data, to be called on form submit
  const fetchDirections = async (address) => {
    setLoading(true)
    try {
      const response = await fetch('https://backend-weqx5qlxya-uw.a.run.app/getDirections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address }), // Use the address from the form
      });

      setLoading(false)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setOriginAddress(address);
      setServices(data.places); // Update state with fetched data

      //onDetailsRequested(selectedCategory);

    } catch (error) {
      setLoading(false)
      console.error("Failed to fetch directions:", error);
    }
  };



  return (
    <div className="App">
      <Header />
      <AddressForm onSubmit={fetchDirections} spinner={loading} />

      <StatsSection services={services} onDetailsRequested={onDetailsRequested} />
      <DetailsSection selectedServices={selectedServices} originAddress={originAddress} />
    </div>
  );
}

export default App;
