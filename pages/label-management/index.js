import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/outline'
import { useForm } from 'react-hook-form';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { HttpRequestExternal } from '../../utils/http';
import { PaginationTable } from '../../components/table/PaginationTable';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router'
import moment from 'moment';
import PrintLabelModal from '../../components/PrintLabelModal';
import PrintLabelManyModal from '../../components/PrintLabelManyModal';

export default function App(props) {

    const router = useRouter()
    const [listData, setListData] = useState([])
    const [isLoading, setIsloading] = useState([])
    const [showPrintBatch, setShowPrintBatch] = useState(false)
    const [selectAll, setSelectAll] = useState(false)
    const [btnSelectAll, setBtnSelectAll] = useState(false)
    const [modal, setModal] = useState(false)
    const [modalMulti, setModalMulti] = useState(false)
    const [selected, setSelected] = useState(null)
    const [multiPrint, setMultiPrint] = useState([])
    const [modalMultiBatch, setMultiPrintBatch] = useState(false)
    const [multiAll, setMultiAll] = useState([])

    const getData = useCallback(() => {
        setIsloading(true)
        HttpRequestExternal.getLabelManagement().then((res) => {
            setListData(res.data.data)
            setIsloading(false)
        }).catch((err) => {
            setIsloading(false)
        })
    }, [listData])

    const bacthPrint = useCallback((id_roll, event) => {
        let id = id_roll
        if (event.target.checked) {
            let arr = multiPrint
            arr.push(id)
            setMultiPrint(arr)
            if (multiPrint.length > 0) {
                setShowPrintBatch(true)
            }
        } else {
            let arr = multiPrint
            let index = arr.indexOf(id)
            arr.splice(index, 1)
            if (multiPrint.length == 0) {
                setShowPrintBatch(false)
            }
        }
    }, [multiPrint])

    useEffect(() => {
        getData()
        if (showPrintBatch == true) {
            if (multiPrint.length > 0) {
                setShowPrintBatch(true)
                setIsloading(false)
                setBtnSelectAll(false)
            }
        } else {
            setIsloading(false)
            setBtnSelectAll(true)
            setShowPrintBatch(false)
        }
    }, [showPrintBatch, btnSelectAll])

    const columns = useMemo(
        () => [
            {
                Header: 'Select',
                Footer: 'Select',
                accessor: 'select',
                Cell: (data) => (
                    <div className='flex flex-row items-center'>
                        <input type="checkbox" name="cls" className='mr-3' value={data?.row?.original?.id} onChange={(e) => {
                            bacthPrint(data?.row?.original?.id, e)
                        }} />
                    </div>
                ),
            },
            {
                Header: "Name Equipment",
                accessor: "Name Equipment",
                accessor: 'equipments_name',
            },
            {
                Header: 'Serial Number',
                Footer: 'Serial Number',
                accessor: 'serial_number',
            },
            {
                Header: 'Model',
                Footer: 'Model',
                accessor: 'data_model.model_name',
            },
            {
                Header: 'Brand',
                Footer: 'Brand',
                accessor: 'data_brand.brand_name',
            },
            {
                Header: 'Manufactur Date',
                Footer: 'Manufactur Date',
                accessor: 'manufacturing_date_format',
                Cell: ({ value }) => {
                    return value ? value : '';
                },
            },
            {
                Header: 'Action',
                Footer: 'Action',
                accessor: 'action',
                Cell: (data) => (
                    <div className='flex flex-row'>
                        <Button onClick={() => {
                            setModal(true)
                            setSelected(data?.row?.original?.id)
                        }}>
                            Print
                        </Button>
                    </div>
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
                        Label Management
                    </h1>
                </div>
                <div className='flex flex-col space-y-4'>
                    {
                        showPrintBatch == true && (
                            <Button onClick={() => {
                                if (btnSelectAll == true) {
                                    setMultiPrintBatch(true)
                                } else {
                                    setModalMulti(true)
                                }
                            }}>
                                Batch Print
                            </Button>
                        )
                    }
                    {
                        btnSelectAll == true && (
                            <Button onClick={() => {
                                setSelectAll(true)
                                var ele = document.getElementsByName("cls")
                                for (var i = 0; i < ele.length; i++) {
                                    if (ele[i].type == 'checkbox')
                                        ele[i].checked = true
                                    if (ele[i].checked == true) {
                                        let arr = multiPrint
                                        arr.push(ele[i].value)
                                        setMultiAll(arr)
                                    }
                                }
                                setShowPrintBatch(true)
                                setIsloading(false)
                            }}>
                                Select All
                            </Button>
                        )
                    }

                    {
                        selectAll == true && (
                            <Button onClick={() => {
                                setSelectAll(false)
                                var ele = document.getElementsByName("cls")
                                for (var i = 0; i < ele.length; i++) {
                                    if (ele[i].type == 'checkbox')
                                        ele[i].checked = false;
                                    if (ele[i].checked == false) {
                                        let arr = multiPrint
                                        let index = arr.indexOf(ele[i].value)
                                        arr.splice(index, 1)
                                        setMultiAll(arr)
                                    }
                                }
                                setShowPrintBatch(false)
                                setIsloading(false)
                            }}>
                                Unselect All
                            </Button>
                        )
                    }
                </div>
            </div>

            <PrintLabelModal
                isOpen={modal}
                dataId={selected}
                setIsOpen={() => setModal(false)}
            />

            <PrintLabelManyModal
                isOpen={modalMulti}
                dataId={multiPrint}
                setIsOpen={() => setModalMulti(false)}
            />
            {
                selectAll == true && (
                    <>
                        <PrintLabelManyModal
                            isOpen={modalMultiBatch}
                            dataId={multiAll}
                            setIsOpen={() => setMultiPrintBatch(false)}
                        />
                    </>
                )
            }


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
                        data={listData || []}
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