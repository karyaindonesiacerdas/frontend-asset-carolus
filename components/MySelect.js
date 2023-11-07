import React, { forwardRef } from 'react'

export const MySelect = forwardRef(
    (props, ref) => {
        const {
            placeholder = 'Choose',
            className,
            children,
            errorMessage,
            variant = 'normal',
            ...rest
        } = props

        return (
            <div className="relative">
                <select
                    {...props}
                    ref={ref}
                    placeholder={placeholder}
                    className={`${errorMessage ? 'border-red-500' : 'border-gray-200'} ${variant === 'normal' ? 'py-2' : 'py-1'
                        } pl-3 pr-9 appearance-none block w-full border rounded-full shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-600 focus:border-primary-600 sm:text-sm bg-gray-100 dark:bg-gray-800 dark:text-white dark:border-gray-800 ${className}`}
                    {...rest}
                >
                    {children}
                </select>
                {errorMessage ? (
                    <p className="absolute text-xs text-red-500">{errorMessage}</p>
                ) : null}
            </div>
        )
    },
)

MySelect.displayName = 'MySelect';
export default MySelect
