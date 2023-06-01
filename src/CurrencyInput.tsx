import React from 'react';
import { VNCurrencyFormatter } from './util';

type Props = {
    defaultValue?: number,
    value: number,
    setValue: React.Dispatch<React.SetStateAction<number>>
}

function CurrencyInput({ value, setValue, defaultValue }: Props) {

    const handleInputChange = (event: any) => {
        const inputValue = event.target.value;
        const sanitizedValue = inputValue.replace(/[^0-9]/g, '');
        setValue(sanitizedValue);
    };

    const formatCurrency = (value: any) => {
        return VNCurrencyFormatter.format(value);
    };

    return (
        <input
            defaultValue={defaultValue}
            className="form-input px-4 py-3 rounded-full dark:text-black"
            type="text"
            value={formatCurrency(value)}
            onChange={handleInputChange}
        />
    );
}

export default CurrencyInput;