import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link'
import { FaCampground } from 'react-icons/fa';
import { IconName, IoScanSharp } from "react-icons/io5";
import Input from '../../components/Input';
import format from 'date-fns/format'
import { useForm } from 'react-hook-form';
import MySelect from '../../components/MySelect';
import { HttpRequestExternal } from '../../utils/http';
import Button from '../../components/Button';
import { QrReader } from 'react-qr-reader';
import { useRouter } from 'next/router';
import moment from 'moment';
import Select from 'react-select';
import toast, { Toaster } from 'react-hot-toast';
import Modal from "../../components/Modal";
import ModalBiasa from '../../components/ModalBiasa';

const notifyDel = () => toast.success('Successfully Delete!')
const notifyDelDel = () => toast.error('Failed Delete!')

const notify = (a) => toast.success('Successfully! ' + a)
const notifyGagal = (a) => toast.error('Failed! ' + a)

const customStyles = {
    option: (provided, state) => ({
        ...provided,
        width: state.selectProps.width,
        borderBottom: '1px dotted rgb(218 185 107)',
        color: state.selectProps.menuColor,
        // padding: 20,
    }),
    singleValue: (provided, state) => {
        const opacity = state.isDisabled ? 0.5 : 1;
        const transition = 'opacity 300ms';

        return { ...provided, opacity, transition };
    },
    control: (base, { selectProps: { width } }) => ({
        ...base,
        flexDirection: "row",
        height: 40,
        width: width,
        backgroundColor: "rgb(0 0 0 / 0.05)",
        borderRadius: 30,
        border: '1px solid rgb(0 0 0 / 0.1)',
    })
}

export default function App(props) {
    const router = useRouter()
    const [dataScanner, setDataScanner] = useState({});
    const [isShowScanner, setShowScanner] = useState(false);
    const [isIdUser, setIsIdUser] = useState(false);
    const [listData, setListData] = useState([])
    const [isLoading, setIsLoading] = useState(false);

    const [dataEquipment, setDataEquipment] = useState("");
    const [dataDetail, setDataDetail] = useState([]);
    const [modal, setmodal] = useState(false)
    const [dataTanggal, setDataTanggal] = useState(false)

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting },
        setValue,
    } = useForm()

    const onSubmit = value => {
        const data = {
            ...value,
        }
        let id = null

        if (dataDetail.length == 0) {
            toast.error("Mohon pilih Equipment")
            return false
        }

        if (dataScanner.asset_id == undefined) {
            toast.error("Mohon pilih tanggal")
            return false
        }

        id = dataScanner.id

        // console.log(JSON.stringify(data))
        HttpRequestExternal.returnAssetBooking(id, data).then((response) => {
            notify(response.data.message)

            setTimeout(() => {
                router.back()
            }, 1000);
        }).catch((err) => {
            // notifyGagal(err.response.data.message)
            toast.error("Kesalahan sistem, Mohon ulangi perintah")
            // console.log("err", err, err.response);
        })
    }
    useEffect(() => {
        loadData()
        if (dataEquipment != "") {
            // setmodal(true)
            toast.success("Berhasil mendapatkan data equipment\nMohon pilih tanggal")
            handleIdData()
        }
    }, [dataEquipment])

    const loadData = useCallback(() => {
        setIsLoading(true);
        HttpRequestExternal.getListAssetBox().then((response) => {
            let data = response.data.data
            // console.log("getListAssetBooking", data)
            let looping = data.map((i) => {
                return {
                    value: i.id,
                    label: i.equipments_name
                }
            })
            setListData(looping)
            setIsLoading(false);
        }).catch((error) => {
            // console.log(error, error.response);
            setIsLoading(false);
            setListData([]);
            notifyGagal("Load Data Equipment")
        });
    }, [listData])

    const handleIdData = useCallback(() => {
        setDataTanggal(true)
        let id = dataEquipment
        HttpRequestExternal.getDetailListAssetBox(id).then((response) => {
            let data = response.data.data
            let looping = data.map((i) => {
                return {
                    value: i.id,
                    label: i.tanggal_pinjam_tampil + " " + i.user_name,
                }
            })
            setDataDetail(looping)
        }).catch((error) => {
            // console.log(error, error.response);
            notifyGagal("Load Detail Equipment")
        })
    }, [dataEquipment])

    const handleDetail = useCallback((event) => {
        let id = event
        if (id === "") {
            setDataScanner(null)
        } else {
            HttpRequestExternal.getAssetBookingById(id).then((res) => {
                // console.log("ini adalah detail", res.data.data)
                setDataScanner(res.data.data)
            }).catch((err) => {
                // console.log("err", err, err.response);
                notifyGagal("Load Data Detail")
            })
        }
    }, [dataScanner, dataDetail])

    const defaultEquipment = useCallback((item) => {
        item = ""
        handleDetail()
        setDataTanggal(false)
        return item
    })

    return (
        <>
            <div className="px-3 sm:px-6">
                <Link
                    href={`/returned-asset`}
                >
                    <a className='inline-block mb-4 font-semibold text-primary-600 hover:underline'>Back to Returned Booking List</a>
                </Link>
                <div className='p-6 my-4 bg-white rounded-md'>
                    <div className="flex flex-row pt-4">
                        <div className="mb-4">
                            <h1 className="font-bold text-gray-900 lg:text-2xl sm:text-xl dark:text-white">
                                Request Returned Booking
                            </h1>
                        </div>
                        <div className="flex-1" />
                        <div className="flex flex-row pr-5 mb-4">
                            <h1 className="font-bold text-gray-900 lg:text-2xl sm:text-xl dark:text-white">
                                Type:
                            </h1>
                            <div className="flex items-center ml-4 rounded-lg bg-primary-300">
                                <h1 className="px-5 text-sm font-bold text-gray-900 dark:text-white">
                                    EQUIPMENT
                                </h1>
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-row justify-center pt-4'>
                        <div className='mb-4'>
                            <h1 className="pt-3 pr-4 text-lg font-bold text-gray-900 dark:text-white">
                                Equipment
                            </h1>
                        </div>
                        <span className='self-center w-screen border-t border-black border-1' />
                    </div>

                    <div className='flex flex-row'>
                        <div className='flex flex-col w-[500px]'>
                            <div className='w-auto'>
                                <h1 className='text-sm text-gray-900 dark:text-white'>Scan Equipment</h1>
                            </div>
                            {
                                isShowScanner == false && (
                                    <button type="button" onClick={() => {
                                        setShowScanner(true)
                                    }} className='justify-center mt-4 primary-action-button w-60'>
                                        <IoScanSharp />
                                    </button>
                                )
                            }
                            {
                                isShowScanner == true &&
                                <>
                                    <div className='justify-center mt-4'>
                                        <QrReader
                                            className='h-auto w-60'
                                            onResult={(result, error) => {
                                                if (!!result) {
                                                    let data = defaultEquipment({ ...result.text })
                                                    data = result.text
                                                    setDataEquipment(data)
                                                }
                                            }}
                                            style={{ width: '100%' }}
                                        />
                                    </div>
                                    <div className='w-60'>
                                        <button type='button' onClick={() => {
                                            setShowScanner(false)
                                        }} className='justify-center text-xs primary-action-button w-60'>
                                            Close Scanner
                                        </button>
                                    </div>
                                </>
                            }
                            {
                                isShowScanner == false && (
                                    <>
                                        <div className='w-60'>
                                            <h1 className='pt-3 text-sm text-gray-900 dark:text-white'>Select Equipment</h1>
                                        </div>
                                        <div className='mt-2 w-60'>
                                            <Select
                                                styles={customStyles}
                                                menuColor='black'
                                                options={listData}
                                                onChange={(event) => {
                                                    let looping = listData.map((i) => {
                                                        return {
                                                            value: i.value,
                                                        }
                                                    })
                                                    let data = defaultEquipment({ ...looping })
                                                    data = event.value
                                                    setDataEquipment(data)
                                                }}
                                            />
                                        </div>
                                    </>
                                )
                            }
                            <ModalBiasa
                                showModal={modal}
                                titleModal="Notifikasi"
                                descriptionModal="Berhasil mendapatkan data equipment"
                                actionTitle="Oke"
                                action={() => {
                                    setmodal(false)
                                }}
                            />

                            {/* <div className='w-40'>
                                <h1 className='pt-3 text-sm text-gray-900 dark:text-white'>Select Equipment</h1>
                            </div>
                            <div className='mt-2 w-28'>
                                <Select
                                    styles={customStyles}
                                    menuColor='black'
                                    options={listData}
                                    onChange={(event) => {
                                        setDataEquipment(event.value)
                                    }}
                                /> */}

                            {/* <MySelect
                                    id="user_id"
                                    onChange={(e) => {
                                        // console.log("ini jalan", e.target.value)
                                        HttpRequestExternal.getAssetBooking(e.target.value).then((res) => {
                                            let data = res.data.data
                                            setDataScanner(data)
                                            setIsIdUser(data?.id)
                                        }).catch((err) => {
                                            alert("gagal")
                                        })
                                    }}
                                >
                                    <option>Pilih Equipment</option>
                                    {listData.map((item, equipment_id) => {
                                        // // console.log(item)
                                        return (
                                            <option key={equipment_id} value={item.asset_id}>{item.equipments_name}</option>
                                        )
                                    })}
                                </MySelect> */}
                            {/* </div> */}
                        </div>
                        <div className='grid w-screen col-span-2 '>
                            <div className='h-auto border border-black'>
                                <div className="grid grid-cols-2 gap-2 p-4">
                                    <h1 className='text-sm antialiased font-bold'>Asset Name : </h1>
                                    <h1 className='text-sm antialiased font-bold'>Asset id : </h1>
                                    <h1 className='text-sm antialiased'>{dataScanner?.data_asset?.equipments_name ?? "-"}</h1>
                                    <h1 className='text-sm antialiased'>{dataScanner?.id ?? "-"}</h1>
                                    <h1 className='text-sm antialiased font-bold'>Brand : </h1>
                                    <h1 className='text-sm antialiased font-bold'>Model : </h1>
                                    <h1 className='text-sm antialiased'>{dataScanner?.data_asset?.data_brand?.brand_name ?? "-"}</h1>
                                    <h1 className='text-sm antialiased'>{dataScanner?.data_asset?.data_model?.model_name ?? "-"}</h1>
                                    <h1 className='text-sm antialiased font-bold'>Serial Number : </h1>
                                    <h1 className='text-sm antialiased font-bold'>Type : </h1>
                                    <h1 className='text-sm antialiased'>{dataScanner?.data_asset?.serial_number ? dataScanner?.data_asset?.serial_number : "-"}</h1>
                                    <h1 className='text-sm antialiased'>{dataScanner?.data_asset?.data_type?.type_name ?? "-"}</h1>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-row justify-center pt-4'>
                        <div className='mb-4'>
                            <h1 className="pt-3 pr-4 text-lg font-bold text-gray-900 dark:text-white">
                                Borrows
                            </h1>
                        </div>
                        <span className='self-center w-screen border-t border-black border-1' />
                    </div>
                    <div className='flex flex-row pt-4'>
                        <div className='flex flex-col w-[500px]'>
                            <div className='w-auto'>
                                <h1 className='text-sm text-gray-900 dark:text-white'>Borrower {dataScanner?.user_name ? "Name" + " " + dataScanner?.user_name : ""}</h1>
                            </div>
                            {
                                dataEquipment != "" && (
                                    <>
                                        <div className='mt-2 w-60'>
                                            <h1 className='text-sm text-gray-900 dark:text-white'>Select Date</h1>
                                        </div>
                                        <div className='mt-2 w-60'>
                                            {
                                                dataTanggal === true && (
                                                    <Select
                                                        styles={customStyles}
                                                        menuColor='black'
                                                        defaultValue={[{ value: "", label: "Pilih Tanggal" }]}
                                                        options={dataDetail}
                                                        onChange={(event) => {
                                                            // if (dataTanggal === true) {
                                                            handleDetail(event.value)
                                                            // }
                                                        }}
                                                    />
                                                )
                                            }
                                            {
                                                dataTanggal === false && (
                                                    <Select
                                                        styles={customStyles}
                                                        menuColor='black'
                                                        defaultValue={[{ value: "", label: "Pilih Tanggal" }]}
                                                    />
                                                )
                                            }
                                        </div>
                                    </>
                                )
                            }
                        </div>

                        <div className='grid w-screen col-span-2'>
                            <div className='h-auto p-4 border border-black'>
                                <div className='grid grid-cols-4 gap-2'>
                                    <h1 className='text-sm antialiased font-bold'>Borrower Name : </h1>
                                    <h1 className='text-sm antialiased font-bold'>Date Start Borrow :</h1>
                                    <h1 className='text-sm antialiased font-bold'>Room :</h1>
                                    <h1 className='text-sm antialiased font-bold'>Floor :</h1>

                                    <h1 className='text-sm antialiased'>{dataScanner?.user_name}</h1>
                                    <h1 className='text-sm antialiased'>{dataScanner?.start_date ? moment(dataScanner?.start_date).format("dddd, DD-MM-YYYY") : ""}</h1>
                                    <h1 className='text-sm antialiased'>{dataScanner?.data_room?.room_name}</h1>
                                    <h1 className='text-sm antialiased'>{dataScanner?.data_floor?.name}</h1>
                                </div>
                                <div className='grid grid-cols-4 gap-2 py-3'>
                                    <h1 className='text-sm antialiased font-bold'>Date End :</h1>
                                    <h1 className='text-sm antialiased font-bold'>Department :</h1>
                                    <h1 className='text-sm antialiased font-bold'>Building :</h1>

                                    <h1 className='text-sm antialiased'>{dataScanner?.end_date ? moment(dataScanner?.end_date).format("dddd, DD-MM-YYYY") : ""}</h1>
                                    <h1 className='text-sm antialiased'>{dataScanner?.data_department?.dep_name}</h1>
                                    <h1 className='text-sm antialiased'>{dataScanner?.data_building?.name}</h1>
                                </div>
                                <div>
                                    <h1 className='text-sm antialiased font-bold'>Quantity (opsional) :</h1>
                                    <h1 className='text-sm antialiased'>{dataScanner?.quantity} unit</h1>
                                </div>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className='py-3'>
                            <h3 className='py-3'>Actual Return Date</h3>
                            <div className='flex flex-row '>
                                <div className='w-40'>
                                    <Input
                                        id="request_return_date"
                                        type="date"
                                        defaultValue={moment().format("YYYY-MM-DD")}
                                        errorMessage={errors?.request_return_date?.message}
                                        {...register('request_return_date', { required: 'Required' })}
                                    />
                                </div>
                                <div className='justify-center w-32 ml-8'>
                                    <Input
                                        id="request_return_time"
                                        placeholder="wib"
                                        type="time"
                                        defaultValue={moment().format("hh:mm")}
                                        errorMessage={errors?.request_return_time?.message}
                                        {...register('request_return_time', { required: 'Required' })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-row'>
                            <span className='flex-1' />
                            <Button
                                type="submit"
                            >
                                Request return approval
                            </Button>
                        </div>
                    </form>
                </div>
            </div >
        </>
    )
}