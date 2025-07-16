'use client';
import Colors from '@/app/utils/colors';
import React, { useState } from 'react'
import Image from 'next/image';

type PasswordInputProps = {
    id?: string;
    value?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeHolder?: string;
    className?: string;
    name: string;
}

const PasswordInput = ({
    id = 'password',
    value,
    onChange,
    placeHolder = '',
    className = '',
    name
}: PasswordInputProps) => {

    const [showPassword, setShowPassword] = useState(false);


    return (

        <div className={`relative ${className}`}>
            <input
                name={name}
                type={showPassword ? 'text' : 'password'}
                value={value}
                onChange={onChange}
                placeholder={placeHolder}
                className="w-full px-3 py-1.5 rounded-lg text-base focus:outline-none pr-10"
                style={{
                    border: `1px solid ${Colors.borderColor}`,
                }}
            />
            <button
                type="button"
                className="absolute top-1/2 right-3 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
            >
                <Image
                    src={showPassword ? '/assets/images/hide.svg' : '/assets/images/show.svg'}
                    alt={showPassword ? 'Hide password' : 'Show password'}
                    width={18}
                    height={18}
                />
            </button>
        </div>
    )
}

export default PasswordInput