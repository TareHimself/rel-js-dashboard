import '../../scss/main.scss';
import { VscColorMode } from 'react-icons/vsc';
import React, { useCallback, useEffect, useId, useState } from 'react';
import { Awaitable, IDashboardInputProps } from '../../types';
import useThrottle from '../../hooks/useThrottle';

function DashboardColorInput({ name, value, onChange }: IDashboardInputProps<string, (value: string) => Awaitable<void>>) {

    const [color, setColor] = useState(value)
    const colorInputId = useId()

    const updateColor = useThrottle<string>(100, onChange, value)

    const onColorChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
        const element = document.getElementById(colorInputId)!
        element.style.backgroundColor = ev.target.value
        updateColor(ev.target.value)
        setColor(ev.target.value)
    }, [colorInputId, updateColor])

    useEffect(() => {
        setColor(value)
    }, [value])

    return (
        <div className='dashboard-setting'>
            <h2>{name}</h2>
            <div id={colorInputId} className='dashboard-setting-color' style={{ backgroundColor: value }}>
                <div className='dashboard-setting-color-background' />
                <VscColorMode />
                <input type="color" value={color} onChange={onColorChange} />
            </div>
        </div>
    );
}

export default DashboardColorInput;