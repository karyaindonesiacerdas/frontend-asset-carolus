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

const notify = (a) => toast.success('Successfully! ' + a)
const notifyGagal = (a) => toast.error('Failed! ' + a)

export default function App(props) {

    const [listData, setListData] = useState([])
    const router = useRouter()
    const [isLoading, setIsLoading] = useState([])

    const getAssetVendor = useCallback(() => {
        setIsLoading(true)
        HttpRequestExternal.getVendor().then((res) => {
            // // console.log("res", res)
            setIsLoading(false)
            setListData(res.data.data)
        }).catch((err) => {
            setIsLoading(false)
            setListData([])
            notifyGagal("to get data")
            // // console.log("err", err)
        })
    }, [])

    useEffect(() => {
        getAssetVendor()
    }, [])

    const columns = useMemo(
        () => [
            {
                Header: 'Name',
                Footer: 'Name',
                accessor: 'patient.name',
            },
            {
                Header: 'Supplier',
                Footer: 'Supplier',
                accessor: 'partner.name',
            },
        ],
        [],
    )

    return (
        <>
            <div className="flex items-center justify-between px-3 mb-6 sm:px-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Vendor
                    </h1>
                </div>
                {/* <div className="flex items-center space-x-6">
                    <Link href="/vendor-management/create">
                        <a className="secondary-action-button">
                            <PlusIcon className="w-4 h-4" />
                            <span>Add Vendor</span>
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
                    skeletonCols={3}
                    showFooter={false}
                    data={listData}
                    columns={columns}
                    searchable={true}
                    pagination={false}
                    extraPaddingBottom={false}
                />
            </div>
        </>
    )
}