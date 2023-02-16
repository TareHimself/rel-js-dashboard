import React from 'react';
import { useCallback } from 'react';
import '../../scss/main.scss';
import { Awaitable } from '../../types';


export type DropdownItemProps<T, C> = {
    item: T
    selected: boolean;
    onSelected: (item: T) => Awaitable<void>;
    onUnselected: (item: T) => Awaitable<void>;
    displayFn: (item: T, payload: C) => string;
    displayFnPayload: C
}

function DashboardDropdownInputItems<T, C>({ item, selected, onSelected, onUnselected, displayFn, displayFnPayload }: DropdownItemProps<T, C>) {

    const toggleSelectedState = useCallback(() => {
        if (selected) {
            onUnselected(item);
        }
        else {
            onSelected(item);
        }
    }, [selected, item, onSelected, onUnselected])
    return (
        <div className='dashboard-setting-dropdown-content-item' data-state={selected ? "selected" : "unselected"} onClick={toggleSelectedState}>
            <p>{displayFn(item, displayFnPayload)}</p>
        </div>
    );
}

export default DashboardDropdownInputItems;