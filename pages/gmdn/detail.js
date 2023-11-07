import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/outline'
import { useForm } from 'react-hook-form';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { HttpRequestExternal } from '../../utils/http';
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react';
import TextArea from '../../components/TextArea';
import toast, { Toaster } from 'react-hot-toast';

const notify = (a) => toast.success('Successfully! ' + a)
const notifyGagal = (a) => toast.error('Failed! ' + a)

export default function App(props) {

    // const { register, handleSubmit, formState: { errors, isSubmitting }, } = useForm();
    const router = useRouter();
    const [detail, setDetail] = useState({})
    const { register, handleSubmit, formState: { errors, isSubmitting },
        setValue, } = useForm();

    const getDetail = useCallback(() => {
        HttpRequestExternal.getGdmnDetail(router.query.id).then((res) => {
            setDetail(res.data.data)
            let data = res.data.data
            setValue("code", data.code)
            setValue("name", data.name)
            setValue("description", data.description)
        })
    }, [detail])

    const onSubmit = (value) => {
        // // console.log(value)
        let param = {
            code: value.code,
            name: value.name,
            description: value.description
        }

        HttpRequestExternal.updateGdmn(router.query.id, param).then((res) => {
            // // console.log("res", res)
            notify(res.data.message)

            setTimeout(() => {
                router.back()
            }, 1000);
        }).catch((err) => {
            notifyGagal(err.response.data.message)
        })
    }

    useEffect(() => {
        getDetail()
    }, [])

    return (
        <div className="px-4 sm:px-6 md:px-8 mb-6 flex flex-col ">
            <Link
                href={`/gmdn`}
            >
                <a className='text-primary-600 font-semibold hover:underline mb-4 inline-block'>Back to GMDN List</a>
            </Link>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Asset GMDN | Edit
            </h1>

            <div className='p-3 bg-white my-3'>

                <div className='flex flex-row'>
                    <div className='flex-1 p-3'>
                        <form className="mt-8 space-y-6 accent-primary" onSubmit={handleSubmit(onSubmit)}>
                            <div className="grid sm:grid-cols-2 gap-5">
                                <div>
                                    <label >Code</label>
                                    <div className="mt-1">
                                        <Input
                                            errorMessage={errors?.code?.message}
                                            {...register('code', { required: 'Name is required' })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>GMDN Name</label>
                                    <div className="mt-1">
                                        <Input
                                            errorMessage={errors?.name?.message}
                                            {...register('name', { required: 'Name is required' })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300' htmlFor="supplier_desc">GMDN Description: </label>
                                    <div className="mt-1">
                                        <TextArea
                                            id="description"
                                            rows={5}
                                            errorMessage={errors?.description?.message}
                                            {...register('description', { required: 'Required' })}
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