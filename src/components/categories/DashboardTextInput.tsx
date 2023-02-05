

import React from 'react';
import '../../scss/main.scss';
import { Awaitable, IDashboardInputProps } from '../../types';

function DashboardTextInput({ name, value, onChange }: IDashboardInputProps<string, (value: string) => Awaitable<void>>) {

    return (
        <div className='dashboard-setting'>
            <h2>{name}</h2>
            <input type='text' className='dashboard-setting-text' value={value} onChange={(e) => onChange(e.target.value)} />
        </div>
    );
}

export default DashboardTextInput;