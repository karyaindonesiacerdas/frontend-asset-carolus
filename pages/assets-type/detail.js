import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/outline'
import { useForm } from 'react-hook-form';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { HttpRequestExternal } from '../../utils/http';
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react';

import toast, { Toaster } from 'react-hot-toast';

const notifyDel = () => toast.success('Successfully Delete!')
const notifyDelDel = () => toast.error('Failed Delete!')

const notify = (a) => toast.success('Successfully! ' + a)
const notifyGagal = (a) => toast.error('Failed! ' + a)

export default function App(props) {

    const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm();
    const router = useRouter();
    const [detail, setDetail] = useState({})

    const onSubmit = (value) => {
        // // console.log(value)
        let param = {
            type_name: value.name,
            type_desc: value.desc,
        }

        HttpRequestExternal.updateAssetType(router.query.id, param).then((res) => {
            notify(res.data.message)

            setTimeout(() => {
                router.back()
            }, 1000);
        }).catch((err) => {
            notifyGagal(err.response.data.message)
        })
    }

    const getDetail = useCallback(() => {
        HttpRequestExternal.getAssetTypeDetail(router.query.id).then((res) => {
            setDetail(res.data.data)
            setValue("name", res.data.data.type_name)
            setValue("desc", res.data.data.type_desc)
        }).catch((err) => {
            // // console.log("err", err, err.response)
        })
    }, [detail])

    useEffect(() => {
        getDetail()
    }, [])

    return (
        <div className="px-4 sm:px-6 md:px-8 mb-6 flex flex-col ">
            <Link
                href={`/assets-type`}
            >
                <a className='text-primary-600 font-semibold hover:underline mb-4 inline-block'>Back to Asset Type List</a>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Asset Type | Edit
            </h1>

            <div className='p-3 bg-white my-3'>

                <div className='flex flex-row'>
                    <div className='flex-1'>
                        <form className="mt-8 space-y-6 accent-primary" onSubmit={handleSubmit(onSubmit)}>

                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>Asset Type Name</label>
                            <div className="mt-1">
                                <Input
                                    errorMessage={errors?.name?.message}
                                    {...register('name', { required: 'Name is required' })}
                                />
                            </div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>Asset Type Description</label>
                            <div className="mt-1">
                                <Input
                                    errorMessage={errors?.desc?.message}
                                    {...register('desc', { required: 'Description is required' })}
                                />
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