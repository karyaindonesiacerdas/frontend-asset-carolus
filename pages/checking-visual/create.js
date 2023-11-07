import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/outline'
import { useForm } from 'react-hook-form';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { HttpRequestExternal } from '../../utils/http';
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react';
import MySelect from '../../components/MySelect';
import TextArea from '../../components/TextArea';

import toast, { Toaster } from 'react-hot-toast';

const notify = (a) => toast.success('Successfully! ' + a)
const notifyGagal = (a) => toast.error('Failed! ' + a)

export default function App(props) {

    const { register, handleSubmit, formState: { errors, isSubmitting }, } = useForm();
    const router = useRouter();

    const onSubmit = (value) => {
        // // console.log(value)
        let param = {
            ...value
        }

        HttpRequestExternal.saveChecking(param).then((res) => {
            // // console.log("res", res)
            notify(res.data.message)

            setTimeout(() => {
                router.back()
            }, 1000);
        }).catch((err) => {
            notifyGagal(err.data.message)
        })
    }

    return (
        <div className="px-4 sm:px-6 md:px-8 mb-6 flex flex-col ">
            <Link
                href={`/checking-visual`}
            >
                <a className='text-primary-600 font-semibold hover:underline mb-4 inline-block'>Back to Checking List</a>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Checking | Create
            </h1>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='py-5 px-8 bg-white my-6'>
                    <div className='grid sm:grid-cols-2 sm:gap-3 lg:gap-5 lg:grid-cols-2 md:grid-cols-1 md:gap-2'>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>Name</label>
                            <div className="mt-1">
                                <Input
                                    id="name"
                                    errorMessage={errors?.name?.message}
                                    {...register('name', { required: 'name is required' })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>Type</label>
                            <div className="mt-1">
                                <Input
                                    id="type"
                                    errorMessage={errors?.type?.message}
                                    {...register('type', { required: 'Type is required' })}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-row'>
                        <span className='flex flex-1' />
                        <div className='pt-6'>
                            <Button
                                type="submit"
                                isLoading={isSubmitting}
                                shadow="small"
                                size="large"
                                rounded="full"
                                className="w-1/4 float-right text-right"
                            >
                                Submit
                            </Button>
                        </div>
                    </div>
                </div>
            </form>

        </div>
    )
}