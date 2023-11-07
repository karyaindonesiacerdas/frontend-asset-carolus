import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/outline'
import { useForm } from 'react-hook-form';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { HttpRequestExternal } from '../../utils/http';
import { PaginationTable } from '../../components/table/PaginationTable';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router'
import toast, { Toaster } from 'react-hot-toast';

const notifyDel = () => toast.success('Successfully Delete!')
const notifyDelDel = (a) => toast.error('Failed! ' + a)

export default function App(props) {

    const [listData, setListData] = useState([])
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const getData = useCallback(() => {
        setIsLoading(true)
        HttpRequestExternal.getRole().then((res) => {
            // console.log("res", res)
            setListData(res.data.data)
            setIsLoading(false)
        }).catch((err) => {
            // console.log("err", err, err.response)
            setIsLoading(false)
            setListData([])
            notifyDelDel("Load Data")
            // notifyDelDel(err.response.data.message)
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
        ],
        [],
    )

    return (
        <>
            <div className="flex items-center justify-between px-3 mb-6 sm:px-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Role
                    </h1>
                </div>
                {/* <div className="flex items-center space-x-6">
                    <Link href="/role/create">
                        <a className="secondary-action-button">
                            <PlusIcon className="w-4 h-4" />
                            <span>Add Role</span>
                        </a>
                    </Link>
                </div> */}
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