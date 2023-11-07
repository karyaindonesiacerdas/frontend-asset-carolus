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
        // console.log(value)
        let param = {
            code: value.code,
            name: value.name,
            description: value.desc
        }

        HttpRequestExternal.updateUmdns(router.query.id, param).then((res) => {
            // console.log("res", res)
            notify(res.data.message)

            setTimeout(() => {
                router.back()
            }, 1000);
        }).catch((err) => {
            notifyGagal(err.response.data.message)
        })
    }

    const getDetail = useCallback(() => {
        HttpRequestExternal.getUmdnsDetail(router.query.id).then((res) => {
            // console.log("res", res)
            setDetail(res.data.data)
            setValue("code", res.data.data.code)
            setValue("name", res.data.data.name)
            setValue("desc", res.data.data.description)
        }).catch((err) => {
            // console.log("err", err, err.response)
        })
    }, [detail])

    useEffect(() => {
        getDetail()
    }, [])

    return (
        <div className="px-4 sm:px-6 md:px-8 mb-6 flex flex-col ">
            <Link
                href={`/umdns`}
            >
                <a className='text-primary-600 font-semibold hover:underline mb-4 inline-block'>Back to UMDNS List</a>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                UMDNS | Edit
            </h1>
            <div className='p-3 bg-white my-3'>

                <div className='flex flex-row'>
                    <div className='flex-1 ml-4'>
                        <form className="mt-8 space-y-5 accent-primary" onSubmit={handleSubmit(onSubmit)}>

                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>Code</label>
                            <div className="mt-1">
                                <Input
                                    errorMessage={errors?.code?.message}
                                    {...register('code', { required: 'Code is required' })}
                                />
                            </div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>Name</label>
                            <div className="mt-1">
                                <Input
                                    errorMessage={errors?.name?.message}
                                    {...register('name', { required: 'Name is required' })}
                                />
                            </div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>Description</label>
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