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
    
    const { register, handleSubmit, formState: { errors, isSubmitting }, } = useForm();
    const router = useRouter();

    const onSubmit = (value) => {
        // // console.log(value)
        let param = {
            name: value.name,
        }

        HttpRequestExternal.saveBuilding(param).then((res) => {
            // // console.log("res", res)
            notify(res.data.message)

            setTimeout(() => {
                router.back()
            }, 1000);
        }).catch((err) => {
            notifyGagal(err.response.data.message)
        })
    }

    return (
        <div className="px-4 sm:px-6 md:px-8 mb-6 flex flex-col ">
            <Link
                href={`/building`}
            >
                <a className='text-primary-600 font-semibold hover:underline mb-4 inline-block'>Back to Building List</a>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Asset Building | Create
            </h1>

            <div className='p-3 bg-white my-3'>

                <div className='flex flex-row'>
                    <div className='flex-1 p-3'>
                        <form className="mt-8 space-y-6 accent-primary" onSubmit={handleSubmit(onSubmit)}>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>Asset Building Name</label>
                            <div className="mt-1">
                                <Input
                                    errorMessage={errors?.name?.message}
                                    {...register('name', { required: 'Name is required' })}
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
                </div>
            </div>

        </div>
    )
}