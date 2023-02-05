import { useCallback, useState } from 'react';
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

    const dropdownId = `${name}-dropdown-input`;

    const [showDropdown, setShowDropdown] = useState(false);

    const toggleDropdown = useCallback(() => {
        setShowDropdown(!showDropdown);
    }, [showDropdown])

    const onItemSelected = useCallback((item: T) => {

        value.push(item);

        if (value.length > (maxSelection || Infinity)) value.shift();

        onChange([...value]);
    }, [maxSelection, onChange, value])

    const onItemUnselected = useCallback((item: T) => {
        const index = value.indexOf(item);

        if (index !== -1) {
            if (value.length - 1 < (minSelection || 0)) return;
            value.splice(index, 1);
        }

        onChange([...value]);
    }, [minSelection, onChange, value])

    const elements = options.map((option, index) => {
        return <DashboardDropdownInputItems<T, C>
            key={index}
            item={option}
            selected={value.includes(option)}
            onSelected={onItemSelected}
            onUnselected={onItemUnselected}
            displayFn={displayFn}
            displayFnPayload={displayFnPayload}
        />
    });

    useEffect(() => {
        const icon = document.getElementById(dropdownId + '-icon');
        if (icon) {
            icon.setAttribute('is-open', showDropdown ? 'true' : 'false');
        }
    }, [showDropdown, dropdownId])

    useEffect(() => {

        const decideCloseDropdown = (clickEvent: MouseEvent) => {

            const dropdown = document.getElementById(dropdownId);

            if (!dropdown) return;

            const bounds = dropdown.getBoundingClientRect();

            if ((clickEvent.pageX > bounds.left && clickEvent.pageX < bounds.right) && (clickEvent.pageY > bounds.top && clickEvent.pageY < bounds.bottom)) return;

            window.removeEventListener('click', decideCloseDropdown);

            setShowDropdown(false);

            const icon = document.getElementById(dropdownId + '-icon');
            if (icon) {
                icon.setAttribute('is-open', 'false');
            }
        }

        if (showDropdown) {
            window.addEventListener('click', decideCloseDropdown);
        }

        return () => { if (showDropdown) window.removeEventListener('click', decideCloseDropdown) };
    }, [showDropdown, dropdownId])

    const currentValue = (value.length > 1) ? `${value.length} Selected` : displayFn(value[0], displayFnPayload);
    return (
        <div className='dashboard-setting'>

            <h2>{name}</h2>
            <div className='dashboard-setting-dropdown'>

                <div className='dashboard-setting-dropdown-text' onClick={toggleDropdown} >
                    <h3>{currentValue}</h3> <IoMdArrowDropdown id={dropdownId + '-icon'} />
                </div>
                {showDropdown && <div className='dashboard-setting-dropdown-content' id={dropdownId}>
                    {elements}
                </div>}
            </div>
        </div>
    );
}

export default DashboardDropdownInput;