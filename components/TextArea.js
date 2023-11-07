import React, { forwardRef } from 'react'

export const TextArea = forwardRef(
  (props, ref) => {
    const { className, errorMessage, ...rest } = props

    return (
      <div className="relative">
        <textarea
          ref={ref}
          autoComplete="service"
          className={`${className} ${errorMessage ? 'border-red-500' : 'border-gray-200'
            } appearance-none block w-full px-3 py-2 border rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-600 focus:border-primary-600 sm:text-sm bg-gray-100 dark:focus:bg-gray-900 dark:hover:bg-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-800 read-only:bg-gray-300 read-only:focus:bg-gray-300 read-only:focus:ring-transparent read-only:focus:border-transparent`}
          {...rest}
        />
        {errorMessage ? (
          <p className="absolute text-xs text-red-500">{errorMessage}</p>
        ) : null}
      </div>
    )
  },
)

export default TextArea
