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

    const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm();
    const router = useRouter();
    const [detail, setDetail] = useState({})

    const onSubmit = (value) => {
        // console.log(value)
        let param = {
            ...value
        }

        HttpRequestExternal.updateSuplier(router.query.id, param).then((res) => {
            notify(res.data.message)
            setTimeout(() => {
                router.back()
            }, 1000);
        }).catch((err) => {
            notifyGagal(err.data.message)
            // console.log("err", err)
        })
    }

    const getDetail = useCallback(() => {
        HttpRequestExternal.getDetailSupplier(router.query.id).then((res) => {
            let data = res.data.data
            setDetail(data)
            setValue("supplier_name", data.supplier_name)
            setValue("supplier_sn", data.supplier_sn)
            setValue("contact_no", data.contact_no)
            setValue("contact_email", data.contact_email)
            setValue("address", data.address)
            setValue("supplier_desc", data.supplier_desc)
        }).catch((err) => {
            notifyGagal(err.response.data.message)
        })
    }, [detail])

    useEffect(() => {
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
        <div className="px-4 sm:px-6 md:px-8 mb-6 flex flex-col ">
            <Link
                href={`/suplier-management`}
            >
                <a className='text-primary-600 font-semibold hover:underline mb-4 inline-block'>Back to Supplier list</a>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Supplier Detail
            </h1>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='py-5 px-8 bg-white my-6'>
                    <div className='grid sm:grid-cols-2 sm:gap-3 lg:gap-5 lg:grid-cols-2 md:grid-cols-1 md:gap-2'>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>Supplier Name</label>
                            <div className="mt-1">
                                <Input
                                    id="supplier_name"
                                    errorMessage={errors?.supplier_name?.message}
                                    {...register('supplier_name', { required: 'supplier name is required' })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>Supplier SN</label>
                            <div className="mt-1">
                                <Input
                                    type="text"
                                    id="supplier_sn"
                                    errorMessage={errors?.supplier_sn?.message}
                                    {...register('supplier_sn', {
                                        required: 'supplier SN is required',
                                        onChange: (e) => {
                                            setValue('supplier_sn', parseToNumber(e.target?.value))
                                        }
                                    })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>Supplier Contact</label>
                            <div className="mt-1">
                                <Input
                                    type="text"
                                    id="contact_no"
                                    errorMessage={errors?.contact_no?.message}
                                    {...register('contact_no', {
                                        required: 'Supplier Contact is required',
                                        onChange: (e) => {
                                            setValue('contact_no', parseToNumber(e.target?.value))
                                        }
                                    })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>Supplier Email</label>
                            <div className="mt-1">
                                <Input
                                    type="email"
                                    id="contact_email"
                                    errorMessage={errors?.contact_email?.message}
                                    {...register('contact_email', { required: 'Supplier Email is required' })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>Supplier Address</label>
                            <div className="mt-1">
                                <TextArea
                                    rows={4}
                                    id="address"
                                    errorMessage={errors?.address?.message}
                                    {...register('address', { required: 'Supplier Address is required' })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>Supplier Description</label>
                            <div className="mt-1">
                                <TextArea
                                    rows={4}
                                    id="supplier_desc"
                                    errorMessage={errors?.supplier_desc?.message}
                                    {...register('supplier_desc', { required: 'Supplier Description is required' })}
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
        </div >
    )
}