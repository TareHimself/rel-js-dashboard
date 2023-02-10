import { useCallback, useId, useState } from 'react';
import '../../scss/main.scss';
import { IoMdArrowDropdown } from 'react-icons/io';
import DashboardDropdownInputItems from './DashboardDropdownInputItems';
import { useEffect } from 'react';
import { Awaitable, IDashboardInputProps } from '../../types';
import React from 'react';

export interface IDropdownInputProps<T, C> extends IDashboardInputProps<T[], (value: T[]) => Awaitable<void>> {
    options: T[]
    minSelection: number;
    maxSelection: number;
    displayFn: (item: T, payload: C) => string;
    displayFnPayload: C
}


function DashboardDropdownInput<T, C>({ name, value, options, minSelection, maxSelection, onChange, displayFn, displayFnPayload }: IDropdownInputProps<T, C>) {

    if (!options) throw new Error('No options passed into dropdown');

    const dropdownId = useId();

    const [selectedItems, setSelectedItems] = useState(value);

    const [showDropdown, setShowDropdown] = useState(false);

    const toggleDropdown = useCallback(() => {
        setShowDropdown(!showDropdown);
    }, [showDropdown])

    const onItemSelected = useCallback((item: T) => {
        selectedItems.push(item);

        if (selectedItems.length > (maxSelection || Infinity)) selectedItems.shift();
        const newSelected = [...selectedItems];

        setSelectedItems(newSelected);
        onChange(newSelected);
    }, [maxSelection, onChange, selectedItems, setSelectedItems])

    const onItemUnselected = useCallback((item: T) => {
        const index = selectedItems.indexOf(item);

        if (index !== -1) {
            if (selectedItems.length - 1 < (minSelection || 0)) return;
            selectedItems.splice(index, 1);
        }
        const newSelected = [...selectedItems];

        setSelectedItems(newSelected);
        onChange(newSelected);;
    }, [minSelection, onChange, selectedItems, setSelectedItems])

    const elements = options.map((option, index) => {
        return <DashboardDropdownInputItems<T, C>
            key={index}
            item={option}
            selected={selectedItems.includes(option)}
            onSelected={onItemSelected}
            onUnselected={onItemUnselected}
            displayFn={displayFn}
            displayFnPayload={displayFnPayload}
        />
    });

    useEffect(() => {

        const decideCloseDropdown = (clickEvent: MouseEvent) => {

            const content = document.getElementById(`content-${dropdownId}`);
            const dropdown = document.getElementById(`dropdown-${dropdownId}`);

            if (!showDropdown || !content || !dropdown) return;

            const boundsContent = content.getBoundingClientRect();
            const boundsDropdown = dropdown.getBoundingClientRect();
            const bounds = {
                bottom: boundsDropdown.bottom,
                left: boundsContent.left,
                right: boundsDropdown.right,
                top: boundsContent.top,
            }

            if ((clickEvent.pageX > bounds.left && clickEvent.pageX < bounds.right) && (clickEvent.pageY > bounds.top && clickEvent.pageY < bounds.bottom)) return;

            window.removeEventListener('click', decideCloseDropdown);

            setShowDropdown(false);
        }

        if (showDropdown) {
            window.addEventListener('click', decideCloseDropdown);
        }

        return () => { if (showDropdown) window.removeEventListener('click', decideCloseDropdown) };
    }, [showDropdown, dropdownId])

    const currentValue = (selectedItems.length > 1) ? `${selectedItems.length} Selected` : displayFn(selectedItems[0], displayFnPayload);

    useEffect(() => {
        setSelectedItems(value)
    }, [value])

    return (
        <div className='dashboard-setting'>

            <h2>{name}</h2>
            <div className='dashboard-setting-dropdown' id={`content-${dropdownId}`}>

                <div className='dashboard-setting-dropdown-text' onClick={toggleDropdown} >
                    <h3>{currentValue}</h3> <IoMdArrowDropdown id={dropdownId + '-icon'} data-open={`${showDropdown}`} />
                </div>
                {showDropdown && <div className='dashboard-setting-dropdown-content' id={`dropdown-${dropdownId}`}>
                    {elements}
                </div>}
            </div>
        </div>
    );
}

export default DashboardDropdownInput;