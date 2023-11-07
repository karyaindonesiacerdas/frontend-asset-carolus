import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/outline'
import { useForm } from 'react-hook-form';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { HttpRequestExternal } from '../../utils/http';
import { PaginationTable } from '../../components/table/PaginationTable';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { useRouter } from 'next/router'

export default function App(props) {

    const [listData, setListData] = useState([])
    const router = useRouter()
    const [isLoading, setIsloading] = useState(false)

    const getData = useCallback(() => {
        setIsloading(true)
        HttpRequestExternal.getInstitation().then((res) => {
            // // console.log("res", res)
            setListData(res.data.data)
            setIsloading(false)
        }).catch((err) => {
            // // console.log("err", err)
            setIsloading(false)
            setListData([])
        })
    }, [listData])

    useEffect(() => {
        getData()
    }, [])

    const columns = useMemo(
        () => [
            {
                Header: 'Name',
                Footer: 'Name',
                accessor: 'name',
            },
            {
                Header: 'Email',
                Footer: 'Email',
                accessor: 'email',
            },
        ],
        [],
    )

    return (
        <>
            <div className="px-3 sm:px-6 mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Institution List
                    </h1>
                </div>
            </div>
            <div className="px-3 sm:px-6">
                {/* <ServerPagination
                    currentPage={1}
                    firstPage={1}
                    lastPage={1}
                    totalPage={1}
                    isFetching={isFetching}
                    isLoading={isLoading}
                    isRefetching={isRefetching}
                    refetch={refetch}
                    limit={limit}
                    setLimit={setLimit}
                    page={page}
                    setPage={setPage}
                /> */}

                <PaginationTable
                    isLoading={isLoading}
                    // isFetching={isFetching}
                    skeletonCols={2}
                    showFooter={false}
                    data={listData}
                    columns={columns}
                    searchable={true}
                    pagination={true}
                    extraPaddingBottom={false}
                />
            </div>
        </>
    )
}