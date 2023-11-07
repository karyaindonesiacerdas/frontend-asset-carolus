import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/outline'
import { useForm } from 'react-hook-form';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { HttpRequestExternal } from '../../utils/http';
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react';
import MySelect from '../../components/MySelect';
import Script from 'next/script';

import toast, { Toaster } from 'react-hot-toast';
import Photo from '../../utils/Photo';
import Select from 'react-select'

const notifyDel = () => toast.success('Successfully Delete!')
const notifyDelDel = () => toast.error('Failed Delete!')

const notify = (a) => toast.success('Successfully! ' + a)
const notifyGagal = (a) => toast.error('Failed! ' + a)

export default function App(props) {

    const [dataBuilding, setDataBuilding] = useState([])
    const [dataInstitution, setDataInstitution] = useState([])
    const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm();
    const [photo, setPhoto] = useState('')
    const router = useRouter();

    const onSubmit = (value) => {
        // // console.log(value)
        let param = {
            ...value,
            image: photo ? photo : ""
        }

        HttpRequestExternal.saveLevel(param).then((res) => {
            notify(res.data.message)

            setTimeout(() => {
                router.back()
            }, 1000);
        }).catch((err) => {
            notifyGagal(err.response.data.message)
        })
    }

    const getBuilding = useCallback(() => {
        HttpRequestExternal.getBuilding().then((res) => {
            let data = res.data.data
            setDataBuilding(data)
        }).catch((err) => {
            notifyGagal(err.message)
        })
    }, [dataBuilding])


    const getInstitation = useCallback(() => {
        HttpRequestExternal.getInstitation().then((res) => {
            let data = res.data.data
            setDataInstitution(data)
        }).catch((err) => {
            notifyGagal(err.message)
        })
    }, [dataInstitution])


    const onPhotoUpload = useCallback((e) => {
        HttpRequestExternal.uploadImage(e.target.files[0]).then((res) => {
            // // console.log("upload file ", res)
            toast.success("Upload File berhasil, klik tombol simpan untuk menyimpan data")
            setPhoto(res.data.data)
        }).catch((err) => {
            notifyGagal(err.message)
        })
    }, [photo])

    useEffect(() => {
        getBuilding()
        getInstitation()
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
        <div className="px-4 sm:px-6 md:px-8 mb-6 flex flex-col ">
            <Link
                href={`/level`}
            >
                <a className='text-primary-600 font-semibold hover:underline mb-4 inline-block'>Back to Level List</a>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Asset Level | Create
            </h1>

            <div className='p-3 bg-white my-3'>

                <div className='flex flex-row'>
                    <div className='flex-1 p-3'>
                        <form className="mt-8 space-y-6 accent-primary" onSubmit={handleSubmit(onSubmit)}>

                            <div className="grid sm:grid-cols-2 gap-5">
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
                                            errorMessage={errors?.building_id?.message}
                                            {...register('building_id', { required: 'building_id is required' })}
                                        >
                                            {dataBuilding.map((item, index) => {
                                                return (
                                                    <option key={index} value={item.id}>{item.name}</option>
                                                )
                                            })}
                                        </MySelect>
                                    </div>
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>Institution Id</label>
                                    <div className="mt-1">
                                        <MySelect
                                            errorMessage={errors?.institution_id?.message}
                                            {...register('institution_id', { required: 'institution_id is required' })}
                                        >
                                            {dataInstitution.map((item, index) => {
                                                return (
                                                    <option key={index} value={item.id}>{item.name}</option>
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
                                className="w-1/4 float-right text-right"
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