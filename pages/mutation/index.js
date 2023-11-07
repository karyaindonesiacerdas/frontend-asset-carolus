import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { PaginationTable } from "../../components/table/PaginationTable"
import { PlusIcon } from '@heroicons/react/outline'
import Link from 'next/link';
import { HttpRequest, HttpRequestExternal } from '../../utils/http';
import moment from 'moment';
import Button from '../../components/Button';
import { useRouter } from 'next/router';
import toast, { Toaster } from 'react-hot-toast';

const notify = (a) => toast.success('Successfully! ' + a)
const notifyGagal = (a) => toast.error('Failed! ' + a)

export default function App(props) {
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [listData, setListData] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter()

    const loadData = useCallback(() => {
        setIsLoading(true);
        HttpRequestExternal.listBooking().then((response) => {
            setListData(response.data.data)
            // console.log("data list booking", response)
            setIsLoading(false);
        }).catch((error) => {
            // console.log(error, error.response);
            notifyGagal("Load Data")
            setIsLoading(false);
            setListData([]);
        });
    }, [listData])

    useEffect(() => {
        loadData()
    }, [])

    const columns = useMemo(
        () => [
            {
                Header: 'Name Asset',
                Footer: 'Data Asset',
                accessor: 'data_asset.equipments_name',
            },
            {
                Header: 'Status Booking',
                Footer: 'Status Booking',
                accessor: 'status_booking_name',
            },
            {
                Header: 'Start Date',
                Footer: 'Start Date',
                accessor: 'start_date_format',
                Cell: ({ value }) => {
                    return value ? value : '';
                },
            },
            {
                Header: 'End Date',
                Footer: 'End Date',
                accessor: 'end_date_format',
                Cell: ({ value }) => {
                    return value ? value : '';
                },
            },
            {
                Header: 'Quantity',
                Footer: 'Quantity',
                accessor: 'quantity',
            },
            {
                Header: 'Action',
                Footer: 'Action',
                accessor: 'action',
                Cell: (data) => (
                    <Button onClick={() => {
                        router.push({
                            pathname: "/mutation/request",
                            query: {
                                id: data.row.original.id
                            }
                        })
                    }}>
                        Open
                    </Button>
                ),
            },
        ],
        [],
    )

    return (
        <>
            <div className="px-3 sm:px-6 mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Booking
                    </h1>
                </div>
            </div>
            <div className='px-3 sm:px-6 mb-6 flex items-center justify-between'>
                <span className='flex flex-1' />
                <div className="flex space-x-6 items-center">
                    <Link href="/mutation/create">
                        <a className="secondary-action-button">
                            <span >Add Booking Registration</span>
                        </a>
                    </Link>
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
                <div className='overflow-hidden'>
                    <PaginationTable
                        isLoading={isLoading}
                        // isFetching={isFetching}
                        skeletonCols={6}
                        showFooter={false}
                        data={listData}
                        columns={columns}
                        searchable={true}
                        pagination={true}
                        extraPaddingBottom={false}
                    />
                </div>
            </div>
        </>
    )
}