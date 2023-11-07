import React, { forwardRef, useState } from 'react'
import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid'

export const Input = forwardRef(
    (props, ref) => {
        const { type = 'text', className, errorMessage, ...rest } = props
        const [showPassword, setShowPassword] = useState(false)

        if (type === 'file') {
            return (
                <input
                    ref={ref}
                    type="file"
                    className="py-1.5 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md file:bg-primary-300 file:text-primary-700 file:font-semibold file:border-none file:px-4 file:py-2 file:rounded-full file:mr-6 hover:file:bg-primary-200 file:cursor-pointer transition dark:text-white"
                    {...rest}
                />
            )
        }

        if (type === 'password') {
            return (
                <div className="relative">
                    <button
                        type="button"
                        className="absolute top-1.5 right-3 text-gray-700 p-1 focus:outline-none focus:ring-2 focus:ring-primary-600 rounded-full"
                        onClick={() => setShowPassword(prev => !prev)}
                    >
                        <span className="sr-only">Toggle Show</span>
                        {showPassword ? (
                            <EyeIcon className="w-5 h-5 text-gray-500" />
                        ) : (
                            <EyeOffIcon className="w-5 h-5 text-gray-500" />
                        )}
                    </button>
                    <input
                        ref={ref}
                        type={showPassword ? 'text' : 'password'}
                        // autoComplete="service"
                        className={`${className} ${errorMessage ? 'border-red-500' : 'border-gray-200'
                            } appearance-none block w-full pl-3 pr-12 py-2 border  rounded-full shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-600 focus:border-primary-600 sm:text-sm read-only:bg-gray-300 read-only:focus:ring-transparent read-only:focus:border-transparent focus:bg-white bg-gray-100 dark:bg-gray-800 dark:text-white dark:border-gray-800`}
                        {...rest}
                    />

                    {errorMessage ? (
                        <p className="absolute text-xs text-red-500">{errorMessage}</p>
                    ) : null}
                </div>
            )
        }

        return (
            <div className="relative">
                <input
                    ref={ref}
                    type={type}
                    // autoComplete="service"
                    className={`${className} ${errorMessage ? 'border-red-500' : 'border-gray-200'
                        } ${type === 'checkbox rounded' ? 'p-2.5' : 'px-3 py-2 rounded-full'
                        } appearance-none block w-full  border  rounded-full shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-600 focus:border-primary-600 sm:text-sm  read-only:bg-gray-300 read-only:focus:bg-gray-300 read-only:focus:ring-transparent read-only:focus:border-transparent bg-gray-100 focus:bg-white dark:read-only:bg-black dark:read-only:focus:bg-black dark:read-only:hover:bg-black dark:read-only:border-black dark:focus:bg-gray-900 dark:hover:bg-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-800`}
                    {...rest}
                />
                {errorMessage ? (
                    <p className="absolute text-xs text-red-500">{errorMessage}</p>
                ) : null}
            </div>
        )
    },
)
Input.displayName = 'Input';
export default Input
