import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { QRCode } from "react-qrcode-logo";
import { FaDochub, FaUpload } from "react-icons/fa";
import { SubmitHandler, useForm, useWatch, Controller } from "react-hook-form";
import Button from "../../components/Button";
import format from "date-fns/format";
import Photo from "../../utils/Photo";

import Input from "../../components/Input";
import { HttpRequest, HttpRequestExternal } from "../../utils/http";
import MySelect from "../../components/MySelect";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Select from "react-select";
import toast, { Toaster } from "react-hot-toast";
import { ErrorMessage } from "@hookform/error-message";
import moment from "moment";

const notifyDel = () => toast.success("Successfully Delete!");
const notifyDelDel = () => toast.error("Failed Delete!");

const notify = (a) => toast.success("Successfully! " + a);
const notifyGagal = (a) => toast.error("Failed! " + a);

const App = () => {
  const user = useSelector((state) => state.user);
  const router = useRouter();
  const [dataModel, setDataModel] = useState([]);
  const [dataBrand, setDataBrand] = useState([]);
  const [dataDepartement, setDataDepartement] = useState([]);
  const [dataUmdns, setDataUMDNS] = useState([]);
  const [dataType, setDataType] = useState([]);
  const [dataGmdn, setDataGMDN] = useState([]);
  const [generateId, setGenerateID] = useState("");

  const [dataBuilding, setDataBuilding] = useState([]);
  const [dataFloor, setDataFloor] = useState([]);
  const [dataRoom, setDataRoom] = useState([]);
  const [dataSheet, setDataSheet] = useState("");
  const [dataDocument, setDocument] = useState("");
  const [photo, setPhoto] = useState("");
  const [dataManager, setDataManager] = useState([]);
  const [dataPicId, setDataPicId] = useState([]);
  const [dataSupplier, setDataSupplier] = useState([]);
  const [dataFilterSupplier, setFilterSupplier] = useState([]);

  const [limitEndDate, setLimitEndDate] = useState(
    moment().format("YYYY-MM-DD")
  );

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    getValues,
    control,
  } = useForm();

  useEffect(() => {
    getDataModel();
    getDataBrand();
    getDataUMDNS();
    getDataType();
    getDepartment();
    getDataGMDN();
    getGenerateID();

    getDataBuilding();
    getDataFloor();
    getDataRoom();
    getAssetManager();
    getAssetPic();
    getDataSupplier();
  }, []);

  const onSubmit = (value, e) => {
    // console.log("value", value)
    if (value.asset_name == "") {
      notifyGagal("Name is required");
      return;
    }
    // e.target.reset();
    if (value.model === "") {
      notifyGagal("Model is required");
      return;
    }
    if (value.brand === "") {
      notifyGagal("Brand is required");
      return;
    }
    if (value.departement === "") {
      notifyGagal("Departement is required");
      return;
    }
    if (value.umdns === "" && value.medical_devices) {
      notifyGagal("UMDNS is required");
      return;
    }
    if (value.type === "") {
      notifyGagal("Type is required");
      return;
    }
    if (value.gmdn === "" && value.medical_devices) {
      notifyGagal("GMDN is required");
      return;
    }
    if (value.building === "") {
      notifyGagal("Building is required");
      return;
    }
    if (value.floor === "") {
      notifyGagal("Floor is required");
      return;
    }
    if (value.room === "") {
      notifyGagal("Room is required");
      return;
    }
    const data = {
      equipments_name: value.asset_name,
      id: value.asset_id,
      model_id: value.model,
      brand_id: value.brand,
      asset_type: value.type,

      umdns_id: value.umdns,
      gmdn: value.gmdn,
      serial_number: value.serial_number,
      manufacturing_date: value.manufacturer_date,
      manufacturer_warranty_exp_date_start: value.start_date,
      manufacturer_warranty_exp_date_end: value.end_date,
      manufacturer_recomend_daily_use: value.manufacturer_recommended_daily_use,

      mobility: value.mobility_portability,
      lifetime_expectancy: value.life_expectancy,
      quantity: value.qty,

      department_id: value.department,
      building_id: value.building,
      floor_id: value.floor,
      room_id: value.room,

      technical_environmental_specification: value.environmental_specification,
      technical_list_of_accessories: value.list_of_accessories,
      technical_electrical_source_phase: value.phase,
      technical_electrical_source_volt: value.volt,
      technical_electrical_source_amp: value.amp,
      technical_electrical_source_freq: value.freq,
      technical_battery_charger_volt: value.volt_a,
      technical_battery_charger_amp: value.amp_a,
      technical_weight: value.weight,
      technical_dimension: value.dimension,
      technical_power: value.power,
      technical_material: value.material,
      technical_shelf_life: value.shelf,

      technical_datasheet: dataSheet ? dataSheet : "",

      supplier_id: value.supplier_id,
      supplier_name: value.supplier_company_name,
      supplier_address: value.supplier_address,
      supplier_contact_no: value.supplier_phone,
      supplier_contact_email: value.supplier_email,

      purchasing_order_no: value.purchase_order_no,
      purchasing_price: value.price,
      purchasing_date: value.purchase_date,
      purchasing_warranty_exp_date: value.supplier_warranty_expiration_date,
      purchasing_duration_sparepart: value.duration_for_spare,

      maintenance_provider_name: value.service_provider_company_name,
      maintenance_provider_address: value.service_provider_address,
      maintenance_provider_number: value.service_provider_number,
      maintenance_provider_email: value.service_provider_email,
      maintenance_last_maintenance_date: value.last_maintenace_date,

      safety_risk_classification: value.risk_classification,
      safety_regulatory_approval: value.regulatory_approval,
      safety_international_standard: value.international_standards,
      safety_local_standard: value.local_standards,
      safety_regulation: value.regulation,

      document_url: dataDocument ? dataDocument : [],

      hospital_contact_asset_manager_name: value.asset_manager_name,
      hospital_contact_asset_manager_id: value.asset_manager_id,
      hospital_contact_asset_manager_contact: value.asset_manager_contact_no,
      hospital_contact_pic_name: value.pic_name,
      hospital_contact_pic_id: value.pic_id,
      hospital_contact_pic_contact: value.pic_contact,

      image_url: [photo] ? [photo] : "",
    };
    HttpRequestExternal.postRegisteredAssets(data)
      .then((res) => {
        notify(res.data.message);

        setTimeout(() => {
          router.back();
        }, 1000);
      })
      .catch((err) => {
        notifyGagal(err.response.data.message);
        getGenerateID();
        // console.log("gagal send", err, err.response)
      });
  };

  const getAssetManager = useCallback(() => {
    // let data = user.user.data.data.id
    HttpRequestExternal.getAssetManager()
      .then((res) => {
        let data = res.data.data;
        setDataManager(res.data.data);

        let looping = data.map((item, index) => {
          return {
            id: item.id,
            name: item.name,
            phone_number: item.phone_number,
          };
        });

        // // console.log(JSON.stringify(looping))
        setValue("asset_manager_name", looping[0].name);
        setValue("asset_manager_id", looping[0].id);
        setValue("asset_manager_contact_no", looping[0].phone_number);

        // console.log("res asset Manager", res)
      })
      .catch((err) => {
        // console.log("err asset Manager", err)
      });
  }, [dataManager]);

  const getAssetPic = useCallback(() => {
    HttpRequestExternal.getPICID()
      .then((res) => {
        setDataPicId(res.data.data);

        let data = res.data.data;
        let looping = data.map((item, index) => {
          return {
            id: item.id,
            name: item.name,
            phone_number: item.phone_number,
          };
        });
        setValue("pic_name", looping[0].name);
        setValue("pic_id", looping[0].id);
        setValue("pic_contact", looping[0].phone_number);

        // console.log("res asset pic", res)
      })
      .catch((err) => {
        // console.log("err asset Manager", err)
      });
  }, [dataPicId]);

  const getDataModel = useCallback(() => {
    HttpRequestExternal.getAssetModel()
      .then((res) => {
        // console.log("model", res)
        let data = res.data.data;
        let looping = data.map((item, index) => {
          return {
            value: item.id,
            label: item.model_name,
          };
        });
        setDataModel(looping);
        setValue("model", "");
      })
      .catch((err) => {
        // console.log("data model err", err, err.response)
      });
  }, [dataModel]);

  const getDataBrand = useCallback(() => {
    HttpRequestExternal.getAssetBrand()
      .then((res) => {
        // console.log("brand", res)
        let data = res.data.data;
        let looping = data.map((item, index) => {
          return {
            value: item.id,
            label: item?.brand_name,
          };
        });
        setDataBrand(looping);
        setValue("brand", "");
      })
      .catch((err) => {
        // console.log("data brand err", err, err.response)
      });
  }, [dataBrand]);

  const getDepartment = useCallback(() => {
    HttpRequestExternal.getDepartment()
      .then((res) => {
        // console.log("departemen", res)
        let data = res.data.data;
        let looping = data.map((item, index) => {
          return {
            value: item.id,
            label: item.dep_name,
          };
        });
        setDataDepartement(looping);
        setValue("department", "");
      })
      .catch((err) => {
        // console.log("data department err", err, err.response)
      });
  }, [dataDepartement]);

  const getDataUMDNS = useCallback(() => {
    HttpRequestExternal.getUmdns()
      .then((res) => {
        // console.log("umdns", res)
        let data = res.data.data;
        let looping = data.map((item, index) => {
          return {
            value: item.id,
            label: item.name,
          };
        });
        setDataUMDNS(looping);
        setValue("umdns", "");
      })
      .catch((err) => {
        // console.log("data umdns errr", err, err.response)
      });
  }, [dataUmdns]);

  const getDataType = useCallback(() => {
    HttpRequestExternal.getAssetType()
      .then((res) => {
        // console.log("type", res)
        let data = res.data.data;
        let looping = data.map((item, index) => {
          return {
            value: item.id,
            label: item.type_name,
          };
        });
        setDataType(looping);
        setValue("type", "");
      })
      .catch((err) => {
        // console.log("data type errr", err, err.response)
      });
  }, [dataUmdns]);

  const getDataGMDN = useCallback(() => {
    HttpRequestExternal.getGdmn()
      .then((res) => {
        // console.log('GMDN', res.data.data)
        let data = res.data.data;
        let looping = data.map((item, index) => {
          return {
            value: item.id,
            label: item.name,
          };
        });
        setDataGMDN(looping);
        setValue("gdmn", "");
      })
      .catch((err) => {
        // console.log("data gmdn err", err, err.response)
      });
  }, [dataGmdn]);

  const getGenerateID = useCallback(() => {
    HttpRequestExternal.generateId()
      .then((res) => {
        let data = res.data;
        setGenerateID(data);
        setValue("asset_id", `${data}`);
      })
      .catch((err) => {
        // console.log("data generateid", err, err.response)
      });
  }, [generateId]);

  const getDataBuilding = useCallback(() => {
    HttpRequestExternal.getBuilding()
      .then((res) => {
        let data = res.data.data;
        let looping = data.map((item, index) => {
          return {
            value: item.id,
            label: item?.name,
          };
        });
        setDataBuilding(looping);
        setValue("building", "");
        // console.log("build", data)
      })
      .catch((err) => {
        // console.log("data building err", err, err.response)
      });
  }, [dataBuilding]);

  const getDataFloor = useCallback(() => {
    HttpRequestExternal.getFloor()
      .then((res) => {
        let data = res.data.data;
        let looping = data.map((item, index) => {
          return {
            value: item.id,
            label: item.name,
          };
        });
        setDataFloor(looping);
        // console.log("floor", data)
        setValue("floor", "");
      })
      .catch((err) => {
        // console.log("data floor err", err, err.response)
      });
  }, [dataFloor]);

  const getDataRoom = useCallback(() => {
    HttpRequestExternal.getRoom()
      .then((res) => {
        let data = res.data.data;
        let looping = data.map((item, index) => {
          return {
            value: item.id,
            label: item.room_name,
          };
        });
        setDataRoom(looping);
        // console.log("room", data)
        setValue("room", "");
      })
      .catch((err) => {
        // console.log("data room err", err, err.response)
      });
  }, [dataRoom]);

  const getDataSupplier = useCallback(() => {
    HttpRequestExternal.getSupplier()
      .then((res) => {
        // console.log("supplier", res)
        let data = res.data.data;
        let looping = data.map((item, index) => {
          return {
            value: item.id,
            label: item?.supplier_name == "" ? "-" : item?.supplier_name,
          };
        });
        setDataSupplier(looping);
        setFilterSupplier(data);
        setValue("supplier", "");
      })
      .catch((err) => {
        // console.log("data supplier err", err, err.response)
      });
  }, [dataSupplier]);

  const onChangeDataSheet = useCallback((e) => {
    let files = e.target.files;
    const allow = ["doc", "docx", "pdf"];

    let result = [];
    for (let index = 0; index < files.length; index++) {
      let test = validateExstension(allow, files[index].name);
      result.push(test);
    }

    let validate = result.some((i) => i === false);
    if (validate) {
      toast.error(
        "File tidak diterima, Extensi file yang di izinkan hanya doc, docx, dan pdf"
      );
      return false;
    }

    HttpRequestExternal.uploadStatisFile(e.target.files[0])
      .then((res) => {
        // console.log("upload file ", res)
        setDataSheet(res.data.data);
        notify("upload file");
      })
      .catch((err) => {
        // console.log("upload image err", err)
        notifyGagal(err.message);
      });
  }, []);

  const validateExstension = useCallback((arrOfExtensions, filename) => {
    let ext = filename.split(".");
    return arrOfExtensions.some(
      (i) => i.toLowerCase() === ext[ext.length - 1].toLowerCase()
    );
  });

  const onUploadDocument = useCallback((e) => {
    // // console.log(e.target.files)
    let files = e.target.files;
    const allow = ["doc", "docx", "pdf"];

    let result = [];
    for (let index = 0; index < files.length; index++) {
      let test = validateExstension(allow, files[index].name);
      result.push(test);
    }

    let validate = result.some((i) => i === false);
    if (validate) {
      toast.error(
        "File tidak diterima, Extensi file yang di izinkan hanya doc, docx, dan pdf"
      );
      return false;
    }

    HttpRequestExternal.uploadStatisFileMutiple(files)
      .then((res) => {
        // console.log("upload file ", res)
        setDocument(res.data.data);
        notify("upload file");
      })
      .catch((err) => {
        // console.log("upload image err", err)
        notifyGagal(err.message);
      });
  }, []);

  const onPhotoUpload = useCallback((e) => {
    HttpRequestExternal.uploadImage(e.target.files[0])
      .then((res) => {
        // console.log("upload file ", res)
        notify("upload file");
        setPhoto(res.data.data);
      })
      .catch((err) => {
        // console.log("upload image err", err)
        notifyGagal(err.message);
      });
  }, []);

  const filterSupplier = useCallback(
    (value) => {
      let id = value;
      let data = dataFilterSupplier.filter((item) => {
        if (item.id === id) {
          return item;
        }
      });
      setValue("supplier_address", data[0].address);
      setValue("supplier_phone", data[0].contact_no);
      setValue("supplier_email", data[0].contact_email);
      // console.log("ini adlah", data)
    },
    [dataFilterSupplier]
  );

  const parseToNumber = (value) => {
    let ch = value?.replace(/[^0-9]+/g, "");
    if (!ch) {
      toast.error("Please enter only number");
    } else {
      return ch;
    }
  };

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

  return (
    <div className="px-3 sm:px-6">
      <Link href={`/registration`}>
        <a className="inline-block mb-4 font-semibold text-primary-600 hover:underline">
          Back to Registration List
        </a>
      </Link>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Register Asset
        </h1>
      </div>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col space-y-4 lg:space-x-6 md:space-y-0 lg:flex-row">
            <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-900">
              <div className="flex flex-row">
                <div className="flex items-center w-auto">
                  <div className="p-3 border border-black rounded-sm ">
                    <QRCode
                      value={generateId}
                      //logoImage="/ptpi/mini-logo.jpg"
                      logoWidth={40}
                      size={100}
                    />
                  </div>
                </div>

                <div className="flex-1 block ml-3">
                  <div className="hidden lg:block">
                    <div className="grid gap-2 lg:grid-cols-4">
                      <div className="grid gap-3 lg:col-span-2">
                        <div className="lg:col-span-2">
                          <label className="md:text-sm whitespace-nowrap">
                            Asset Name:{" "}
                          </label>
                          <div className="mt-1">
                            <Input
                              id="asset_name"
                              errorMessage={errors?.asset_name?.message}
                              {...register("asset_name", {
                                required: "required field",
                                onChange: (e) =>
                                  setValue("asset_name", e.target.value),
                              })}
                            />
                          </div>
                        </div>
                        <div className="lg:col-span-2">
                          <label
                            className="md:text-sm whitespace-nowrap"
                            htmlFor="brand"
                          >
                            brand:{" "}
                          </label>
                          <div className="mt-1">
                            <Select
                              id="brand"
                              styles={customStyles}
                              menuColor="black"
                              isReq={true}
                              onChange={(i) => {
                                setValue("brand", i.value);
                              }}
                              options={dataBrand}
                              placeholder="Select Brand"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="grid gap-3 lg:col-span-2">
                        <div>
                          <label
                            className="md:text-sm whitespace-nowrap"
                            htmlFor="model"
                          >
                            Model :{" "}
                          </label>
                          <div className="mt-1">
                            <Select
                              id="model"
                              styles={customStyles}
                              menuColor="black"
                              options={dataModel}
                              onChange={(event) => {
                                setValue("model", event.value);
                              }}
                              placeholder="Select Model"
                            />
                          </div>
                        </div>
                        <div>
                          <label
                            className="md:text-sm whitespace-nowrap"
                            htmlFor="type"
                          >
                            Type :
                          </label>
                          <div className="mt-1">
                            <Select
                              id="type"
                              styles={customStyles}
                              menuColor="black"
                              onChange={(i) => {
                                setValue("type", i.value);
                              }}
                              options={dataType}
                              placeholder="Select Type"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:block xl:hidden lg:hidden md:mt-5">
                <div className="flex flex-1">
                  <div className="grid w-full grid-flow-row auto-rows-max">
                    <div className="grid grid-rows-2 gap-5 sm:grid-cols-2">
                      <div>
                        <label className="whitespace-nowrap">
                          Asset Name :{" "}
                        </label>
                        <div className="mt-1">
                          {/* <Input
                                                        onChange={(event) => {
                                                            setValue("name", event.target.value)
                                                        }}
                                                    /> */}
                          <Input
                            id="asset_name"
                            errorMessage={errors?.asset_name?.message}
                            {...register("asset_name", {
                              required: "required field",
                              onChange: (e) =>
                                setValue("asset_name", e.target.value),
                            })}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="whitespace-nowrap" htmlFor="model">
                          Model :{" "}
                        </label>
                        <div className="mt-1">
                          <Select
                            id="model"
                            styles={customStyles}
                            menuColor="black"
                            onChange={(i) => {
                              setValue("model", i.value);
                            }}
                            options={dataModel}
                            placeholder="Select Model"
                          />
                        </div>
                      </div>
                      <div className="lg:col-span-2">
                        <label className="whitespace-nowrap" htmlFor="brand">
                          brand :{" "}
                        </label>
                        <div className="mt-1">
                          <Select
                            id="brand"
                            styles={customStyles}
                            menuColor="black"
                            onChange={(i) => {
                              setValue("brand", i.value);
                            }}
                            options={dataBrand}
                            placeholder="Select Brand"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="whitespace-nowrap" htmlFor="type">
                          Type :
                        </label>
                        <div className="mt-1">
                          <Select
                            id="type"
                            styles={customStyles}
                            menuColor="black"
                            onChange={(i) => {
                              setValue("type", i.value);
                            }}
                            options={dataType}
                            placeholder="Select Type"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-flow-row auto-rows-max">
                <div className="grid grid-flow-row-dense gap-5 py-3 sm:grid-cols-3 xl:grid-cols-3">
                  <div className="flex flex-col">
                    <label className="whitespace-nowrap" htmlFor="umdns">
                      Medical Devices :{" "}
                    </label>
                    <div className="mt-1">
                      <Select
                        id="medical_devices"
                        styles={customStyles}
                        menuColor="black"
                        onChange={(i) => {
                          setValue("medical_devices", i.value);
                        }}
                        options={[
                          {
                            value: true,
                            label: 'Yes',
                          },
                          {
                            value: false,
                            label: 'No',
                          },
                        ]}
                        placeholder="Select"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className="whitespace-nowrap" htmlFor="umdns">
                      UMDNS :{" "}
                    </label>
                    <div className="mt-1">
                      <Select
                        id="umdns"
                        styles={customStyles}
                        menuColor="black"
                        onChange={(i) => {
                          setValue("umdns", i.value);
                        }}
                        options={dataUmdns}
                        placeholder="Select Umdns"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className="whitespace-nowrap" htmlFor="gmdn">
                      GMDN :{" "}
                    </label>
                    <div className="mt-1">
                      <Select
                        id="gmdn"
                        styles={customStyles}
                        menuColor="black"
                        onChange={(i) => {
                          setValue("gmdn", i.value);
                        }}
                        options={dataGmdn}
                        placeholder="Select Gmdn"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label
                      className="whitespace-nowrap"
                      htmlFor="serial_number"
                    >
                      Serial Number :{" "}
                    </label>
                    <div className="mt-1">
                      <Input
                        id="serial_number"
                        errorMessage={errors?.serial_number?.message}
                        {...register("serial_number", {
                          required: "required field",
                        })}
                      />
                    </div>
                  </div>
                </div>
                {/* <div className="grid grid-cols-4"> */}
                <div className="grid gap-2 sm:grid-cols-4 lg:grid-cols-4">
                  <div className="grid grid-rows-2">
                    <label className="text-xs" htmlFor="manufacturer_date">
                      Manufacturer Date :{" "}
                    </label>
                    <div>
                      <Input
                        id="manufacturer_date"
                        type="date"
                        defaultValue={moment().format("YYYY-MM-DD")}
                        errorMessage={errors?.manufacturer_date?.message}
                        {...register("manufacturer_date", {
                          required: "required field",
                        })}
                      />
                    </div>
                  </div>
                  <div className="grid col-span-2 sm:grid-cols-1">
                    <label
                      className="text-sm whitespace-nowrap"
                      htmlFor="manufacturer"
                    >
                      Manufacturer Warranty Expiration Date:{" "}
                    </label>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2 lg:row-span-2">
                      <div>
                        <label
                          className="text-sm sm:truncate xl:mb-4 md:mb-6 lg:mb-8 whitespace-nowrap"
                          htmlFor="start_date"
                        >
                          Start :{" "}
                        </label>
                        <Input
                          id="start_date"
                          type="date"
                          defaultValue={moment().format("YYYY-MM-DD")}
                          errorMessage={errors?.start_date?.message}
                          {...register("start_date", {
                            required: "required field",
                            onChange: (e) => {
                              setLimitEndDate(e.target.value);
                              setValue("start_date", e.target.value);
                            },
                          })}
                        />
                      </div>
                      <div>
                        <label
                          className="text-sm sm:truncate xl:mb-4 md:mb-5 lg:mb-8 whitespace-nowrap"
                          htmlFor="end_date"
                        >
                          End :{" "}
                        </label>
                        <Input
                          id="end_date"
                          type="date"
                          min={limitEndDate}
                          defaultValue={moment().format("YYYY-MM-DD")}
                          errorMessage={errors?.end_date?.message}
                          {...register("end_date", {
                            required: "required field",
                          })}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-rows-2">
                    <label
                      className="text-xs"
                      htmlFor="manufacturer_recommended_daily_use"
                    >
                      Manufacturer Recommended Daily Use (Hours):
                    </label>
                    <div>
                      <Input
                        id="manufacturer_recommended_daily_use"
                        type="text"
                        errorMessage={
                          errors?.manufacturer_recommended_daily_use?.message
                        }
                        {...register("manufacturer_recommended_daily_use", {
                          required: "required field",
                          onChange: (e) => {
                            setValue(
                              "manufacturer_recommended_daily_use",
                              parseToNumber(e.target?.value)
                            );
                          },
                        })}
                      />
                    </div>
                  </div>
                </div>
                {/* </div> */}
                <div className="grid grid-flow-row py-3 auto-rows-max sm:grid-cols-2 lg:grid-cols-3">
                  <div className="flex flex-col mr-3">
                    <label htmlFor="mobility_portability">
                      Mobility, Portability :{" "}
                    </label>
                    <Input
                      id="mobility_portability"
                      errorMessage={errors?.mobility_portability?.message}
                      {...register("mobility_portability", {
                        required: "required field",
                      })}
                    />
                  </div>
                  <div className="flex flex-col mr-3">
                    <label htmlFor="life_expectancy">Life expectancy : </label>
                    <Input
                      id="life_expectancy"
                      errorMessage={errors?.life_expectancy?.message}
                      {...register("life_expectancy", {
                        required: "required field",
                      })}
                    />
                  </div>
                  <div className="flex flex-col mr-3">
                    <label htmlFor="qty">Quantity : </label>
                    <Input
                      id="qty"
                      type="text"
                      errorMessage={errors?.qty?.message}
                      {...register("qty", {
                        required: "required field",
                        onChange: (e) => {
                          setValue("qty", parseToNumber(e.target.value));
                        },
                      })}
                    />
                  </div>
                </div>
                <h3 className="py-2 text-xl font-bold">Asset Location</h3>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="flex flex-col">
                    <label htmlFor="department">Department : </label>
                    <div className="mt-2">
                      <Select
                        id="department"
                        styles={customStyles}
                        menuColor="black"
                        onChange={(i) => {
                          setValue("department", i.value);
                        }}
                        options={dataDepartement}
                        placeholder="Select Department"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="building">Building : </label>
                    <div className="mt-2">
                      <Select
                        id="building"
                        styles={customStyles}
                        menuColor="black"
                        onChange={(i) => {
                          setValue("building", i.value);
                        }}
                        options={dataBuilding}
                        placeholder="Select Building"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="floor">Floor : </label>
                    <div className="mt-2">
                      <Select
                        id="floor"
                        styles={customStyles}
                        menuColor="black"
                        onChange={(i) => {
                          setValue("floor", i.value);
                        }}
                        options={dataFloor}
                        placeholder="Select Floor"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="room">Room : </label>
                    <div className="mt-2">
                      <Select
                        id="room"
                        styles={customStyles}
                        menuColor="black"
                        onChange={(i) => {
                          setValue("room", i.value);
                        }}
                        options={dataRoom}
                        placeholder="Select Room"
                      />
                    </div>
                  </div>
                </div>
                <h3 className="py-4 text-xl font-bold">
                  Technical Characteristic
                </h3>
                <div className="flex sm:flex-row">
                  <div className="grid grid-flow-row-dense gap-5 py-2 md:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="flex flex-col">
                      <label htmlFor="environmental_specification">
                        Environmental Specification :{" "}
                      </label>
                      <div className="mt-5">
                        <Input
                          id="environmental_specification"
                          errorMessage={
                            errors?.environmental_specification?.message
                          }
                          {...register("environmental_specification", {
                            required: "required field",
                          })}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="list_of_accessories">
                        List of Accessories :{" "}
                      </label>
                      <div className="mt-5">
                        <Input
                          id="list_of_accessories"
                          errorMessage={errors?.list_of_accessories?.message}
                          {...register("list_of_accessories", {
                            required: "required field",
                          })}
                        />
                      </div>
                    </div>
                    <div className="flex md:flex-col xl:flex-col">
                      <h2 className="text-sm md:mb-2">
                        Electrical Source Requirement:{" "}
                      </h2>
                      <div className="grid grid-flow-row-dense gap-2 md:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="flex flex-col">
                          <label className="md:text-xs" htmlFor="phase">
                            Phase :
                          </label>
                          <Input
                            id="phase"
                            type="text"
                            errorMessage={errors?.phase?.message}
                            {...register("phase", {
                              required: "required field",
                              onChange: (e) => {
                                setValue(
                                  "phase",
                                  parseToNumber(e.target.value)
                                );
                              },
                            })}
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="md:text-xs" htmlFor="volt">
                            Volt :
                          </label>
                          <Input
                            id="volt"
                            type="text"
                            errorMessage={errors?.volt?.message}
                            {...register("volt", {
                              required: "required field",
                              onChange: (e) => {
                                setValue("volt", parseToNumber(e.target.value));
                              },
                            })}
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="md:text-xs" htmlFor="amp">
                            Amp(A):
                          </label>
                          <Input
                            id="amp"
                            type="text"
                            errorMessage={errors?.amp?.message}
                            {...register("amp", {
                              required: "required field",
                              onChange: (e) => {
                                setValue("amp", parseToNumber(e.target.value));
                              },
                            })}
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="md:text-xs" htmlFor="freq">
                            Freq(Hz):
                          </label>
                          <Input
                            id="freq"
                            type="text"
                            errorMessage={errors?.freq?.message}
                            {...register("freq", {
                              required: "required field",
                              onChange: (e) => {
                                setValue("freq", parseToNumber(e.target.value));
                              },
                            })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid gap-3 py-3 md:grid-cols-3 sm:grid-cols-1 xl:grid-cols-7">
                  <div className="grid xl:col-span-2">
                    <h2 className="text-sm">
                      Battery Charger Characteristics:
                    </h2>
                    <div className="grid grid-cols-2 gap-3 py-2">
                      <div className="flex flex-col">
                        <label className="text-sm md:mt-2" htmlFor="volt_a">
                          Volt:{" "}
                        </label>
                        <Input
                          id="volt_a"
                          type="text"
                          errorMessage={errors?.volt_a?.message}
                          {...register("volt_a", {
                            required: "required field",
                            onChange: (e) => {
                              setValue("volt_a", parseToNumber(e.target.value));
                            },
                          })}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm md:mt-2" htmlFor="amp_a">
                          Amp (A) :
                        </label>
                        <Input
                          id="amp_a"
                          type="text"
                          errorMessage={errors?.amp_a?.message}
                          {...register("amp_a", {
                            required: "required field",
                            onChange: (e) => {
                              setValue("amp_a", parseToNumber(e.target.value));
                            },
                          })}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className="md:truncate md:text-sm" htmlFor="weight">
                      Weight (KG):{" "}
                    </label>
                    <div className="sm:mt-15 md:mt-9 lg:mt-8">
                      <Input
                        id="weight"
                        type="text"
                        errorMessage={errors?.weight?.message}
                        {...register("weight", {
                          required: "required field",
                          onChange: (e) => {
                            setValue("weight", parseToNumber(e.target.value));
                          },
                        })}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label
                      className="md:truncate md:text-sm"
                      htmlFor="dimension"
                    >
                      Dimension (W x H x L) (mm):{" "}
                    </label>
                    <div className="sm:mt-15 md:mt-9 lg:mt-8">
                      <Input
                        id="dimension"
                        type="text"
                        errorMessage={errors?.dimension?.message}
                        {...register("dimension", {
                          required: "required field",
                          onChange: (e) => {
                            setValue("dimension", e.target.value);
                          },
                        })}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className="md:truncate md:text-sm" htmlFor="power">
                      Power (Watt):{" "}
                    </label>
                    <div className="sm:mt-15 md:mt-4 lg:mt-8">
                      <Input
                        id="power"
                        type="text"
                        errorMessage={errors?.power?.message}
                        {...register("power", {
                          required: "required field",
                          onChange: (e) => {
                            setValue("power", parseToNumber(e.target.value));
                          },
                        })}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label
                      className="md:truncate md:text-sm"
                      htmlFor="material"
                    >
                      Material:{" "}
                    </label>
                    <div className="sm:mt-15 md:mt-4 lg:mt-8">
                      <Input
                        id="material"
                        errorMessage={errors?.material?.message}
                        {...register("material", {
                          required: "required field",
                        })}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className="md:truncate md:text-sm" htmlFor="shelf">
                      Shelf Life (Year):{" "}
                    </label>
                    <div className="sm:mt-15 md:mt-4 lg:mt-8">
                      <Input
                        id="shelf"
                        type="text"
                        errorMessage={errors?.shelf?.message}
                        {...register("shelf", {
                          required: "required field",
                          onChange: (e) => {
                            setValue("shelf", parseToNumber(e.target.value));
                          },
                        })}
                      />
                    </div>
                  </div>
                </div>

                <h3 className="py-2 text-xl font-bold">Datasheet : </h3>
                <div className="flex sm:flex-row lg:flex-row">
                  {/* <FaDochub /> */}
                  <div className="flex flex-col mr-3">
                    <Input
                      id="identity-card-image"
                      type="file"
                      accept=".doc, .docx, .pdf"
                      onChange={onChangeDataSheet}
                    />
                    {dataSheet && (
                      <div className="flex flex-row flex-1">
                        <div className="flex flex-row justify-center px-4 py-2 mt-2 rounded-lg bg-primary-600">
                          <a
                            target={"_blank"}
                            href={`${process.env.NEXT_PUBLIC_API_ASSET_URL}/${dataSheet}`}
                          >
                            {dataSheet}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <h3 className="py-3 text-xl font-bold">Supplier Information</h3>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="flex flex-col mt-2 mr-3">
                    <label className="text-sm" htmlFor="supplier_company_name">
                      Supplier Company Name:{" "}
                    </label>
                    <div className="mt-4">
                      <Select
                        id="supplier_company_name"
                        styles={customStyles}
                        menuColor="black"
                        onChange={(i) => {
                          setValue("supplier_company_name", i.label);
                          setValue("supplier_id", i.value);
                          filterSupplier(i.value);
                        }}
                        options={dataSupplier}
                        placeholder="Select Supplier Name"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col mt-2 mr-3">
                    <label className="text-sm" htmlFor="supplier_address">
                      Supplier Address:{" "}
                    </label>
                    <div className="mt-4">
                      <Input
                        disabled
                        id="supplier_address"
                        errorMessage={errors?.supplier_address?.message}
                        {...register("supplier_address", {
                          required: "required field",
                        })}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col mt-2 mr-3">
                    <label className="text-sm" htmlFor="supplier_phone">
                      Supplier Phone/ Fax:{" "}
                    </label>
                    <div className="mt-4">
                      <Input
                        disabled
                        id="supplier_phone"
                        errorMessage={errors?.supplier_phone?.message}
                        {...register("supplier_phone", {
                          required: "required field",
                        })}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col mt-2 mr-3">
                    <label className="text-sm" htmlFor="supplier_email">
                      Supplier Email:{" "}
                    </label>
                    <div className="mt-4">
                      <Input
                        disabled
                        id="supplier_email"
                        errorMessage={errors?.supplier_email?.message}
                        {...register("supplier_email", {
                          required: "required field",
                        })}
                      />
                    </div>
                  </div>
                </div>

                <h3 className="py-3 text-xl font-bold">
                  Purchasing Information
                </h3>
                <div className="grid gap-5 sm:grid-cols-1 lg:grid-cols-3 grid-row-2">
                  <div className="flex flex-col mr-3">
                    <label htmlFor="purchase_order_no">
                      Supplier Purchase Order No:{" "}
                    </label>
                    <Input
                      id="purchase_order_no"
                      errorMessage={errors?.purchase_order_no?.message}
                      {...register("purchase_order_no", {
                        required: "required field",
                      })}
                    />
                  </div>
                  <div className="flex flex-col mr-3">
                    <label htmlFor="price">Price: </label>
                    <Input
                      id="price"
                      type="text"
                      errorMessage={errors?.price?.message}
                      {...register("price", {
                        required: "required field",
                        onChange: (e) => {
                          setValue("price", parseToNumber(e.target.value));
                        },
                      })}
                    />
                  </div>
                  <div className="flex flex-col mr-3">
                    <label className="sm:truncate" htmlFor="purchase_date">
                      Purchase Date :{" "}
                    </label>
                    <Input
                      id="purchase_date"
                      type="date"
                      defaultValue={moment().format("YYYY-MM-DD")}
                      errorMessage={errors?.purchase_date?.message}
                      {...register("purchase_date", {
                        required: "required field",
                      })}
                    />
                  </div>
                  <div className="flex flex-col mr-3">
                    <label
                      className="sm:truncate"
                      htmlFor="supplier_warranty_expiration_date"
                    >
                      Supplier Warranty Expiration Date :{" "}
                    </label>
                    <Input
                      id="supplier_warranty_expiration_date"
                      type="date"
                      defaultValue={moment().format("YYYY-MM-DD")}
                      errorMessage={
                        errors?.supplier_warranty_expiration_date?.message
                      }
                      {...register("supplier_warranty_expiration_date", {
                        required: "required field",
                      })}
                    />
                  </div>
                  <div className="flex flex-col mr-3">
                    <label className="sm:truncate" htmlFor="duration_for_spare">
                      Duration for spare part availibility (Year) :{" "}
                    </label>
                    <Input
                      id="duration_for_spare"
                      type="text"
                      errorMessage={errors?.duration_for_spare?.message}
                      {...register("duration_for_spare", {
                        required: "required field",
                        onChange: (e) => {
                          setValue(
                            "duration_for_spare",
                            parseToNumber(e.target.value)
                          );
                        },
                      })}
                    />
                  </div>
                </div>

                <h3 className="py-3 text-xl font-bold">
                  Maintenance Information
                </h3>
                <div className="grid grid-flow-row-dense grid-rows-2 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="flex flex-col mr-3">
                    <label htmlFor="service_provider_company_name">
                      Service Provider Company Name:{" "}
                    </label>
                    <Input
                      id="service_provider_company_name"
                      errorMessage={
                        errors?.service_provider_company_name?.message
                      }
                      {...register("service_provider_company_name", {
                        required: "required field",
                      })}
                    />
                  </div>
                  <div className="flex flex-col mr-3">
                    <label htmlFor="service_provider_address">
                      Service Provider Address:{" "}
                    </label>
                    <Input
                      id="service_provider_address"
                      errorMessage={errors?.service_provider_address?.message}
                      {...register("service_provider_address", {
                        required: "required field",
                      })}
                    />
                  </div>
                  <div className="flex flex-col mr-3">
                    <label htmlFor="service_provider_number">
                      Service Provider number:{" "}
                    </label>
                    <Input
                      id="service_provider_number"
                      errorMessage={errors?.service_provider_number?.message}
                      {...register("service_provider_number", {
                        required: "required field",
                      })}
                    />
                  </div>
                  <div className="flex flex-col mr-3">
                    <label htmlFor="service_provider_email">
                      Service Provider Email:{" "}
                    </label>
                    <Input
                      id="service_provider_email"
                      errorMessage={errors?.service_provider_email?.message}
                      {...register("service_provider_email", {
                        required: "required field",
                      })}
                    />
                  </div>
                  <div className="flex flex-col mr-3 col-h2-2">
                    <label
                      className="sm:truncate"
                      htmlFor="last_maintenace_date"
                    >
                      Last Maintenace Date:{" "}
                    </label>
                    <Input
                      id="last_maintenace_date"
                      type="date"
                      defaultValue={moment().format("YYYY-MM-DD")}
                      errorMessage={errors?.last_maintenace_date?.message}
                      {...register("last_maintenace_date", {
                        required: "required field",
                      })}
                    />
                  </div>
                </div>
                <h3 className="py-3 text-xl font-bold">Safety and Standards</h3>
                <div className="grid grid-flow-row-dense grid-rows-2 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="flex flex-col mr-3">
                    <label htmlFor="risk_classification">
                      Risk Classification:{" "}
                    </label>
                    <Input
                      id="risk_classification"
                      errorMessage={errors?.risk_classification?.message}
                      {...register("risk_classification", {
                        required: "required field",
                      })}
                    />
                  </div>
                  <div className="flex flex-col mr-3">
                    <label htmlFor="regulatory_approval">
                      Regulatory Approval:{" "}
                    </label>
                    <Input
                      id="regulatory_approval"
                      errorMessage={errors?.regulatory_approval?.message}
                      {...register("regulatory_approval", {
                        required: "required field",
                      })}
                    />
                  </div>
                  <div className="flex flex-col mr-3">
                    <label htmlFor="international_standards">
                      International Standards:{" "}
                    </label>
                    <Input
                      id="international_standards"
                      errorMessage={errors?.international_standards?.message}
                      {...register("international_standards", {
                        required: "required field",
                      })}
                    />
                  </div>
                  <div className="flex flex-col mr-3">
                    <label htmlFor="local_standards">Local Standards: </label>
                    <Input
                      id="local_standards"
                      errorMessage={errors?.local_standards?.message}
                      {...register("local_standards", {
                        required: "required field",
                      })}
                    />
                  </div>
                  <div className="flex flex-col mr-3">
                    <label htmlFor="regulation">Regulation: </label>
                    <Input
                      id="regulation"
                      errorMessage={errors?.regulation?.message}
                      {...register("regulation", {
                        required: "required field",
                      })}
                    />
                  </div>
                </div>
                <h3 className="py-3 text-xl font-bold">Documentation</h3>
                <p className="py-2">
                  Upload related documents of the asset (e.g service manual,
                  operation manual, routine maintenance manual, disposal
                  procedure etc):
                </p>
                <div>
                  <Input
                    id="photo-image-document"
                    type="file"
                    multiple={true}
                    accept=".doc, .docx, .pdf"
                    onChange={onUploadDocument}
                  />
                  <div className="">
                    {dataDocument.length >= 1 &&
                      dataDocument?.map((item, img) => {
                        let extension = item.split(".")[1] ?? ".pdf";
                        let allowImage = ["png", "jpeg", "jpg"];
                        let allowDoc = ["pdf", "doc", "docx"];
                        return (
                          <div key={img} className="flex flex-row flex-1">
                            <div className="flex flex-row justify-center px-4 py-2 mt-2 rounded-lg bg-primary-600">
                              {allowDoc.some((i) => i === extension) && (
                                <a
                                  target={"_blank"}
                                  href={`${process.env.NEXT_PUBLIC_API_ASSET_URL}/${item}`}
                                >
                                  {item}
                                </a>
                              )}
                              {allowImage.some((i) => i === extension) && (
                                <img
                                  className="object-cover w-40 aspect-video"
                                  src={Photo.get(item)}
                                  alt="preview document"
                                />
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
                <h3 className="py-2 text-xl font-bold">
                  Hospital Asset Contact Person:
                </h3>
                <div className="grid grid-flow-row gap-5 sm:grid-cols-4 auto-rows-max ">
                  <div className="flex flex-col">
                    <label className="sm:truncate" htmlFor="asset_manager_name">
                      Asset Manager Name:{" "}
                    </label>
                    <MySelect
                      id="asset_manager_name"
                      errorMessage={errors?.asset_manager_name?.message}
                      {...register("asset_manager_name", {
                        required: "required field",
                        onChange: (e) => {
                          let selected = dataManager.find(
                            (i) => i.name === e.target.value
                          );
                          setValue("asset_manager_id", selected?.id);
                          setValue("asset_manager_name", selected?.name);
                          setValue(
                            "asset_manager_contact_no",
                            selected?.phone_number
                          );
                        },
                      })}
                    >
                      {dataManager.map((item, model) => {
                        return (
                          <option key={model} value={item.name}>
                            {item.name}
                          </option>
                        );
                      })}
                    </MySelect>
                  </div>
                  <div className="flex flex-col">
                    <label
                      className="sm:truncate"
                      htmlFor="asset_manager_contact_no"
                    >
                      Asset Manager Contact No:{" "}
                    </label>
                    <Input
                      disabled
                      id="asset_manager_contact_no"
                      errorMessage={errors?.asset_manager_contact_no?.message}
                      {...register("asset_manager_contact_no", {
                        required: "required field",
                      })}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="sm:truncate" htmlFor="pic_name">
                      PIC Name:{" "}
                    </label>
                    <MySelect
                      id="pic_name"
                      errorMessage={errors?.pic_name?.message}
                      {...register("pic_name", {
                        required: "required field",
                        onChange: (e) => {
                          let selected = dataPicId.find(
                            (i) => i.name === e.target.value
                          );
                          setValue("pic_id", selected?.id);
                          setValue("pic_name", selected?.name);
                          setValue("pic_contact", selected?.phone_number);
                        },
                      })}
                    >
                      {dataPicId.map((item, model) => {
                        return (
                          <option key={model} value={item.name}>
                            {item.name}
                          </option>
                        );
                      })}
                    </MySelect>
                  </div>
                  <div className="flex flex-col">
                    <label className="sm:truncate" htmlFor="pic_contact">
                      PIC Contact No:{" "}
                    </label>
                    <Input
                      disabled
                      id="pic_contact"
                      errorMessage={errors?.pic_contact?.message}
                      {...register("pic_contact", {
                        required: "required field",
                      })}
                    />
                  </div>
                </div>
                <h2 className="py-2 text-xl font-bold">Photo: </h2>
                <div>
                  <Input
                    id="photo-image"
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={onPhotoUpload}
                  />
                  {photo && (
                    <img
                      className="object-cover w-40 aspect-video"
                      src={Photo.get(photo)}
                      alt="preview document"
                    />
                  )}
                </div>
                <div className="flex flex-row">
                  <div className="flex flex-1"></div>
                  <Button
                    type="submit"
                    isLoading={isSubmitting}
                    // disabledd={!confirmIdentity || !confirmSignature}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default App;
