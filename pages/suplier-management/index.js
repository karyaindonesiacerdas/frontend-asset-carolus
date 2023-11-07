import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { PaginationTable } from "../../components/table/PaginationTable"
import { PlusIcon } from '@heroicons/react/outline'
import Link from 'next/link';
import { HttpRequest, HttpRequestExternal } from '../../utils/http';
import Button from '../../components/Button';

import { useRouter } from 'next/router'
import ModalDelete from '../../components/ModalDelete';
import toast, { Toaster } from 'react-hot-toast';

const notifyDel = () => toast.success('Successfully Delete!')
const notifyDelDel = (a) => toast.error('Failed! ' + a)

export default function App(props) {
    const router = useRouter();
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [listData, setListData] = useState([])
    const [isLoading, setIsLoading] = useState([])

    const loadData = useCallback(() => {
        setIsLoading(true)
        HttpRequestExternal.getSupplier().then((response) => {
            setListData(response.data.data)
            setIsLoading(false)
            // // console.log("data list registerd", response.data.data)
        }).catch((error) => {
            setIsLoading(false)
            setListData([])
            // console.log(error, error.response)
        })
    }, [])

    useEffect(() => {
        loadData()
    }, [])

    const refreshData = useCallback(() => {
        router.replace(router.asPath)
        setIsLoading(true)
    }, [])

    const deleteData = useCallback((id) => {
        setIsLoadingDelete(true)
        HttpRequestExternal.deleteSupplier(id).then((response) => {
            refreshData();
            notifyDel()
            setIsLoadingDelete(false)
            setModalDelete(false)
        }).catch((error) => {
            notifyDelDel(error.response.data.message)
            setIsLoadingDelete(false)
            setModalDelete(false)
        });
    }, [])

    const columns = useMemo(
        () => [
            {
                Header: 'Name',
                Footer: 'Name',
                accessor: 'supplier_name',
            },
            {
                Header: 'SN',
                Footer: 'SN',
                accessor: 'supplier_sn',
            },
            {
                Header: 'Description',
                Footer: 'Description',
                accessor: 'supplier_desc',
            },
            {
                Header: 'Contact',
                Footer: 'Contact',
                accessor: 'contact_no',
            },
            {
                Header: 'Email',
                Footer: 'Email',
                accessor: 'contact_email',
            },
            {
                Header: 'Action',
                Footer: 'Action',
                accessor: 'action',
                Cell: (data) => (
                    <div className='flex flex-row'>
                        <Button onClick={() => {
                            router.push({
                                pathname: "/suplier-management/detail",
                                query: {
                                    id: data.row.original.id
                                }
                            })
                        }}>
                            Detail
                        </Button>
                        <span className='px-2' />
                        <Button variant="danger" className="bg-red-600 hover:bg-red-300" onClick={() => {
                            setModalDelete(true)
                            setSelected(data.row.original.id)
                        }}>
                            Delete
                        </Button>
                    </div>
                ),
            },
        ],
        [listData],
    )

    const [modalDelete, setModalDelete] = useState(false)
    const [selected, setSelected] = useState(null)
    const [isLoadingDelete, setIsLoadingDelete] = useState(false)

    return (
        <>
            <div className="flex items-center justify-between px-3 mb-6 sm:px-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Supplier
                    </h1>
                </div>

                <ModalDelete
                    open={modalDelete}
                    title="Delete Asset Supplier"
                    setOpen={() => setModalDelete(false)}
                    isLoading={isLoadingDelete}
                    action={() => {
                        // // console.log("action")
                        deleteData(selected)
                    }}
                />
            </div>
            <div className='flex items-center justify-between px-3 mb-6 sm:px-6'>
                <span className='flex flex-1' />
                <div className="flex items-center space-x-6">
                    <Link href="/suplier-management/create">
                        <a className="secondary-action-button">
                            {/* <PlusIcon className="w-4 h-4" /> */}
                            <span >Add Suplier</span>
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
                        skeletonCols={7}
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