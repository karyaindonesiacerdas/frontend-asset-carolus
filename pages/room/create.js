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

const notifyDel = () => toast.success('Successfully Delete!')
const notifyDelDel = () => toast.error('Failed Delete!')

const notify = (a) => toast.success('Successfully! ' + a)
const notifyGagal = (a) => toast.error('Failed! ' + a)

export default function App(props) {

    const [dataBrand, setDataBrand] = useState([])
    const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm();
    const [photo, setPhoto] = useState('')
    const router = useRouter();
    const [dataInstitution, setDataInstitution] = useState([])
    const [dataLevel, setDataLevel] = useState([])

    const onSubmit = (value) => {
        // console.log(value)
        let param = {
            current_productivity: value.current_productivity,
            current_safety: value.current_safety,
            current_security: value.current_security,
            electrical_installation: value.electrical_installation,
            gas_installation: value.gas_installation,
            institution_id: value.institution_id,
            latitute_high: value.latitute_high,
            latitute_low: value.latitute_low,
            level_id: value.level_id,
            longitude_high: value.longitude_high,
            longitude_low: value.longitude_low,
            mechanical_installation: value.mechanical_installation,
            network_installation: value.network_installation,
            number_subroom: value.number_subroom,
            room_capacity: value.room_capacity,
            room_cost: value.room_cost,
            room_facilities: value.room_facilities,
            room_height: value.room_height,
            room_material: value.room_material,
            room_name: value.room_name,
            room_sn: value.room_sn,
            room_width: value.room_width,
            safety_feature: value.safety_feature,
            security_feature: value.security_feature,
            structure_type: value.structure_type,
            water_installation: value.water_installation,
            year_of_build: value.year_of_build,
            image: photo ? photo : ""
        }

        // console.log('ini adalah res create', JSON.stringify(param))
        HttpRequestExternal.saveRoom(param).then((res) => {
            // console.log("res", res)
            notify(res.data.message)

            setTimeout(() => {
                router.back()
            }, 1000);
        }).catch((err) => {
            notifyGagal(err.response.data.message)
            // console.log("err", err)
        })
    }

    const getAssetBrand = useCallback(() => {
        HttpRequestExternal.getAssetBrand().then((res) => {
            // console.log("res", res)
            setDataBrand(res.data.data)
        }).catch((err) => {
            // console.log("err", err)
        })
    }, [dataBrand])

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
            // console.log("upload file ", res)
            toast.success("Upload File berhasil, klik tombol simpan untuk menyimpan data")
            setPhoto(res.data.data)
        }).catch((err) => {
            // console.log("upload image err", err, err.response)
            notifyGagal(err.message)
        })
    }, [photo])

    useEffect(() => {
        getAssetBrand()
        getInstitation()
        getLevel()
    }, [])

    const getLevel = useCallback(() => {
        HttpRequestExternal.getListLevel().then((res) => {
            // console.log("res", res)
            setDataLevel(res.data.data)
        }).catch((err) => {
            notifyGagal(err.message)
        })
    }, [])

    const parseToDesimal = (value) => {
        return parseFloat(value).toFixed(7)
    }

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
                href={`/room`}
            >
                <a className='inline-block mb-4 font-semibold text-primary-600 hover:underline'>Back to Room List</a>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Asset Room | Create
            </h1>

            <div className='p-3 my-3 bg-white'>

                <div className='flex flex-row'>
                    <div className='flex-1 p-3'>
                        <form className="mt-8 space-y-6 accent-primary" onSubmit={handleSubmit(onSubmit)}>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>Room Name</label>
                                    <div className="mt-1">
                                        <Input
                                            errorMessage={errors?.room_name?.message}
                                            {...register('room_name', { required: 'required field' })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>Room SN</label>
                                    <div className="mt-1">
                                        <Input
                                            errorMessage={errors?.room_sn?.message}
                                            {...register('room_sn', { required: 'required field' })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>Latitute Low</label>
                                    <div className="mt-1">
                                        <Input
                                            type="number"
                                            step=".01"
                                            min="0"
                                            errorMessage={errors?.latitute_low?.message}
                                            {...register('latitute_low', {
                                                required: 'required field',
                                                onChange: (e) => {
                                                    setValue('latitute_low', parseToDesimal(e.target?.value))
                                                }
                                            })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>latitute high</label>
                                    <div className="mt-1">
                                        <Input
                                            type="number"
                                            step=".01"
                                            min="0"
                                            errorMessage={errors?.latitute_high?.message}
                                            {...register('latitute_high', {
                                                required: 'required field',
                                                onChange: (e) => {
                                                    setValue('latitute_high', parseToDesimal(e.target?.value))
                                                }
                                            })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>longitude low</label>
                                    <div className="mt-1">
                                        <Input
                                            type="number"
                                            step=".01"
                                            min="0"
                                            errorMessage={errors?.longitude_low?.message}
                                            {...register('longitude_low', {
                                                required: 'required field',
                                                onChange: (e) => {
                                                    setValue('longitude_low', parseToDesimal(e.target?.value))
                                                }
                                            })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>longitude high</label>
                                    <div className="mt-1">
                                        <Input
                                            type="number"
                                            step=".01"
                                            min="0"
                                            errorMessage={errors?.longitude_high?.message}
                                            {...register('longitude_high', {
                                                required: 'required field',
                                                onChange: (e) => {
                                                    setValue('longitude_high', parseToDesimal(e.target?.value))
                                                }
                                            })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>current_safety</label>
                                    <div className="mt-1">
                                        <Input
                                            type="text"
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
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>current security</label>
                                    <div className="mt-1">
                                        <Input
                                            type="text"
                                            onkeypress="isInputNumber(event)"
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
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>current productivity</label>
                                    <div className="mt-1">
                                        <Input
                                            type="text"
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
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>level</label>
                                    <div className="mt-1">
                                        <MySelect
                                            errorMessage={errors?.level_id?.message}
                                            {...register('level_id', { required: 'level_id is required' })}
                                        >
                                            <option value={""}>Pilih Level</option>
                                            {dataLevel.map((item, index) => {
                                                return (
                                                    <option key={index} value={item.id}>{item.level_name}</option>
                                                )
                                            })}
                                        </MySelect>
                                    </div>
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>institution id</label>
                                    <div className="mt-1">
                                        <MySelect
                                            errorMessage={errors?.institution_id?.message}
                                            {...register('institution_id', { required: 'institution_id is required' })}
                                        >
                                            <option value={""}>Pilih Institution</option>
                                            {dataInstitution.map((item, index) => {
                                                return (
                                                    <option key={index} value={item.id}>{item.name}</option>
                                                )
                                            })}
                                        </MySelect>
                                    </div>
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>room width</label>
                                    <div className="mt-1">
                                        <Input
                                            type="text"
                                            errorMessage={errors?.room_width?.message}
                                            {...register('room_width', {
                                                required: 'required field',
                                                onChange: (e) => {
                                                    setValue('room_width', parseToNumber(e.target?.value))
                                                }
                                            })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>room height</label>
                                    <div className="mt-1">
                                        <Input
                                            type="text"
                                            errorMessage={errors?.room_height?.message}
                                            {...register('room_height', {
                                                required: 'required field',
                                                onChange: (e) => {
                                                    setValue('room_height', parseToNumber(e.target?.value))
                                                }
                                            })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>room capacity</label>
                                    <div className="mt-1">
                                        <Input
                                            type="text"
                                            errorMessage={errors?.room_capacity?.message}
                                            {...register('room_capacity', {
                                                required: 'required field',
                                                onChange: (e) => {
                                                    setValue('room_capacity', parseToNumber(e.target?.value))
                                                }
                                            })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>room material</label>
                                    <div className="mt-1">
                                        <Input
                                            errorMessage={errors?.room_material?.message}
                                            {...register('room_material', { required: 'required field' })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>mechanical installation</label>
                                    <div className="mt-1">
                                        <Input
                                            errorMessage={errors?.mechanical_installation?.message}
                                            {...register('mechanical_installation', { required: 'required field' })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>gas installation</label>
                                    <div className="mt-1">
                                        <Input
                                            errorMessage={errors?.gas_installation?.message}
                                            {...register('gas_installation', { required: 'required field' })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>water installation</label>
                                    <div className="mt-1">
                                        <Input
                                            errorMessage={errors?.water_installation?.message}
                                            {...register('water_installation', { required: 'required field' })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>electrical installation</label>
                                    <div className="mt-1">
                                        <Input
                                            errorMessage={errors?.electrical_installation?.message}
                                            {...register('electrical_installation', { required: 'required field' })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>network installation</label>
                                    <div className="mt-1">
                                        <Input
                                            errorMessage={errors?.network_installation?.message}
                                            {...register('network_installation', { required: 'required field' })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>room facilities</label>
                                    <div className="mt-1">
                                        <Input
                                            errorMessage={errors?.room_facilities?.message}
                                            {...register('room_facilities', { required: 'required field' })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>safety feature</label>
                                    <div className="mt-1">
                                        <Input
                                            errorMessage={errors?.safety_feature?.message}
                                            {...register('safety_feature', { required: 'required field' })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>security feature</label>
                                    <div className="mt-1">
                                        <Input
                                            errorMessage={errors?.security_feature?.message}
                                            {...register('security_feature', { required: 'required field' })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>year of build</label>
                                    <div className="mt-1">
                                        <Input
                                            type="text"
                                            errorMessage={errors?.year_of_build?.message}
                                            {...register('year_of_build', {
                                                required: 'required field',
                                                onChange: (e) => {
                                                    setValue('year_of_build', parseToNumber(e.target?.value))
                                                }
                                            })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>room cost</label>
                                    <div className="mt-1">
                                        <Input
                                            type="text"
                                            errorMessage={errors?.room_cost?.message}
                                            {...register('room_cost', {
                                                required: 'required field',
                                                onChange: (e) => {
                                                    setValue('room_cost', parseToNumber(e.target?.value))
                                                }
                                            })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>structure type</label>
                                    <div className="mt-1">
                                        <Input
                                            errorMessage={errors?.structure_type?.message}
                                            {...register('structure_type', { required: 'required field' })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>number subroom</label>
                                    <div className="mt-1">
                                        <Input
                                            type="text"
                                            errorMessage={errors?.number_subroom?.message}
                                            {...register('number_subroom', {
                                                required: 'required field',
                                                onChange: (e) => {
                                                    setValue('number_subroom', parseToNumber(e.target?.value))
                                                }
                                            })}
                                        />
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