import React, { useState, useCallback, useMemo } from 'react';
import { Box, Container, Slider, Typography } from '@mui/material';
import './App.css';
import TableComponent from './components/TableComponent';
import { useFetchData } from './hooks/useFetchData';

function App() {
  const { data, isLoading, isError } = useFetchData();
  const [sliderValue, setSliderValue] = useState(10);
  const [displayedRowCount, setDisplayedRowCount] = useState(10);

  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
  };

  const handleSliderChangeCommitted = (event, newValue) => {
    setDisplayedRowCount(newValue);
  };

  const filterData = useCallback((data, count) => {
    const sortedData = [...data].sort((a, b) => a.strike - b.strike);
    const pivotIndex = sortedData.findIndex(row => row.strike > 214.29);

    let lowerHalf = sortedData.slice(0, pivotIndex).reverse();
    let upperHalf = sortedData.slice(pivotIndex);

    const halfCount = Math.floor(count / 2);

    // If one half doesn't have enough rows, take more from the other half
    if (lowerHalf.length < halfCount) {
      upperHalf = upperHalf.slice(0, count - lowerHalf.length);
    } else if (upperHalf.length < halfCount) {
      lowerHalf = lowerHalf.slice(0, count - upperHalf.length);
    } else {
      lowerHalf = lowerHalf.slice(0, halfCount);
      upperHalf = upperHalf.slice(0, count - lowerHalf.length);
    }

    const newData =  [...lowerHalf, ...upperHalf].sort((a, b) => a.strike - b.strike); // create new array combining both and sort them
    let dataWithSubrows= []
      for (let i =0; i<newData.length; i+=2){
        const data  = {...newData[i], subRows:[ newData[i+1]]}
        // dataWithSubrows.push(newData[i].subRow = newData[i+1])
        dataWithSubrows.push(data)
      }
      console.log(dataWithSubrows)
      return dataWithSubrows
  }, []);


  const filteredData = useMemo(() => {
    return data ? filterData(data, displayedRowCount) : [];
  }, [data, displayedRowCount, filterData]);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen text-2xl'>
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div className='flex items-center justify-center h-screen text-2xl'>
        Error Fetching...
      </div>
    );
  }

  return (
    <>
      <Container maxWidth={false} sx={{ height: '100vh', display: 'flex', flexDirection: 'column', padding: 2 }}>
        <Box sx={{ width: 300 }}>
          <Typography gutterBottom>Number of rows: {sliderValue}</Typography>
          <Box sx={{ display: 'flex', alignItems:'center', gap:2 }}>
            <Typography>0
              </Typography>
              <Slider
                value={sliderValue}
                onChange={handleSliderChange}
                onChangeCommitted={handleSliderChangeCommitted}
                valueLabelDisplay="auto"
                min={1}
                max={data ? data.length : 100}
              />
              <Typography>{data.length}
              </Typography>
          </Box>
        </Box>
        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          <TableComponent data={filteredData} />
        </Box>
      </Container>
    </>
  );
}

export default App;