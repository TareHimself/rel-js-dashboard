

import React, { useCallback, useEffect, useState } from 'react';
import useThrottle from '../../hooks/useThrottle';
import '../../scss/main.scss';
import { Awaitable, IDashboardInputProps } from '../../types';

function DashboardTextInput({ name, value, onChange }: IDashboardInputProps<string, (value: string) => Awaitable<void>>) {

    const [text, setText] = useState(value)

    const updateText = useThrottle<string>(100, onChange, value)

    const onTextChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
        updateText(ev.target.value)
        setText(ev.target.value)
    }, [setText, updateText])


    useEffect(() => {
        setText(value)
    }, [value])

    return (
        <div className='dashboard-setting'>
            <h2>{name}</h2>
            <input type='text' className='dashboard-setting-text' value={text} onChange={onTextChange} />
        </div>
    );
}

export default DashboardTextInput;