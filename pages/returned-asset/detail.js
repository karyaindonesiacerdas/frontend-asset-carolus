import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link'
import { FaCampground } from 'react-icons/fa';
import { IconName, IoCloudUploadOutline, IoScanSharp, IoImageOutline } from "react-icons/io5";
import Input from '../../components/Input';
import format from 'date-fns/format'
import { useForm } from 'react-hook-form';
import MySelect from '../../components/MySelect';
import { HttpRequestExternal } from '../../utils/http';
import Button from '../../components/Button';
import { QrReader } from 'react-qr-reader';
import { Checkbox } from '../../components/Checkbox';
import { useRouter } from 'next/router';
import moment from 'moment';

import toast, { Toaster } from 'react-hot-toast';
import Photo from '../../utils/Photo';

const notifyDel = () => toast.success('Successfully Delete!')
const notifyDelDel = () => toast.error('Failed Delete!')

const notify = (a) => toast.success('Successfully! ' + a)
const notifyGagal = (a) => toast.error('Failed! ' + a)

const data = [
    {
        name: "Plug-in component: relays, connectors and printed boards",
    },
    {
        name: "Plug-in component: relays, connectors and printed boards",
    },
    {
        name: "Plug-in component: relays, connectors and printed boards",
        need_repair: true
    },
]

let arr = [
    5, 6
]
let bisa = [
    1, 2, 3, 4
]

export default function App(props) {
    const router = useRouter()
    const [dataScanner, setDataScanner] = useState([]);
    const [isShowScanner, setShowScanner] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [dataValue, setDataValue] = useState(data);
    const [dataDetail, setDataDetail] = useState([]);
    const [dataCheck, setDataCheck] = useState([]);
    const [dataVisual, setDataVisual] = useState([])
    const [dataPicId, setDataPicId] = useState([])
    const [detailPic, setDetailPic] = useState([])
    const [photo, setPhoto] = useState('')

    const [visualCheck, setvisualCheck] = useState([])
    const [errorVisualCheck, setErrorVisualCheck] = useState([])

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting },
        setValue,
    } = useForm()

    const onSubmit = value => {
        // console.log("value", value)
        if (value.pic_id == null) {
            toast.error("Mohon pilih PIC Terlebih dahulu")
            return false
        }

        let visual_check = []
        dataCheck.map((item, index) => {
            item.data_point.map((i) => {
                let pass = i?.pass == true && i?.pass != undefined ? 1 : 0
                let failed = i?.failed == true && i?.failed != undefined ? 1 : 0
                let n_a = i?.n_a == true && i?.n_a != undefined ? 1 : 0
                let need_repair = i?.need_repair == true && i?.need_repair != undefined ? 1 : 0
                let image_url = i?.image_url
                return (
                    visual_check.push(
                        {
                            id: i?.id,
                            pass: pass,
                            failed: failed,
                            n_a: n_a,
                            need_repair: need_repair,
                            image_url: image_url,
                            name: i.name
                        }
                    )
                )
            })

        })

        const data = {
            ...value,
            visual_check: visual_check
        }

        let errors = []
        visual_check.forEach((i) => {
            let test = checkItemData(i)
            if (test == false) {
                errors.push(i.name + " belum di isi")
            }
        })

        if (dataDetail?.physical_check_bfr_booking == 1) {
            setErrorVisualCheck(errors)
            if (errors.length > 0) {
                return false
            }
        }

        // // console.log("daya", JSON.stringify(data))
        HttpRequestExternal.checkingReturnAsset(router.query.id, data).then((response) => {
            notify(response.data.message)

            setTimeout(() => {
                router.back()
            }, 1000);
            // console.log('sukses', response.data)
        }).catch((err) => {
            notifyGagal(err.response.data.message)
            // console.log("err", err, err.response);
        })
    }

    const checkItemData = useCallback((item) => {
        return item.pass == 1 || item.failed == 1 || item.n_a == 1 || item.need_repair == 1
    })

    useEffect(() => {
        getDetail()
        getChecking()
        getAssetPic()
    }, []);

    const getDetail = useCallback(() => {
        HttpRequestExternal.getReturnAssetDetail(router.query.id).then((response) => {
            //// console.log("Response", response);
            setDataDetail(response.data.data)
            setValue('pic_name', response.data.data?.pic_name)
            setValue("pic_id", response.data.data?.pic_id)
            setValue("check_return_date", moment(response.data.data?.start_date).format("YYYY-MM-DD"))
            setvisualCheck(response.data.data?.data_visual_check)
            // console.log("detai;", response.data.data)
        }).catch((error) => {
            // console.log(error, error.response);
            notifyGagal("Gagal memuat")
        });
    }, [])

    const getChecking = useCallback(() => {
        HttpRequestExternal.getCheckingPoint().then((response) => {
            setDataCheck(response.data.data)
            // console.log("data list checking", response)
        }).catch((error) => {
            // console.log(error, error.response);
            notifyGagal("Gagal memuat")
        });
    }, [])

    const getAssetPic = useCallback(() => {
        HttpRequestExternal.getPICID().then((res) => {
            setDataPicId(res.data.data)
        }).catch((err) => {
            notifyGagal("Load PIC ID")
            // console.log("err asset Manager", err)
        })
    }, [dataPicId])

    const onPhotoUpload = useCallback((e, item, dataCheck, check, indexIsi) => {
        HttpRequestExternal.uploadImage(e.target.files[0]).then((res) => {
            // console.log("upload file ", res)
            let obj = { ...item }
            let listData = [...dataCheck]
            obj.image_url = Photo.get(res.data.data)
            listData[check].data_point[indexIsi] = obj
            setDataCheck(listData)
            notify("upload file")
            setPhoto(res.data.data)
        }).catch((err) => {
            // console.log("upload image err", err, err.response)
            notifyGagal(err.response?.data?.message ?? "Upload file gagal, Pastikan hanya file gambar yang di upload")
        })
    }, [])

    const canEdit = useMemo(() => {
        let statusCanEdit = 4 // Request Return

        let result = true
        if (dataDetail?.status_booking != statusCanEdit) {
            result = false
        }
        return result
    }, [dataDetail])

    const resetValue = useCallback((item) => {
        item.pass = 0
        item.failed = 0
        item.n_a = 0
        item.need_repair = 0
        return item
    })

    return (
        <>
            <div className="px-3 sm:px-6">
                <Link
                    href={`/returned-asset`}
                >
                    <a className='inline-block mb-4 font-semibold text-primary-600 hover:underline'>Back to Returned Asset</a>
                </Link>
                <div className='p-6 my-4 bg-white rounded-md'>
                    <div className="flex flex-row pt-4">
                        <div className="mb-4">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Returned Asset
                            </h1>
                        </div>
                        <div className="flex-1" />
                        <div className="flex flex-row pr-5 mb-4">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Type:
                            </h1>
                            <div className="flex items-center ml-4 rounded-lg bg-primary-300">
                                <h1 className="px-5 text-sm font-bold text-gray-900 dark:text-white">
                                    Equipment
                                </h1>
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-row justify-center pt-4'>
                        <div className='w-56 mb-4'>
                            <h1 className="pt-3 pr-4 text-lg font-bold text-gray-900 dark:text-white">
                                Equipment
                            </h1>
                        </div>
                        <span className='self-center w-screen border-t border-black border-1' />
                    </div>

                    <div className='flex flex-row'>
                        <div className='flex flex-col'>
                            <div className='w-40'>

                            </div>
                        </div>
                        <div className='grid w-screen col-span-2 '>
                            <div className='h-auto border border-black'>
                                <div className="grid grid-cols-2 gap-2 p-4">
                                    <h1 className='text-sm antialiased font-bold'>Asset Name : </h1>
                                    <h1 className='text-sm antialiased font-bold'>Asset id : </h1>
                                    <h1 className='text-sm antialiased'>{dataDetail?.data_asset?.equipments_name ?? "-"}</h1>
                                    <h1 className='text-sm antialiased'>{dataDetail?.id ?? "-"}</h1>
                                    <h1 className='text-sm antialiased font-bold'>Brand : </h1>
                                    <h1 className='text-sm antialiased font-bold'>Model : </h1>
                                    <h1 className='text-sm antialiased'>{dataDetail?.data_asset?.data_brand?.brand_name ?? "-"}</h1>
                                    <h1 className='text-sm antialiased'>{dataDetail?.data_asset?.data_model?.model_name ?? "-"}</h1>
                                    <h1 className='text-sm antialiased font-bold'>Serial Number : </h1>
                                    <h1 className='text-sm antialiased font-bold'>Type : </h1>
                                    <h1 className='text-sm antialiased'>{dataDetail?.data_asset?.serial_number ?? "-"}</h1>
                                    <h1 className='text-sm antialiased'>{dataDetail?.data_asset?.data_type?.type_name ?? "-"}</h1>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-row justify-center pt-4'>
                        <div className='w-56 mb-4'>
                            <h1 className="pt-3 pr-4 text-lg font-bold text-gray-900 dark:text-white">
                                Borrowing Info
                            </h1>
                        </div>
                        <span className='self-center w-screen border-t border-black border-1' />
                    </div>

                    <div className='flex flex-row pt-4'>
                        <div className='flex flex-col'>
                            <div className='w-40'>
                                {/* <h1 className='text-sm text-gray-900 dark:text-white'>Borrower</h1> */}
                            </div>
                        </div>
                        <div className='grid w-screen col-span-2'>
                            <div className='h-auto p-4 border border-black'>
                                <div className='grid grid-cols-4 gap-2'>
                                    <h1 className='text-sm antialiased font-bold'>Borrower Name : </h1>
                                    <h1 className='text-sm antialiased font-bold'>Date Start Borrow :</h1>
                                    <h1 className='text-sm antialiased font-bold'>Room :</h1>
                                    <h1 className='text-sm antialiased font-bold'>Floor :</h1>

                                    <h1 className='text-sm antialiased'>{dataDetail?.user_name}</h1>
                                    <h1 className='text-sm antialiased'>{moment(dataDetail?.start_date).format("dddd, DD-MM-YYYY")}</h1>
                                    <h1 className='text-sm antialiased'>{dataDetail?.data_room?.room_name}</h1>
                                    <h1 className='text-sm antialiased'>{dataDetail?.data_floor?.name}</h1>
                                </div>
                                <div className='grid grid-cols-4 gap-2 py-3'>
                                    <h1 className='text-sm antialiased font-bold'>Date End :</h1>
                                    <h1 className='text-sm antialiased font-bold'>Department :</h1>
                                    <h1 className='text-sm antialiased font-bold'>Building :</h1>

                                    <h1 className='text-sm antialiased'>{moment(dataDetail?.end_date).format("dddd, DD-MM-YYYY")}</h1>
                                    <h1 className='text-sm antialiased'>{dataDetail?.data_department?.dep_name}</h1>
                                    <h1 className='text-sm antialiased'>{dataDetail?.data_building?.name}</h1>
                                </div>
                                <div>
                                    <h1 className='text-sm antialiased font-bold'>Quantity (opsional) :</h1>
                                    <h1 className='text-sm antialiased'>{dataDetail?.quantity} unit</h1>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-row justify-center pt-4'>
                        <div className='w-56 mb-4'>
                            <h1 className="pt-3 pr-4 text-lg font-bold text-gray-900 dark:text-white">
                                Equipment Check
                            </h1>
                        </div>
                        <span className='self-center w-screen border-t border-black border-1' />
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className='flex flex-row pt-4'>
                            <div className='flex flex-col'>
                                <div className='flex flex-col'>
                                    {!canEdit && (
                                        <div className='w-40'>
                                        </div>
                                    )}
                                    {canEdit && (
                                        <>
                                            <div className='w-40'>
                                                <h1 className='text-sm text-gray-900 dark:text-white'>Scan ID</h1>
                                            </div>
                                            {
                                                isShowScanner == false && (
                                                    <button type="button" onClick={() => {
                                                        setShowScanner(true)
                                                    }} className='justify-center mt-4 primary-action-button w-28'>
                                                        <IoScanSharp />
                                                    </button>
                                                )
                                            }
                                            {
                                                isShowScanner == true &&
                                                <>
                                                    <div className='justify-center mt-4'>
                                                        <QrReader
                                                            className='h-auto w-28'
                                                            onResult={(result, error) => {
                                                                if (!!result) {
                                                                    HttpRequestExternal.getDetailUser(result?.text).then((res) => {
                                                                        notify("Succes")
                                                                        setDetailPic(res.data.data)
                                                                        setValue('pic_name', res.data.data.name)
                                                                        setValue("pic_id", res.data.data.id)
                                                                    }).catch((err) => {
                                                                        notifyGagal(err.message)
                                                                    })
                                                                }
                                                            }}
                                                            style={{ width: '100%' }}
                                                        />
                                                    </div>
                                                    <button type='button' onClick={() => {
                                                        setShowScanner(false)
                                                    }} className='justify-center w-auto text-xs primary-action-button'>
                                                        Close Scanner
                                                    </button>
                                                </>
                                            }
                                            <div className="flex flex-col">
                                                <label className='text-xs sm:truncate' htmlFor="pic_name">PIC Name: </label>
                                                <MySelect
                                                    id="pic_name"
                                                    required={true}
                                                    onChange={(e) => {
                                                        // console.log(e.target.value)

                                                        if (e.target.value == "-") {
                                                            setDetailPic(null)
                                                            setValue('pic_name', null)
                                                            setValue("pic_id", null)
                                                            return false
                                                        }

                                                        HttpRequestExternal.getDetailUser(e.target.value).then((res) => {
                                                            notify("Succes")
                                                            setDetailPic(res.data.data)
                                                            setValue('pic_name', res.data.data.name)
                                                            setValue("pic_id", res.data.data.id)
                                                        }).catch((err) => {
                                                            notifyGagal(err.message)
                                                        })
                                                    }}
                                                >
                                                    <option value={"-"}>Pilih PIC</option>
                                                    {dataPicId.map((item, model) => {
                                                        return (
                                                            <option key={model} value={item.id}>{item.name}</option>
                                                        )
                                                    })}
                                                </MySelect>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className='grid w-screen col-span-2'>
                                <div className='h-auto p-4 border border-black'>
                                    <div className='grid grid-cols-3 gap-2'>
                                        <h1 className='text-sm antialiased font-bold'>PIC Name : </h1>
                                        <h1 className='text-sm antialiased font-bold'>PIC ID :</h1>
                                        <h1 className='text-sm antialiased font-bold'>Check Equipment Date :</h1>

                                        <h1
                                            className='text-sm antialiased' > {dataDetail?.pic_name ? dataDetail?.pic_name : detailPic?.name} </h1>
                                        <h1
                                            className='text-sm antialiased' > {dataDetail?.pic_id ? dataDetail?.pic_id : detailPic?.id}</h1>
                                        <div className='w-40'>
                                            <Input
                                                id="check_return_date"
                                                type="date"
                                                disabled={canEdit == false}
                                                max={moment().format("YYYY-MM-DD")}
                                                defaultValue={moment().format("YYYY-MM-DD")}
                                                errorMessage={errors?.check_return_date?.message}
                                                {...register('check_return_date', { required: 'Required' })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {dataDetail?.physical_check_bfr_booking == 1 && (
                            <>
                                <table className='my-5' style={{ width: '100%', borderWidth: "2px", borderColor: "#0000" }} border="1px">
                                    <thead>
                                        <tr style={{ borderWidth: "1px", borderColor: "#0000", border: "1px solid black", padding: "10px" }}>
                                            <th className='pb-4 text-left'>Visual Check</th>
                                            <th className='w-20 pb-4 text-center'>Pass</th>
                                            <th className='w-20 pb-4 text-center'>Failed</th>
                                            <th className='w-20 pb-4 text-center'>N/A</th>
                                            <th className='w-20 pb-4 text-center'>Need Repair</th>
                                        </tr>
                                    </thead>

                                    {
                                        dataDetail.status_booking && arr.includes(dataDetail?.status_booking) &&
                                        (
                                            <>
                                                {
                                                    dataDetail?.data_visual_checks?.map((header, check) => {
                                                        return (
                                                            <>
                                                                <tr className='p-5'>
                                                                    <td className='font-bold'>{header.type ?? "-"}</td>
                                                                </tr>
                                                                {
                                                                    header.data_point.filter(item => item.id).map((item, indexIsi) => {
                                                                        return (
                                                                            <>
                                                                                <tr>
                                                                                    <td className='p-2 font-bold'>{item?.name ?? "-"}</td>
                                                                                    <td className='w-20 text-center'>
                                                                                        <Checkbox disabled value={item.data_detail_checking.pass} />
                                                                                    </td>
                                                                                    <td className='w-20 text-center'>
                                                                                        <Checkbox disabled value={item.data_detail_checking.failed} />
                                                                                    </td>
                                                                                    <td className='w-20 text-center'>
                                                                                        <Checkbox disabled value={item.data_detail_checking.n_a} />
                                                                                    </td>
                                                                                    <td className='w-24 text-center'>
                                                                                        <div className='flex flex-row items-center justify-end'>
                                                                                            <Checkbox disabled value={item.data_detail_checking.need_repair} />
                                                                                            {item?.data_detail_checking.image_url && (
                                                                                                <a target={"_blank"} href={item?.data_detail_checking?.image_url}>
                                                                                                    <IoImageOutline size={25} className='ml-1' />
                                                                                                </a>
                                                                                            )}
                                                                                            {!item?.data_detail_checking.image_url && (
                                                                                                <div className='ml-2' >
                                                                                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                            </>
                                                                        )
                                                                    })
                                                                }
                                                            </>
                                                        )
                                                    })
                                                }
                                            </>
                                        )
                                    }

                                    {
                                        dataDetail.status_booking && bisa.includes(dataDetail?.status_booking) && (
                                            <>
                                                {
                                                    dataCheck.map((header, check) => {
                                                        return (
                                                            <>
                                                                <tr className='p-5'>
                                                                    <td className='font-bold'>{header.type ?? "-"}</td>
                                                                </tr>
                                                                {
                                                                    header.data_point.map((item, indexIsi) => {
                                                                        return (
                                                                            <>
                                                                                <tr>
                                                                                    <td className='p-2 font-bold'>{item?.name ?? "-"}</td>
                                                                                    <td className='w-20 text-center'>
                                                                                        <Checkbox onPress={() => {
                                                                                            let obj = resetValue({ ...item })
                                                                                            let listData = [...dataCheck]
                                                                                            obj.pass = true
                                                                                            listData[check].data_point[indexIsi] = obj
                                                                                            setDataCheck(listData)
                                                                                            if (item.pass == true) {
                                                                                                let obj = resetValue({ ...item })
                                                                                                let listData = [...dataCheck]
                                                                                                obj.pass = false
                                                                                                listData[check].data_point[indexIsi] = obj
                                                                                                setDataCheck(listData)
                                                                                            }
                                                                                            if (item.pass == false) {
                                                                                                let obj = resetValue({ ...item })
                                                                                                let listData = [...dataCheck]
                                                                                                obj.pass = true
                                                                                                listData[check].data_point[indexIsi] = obj
                                                                                                setDataCheck(listData)
                                                                                            }
                                                                                        }} value={item.pass} />
                                                                                    </td>
                                                                                    <td className='w-20 text-center'>
                                                                                        <Checkbox onPress={() => {
                                                                                            let obj = resetValue({ ...item })
                                                                                            let listData = [...dataCheck]
                                                                                            obj.failed = true
                                                                                            listData[check].data_point[indexIsi] = obj
                                                                                            setDataCheck(listData)
                                                                                            if (item.failed == true) {
                                                                                                let obj = resetValue({ ...item })
                                                                                                let listData = [...dataCheck]
                                                                                                obj.failed = false
                                                                                                listData[check].data_point[indexIsi] = obj
                                                                                                setDataCheck(listData)
                                                                                            }
                                                                                        }} value={item.failed} />
                                                                                    </td>
                                                                                    <td className='w-20 text-center'>
                                                                                        <Checkbox onPress={() => {
                                                                                            let obj = resetValue({ ...item })
                                                                                            let listData = [...dataCheck]
                                                                                            obj.n_a = true
                                                                                            listData[check].data_point[indexIsi] = obj
                                                                                            setDataCheck(listData)
                                                                                            if (item.n_a == true) {
                                                                                                let obj = resetValue({ ...item })
                                                                                                let listData = [...dataCheck]
                                                                                                obj.n_a = false
                                                                                                listData[check].data_point[indexIsi] = obj
                                                                                                setDataCheck(listData)
                                                                                            }
                                                                                        }} value={item.n_a} />
                                                                                    </td>
                                                                                    <td className='w-24 text-center'>
                                                                                        <div className='flex flex-row items-center justify-end'>
                                                                                            <Checkbox onPress={() => {
                                                                                                let obj = resetValue({ ...item })
                                                                                                let listData = [...dataCheck]
                                                                                                obj.need_repair = true
                                                                                                listData[check].data_point[indexIsi] = obj
                                                                                                setDataCheck(listData)
                                                                                                if (item.need_repair == true) {
                                                                                                    let obj = resetValue({ ...item })
                                                                                                    let listData = [...dataCheck]
                                                                                                    obj.need_repair = false
                                                                                                    listData[check].data_point[indexIsi] = obj
                                                                                                    setDataCheck(listData)

                                                                                                } // console.log("apa si ini", dataCheck)
                                                                                            }} value={item.need_repair} />
                                                                                            <div className='relative flex flex-row items-center justify-center overflow-hidden'>
                                                                                                <IoCloudUploadOutline className='ml-2' />
                                                                                                <input
                                                                                                    type="file"
                                                                                                    accept="image/png, image/jpeg, image/jpg"
                                                                                                    onChange={(e) => {
                                                                                                        onPhotoUpload(e, item, dataCheck, check, indexIsi)
                                                                                                    }}
                                                                                                    className='absolute top-0 right-0 h-full opacity-0 cursor-pointer'
                                                                                                />
                                                                                            </div>
                                                                                            {item?.image_url && (
                                                                                                <a target={"_blank"} href={item?.image_url}>
                                                                                                    <IoImageOutline className='ml-2' />
                                                                                                </a>
                                                                                            )}
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                            </>
                                                                        )
                                                                    })
                                                                }
                                                            </>
                                                        )
                                                    })
                                                }
                                            </>
                                        )}
                                </table>
                            </>
                        )}

                        <div className='p-4 rounded-md opacity-50'>
                            {errorVisualCheck && (
                                errorVisualCheck.map((i) => {
                                    return (
                                        <div className='text-red-600'>{i}</div>
                                    )
                                })
                            )}
                        </div>

                        {
                            dataDetail.status_booking && bisa.includes(dataDetail?.status_booking) && (
                                <>
                                    <div className='flex flex-row items-center my-6'>
                                        <Checkbox onPress={() => {
                                            if (isChecked == false) {
                                                setIsChecked(true)
                                            } else {
                                                setIsChecked(false)
                                            }
                                        }} value={isChecked} />
                                        <h1 className='ml-2'>By filling this form, the person responsible for the equipment condition that being returned.</h1>
                                    </div>
                                    {
                                        isChecked == true && (
                                            <div className='flex flex-row'>
                                                <span className='flex-1' />
                                                <Button
                                                    type="submit"
                                                    isLoading={isSubmitting}
                                                >
                                                    Submit
                                                </Button>
                                            </div>
                                        )
                                    }
                                    {
                                        isChecked == false && (
                                            <div className='flex flex-row'>
                                                <span className='flex-1' />
                                                <Button
                                                    disabled
                                                >
                                                    Submit
                                                </Button>
                                            </div>
                                        )
                                    }
                                </>
                            )
                        }

                    </form>
                </div>
            </div>
        </>
    )
}