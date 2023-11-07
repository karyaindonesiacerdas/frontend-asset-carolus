import React, { useState, useCallback, useEffect } from 'react';
import { SearchIcon } from '@heroicons/react/solid';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
    BarElement,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { HttpRequestExternal } from '../utils/http';
import DatePicker, { DateObject } from "react-multi-date-picker"
import DatePanel from "react-multi-date-picker/plugins/date_panel"
import Button from '../components/Button';
import MySelect from '../components/MySelect';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import moment from 'moment';

const notifyDel = () => toast.success('Successfully Delete!')
const notifyDelDel = (a) => toast.error('Failed! ' + a)

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    Title,
    BarElement,
    Tooltip,
);

const options = {
    responsive: true,
    options: {
        plugins: {
            legend: {
                display: false
            }
        },
    },
    scales: {
        y: {
            display: true // Hide Y axis labels
        },
        x: {
            display: true // Hide X axis labels
        }
    }
};

const dataShort = [
    {
        value: "daily",
        label: "Daily",
    },
    {
        value: "monthly",
        label: "Monthly",
    },
    {
        value: "yearly",
        label: "Yearly",
    },
]

const App = () => {
    const [values, setValues] = useState([
        new DateObject().subtract(0, "days"),
        new DateObject().add(1, "days")
    ])

    const [listData, setListData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [short, setShort] = useState("");
    const [dataDepartement, setDataDepartement] = useState([])
    const [dataDep, setDataDep] = useState("")
    const [dataAll, setDataAll] = useState([])
    const [dataTotalAssetRegistered, setDataTotalAssetRegistered] = useState([])
    const [dataTotalAssetInspection, setDataTotalAssetInspection] = useState([])
    const [dataTtlRegistered, setDataTtlRegistered] = useState(0)
    const [dataTtlInspection, setDataTtlInspection] = useState(0)

    const [tlRepair, setTlRepair] = useState(0)
    const [tlFailed, setTlFailed] = useState(0)
    const [tlAsset, setTlAsset] = useState(0)
    const [tlInspection, setTlInspection] = useState(0)

    const [chartAssetRegistered, setChartAssetRegistered] = useState()
    const [chartInspected, setChartInspected] = useState()

    const Grafik = useCallback(() => {
        let startDate = ""
        let endDate = ""
        if (short === "daily") {
            startDate = format(values[0]?.toDate(), "yyyy-MM-dd")
            endDate = values[1]?.toDate() ? format(values[1]?.toDate(), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd")
        }
        if (short === "monthly") {
            startDate = moment(values[0]?.toDate()).startOf("month").format("YYYY-MM-DD")
            endDate = moment(values[1]?.toDate()).endOf("month").format("YYYY-MM-DD")
        }

        if (short === "yearly") {

            startDate = moment(values[0]?.toDate()).startOf("year").format("YYYY-MM-DD")
            endDate = moment(values[1]?.toDate()).endOf("year").format("YYYY-MM-DD")
        }

        let data = {
            start_date: startDate,
            end_date: endDate,
            sort: short ? short : "daily",
            department: dataDep
        }

        // // console.log("data", data)
        // // console.log("data year", startDate)
        // // console.log("data year", values[0].toDate())

        if (data.department == "") {
            toast.error("Mohon pilih departemen")
            return false
        }
        if (data.department == "Pilih Department") {
            toast.error("Mohon pilih departemen")
            return false
        }

        setIsLoading(true)
        HttpRequestExternal.dashboardStatistic(data).then((res) => {
            // // console.log("res", res)
            setIsLoading(false)
            let data = res.data.data
            setListData(res.data.data)

            let arr_registered_label = []
            let arr_register = []

            let arr_inspected_label = []
            let arr_inspect = []

            data.forEach((item, index) => {
                if (item.nama == "Statistik Asset Registered") {
                    item.data.forEach((i) => {
                        arr_registered_label.push(i.display)
                        arr_register.push(i.total)
                    })
                    setTlAsset(item.data_total)
                }
                if (item.nama == "Statistik Asset Inspected") {
                    item.data.forEach((i) => {
                        arr_inspected_label.push(i.display)
                        arr_inspect.push(i.total)
                    })
                    setTlInspection(item.data_total)
                }

                if (item.nama == "Statistik Asset Failed") {
                    setTlFailed(item.data_total)
                }

                if (item.nama == "Statistik Asset Report Repair") {
                    setTlRepair(item.data_total)
                }
            })

            setChartAssetRegistered({
                labels: arr_registered_label,
                datasets: [
                    {
                        label: "",
                        fill: false,
                        backgroundColor: 'rgb(53, 162, 235)',
                        data: arr_register
                    }
                ]
            })

            setChartInspected({
                labels: arr_inspected_label,
                datasets: [
                    {
                        label: "",
                        fill: false,
                        backgroundColor: 'rgb(53, 162, 235)',
                        data: arr_inspect
                    }
                ]
            })

            setDataTtlRegistered(arr_register)
            setDataTtlInspection(arr_inspect)

            setIsLoading(false)
        }).catch((err) => {
            setIsLoading(false)
            notifyDelDel(err.response.data.message)
        })
    }, [values, dataDep, short])

    const defaultChart = {
        labels: [],
        datasets: [
            {
                label: "",
                fill: false,
                borderColor: 'rgba(75,192,192,1)',
                data: []
            }
        ]
    };

    useEffect(() => {
        getDepartment()
        if (short == "") {
            setShort("daily")
        }
    }, [short, chartAssetRegistered, chartInspected, tlAsset, tlInspection, tlFailed, tlRepair]);

    const getDepartment = useCallback(() => {
        HttpRequestExternal.getDepartment().then((res) => {
            let data = res.data.data
            setDataDepartement(data)
        }).catch((err) => {
            // // console.log("data department err", err, err.response)
        })
    }, [dataDepartement, dataDep])

    return (
        <>
            <div className="px-4 sm:px-6 md:px-8 mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Report Asset Management
                </h1>
            </div>
            <div className='bg-white h-auto'>
                {/* <div className='pt-6 pb-5 ml-6 w-80'> */}
                {/* <div className="sm:max-w-sm flex md:ml-0 border border-gray-500 rounded-md "> */}
                {/* <label htmlFor="search_field" className="sr-only">
                            Search
                        </label>
                        <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                            <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                                <SearchIcon className="h-5 w-5" aria-hidden="true" />
                            </div>
                            <input
                                id="search_field"
                                className="block w-full h-full pl-10 pr-3 py-2 border border-transparent text-gray-900 placeholder-gray-500 outline-none focus:outline-none focus:placeholder-gray-400 focus:ring-2  sm:text-sm bg-white dark:bg-gray-900 dark:text-white rounded-md  focus:ring-primary-500 focus:bg-white focus:border-transparent shadow-sm"
                                type="search"
                                name="search"
                                value={""}
                                onChange={e => {
                                    // setValue(e.target.value)
                                    // onChange(e.target.value)
                                }}
                                placeholder="Search"
                            />
                        </div> */}
                {/* </div> */}
                {/* </div> */}

                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mr-10 h-auto py-10'>
                    <div className='flex'>
                        <div className='flex w-auto flex-col border pl-6 border-black rounded-lg mx-5'>
                            <h1 className='my-4 mt-4'>Filter</h1>
                            <div className="mb-2 pr-10">
                                <h1>Short : </h1>
                                <MySelect
                                    name="short"
                                    onChange={(e) => setShort(e.target.value)}
                                >
                                    {dataShort.map((item, short) => {
                                        return (
                                            <option key={short} value={item.value}>{item.label}</option>
                                        )
                                    })}
                                </MySelect>
                            </div>

                            <div className="mb-2 pr-10">
                                <label htmlFor="department">Department : </label>
                                <MySelect
                                    id="department"
                                    onChange={(e) => setDataDep(e.target.value)}
                                >
                                    <option>Pilih Department</option>
                                    {dataDepartement.map((item, department) => {
                                        return (
                                            <option key={department} value={item.id}>{item.dep_name + " - " + item.dep_code}</option>
                                        )
                                    })}
                                </MySelect>
                            </div>
                            <div>
                                {
                                    short == "daily" && (
                                        <div>
                                            <h1 className="mb-2 text-sm">Date : </h1>
                                            <div className="border h-9 border-black rounded-md mr-10 mb-4">
                                                <DatePicker
                                                    value={values}
                                                    onChange={setValues}
                                                    range
                                                    plugins={[
                                                        <DatePanel />
                                                    ]}
                                                />
                                            </div>
                                        </div>
                                    )
                                }
                                {
                                    short == "monthly" && (
                                        <div>
                                            <h1 className="mb-2 text-sm">Date :</h1>
                                            <div className="border h-9 border-black rounded-md mr-10 mb-4">
                                                <DatePicker
                                                    onlyMonthPicker
                                                    value={values}
                                                    onChange={setValues}
                                                    range
                                                    plugins={[
                                                        <DatePanel />
                                                    ]}
                                                />
                                            </div>
                                        </div>
                                    )
                                }
                                {
                                    short == "yearly" && (
                                        <div>
                                            <h1 className="mb-2 text-sm">Date :</h1>
                                            <div className="border h-9 border-black rounded-md mr-10 mb-4">
                                                <DatePicker
                                                    onlyYearPicker
                                                    value={values}
                                                    onChange={setValues}
                                                    range
                                                    plugins={[
                                                        <DatePanel />
                                                    ]}
                                                />
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                            <div className='flex flex-row pr-10'>
                                <span className='flex flex-1' />
                                <div className='mb-4'>
                                    <Button
                                        isLoading={isLoading}
                                        onClick={() => {
                                            Grafik()
                                        }}>
                                        Submit
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='lg:w-auto h-auto mx-6'>
                        <div className='w-auto bg-gray-200 px-3 py-8'>
                            <div className='text antialiased text-xl font-bold text-black '>
                                Total Asset Registered
                                <div className='text antialiased text-4xl font-bold text-green-700 py-2'>{tlAsset}</div>
                                <Bar
                                    options={options}
                                    data={chartAssetRegistered ?? defaultChart}
                                />
                            </div>
                        </div>
                        <span className="h-16" />
                        <div className='w-auto bg-gray-200 px-3 py-3 flex flex-col h-52 my-16'>
                            <div className='text antialiased text-xl font-bold text-black '>Total Asset reported need repair</div>
                            <div className='text antialiased text-4xl font-bold text-green-700 py-2'>{tlRepair}</div>
                        </div>
                    </div>

                    <div className='block xl:hidden'>
                        <span className='flex flex-1' />
                    </div>

                    <div className='lg:w-auto h-auto mx-6'>
                        <div className='w-auto bg-gray-200 px-3 py-8'>
                            <div className='text antialiased text-xl font-bold text-black '>
                                Total Asset Inspected
                                <div className='text antialiased text-4xl font-bold text-green-700 py-2'>{tlInspection}</div>
                                <Bar
                                    options={options}
                                    data={chartInspected ?? defaultChart}
                                />
                            </div>
                        </div>
                        <div className='w-auto bg-gray-200 px-3 py-3 flex flex-col h-52 my-16'>
                            <div className='text antialiased text-xl font-bold text-black '>Total Failed Items</div>
                            <div className='text antialiased text-4xl font-bold text-green-700 py-2'>{tlFailed}</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default App;