import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/outline'
import { useForm } from 'react-hook-form';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { HttpRequestExternal } from '../../utils/http';
import { PaginationTable } from '../../components/table/PaginationTable';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router'
import ModalDelete from '../../components/ModalDelete';

import toast, { Toaster } from 'react-hot-toast';

const notifyDel = () => toast.success('Successfully Delete!')
const notifyDelDel = (a) => toast.error('Failed! ' + a)

export default function App(props) {

    const router = useRouter()
    const [listData, setListData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [modalDelete, setModalDelete] = useState(false)
    const [selected, setSelected] = useState(null)
    const [isLoadingDelete, setIsLoadingDelete] = useState(false)

    const getData = useCallback(() => {
        setIsLoading(true)
        HttpRequestExternal.getAssetType().then((res) => {
            let data = res.data.data
            setIsLoading(false)
            setListData(data)
        }).catch((err) => {
            setIsLoading(false)
            setListData([])
        })
    }, [listData])

    useEffect(() => {
        getData()
    }, [])

    const refreshData = useCallback(() => {
        router.replace(router.asPath)
        setIsLoading(true)
    }, [])

    const deleteData = useCallback((id) => {
        setIsLoadingDelete(true)
        HttpRequestExternal.deleteAssetType(id).then((response) => {
            refreshData()
            notifyDel()
            setIsLoadingDelete(false)
            setModalDelete(false)
        }).catch((error) => {
            notifyDelDel(error.response.data.message)
            setIsLoadingDelete(false)
            setModalDelete(false)
            // // console.log(error, error.response);
        });
    }, [])

    const columns = useMemo(
        () => [
            {
                Header: 'Type Name',
                Footer: 'Type Name',
                accessor: 'type_name',
            },
            {
                Header: 'Type Description',
                Footer: 'Type Description',
                accessor: 'type_desc',
            },
            {
                Header: 'Action',
                Footer: 'Action',
                accessor: 'action',
                Cell: (data) => (
                    <div className='flex flex-row'>
                        <Button onClick={() => {
                            router.push({
                                pathname: "/assets-type/detail",
                                query: {
                                    id: data.row.original.id
                                }
                            })
                        }}>
                            Edit
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
        [],
    )

    return (
        <>
            <div className="flex items-center justify-between px-3 mb-6 sm:px-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Asset Type
                    </h1>
                </div>
            </div>

            <ModalDelete
                open={modalDelete}
                title="Delete Asset Type"
                setOpen={() => setModalDelete(false)}
                isLoading={isLoadingDelete}
                action={() => {
                    // // console.log("action")
                    deleteData(selected)
                }}
            />

            <div className='flex items-center justify-between px-3 mb-6 sm:px-6'>
                <span className='flex flex-1' />
                <div className='flex items-center justify-between px-3 mb-6 sm:px-6'>
                    <Link href="/assets-type/create">
                        <a className="secondary-action-button">
                            {/* <PlusIcon className="w-4 h-4" /> */}
                            <span >Add Type</span>
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
                        skeletonCols={4}
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