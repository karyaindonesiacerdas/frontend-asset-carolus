import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/outline'
import { useForm } from 'react-hook-form';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { HttpRequestExternal } from '../../utils/http';
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react';
import MySelect from '../../components/MySelect';

import toast, { Toaster } from 'react-hot-toast';

const notifyDel = () => toast.success('Successfully Delete!')
const notifyDelDel = () => toast.error('Failed Delete!')

const notify = (a) => toast.success('Successfully! ' + a)
const notifyGagal = (a) => toast.error('Failed! ' + a)

export default function App(props) {

    const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm();
    const router = useRouter();
    const [detail, setDetail] = useState({})
    const [dataBrand, setDataBrand] = useState([])
    const [isLoading, setIsLoading] = useState(false)


    const onSubmit = (value) => {
        // // console.log(value)
        let param = {
            model_name: value.name,
            model_desc: value.desc,
            brand_id: value.brand
        }

        HttpRequestExternal.updateAssetModel(router.query.id, param).then((res) => {
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
        HttpRequestExternal.getAssetModelDetail(router.query.id).then((res) => {
            setDetail(res.data.data)
            setValue("name", res.data.data.model_name)
            setValue("desc", res.data.data.model_desc)
            setValue("brand", res.data.data.brand_id)
            setIsLoading(false)
        }).catch((err) => {
            setIsLoading(false)
            notifyGagal(err.message)
        })
    }, [detail])

    const getAssetBrand = useCallback(() => {
        HttpRequestExternal.getAssetBrand().then((res) => {
            let data = res.data.data
            setDataBrand(data)
            getDetail()
        }).catch((err) => {
            notifyGagal(err.message)
        })
    }, [])

    useEffect(() => {
        getAssetBrand()
    }, [])

    return (
        <div className="px-4 sm:px-6 md:px-8 mb-6 flex flex-col ">
            <Link
                href={`/assets-model`}
            >
                <a className='text-primary-600 font-semibold hover:underline mb-4 inline-block'>Back to Asset Model List</a>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Asset Model | Edit
            </h1>

            <div className='p-3 bg-white my-3'>

                <div className='flex flex-row'>
                    <div className='flex-1'>
                        <form className="mt-8 space-y-6 accent-primary" onSubmit={handleSubmit(onSubmit)}>

                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>Asset Model Name</label>
                            <div className="mt-1">
                                <Input
                                    errorMessage={errors?.name?.message}
                                    {...register('name', { required: 'Name is required' })}
                                />
                            </div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>Asset Model Description</label>
                            <div className="mt-1">
                                <Input
                                    errorMessage={errors?.desc?.message}
                                    {...register('desc', { required: 'Description is required' })}
                                />
                            </div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>Asset Brand</label>
                            <div className="mt-1">
                                <MySelect
                                    errorMessage={errors?.brand?.message}
                                    {...register('brand', { required: 'Brand is required' })}
                                >
                                    {dataBrand.map((item, index) => {
                                        return (
                                            <option key={index} value={item.id}>{item.brand_name}</option>
                                        )
                                    })}
                                </MySelect>
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
                    <div className='flex-1' />
                </div>
            </div>

        </div>
    )
}