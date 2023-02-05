import '../../scss/main.scss';
import { VscColorMode } from 'react-icons/vsc';
import React from 'react';
import { Awaitable, IDashboardInputProps } from '../../types';

function DashboardColorInput({ name, value, onChange }: IDashboardInputProps<string, (value: string) => Awaitable<void>>) {

    return (
        <div className='dashboard-setting'>
            <h2>{name}</h2>
            <div className='dashboard-setting-color' style={{ backgroundColor: value }}>
                <div className='dashboard-setting-color-background' />
                <VscColorMode />
                <input type="color" value={value} onChange={(e) => onChange(e.target.value)} />
            </div>
        </div>
    );
}

export default DashboardColorInput;