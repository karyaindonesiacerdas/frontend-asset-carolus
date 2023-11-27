import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { IconName, IoScanSharp } from "react-icons/io5";
import Input from "../../components/Input";
import { useForm } from "react-hook-form";
import MySelect from "../../components/MySelect";
import Button from "../../components/Button";
import { QrReader } from "react-qr-reader";
import { HttpRequestExternal } from "../../utils/http";
import { useRouter } from "next/router";
import Select from "react-select";

import toast, { Toaster } from "react-hot-toast";
import moment from "moment";
import { store } from "../../store";

const notifyDel = () => toast.success("Successfully Delete!");
const notifyDelDel = () => toast.error("Failed Delete!");

const notify = (a) => toast.success("Successfully! " + a);
const notifyGagal = (a) => toast.error("Failed! " + a);

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    width: state.selectProps.width,
    borderBottom: "1px dotted rgb(218 185 107)",
    color: state.selectProps.menuColor,
    // padding: 20,
  }),
  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = "opacity 300ms";

    return { ...provided, opacity, transition };
  },
  control: (base, { selectProps: { width } }) => ({
    ...base,
    flexDirection: "row",
    height: 40,
    width: width,
    backgroundColor: "rgb(0 0 0 / 0.05)",
    borderRadius: 30,
    border: "1px solid rgb(0 0 0 / 0.1)",
  }),
};

export default function App(props) {
  const [dataBuilding, setDataBuilding] = useState([]);
  const [dataFloor, setDataFloor] = useState([]);
  const [dataDepartement, setDataDepartement] = useState([]);
  const [dataUnit, setDataUnit] = useState([]);
  const [dataRoom, setDataRoom] = useState([]);
  const [dataEquipment, setDataEquipment] = useState([]);
  const [dataUser, setDataUser] = useState([]);
  const [isShowScanner, setShowScanner] = useState(false);
  const [isShowScannerBooking, setShowScannerBooking] = useState(false);
  const [dataRegistration, setDataRegistration] = useState([]);
  const [dataAllUser, setAllDataUser] = useState([]);
  const router = useRouter();
  const [isLoadingEmploye, setIsLoadingEmploye] = useState(false);
  const [limitEndDate, setLimitEndDate] = useState(
    moment().format("YYYY-MM-DD")
  );

  const user = store.getState().user;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm();

  const onSubmit = (value) => {
    const data = {
      user_id: value.user_id,
      user_name: value.user_name,
      asset_id: value.asset_id,
      start_date: value.start_date,
      end_date: value.end_date,
      start_time: value.start_time,
      end_time: value.end_time,
      quantity: value.quantity,
      room_id: value.room,
      floor_id: value.floor,
      building_id: value.building,
      department_id: value.department,
    };

    if (!data.asset_id) {
      toast.error("Mohon pilih equipment");
      return false;
    }

    if (!data.user_id) {
      toast.error("Mohon borrower");
      return false;
    }

    HttpRequestExternal.requestBooking(data)
      .then((response) => {
        notify(response.data.message);
        setTimeout(() => {
          router.back();
        }, 1000);
      })
      .catch((err) => {
        notifyGagal(err.response.data.message);
      });
  };

  useEffect(() => {
    getDataFloor();
    getDataRoom();
    getDataDepartement();
    getDataBuilding();
    getAssetRegistration();
    getListUserAll();
  }, []);

  const getAssetRegistration = useCallback(() => {
    HttpRequestExternal.getListBooking()
      .then((res) => {
        let data = res.data.data;
        let looping = data.map((item, index) => {
          return {
            value: item.id,
            label: item.equipments_name,
          };
        });
        setDataRegistration(looping);
      })
      .catch((err) => {
        let data = "Load Data Asset Registration";
        notifyGagal(data);
      });
  }, [dataRegistration]);

  const getListUserAll = useCallback(() => {
    if (
      ![
        "super-admin",
        "admin",
        "hospital-admin",
        "asset-manager",
        "asset-pic",
      ].includes(user?.employee?.role?.alias)
    ) {
      setAllDataUser([
        {
          value: user.user.data.data.id,
          label: user.user.data.data.name,
        },
      ]);
    } else {
      setIsLoadingEmploye(true);
      HttpRequestExternal.getListUser()
        .then((res) => {
          let data = res.data.data;
          let looping = data.map((item, index) => {
            return {
              value: item.id,
              label: item.name,
            };
          });
          setIsLoadingEmploye(false);
          setAllDataUser(looping);
        })
        .catch((err) => {
          setIsLoadingEmploye(false);
          let data = "Load Data List User";
          notifyGagal(data);
        });
    }
  }, [dataAllUser]);

  const getDataBuilding = useCallback(() => {
    HttpRequestExternal.getBuilding()
      .then((response) => {
        setDataBuilding(response.data.data);
        let data = response.data.data;
        let looping = data.map((item, index) => {
          return {
            id: item.id,
          };
        });
        setValue("building", looping[0].id);
        // console.log("ini adalah building", data)
      })
      .catch((err) => {
        // console.log('err', err, err.response)
        let data = "Load Data Unit";
        notifyGagal(data);
      });
  }, [dataBuilding]);

  const getDataDepartement = useCallback(() => {
    HttpRequestExternal.getDepartment()
      .then((res) => {
        setDataDepartement(res.data.data);
        let data = res.data.data;
        let looping = data.map((item, index) => {
          return {
            id: item.id,
          };
        });
        setValue("department", looping[0].id);
      })
      .catch((err) => {
        // console.log("data department err", err, err.response)
        let data = "Load Data Department";
        notifyGagal(data);
      });
  }, [dataDepartement]);

  const getDataFloor = useCallback(() => {
    HttpRequestExternal.getFloor()
      .then((res) => {
        setDataFloor(res.data.data);
        let data = res.data.data;
        let looping = data.map((item, index) => {
          return {
            id: item.id,
          };
        });
        setValue("floor", looping[0].id);
      })
      .catch((err) => {
        let data = "Load Data Floor";
        notifyGagal(data);
      });
  }, [dataFloor]);

  const getDataRoom = useCallback(() => {
    HttpRequestExternal.getRoom()
      .then((res) => {
        setDataRoom(res.data.data);
        let data = res.data.data;
        let looping = data.map((item, index) => {
          return {
            id: item.id,
          };
        });
        setValue("room", looping[0].id);
      })
      .catch((err) => {
        // console.log("data room err", err, err.response)
        let data = "Load Data Room";
        notifyGagal(data);
      });
  }, [dataRoom]);

  const parseToNumber = (value) => {
    let ch = value?.replace(/[^0-9]+/g, "");
    if (!ch) {
      toast.error("Please enter only number");
    } else {
      return ch;
    }
  };

  return (
    <>
      {/* <div className=""> */}
      <div className="px-6">
        <Link href={`/mutation`}>
          <a className="inline-block mb-4 font-semibold text-primary-600 hover:underline">
            Back to Booking List
          </a>
        </Link>
      </div>
      <div className="pb-4 mx-3 my-5 bg-white rounded-md sm:px-6">
        <div className="flex flex-row pt-4">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Booking
            </h1>
          </div>
          <div className="flex-1" />
          <div className="flex flex-row pr-5 mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Type:
            </h1>
            <div className="flex items-center ml-4 rounded-lg bg-primary-300">
              <h1 className="px-5 text-sm font-bold text-gray-900 dark:text-white">
                Equipment
              </h1>
            </div>
          </div>
        </div>

        <div className="flex flex-row justify-center pt-4">
          <div className="mb-4">
            <h1 className="w-40 pt-3 pr-4 text-lg font-bold text-gray-900 dark:text-white">
              Equipment
            </h1>
          </div>
          <span className="self-center w-screen border-t border-black border-1" />
        </div>

        <div className="flex flex-row">
          <div className="flex flex-col">
            <div className="w-40">
              <h1 className="text-xs text-gray-900 dark:text-white">
                Scan Equipment
              </h1>
            </div>
            {isShowScanner == false && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    if (isShowScannerBooking == true) {
                      return setShowScannerBooking(false);
                    } else {
                      return setShowScanner(true);
                    }
                  }}
                  className="justify-center mt-4 primary-action-button w-28"
                >
                  <IoScanSharp />
                </button>
              </>
            )}
            {isShowScanner == true && (
              <>
                <div className="justify-center mt-4">
                  <QrReader
                    className="w-32 h-auto"
                    constraints={{
                      constraints: { video: true, audio: false },
                    }}
                    onResult={(result, error) => {
                      if (!!result) {
                        HttpRequestExternal.scanAsset(result?.text)
                          .then((res) => {
                            // console.log("berhasil scann data", res)
                            setDataEquipment(res.data.data);
                            setValue("asset_id", res.data.data.id);
                          })
                          .catch((err) => {
                            notifyGagal("Scan Equipment");
                            // console.log("error scann data", err, err.response)
                          });
                      }
                    }}
                    style={{ width: "100%" }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setShowScanner(false);
                    }}
                    className="justify-center w-auto text-xs primary-action-button"
                  >
                    Close Scanner
                  </button>
                </div>
              </>
            )}
            <div className="w-40">
              <h1 className="pt-3 text-xs text-gray-900 dark:text-white">
                Select Equipment
              </h1>
            </div>
            <div className="mt-4 w-28">
              <Select
                styles={customStyles}
                menuColor="black"
                options={dataRegistration}
                onChange={(event) => {
                  HttpRequestExternal.scanAsset(event.value)
                    .then((res) => {
                      // console.log("berhasil get data asset", res)
                      setDataEquipment(res.data.data);
                      setValue("asset_id", res.data.data.id);
                    })
                    .catch((err) => {
                      notifyGagal("Select Equipment");
                      // console.log("error scann data", err, err.response)
                    });
                }}
              />
            </div>
          </div>
          <div className="grid w-screen col-span-2">
            <div className="h-auto border border-black">
              <div className="hidden lg:block">
                <div className="grid grid-cols-2 gap-2 p-4">
                  <h1 className="text-sm antialiased font-bold">
                    Asset Name :{" "}
                  </h1>
                  <h1 className="text-sm antialiased font-bold">Brand : </h1>
                  <h1 className="text-sm antialiased">
                    {dataEquipment?.equipments_name ?? "-"}
                  </h1>
                  <h1 className="text-sm antialiased">
                    {dataEquipment?.data_brand?.brand_name ?? "-"}
                  </h1>
                  <h1 className="text-sm antialiased font-bold">Model : </h1>
                  <h1 className="text-sm antialiased font-bold">
                    Serial Number :{" "}
                  </h1>
                  <h1 className="text-sm antialiased">
                    {dataEquipment?.data_model?.model_name ?? "-"}
                  </h1>
                  <h1 className="text-sm antialiased">
                    {dataEquipment?.serial_number ?? "-"}
                  </h1>
                  <h1 className="text-sm antialiased font-bold">Type : </h1>
                  <h1 className="text-sm antialiased">
                    {dataEquipment?.data_type?.type_name ?? "-"}
                  </h1>
                </div>
              </div>
              <div className="sm:block lg:hidden">
                <div className="grid grid-cols-2 gap-2 p-4">
                  <h1 className="text-sm antialiased font-bold">
                    Asset Name :{" "}
                  </h1>
                  <h1 className="text-sm antialiased">
                    {dataEquipment?.equipments_name ?? "-"}
                  </h1>
                  <h1 className="text-sm antialiased font-bold">Brand : </h1>
                  <h1 className="text-sm antialiased">
                    {dataEquipment?.data_brand?.brand_name ?? "-"}
                  </h1>
                  <h1 className="text-sm antialiased font-bold">Model : </h1>
                  <h1 className="text-sm antialiased">
                    {dataEquipment?.data_model?.model_name ?? "-"}
                  </h1>
                  <h1 className="text-sm antialiased font-bold">
                    Serial Number :{" "}
                  </h1>
                  <h1 className="text-sm antialiased">
                    {dataEquipment?.serial_number ?? "-"}
                  </h1>
                  <h1 className="text-sm antialiased font-bold">Type : </h1>
                  <h1 className="text-sm antialiased">
                    {dataEquipment?.data_type?.type_name ?? "-"}
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-row justify-center pt-4">
          <div className="mb-4">
            <h1 className="w-40 pt-3 pr-4 text-base font-bold text-gray-900 dark:text-white">
              Person in Charge
            </h1>
          </div>
          <span className="self-center w-screen border-t border-black border-1" />
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-row pt-4">
            <div className="flex flex-col">
              <div className="w-40">
                <h1 className="pt-3 text-xs text-gray-900 dark:text-white">
                  Select Borrower
                </h1>
              </div>
              <div className="mt-4 w-28">
                <Select
                  styles={customStyles}
                  menuColor="black"
                  options={dataAllUser}
                  onChange={(event) => {
                    HttpRequestExternal.getDetailUser(event.value)
                      .then((res) => {
                        setValue("user_name", res.data.data.name);
                        setValue("user_id", res.data.data.id);
                        setDataUser(res.data.data);
                      })
                      .catch((err) => {
                        notifyGagal("Select Borrower");
                      });
                  }}
                />
              </div>
            </div>
            <div className="grid w-screen col-span-2 ">
              <div className="h-auto border border-black">
                <div className="grid grid-cols-3 gap-2 p-4">
                  <div>
                    <h1 className="text-sm font-bold text-gray-900 dark:text-white">
                      Person in Charge Name
                    </h1>
                  </div>
                  <div className="col-span-2">
                    <h1 className="text-sm font-bold text-gray-900 dark:text-white">
                      Date Start Borrow
                    </h1>
                  </div>
                  <div>
                    <h1 className="text-sm text-gray-900 dark:text-white">
                      {dataUser?.name}
                    </h1>
                  </div>
                  <div>
                    <Input
                      id="start_date"
                      type="date"
                      min={moment().format("YYYY-MM-DD")}
                      defaultValue={moment().format("YYYY-MM-DD")}
                      errorMessage={errors?.start_date?.message}
                      {...register("start_date", {
                        required: "Required",
                        onChange: (e) => {
                          setLimitEndDate(e.target.value);
                          setValue("start_date", e.target.value);
                        },
                      })}
                    />
                  </div>
                  <div className="w-32">
                    <Input
                      id="start_time"
                      placeholder="wib"
                      type="time"
                      min={moment().format("hh:mm")}
                      defaultValue={moment().format("hh:mm")}
                      errorMessage={errors?.start_time?.message}
                      {...register("start_time", {
                        required: "Required",
                      })}
                    />
                  </div>
                  <div>
                    <h1 className="text-sm font-bold text-gray-900 dark:text-white">
                      Borrower Name :{" "}
                    </h1>
                  </div>
                  <div className="col-span-2">
                    <h1 className="text-sm font-bold text-gray-900 dark:text-white">
                      Date End
                    </h1>
                  </div>
                  <div>
                    <h1 className="text-sm text-gray-900 dark:text-white">
                      {dataUser?.name}
                    </h1>
                  </div>
                  <div>
                    <Input
                      id="end_date"
                      type="date"
                      min={limitEndDate}
                      defaultValue={moment().format("YYYY-MM-DD")}
                      errorMessage={errors?.end_date?.message}
                      {...register("end_date", { required: "Required" })}
                    />
                  </div>
                  <div className="w-32">
                    <Input
                      id="end_time"
                      placeholder="wib"
                      type="time"
                      defaultValue={moment().format("hh:mm")}
                      errorMessage={errors?.end_time?.message}
                      {...register("end_time", { required: "Required" })}
                    />
                  </div>
                </div>
                <h1 className="p-4 text-sm font-bold text-gray-900 dark:text-white">
                  Quantity :
                </h1>
                <div className="flex flex-row p-4">
                  <div>
                    <Input
                      id="quantity"
                      type="text"
                      errorMessage={errors?.quantity?.message}
                      {...register("quantity", {
                        required: "Required",
                        onChange: (e) => {
                          setValue("quantity", parseToNumber(e.target.value));
                        },
                      })}
                    />
                  </div>
                  <span className="px-2" />
                  <div className="w-32">
                    <Input
                      disabled
                      value={
                        dataEquipment?.quantity
                          ? dataEquipment?.quantity + " Unit"
                          : "0" + " Unit"
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-flow-row-dense grid-rows-2 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="flex flex-col">
                    <label
                      htmlFor="building"
                      className="p-1 text-sm font-bold text-gray-900 dark:text-white"
                    >
                      Building :{" "}
                    </label>
                    <MySelect
                      id="building"
                      errorMessage={errors?.building?.message}
                      {...register("building", { required: "Required" })}
                    >
                      {dataBuilding.map((item, room) => {
                        return (
                          <option key={room} value={item.id}>
                            {item.name}
                          </option>
                        );
                      })}
                    </MySelect>
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="floor"
                      className="p-1 text-sm font-bold text-gray-900 dark:text-white"
                    >
                      Floor :{" "}
                    </label>
                    <MySelect
                      id="floor"
                      errorMessage={errors?.floor?.message}
                      {...register("floor", { required: "Required" })}
                    >
                      {dataFloor.map((item, floor) => {
                        return (
                          <option key={floor} value={item.id}>
                            {item.name}
                          </option>
                        );
                      })}
                    </MySelect>
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="room"
                      className="p-1 text-sm font-bold text-gray-900 dark:text-white"
                    >
                      Room :{" "}
                    </label>
                    <MySelect
                      id="room"
                      errorMessage={errors?.room?.message}
                      {...register("room", { required: "Required" })}
                    >
                      {dataRoom.map((item, room) => {
                        return (
                          <option key={room} value={item.id}>
                            {item.room_name + " - " + item.room_cost}
                          </option>
                        );
                      })}
                    </MySelect>
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="department"
                      className="p-1 text-sm font-bold text-gray-900 dark:text-white"
                    >
                      Department :{" "}
                    </label>

                    <MySelect
                      id="department"
                      errorMessage={errors?.department?.message}
                      {...register("department", { required: "Required" })}
                    >
                      {dataDepartement.map((item, department) => {
                        return (
                          <option key={department} value={item.id}>
                            {item.dep_name + " - " + item.dep_code}
                          </option>
                        );
                      })}
                    </MySelect>
                  </div>
                </div>
                <div className="flex flex-row py-4 mr-4">
                  <span className="flex flex-1" />
                  <Button type="submit">Request Borrow Equipment</Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      {/* </div> */}
    </>
  );
}
