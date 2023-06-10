import React from 'react';
import { VNCurrencyFormatter, cn } from '../lib/utils';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
    value: number | undefined,
    setValue: React.Dispatch<React.SetStateAction<number>>
}

export const CurrencyInput = React.forwardRef<HTMLInputElement, Props>(
    ({ value, setValue, ...props }, ref) => {

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
                className={cn(
                    "flex h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full",
                )}
                ref={ref}
                type="text"
                value={formatCurrency(value)}
                onChange={handleInputChange}
                name={props.name}
            // {...props}
            />
        );
    })
