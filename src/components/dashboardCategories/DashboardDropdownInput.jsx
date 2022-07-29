import { useState } from 'react';
import '../../scss/main.scss';
import { IoMdArrowDropdown } from 'react-icons/io';
import DashboardDropdownInputItems from './DashboardDropdownInputItems';
import { useEffect } from 'react';

function DashboardDropdownInput({ name, value, options, minSelectedOptions, maxSelectedOptions, onValueChange, displayDataFunction, displayDataFunctionPayload }) {

    if (!options) throw new Error('No options passed into dropdown');

    const dropdownId = `${name}-dropdown-input`;

    const [showDropdown, setShowDropdown] = useState(false);

    function toggleDropdown(event) {
        setShowDropdown(!showDropdown);
    }

    function onItemSelected(item) {

        value.push(item);

        if (value.length > (maxSelectedOptions || Infinity)) value.shift();

        onValueChange([...value]);
    }

    function onItemUnselected(item) {
        const index = value.indexOf(item);

        if (index !== -1) {
            if (value.length - 1 < (minSelectedOptions || 0)) return;
            value.splice(index, 1);
        }

        onValueChange([...value]);
    }

    const elements = options.map((option, index) => {
        return <DashboardDropdownInputItems
            key={index}
            item={option}
            isSelected={value.includes(option)}
            onItemSelected={onItemSelected}
            onItemUnselected={onItemUnselected}
            displayDataFunction={displayDataFunction}
            displayDataFunctionPayload={displayDataFunctionPayload}
        />
    });

    useEffect(() => {
        const icon = document.getElementById(dropdownId + '-icon');
        if (icon) {
            icon.setAttribute('is-open', showDropdown ? 'true' : 'false');
        }
    }, [showDropdown, dropdownId])

    useEffect(() => {

        const decideCloseDropdown = function (clickEvent) {

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
    /*
     <div className='dashboard-setting-dropdown-text' onClick={toggleDropdown} >
                        <h3>{currentValue}</h3> <IoMdArrowDropdown id={dropdownId + '-icon'} />
                    </div>
                    {showDropdown && <div className='dashboard-setting-dropdown-content' id={dropdownId}>
                        {elements}
                    </div>}*/
    const currentValue = (maxSelectedOptions && maxSelectedOptions > 1) ? `${value.length} Selected` : (displayDataFunction && value.length === 1 ? displayDataFunction(value[0], displayDataFunctionPayload) : value);
    return (
        <div className='dashboard-setting'>
            <h2>{name}</h2>
            <select name={currentValue} className='dashboard-setting-dropdown' >
                {elements}
            </select>
        </div>
    );
}

export default DashboardDropdownInput;