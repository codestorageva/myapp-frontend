'use client';
import { OnValueFunction } from '@/core/types';
import React, { useEffect, useState } from 'react'
import { City, fetchAllCityByStateId } from './city_controller';
import CustomSelect, { convertData, OptionData } from '@/app/component/select';

const CityDropDown = ({ name, stateId, onValue, selectedCityId, labelVisible = false }: { name?: string; stateId?: string; onValue: OnValueFunction<City>; selectedCityId?: number; labelVisible: boolean }) => {
  const [cityData, setCityData] = useState<City[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(selectedCityId?.toString() || null);

  useEffect(() => {
    if (stateId && stateId !== '' && stateId !== '-1') {
      getAll();
    } else {
      setCityData([]);          // Clear the city list
      setSelectedOption('');    // Clear the selected option
    }
  },
    [selectedCityId, stateId])

    useEffect(() => {
      if (!selectedCityId) {
        setSelectedOption('');
      } else {
        setSelectedOption(selectedCityId.toString());
      }
    }, [selectedCityId]);

  useEffect(() => {
    if (selectedCityId != undefined && selectedCityId !== null) {
      setSelectedOption(selectedCityId.toString());
    }

  }, [selectedCityId])

  const getAll = async () => {
    if (stateId !== '') {
      let res = await fetchAllCityByStateId(stateId!);

      if (res.success) {
        setCityData(res.data);
      }
      else {
        setCityData([]);
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedOption(value);
    if (onValue) {
      const selectedCity = cityData.find((city) => city.cityId.toString() === value);
      if (selectedCity) {
        onValue(selectedCity, e)
      }
    }
  }

  return (
    <select 
    value={selectedOption || ''}
    onChange={handleChange}
    name={name}
    className='block w-full rounded-md border focus:outline-none border-gray-300 py-2 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6 font-inter'
    >
      <option value=''>Select City</option>
      {
        cityData.map((city) => (
          <option key={city.cityId} value={city.cityId.toString()}>
            {city.cityName}
          </option>
        ))
      }
    </select>
  )
}

export default CityDropDown