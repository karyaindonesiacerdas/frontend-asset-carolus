import MySelect from "../../components/MySelect"
import Button from '../../components/Button';
import { useRouter } from "next/router";
import { useCallback, useState, useEffect, useMemo } from "react";
import { HttpRequest, HttpRequestExternal } from '../../utils/http';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form'
import format from 'date-fns/format'
import Link from "next/link";
import toast, { Toaster } from 'react-hot-toast';
import { RadioButton } from "../../components/RadioButton"
import { Checkbox } from "../../components/Checkbox";
import moment from "moment";
import { store } from "../../store";

const notify = (a) => toast.success('Successfully! ' + a)
const notifyGagal = (a) => toast.error('Failed! ' + a)

const approve = [
    {
        name: 'yes',
        value: 1,
        current: false
    },
    {
        name: 'no',
        value: 0,
        current: false
    }
]

export default function App(props) {
    const router = useRouter()

    const [isLoading, setIsloading] = useState(false)
    const [getDetail, setGetDetail] = useState([])
    const [getImage, setImage] = useState("")
    const [radio, setRadio] = useState(null)
    const [hasAccessManager, setHasAccessManager] = useState(true)
    const [canEdit, setCanEdit] = useState(false)


    const getData = useCallback(() => {
        setIsloading(true)
        HttpRequestExternal.getDetailBooking(router.query.id).then((res) => {
            // console.log("data detail bookingg", res.data.data)
            setIsloading(false)
            setGetDetail(res.data.data)

            let data = res.data.data

            // logic process approve request data : 0019
            let rejected = 3
            let approved = 2
            let request = 1
            if (data?.status_booking == rejected) {
                approve[0].current = false
                approve[1].current = true
            }
            if (data?.status_booking == approved) {
                approve[0].current = true
                approve[1].current = false
            }
            if (data?.status_booking == request) {
                approve[0].current = false
                approve[1].current = false
            }
            // End of 0019

            if (data?.status_booking == request) {
                setCanEdit(true)
            }

            let user = store.getState().user
            if (user?.employee?.role?.alias == "asset-pic") {
                setCanEdit(false)
            }

            // TODO : Physical Check, Physical condition Initial Value
            setValue("physical_check_bfr_booking", data?.physical_check_bfr_booking)
            setValue("condition_bfr_booking", data?.condition_bfr_booking)

            let image_url = res.data.data.data_asset?.data_image
            if (image_url != null) {
                image_url.map((item) => {
                    setImage(item.image_url)
                })
            }
        }).catch((err) => {
            setIsloading(false)
            // console.log("err detail booking", err, err.response)
        })
    })

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting },
        setValue,
        getValues
    } = useForm()

    const onSubmit = value => {
        const data = {
            ...value,
            approve: radio
        }

        // console.log(data)

        if (data.physical_check_bfr_booking == null) {
            toast.error("Physical Check Harus Di Pilih")
            return false
        }
        if (data.condition_bfr_booking == null) {
            toast.error("Physical condition Harus Di Pilih")
            return false
        }
        if (data.approve == null) {
            toast.error("Approve Request Harus Di Pilih")
            return false
        }

        HttpRequestExternal.approveBooking(router.query.id, data).then((res) => {
            notify(res.data.message)
            setTimeout(() => {
                router.back()
            }, 1000);
        }).catch((err) => {
            notifyGagal("Submit Data")
            // console.log("err", err, err.response)
        })
    }

    useEffect(() => {
        getData()
    }, []);

    return (
        <>
            <div className="px-3 sm:px-6">
                <Link
                    href={`/mutation`}
                >
                    <a className='inline-block mb-4 font-semibold text-primary-600 hover:underline'>Back to Booking List</a>
                </Link>
                <div className="px-6 my-3 bg-white rounded-md sm:px-6">
                    <h2 className="py-6 text-2xl font-bold">Request Borrow</h2>
                    <h2 className="py-4 text-2xl font-bold">Equipment</h2>
                    <div className="grid grid-cols-2">
                        <div className="grid-cols-1 gird">
                            <div>
                                <h1 className="py-2 text-sm antialiased font-bold">Asset Name : </h1>
                            </div>
                            <div>
                                <h1 className="text-sm antialiased ">{getDetail?.data_asset?.equipments_name ?? "-"}</h1>
                            </div>
                            <div>
                                <h1 className="py-2 text-sm antialiased font-bold">Brand : </h1>
                            </div>
                            <div>
                                <h1 className="text-sm antialiased">{getDetail?.data_asset?.data_brand?.brand_name ?? "-"}</h1>
                            </div>
                            <div>
                                <h1 className="py-2 text-sm antialiased font-bold">Serial Number : </h1>
                            </div>
                            <div>
                                <h1 className="text-sm antialiased">{getDetail?.data_asset?.serial_number ?? "-"}</h1>
                            </div>
                            <div>
                                <h1 className="py-2 text-sm antialiased font-bold">Model : </h1>
                            </div>
                            <div>
                                <h1 className="text-sm antialiased">{getDetail?.data_asset?.data_model?.model_name ?? "-"}</h1>
                            </div>
                            <div>
                                <h1 className="py-2 text-sm antialiased font-bold">Type :</h1>
                            </div>
                            <div>
                                <h1 className="text-sm antialiased">{getDetail?.data_asset?.data_type?.type_name ?? "-"}</h1>
                            </div>
                        </div>

                        <div>
                            <img
                                src={getImage}
                                className="w-auto h-auto"
                            />
                        </div>
                    </div>
                    <h3 className="py-4 text-2xl font-bold">Borrower</h3>
                    <div className="grid w-screen grid-cols-2 gap-x-2">
                        <div>
                            <h1 className="py-2 text-sm antialiased font-bold">Borrower Name : </h1>
                        </div>
                        <div>
                            <h1 className="py-2 text-sm antialiased font-bold">Quantity : </h1>
                        </div>
                        <div>
                            <h1 className="text-sm antialiased">{getDetail?.user_name ?? " - "}</h1>
                        </div>
                        <div>
                            <h1 className="text-sm antialiased">{getDetail?.quantity ?? " - "}</h1>
                        </div>

                        <div>
                            <h1 className="py-2 text-sm antialiased font-bold">Room : </h1>
                        </div>
                        <div>
                            <h1 className="text-sm antialiased">{getDetail?.data_room?.room_name ?? " - "}</h1>
                        </div>

                        <div>
                            <h1 className="py-2 text-sm antialiased font-bold">Date : </h1>
                        </div>
                        <div>
                            <h1 className="py-2 text-sm antialiased font-bold">Floor : </h1>
                        </div>
                        <div>
                            <h1 className="text-sm antialiased">{getDetail?.start_date_format ?? " - "} - {getDetail?.end_date_format ?? " - "}</h1>
                        </div>
                        <div>
                            <h1 className="text-sm antialiased">{getDetail?.data_floor?.name ?? " - "}</h1>
                        </div>

                        <div>
                            <h1 className="py-2 text-sm antialiased font-bold">Department :</h1>
                        </div>
                        <div>
                            <h1 className="py-2 text-sm antialiased font-bold">Building : </h1>
                        </div>
                        <div>
                            <h1 className="text-sm antialiased">{getDetail?.data_department?.dep_name ?? " - "}</h1>
                        </div>
                        <div>
                            <h1 className="text-sm antialiased">{getDetail?.data_building?.name ?? " - "}</h1>
                        </div>

                    </div>



                    <form onSubmit={handleSubmit(onSubmit)}>
                        <h3 className="py-4 text-2xl font-bold">Equipment Check</h3>
                        <div className="grid grid-cols-2">
                            <div className="grid grid-cols-2">
                                <h1 className="py-2 text-sm antialiased font-bold" >Physical Check : </h1>
                                <div>
                                    <MySelect
                                        disabled={canEdit == false}
                                        value={getValues("physical_check_bfr_booking")}
                                        id="physical_check_bfr_booking"
                                        {...register('physical_check_bfr_booking')}
                                    >
                                        <option value={1}>Yes</option>
                                        <option value={0}>No</option>
                                    </MySelect>
                                </div>
                                <h1 className="py-2 text-sm antialiased font-bold">Physical condition : </h1>
                                <div>
                                    <MySelect
                                        disabled={canEdit == false}
                                        id="condition_bfr_booking"
                                        value={getValues("condition_bfr_booking")}
                                        {...register('condition_bfr_booking')}
                                    >
                                        <option value={1}>Good</option>
                                        <option value={2}>Bad</option>
                                    </MySelect>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-row py-6">
                            <div className="grid grid-cols-2 gap-20">
                                <h3 className="mr-6">Approve Request :</h3>
                                <div>
                                    {
                                        approve.map((item, i) => {
                                            return (
                                                <div className="flex flex-row items-center py-1">
                                                    <RadioButton
                                                        disabled={!canEdit}
                                                        onPress={() => {
                                                            setRadio(item.value)
                                                            if (approve[i].current === false) {
                                                                if (i === 0) {
                                                                    approve[0].current = true
                                                                    if (approve[0].current == true) {
                                                                        approve[1].current = false
                                                                    }
                                                                    // notify("Approve")
                                                                }
                                                                if (i === 1) {
                                                                    approve[1].current = true
                                                                    if (approve[1].current == true) {
                                                                        approve[0].current = false
                                                                    }
                                                                    // notify("Reject")
                                                                }
                                                            }
                                                        }} value={item.current} />
                                                    <label className="ml-4">{item.name}</label>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>

                        {
                            canEdit && (
                                getDetail?.status_booking != 3 && getDetail?.status_booking != 2 && (
                                    <div className='flex flex-row py-4 mr-4'>
                                        <span className='flex flex-1' />
                                        <Button
                                            type="submit"
                                        >
                                            Submit
                                        </Button>
                                    </div>
                                )
                            )
                        }
                    </form>
                </div>
            </div >
        </>
    )
}