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

    // const { register, handleSubmit, formState: { errors, isSubmitting }, } = useForm();
    const router = useRouter();
    const [detail, setDetail] = useState({})

    const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm();

    const onSubmit = (value) => {
        let param = {
            name: value.name,
        }

        HttpRequestExternal.updateUnit(router.query.id, param).then((res) => {
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
        HttpRequestExternal.getDetailUnit(router.query.id).then((res) => {
            // console.log("res", res)
            setDetail(res.data.data)
            let data = res.data.data
            setValue("name", data.name)
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
                href={`/building`}
            >
                <a className='text-primary-600 font-semibold hover:underline mb-4 inline-block'>Back to Unit List</a>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Unit | Edit
            </h1>

            <div className='p-3 bg-white my-3'>

                <div className='flex flex-row'>
                    <div className='flex-1 p-3'>
                        <form className="mt-8 space-y-6 accent-primary" onSubmit={handleSubmit(onSubmit)}>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>Unit Name</label>
                            <div className="mt-1">
                                <Input
                                    id="name"
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