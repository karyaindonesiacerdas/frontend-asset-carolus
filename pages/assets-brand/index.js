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
import ModalDelete from '../../components/ModalDelete';

const notifyDel = () => toast.success('Successfully Delete!')
const notifyDelDel = (a) => toast.error('Failed! ' + a)

const notify = (a) => toast.success('Successfully! ' + a)
const notifyGagal = (a) => toast.error('Failed! ' + a)

export default function App(props) {

    const router = useRouter()
    const [listData, setListData] = useState([])
    const [isLoading, setIsloading] = useState([])
    const [modalDelete, setModalDelete] = useState(false)
    const [selected, setSelected] = useState(null)
    const [isLoadingDelete, setIsLoadingDelete] = useState(false)

    const getData = useCallback(() => {
        setIsloading(true)
        HttpRequestExternal.getAssetBrand().then((res) => {
            setListData(res.data.data)
            setIsloading(false)
        }).catch((err) => {
            notifyGagal("Get Data")
            setIsloading(false)
            setListData([])
        })
    }, [listData])

    const deleteData = useCallback((id) => {
        setIsLoadingDelete(true)
        HttpRequestExternal.deleteAssetBrand(id).then((response) => {
            refreshData()
            setIsLoadingDelete(false)
            setModalDelete(false)
            notifyDel()
        }).catch((error) => {
            notifyDelDel(error.response.data.message)
            setIsLoadingDelete(false)
            setModalDelete(false)
        });
    })

    const refreshData = useCallback(() => {
        router.replace(router.asPath)
        setIsloading(true)
    }, [])

    useEffect(() => {
        getData()
    }, [])

    const columns = useMemo(
        () => [
            {
                Header: 'Brand Name',
                Footer: 'Brand Name',
                accessor: 'brand_name',
            },
            {
                Header: 'Brand Description',
                Footer: 'Brand Description',
                accessor: 'brand_desc',
            },
            {
                Header: 'Action',
                Footer: 'Action',
                accessor: 'action',
                Cell: (data) => (
                    <div className='flex flex-row'>
                        <Button onClick={() => {
                            router.push({
                                pathname: "/assets-brand/detail",
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
                        Asset Brands
                    </h1>
                </div>
            </div>

            <ModalDelete
                open={modalDelete}
                title="Delete Asset Brand"
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
                    <Link href="/assets-brand/create">
                        <a className="secondary-action-button">
                            {/* <PlusIcon className="w-4 h-4" /> */}
                            <span >Add Brand</span>
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