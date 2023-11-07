import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/outline'
import { useForm } from 'react-hook-form';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { HttpRequestExternal } from '../../utils/http';
import { useRouter } from 'next/router'

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
            brand_name: value.name,
            brand_desc: value.desc,
        }

        HttpRequestExternal.saveAssetBrand(param).then((res) => {
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
                href={`/assets-brand`}
            >
                <a className='text-primary-600 font-semibold hover:underline mb-4 inline-block"'>Back to Brand List</a>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                Asset Brand | Create
            </h1>

            <div className='py-6 px-4 bg-white my-3 rounded-sm'>
                {/* <div className='flex flex-row'> */}
                <form className="mt-8 space-y-6 accent-primary" onSubmit={handleSubmit(onSubmit)}>
                    <div className='grid grid-cols-2 gap-5'>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>Asset Brand Name</label>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>Asset Brand Description</label>
                        <div className="mt-1">
                            <Input
                                errorMessage={errors?.name?.message}
                                {...register('name', { required: 'Name is required' })}
                            />
                        </div>
                        <div className="mt-1">
                            <Input
                                errorMessage={errors?.desc?.message}
                                {...register('desc', { required: 'Description is required' })}
                            />
                        </div>
                        <span />
                        <div className='grid grid-cols-2'>
                            <span />
                            <Button
                                type="submit"
                                isLoading={isSubmitting}
                                shadow="small"
                                size="large"
                                rounded="full"
                                className="w-max-content"
                            >
                                Simpan
                            </Button>
                        </div>

                    </div>
                </form>
            </div>

        </div>
    )
}