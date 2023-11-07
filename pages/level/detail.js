import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/outline'
import { useForm } from 'react-hook-form';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { HttpRequestExternal } from '../../utils/http';
import { useRouter } from 'next/router'
import { useEffect, useState, useCallback } from 'react';
import MySelect from '../../components/MySelect';
import TextArea from '../../components/TextArea'
import toast, { Toaster } from 'react-hot-toast';

import Select from 'react-select'
import Photo from '../../utils/Photo';

const notify = (a) => toast.success('Successfully! ' + a)
const notifyGagal = (a) => toast.error('Failed! ' + a)

export default function App(props) {

    const [dataDetail, setDetail] = useState([])
    const [dataBuilding, setDataBuilding] = useState([])
    const [dataInstitution, setDataInstitution] = useState([])
    const [defInstitution, setDefInstitution] = useState([])
    const [defBuilding, setDefBuilding] = useState("")
    const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm();
    const router = useRouter();
    const [photo, setPhoto] = useState('')
    const [valBuilding, setValBuilding] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const onSubmit = (value) => {
        // // console.log(value)
        let param = {
            ...value,
            image: photo ? photo : ""
        }

        HttpRequestExternal.updateLevel(router.query.id, param).then((res) => {
            // // console.log("res", res)
            notify(res.data.message)

            setTimeout(() => {
                router.back()
            }, 1000);
        }).catch((err) => {
            notifyGagal(err.response.data.message)
        })
    }

    const getDetail = useCallback(() => {
        setIsLoading(true)
        HttpRequestExternal.getDetailLevel(router.query.id).then((res) => {
            let data = res.data.data
            setDetail(data)
            setPhoto(data.image)
            setValue("level_name", data.level_name)
            setValue("building_id", data.building_id)
            setValue("institution_id", data.institution_id)
            setValue("safety_feature", data.safety_feature)
            setValue("security_feature", data.security_feature)
            setValue("number_rooms", data.number_rooms)
            setValue("material_floor", data.material_floor)
            setValue("current_productivity", data.current_productivity)
            setValue("current_safety", data.current_safety)
            setValue("current_security", data.current_security)
            setIsLoading(false)
        }).catch((err) => {
            setIsLoading(false)
            notifyGagal(err.message)
        })
    }, [dataDetail])

    const getBuilding = useCallback(() => {
        HttpRequestExternal.getBuilding().then((res) => {
            let data = res.data.data
            setDataBuilding(data)
        }).catch((err) => {
            notifyGagal("Building" + err.message)
        })
    }, [dataBuilding])


    const getInstitation = useCallback(() => {
        HttpRequestExternal.getInstitation().then((res) => {
            let data = res.data.data
            setDataInstitution(data)
        }).catch((err) => {
            notifyGagal("Insttitation" + err.response.data.message)
        })
    }, [dataInstitution])

    const onPhotoUpload = useCallback((e) => {
        HttpRequestExternal.uploadImage(e.target.files[0]).then((res) => {
            // // console.log("upload file ", res)
            toast.success("Upload File berhasil, klik tombol simpan untuk menyimpan data")
            setPhoto(res.data.data)
        }).catch((err) => {
            // // console.log("upload image err", err, err.response)
            notifyGagal(err.message)
        })
    }, [photo])

    useEffect(() => {
        getBuilding()
        getInstitation()
        getDetail()
    }, [])

    const parseToNumber = (value) => {
        let ch = value?.replace(/[^0-9]+/g, '')
        if (!ch) {
            toast.error("Please enter only number")
        } else {
            return ch
        }
    }

    return (
        <div className="flex flex-col px-4 mb-6 sm:px-6 md:px-8 ">
            <Link
                href={`/level`}
            >
                <a className='inline-block mb-4 font-semibold text-primary-600 hover:underline'>Back to Floor List</a>
            </Link>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Asset Floor
            </h1>

            <div className='p-3 my-3 bg-white'>

                <div className='flex flex-row'>
                    <div className='flex-1 p-3'>
                        <form className="mt-8 space-y-6 accent-primary" onSubmit={handleSubmit(onSubmit)}>
                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>Level Name</label>
                                    <div className="mt-1">
                                        <Input
                                            errorMessage={errors?.level_name?.message}
                                            {...register('level_name', { required: 'required field' })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>Number Room</label>
                                    <div className="mt-1">
                                        <Input
                                            errorMessage={errors?.number_rooms?.message}
                                            {...register('number_rooms', {
                                                required: 'required field',
                                                onChange: (e) => {
                                                    setValue('number_rooms', parseToNumber(e.target?.value))
                                                }
                                            })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>Current Safety</label>
                                    <div className="mt-1">
                                        <Input
                                            errorMessage={errors?.current_safety?.message}
                                            {...register('current_safety', {
                                                required: 'required field',
                                                onChange: (e) => {
                                                    setValue('current_safety', parseToNumber(e.target?.value))
                                                }
                                            })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>Current Security</label>
                                    <div className="mt-1">
                                        <Input
                                            errorMessage={errors?.current_security?.message}
                                            {...register('current_security', {
                                                required: 'required field',
                                                onChange: (e) => {
                                                    setValue('current_security', parseToNumber(e.target?.value))
                                                }
                                            })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>Current Productivity</label>
                                    <div className="mt-1">
                                        <Input
                                            errorMessage={errors?.current_productivity?.message}
                                            {...register('current_productivity', {
                                                required: 'required field',
                                                onChange: (e) => {
                                                    setValue('current_productivity', parseToNumber(e.target?.value))
                                                }
                                            })}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col mr-3">
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>Image</label>
                                    <Input
                                        id="image"
                                        type="file"
                                        accept="image/png, image/jpeg, image/jpg"
                                        onChange={onPhotoUpload}
                                    />
                                    {photo != "" && photo != null && (
                                        <img src={Photo.get(photo)} style={{ width: 150, height: 150, objectFit: 'contain' }} />
                                    )}
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>Safety Feature</label>
                                    <div className="mt-1">
                                        <Input
                                            errorMessage={errors?.safety_feature?.message}
                                            {...register('safety_feature', { required: 'required field' })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>Security Feature</label>
                                    <div className="mt-1">
                                        <Input
                                            errorMessage={errors?.security_feature?.message}
                                            {...register('security_feature', { required: 'required field' })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>Material Floor</label>
                                    <div className="mt-1">
                                        <Input
                                            errorMessage={errors?.material_floor?.message}
                                            {...register('material_floor', { required: 'required field' })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>Building Id</label>
                                    <div className="mt-1">
                                        <MySelect
                                            id="building_id"
                                            errorMessage={errors?.building_id?.message}
                                            {...register('building_id', { required: 'building_id is required' })}
                                        >
                                            {dataBuilding.map((item, building) => {
                                                return (
                                                    <option key={building} value={item.id}>{item.name}</option>
                                                )
                                            })}
                                        </MySelect>
                                    </div>
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>Institution Id</label>
                                    <div className="mt-1">
                                        <MySelect
                                            id="institution_id"
                                            errorMessage={errors?.institution_id?.message}
                                            {...register('institution_id', { required: 'institution_id is required' })}
                                        >
                                            {dataInstitution.map((item, institution) => {
                                                return (
                                                    <option key={institution} value={item.id}>{item.name}</option>
                                                )
                                            })}
                                        </MySelect>
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                isLoading={isSubmitting}
                                shadow="small"
                                size="large"
                                rounded="full"
                                className="float-right w-1/4 text-right"
                            >
                                Simpan
                            </Button>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    )
}