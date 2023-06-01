import React, { useState } from 'react';

type Props = {
    defaultValue?: number,
    value: number,
    setValue: React.Dispatch<React.SetStateAction<number>>
}

function CurrencyInput({ value, setValue, defaultValue }: Props) {
    // const [value, setValue] = useState('');

    const handleInputChange = (event: any) => {
        const inputValue = event.target.value;
        // Xử lý giá trị để chỉ chứa số và dấu chấm
        const sanitizedValue = inputValue.replace(/[^0-9]/g, '');
        setValue(sanitizedValue);
    };

    const formatCurrency = (value: any) => {
        // Định dạng giá trị tiền tệ
        const formatter = new Intl.NumberFormat('vn-VN', {
            style: 'currency',
            currency: 'VND',

        });
        return formatter.format(value);
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