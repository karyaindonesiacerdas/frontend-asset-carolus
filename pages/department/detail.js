import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { QRCode } from 'react-qrcode-logo'
import { FaDochub, FaUpload } from 'react-icons/fa'
import { SubmitHandler, useForm } from 'react-hook-form'
import format from 'date-fns/format'
import Button from '../../components/Button'
import Input from "../../components/Input"
import TextArea from '../../components/TextArea';
import { HttpRequestExternal } from '../../utils/http'
import { useRouter } from 'next/router'
import MySelect from '../../components/MySelect';


import toast, { Toaster } from 'react-hot-toast';

const notifyDel = () => toast.success('Successfully Delete!')
const notifyDelDel = () => toast.error('Failed Delete!')

const notify = (a) => toast.success('Successfully! ' + a)
const notifyGagal = (a) => toast.error('Failed! ' + a)

const App = () => {
    const [detail, setDetail] = useState([])
    const router = useRouter()
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting },
        setValue,
    } = useForm()
    const [dataInstitution, setDataInstitution] = useState([])

    const onSubmit = value => {
        const data = {
            ...value,
        }

        HttpRequestExternal.updateDepartment(router.query.id, data).then((res) => {
            // // console.log("res", res)
            notify(res.data.message)

            setTimeout(() => {
                router.back()
            }, 1000);
        }).catch((err) => {
            notifyGagal("gagal update")
            // // console.log("err", err)
        })
    }

    const getDetail = useCallback(() => {
        HttpRequestExternal.getDetailDepartment(router.query.id).then((res) => {
            // // console.log("res", res)
            setDetail(res.data.data)
            let data = res.data.data
            setValue("dep_name", data.dep_name)
            setValue("dep_code", data.dep_code)
            setValue("dep_desc", data.dep_desc)
            setValue("institution_id", data.institution_id)
        }).catch((err) => {
            notifyGagal(err.message)
            // // console.log("err", err, err.response)
        })
    }, [detail])

    useEffect(() => {
        getInstitation()
    }, [])

    const getInstitation = useCallback(() => {
        HttpRequestExternal.getInstitation().then((res) => {
            let data = res.data.data
            setDataInstitution(data)
            getDetail()
        }).catch((err) => {
            notifyGagal(err.message)
        })
    }, [dataInstitution])

    const parseToNumber = (value) => {
        let ch = value?.replace(/[^0-9]+/g, '')
        if (!ch) {
            toast.error("Please enter only number")
        } else {
            return ch
        }
    }

    return (
        <div className="px-3 sm:px-6">
            <Link
                href={`/department`}
            >
                <a className="inline-block mb-4 font-semibold text-primary-600 hover:underline">
                    Back to Department Asset List
                </a>
            </Link>
            <div className="mb-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Edit Department
                </h1>
            </div>
            <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="w-full p-6 bg-white rounded-lg shadow-lg dark:bg-gray-900">
                        <div className="grid grid-cols-1 gap-4 xl:grid-cols-1 lg:gap-6">
                            <div className="grid py-2 lg:grid-cols-2 md:grid-cols-1 gap-y-4 gap-x-3">
                                <div>
                                    <label htmlFor="dep_name">Department Name: </label>
                                    <div className="mt-1">
                                        <Input
                                            id="dep_name"
                                            errorMessage={errors?.dep_name?.message}
                                            {...register('dep_name', { required: 'Required' })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="dep_code">Department Code: </label>
                                    <div className="mt-1">
                                        <Input
                                            id="dep_code"
                                            type="text"
                                            errorMessage={errors?.dep_code?.message}
                                            {...register('dep_code', {
                                                required: 'Required',
                                                onChange: (e) => {
                                                    setValue('dep_code', parseToNumber(e.target.value))
                                                }
                                            })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="institution_id">Institution: </label>
                                    <div className="mt-1">
                                        <MySelect
                                            errorMessage={errors?.institution_id?.message}
                                            {...register('institution_id', { required: 'institution_id is required' })}
                                        >
                                            {dataInstitution.map((item, index) => {
                                                return (
                                                    <option key={index} value={item.id}>{item.name}</option>
                                                )
                                            })}
                                        </MySelect>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="dep_desc">Department Description: </label>
                                    <div className="mt-1">
                                        <TextArea
                                            id="dep_desc"
                                            rows={5}
                                            errorMessage={errors?.dep_desc?.message}
                                            {...register('dep_desc', { required: 'Required' })}
                                        />
                                    </div>
                                </div>

                            </div>
                            <div className='flex flex-row'>
                                <span className='flex-1' />
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
                            </div>

                        </div>
                    </div>
                </form>
            </div>
        </div >
    )
}

export default App
