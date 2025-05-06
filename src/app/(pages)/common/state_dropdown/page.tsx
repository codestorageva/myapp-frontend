'use client'
import React, { useEffect, useState } from "react";
import { OnValueFunction } from "@/core/types";
import { fetchAllState, State } from "./state_controller";
import { GetAllParams } from "../../items/items";

interface StateDropDownProps {
    onValue: OnValueFunction<State>;
    name?: string;
    selectedStateId?: number;
    selectBoxWidth?: string;
    labelVisible?: boolean;
}

const StateDropDown: React.FC<StateDropDownProps> = ({
    onValue,
    name = 'state1',
    selectedStateId,
    selectBoxWidth = 'w-full',
    labelVisible = false,
}) => {
    const [sData, setData] = useState<State[]>([]);
    const [selectedOption, setSelectedOption] = useState<string | null>(selectedStateId?.toString() || null);

    const params: Partial<GetAllParams> = {
        sortDirection: 'asc',
        sortBy: 'stateName'
    };

    useEffect(() => {
        getAll();
    }, [selectedStateId]);

    useEffect(() => {
        if (selectedStateId !== undefined && selectedStateId !== null) {
            setSelectedOption(selectedStateId.toString());
        }
    }, [selectedStateId]);

    // Fetch state data from API
    const getAll = async () => {
        try {
            const res = await fetchAllState(params as GetAllParams);
            console.log('Response ', res.data);
            if (res.success) {
                setData(res.data);
            } else {
                setData([]);
            }
        } catch (e) {
            console.error('Error fetching states:', e);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedOption(value);
        if (onValue) {
            const selectedState = sData.find((state) => state.stateId.toString() === value);
            if (selectedState) {
              
                onValue(selectedState, e); 
            }
            else {
                // send dummy empty state object when value is ""
                onValue({ stateId: -1, stateName: "" }, e);
            }
        }
    };

    return (
        <div className={`${selectBoxWidth}`}>
            <select
                value={selectedOption || ''}
                onChange={handleChange}
                name={name}
                className="block w-full rounded-md border focus:outline-none border-gray-300 py-2 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6 font-inter"
            >
                <option value="">Select State</option>
                {sData.map((state) => (
                    <option key={state.stateId} value={state.stateId.toString()}>
                        {state.stateName}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default StateDropDown;
