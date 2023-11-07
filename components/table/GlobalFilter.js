/* eslint-disable react/prop-types */
import { useState } from 'react'
import { SearchIcon } from '@heroicons/react/solid'
import { useAsyncDebounce } from 'react-table'

export const GlobalFilter = ({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) => {
  const count = preGlobalFilteredRows.length
  const [value, setValue] = useState(globalFilter)
  const onChange = useAsyncDebounce(value => {
    setGlobalFilter(value || undefined)
  }, 200)

  return (
    <div className="sm:max-w-sm flex md:ml-0 shadow-sm">
      <label htmlFor="search_field" className="sr-only">
        Search
      </label>
      <div className="relative w-full text-gray-400 focus-within:text-gray-600">
        <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5" aria-hidden="true" />
        </div>
        <input
          id="search_field"
          className="block w-full h-full pl-10 pr-3 py-2 border border-transparent text-gray-900 placeholder-gray-500 outline-none focus:outline-none focus:placeholder-gray-400 focus:ring-2  sm:text-sm bg-white dark:bg-gray-900 dark:text-white rounded-md  focus:ring-primary-500 focus:bg-white focus:border-transparent shadow-sm"
          type="search"
          name="search"
          value={value || ''}
          onChange={e => {
            setValue(e.target.value)
            onChange(e.target.value)
          }}
          placeholder={`Search from ${count} records...`}
          // placeholder={t('table.search', { total: count })}
        />
      </div>
    </div>
  )
}
