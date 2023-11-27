import Link from "next/link";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { HttpRequestExternal } from "../../utils/http";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import { QRCode } from "react-qrcode-logo";
import { IoCloseOutline } from "react-icons/io5";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import MySelect from "../../components/MySelect";
import Select from "react-select";
import moment from "moment";
import Photo from "../../utils/Photo";
import { store } from "../../store";
import toast, { Toaster } from "react-hot-toast";

const notifyDel = () => toast.success("Successfully Delete!");
const notifyDelDel = () => toast.error("Failed Delete!");

const notify = (a) => toast.success("Successfully! " + a);
const notifyGagal = (a) => toast.error("Failed! " + a);

export default function App(props) {
  const router = useRouter();
  const [detail, setDetail] = useState(null);
  const [limitEndDate, setLimitEndDate] = useState(
    moment().format("YYYY-MM-DD")
  );
  const [dataModel, setDataModel] = useState([]);
  const [dataBrand, setDataBrand] = useState([]);
  const [dataDepartement, setDataDepartement] = useState([]);
  const [dataUmdns, setDataUMDNS] = useState([]);
  const [dataType, setDataType] = useState([]);
  const [dataGmdn, setDataGMDN] = useState([]);
  const [dataBuilding, setDataBuilding] = useState([]);
  const [dataFloor, setDataFloor] = useState([]);
  const [dataRoom, setDataRoom] = useState([]);
  const [dataSheet, setDataSheet] = useState("");
  const [dataDocument, setDocument] = useState([]);
  const [photo, setPhoto] = useState("");
  const [isEdit, setEdit] = useState(true);
  const [getImageDocument, setImageDocument] = useState([]);
  const [getAllImageDocument, setGetAllImageDocument] = useState([]);

  const [dataManager, setDataManager] = useState([]);
  const [dataPicId, setDataPicId] = useState([]);
  const [dataSupplier, setDataSupplier] = useState([]);
  const [dataFilterSupplier, setFilterSupplier] = useState([]);
  const [defModel, setDefModel] = useState([]);
  const [defFloor, setDefFloor] = useState([]);
  const [defBrand, setDefBrand] = useState([]);
  const [defDepart, setDefDepart] = useState([]);
  const [defType, setDefType] = useState([]);
  const [defGmdn, setDefGmdn] = useState([]);
  const [defBuilding, setDefBuilding] = useState([]);
  const [defRoom, setDefRoom] = useState([]);
  const [defUmdns, setDefUmdns] = useState([]);
  const [defSupplier, setDefSupplier] = useState([]);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);

  const parseToNumber = (value) => {
    let ch = value?.replace(/[^0-9]+/g, "");
    if (!ch) {
      toast.error("Please enter only number");
    } else {
      return ch;
    }
  };

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm();

  const getDetail = useCallback(() => {
    HttpRequestExternal.getDetailRegestrationDetail(router.query.id)
      .then((res) => {
        setDetail(res.data.data);
        let data = res.data.data;
        setValue("asset_name", data?.equipments_name);
        setValue("serial_number", data?.serial_number);
        setValue(
          "manufacturer_date",
          moment(data?.manufacturer_date).format("YYYY-MM-DD")
        );
        setValue(
          "start_date",
          moment(data?.manufacturer_warranty_exp_date_start).format(
            "YYYY-MM-DD"
          )
        );
        setValue(
          "end_date",
          moment(data?.manufacturer_warranty_exp_date_end).format("YYYY-MM-DD")
        );
        setValue(
          "manufacturer_recommended_daily_use",
          data?.manufacturer_recomend_daily_use
        );
        setValue("mobility_portability", data?.mobility);
        setValue("life_expectancy", data?.lifetime_expectancy);
        setValue("qty", data?.quantity);
        setValue(
          "environmental_specification",
          data?.data_technical?.environmental_specification
        );
        setValue(
          "list_of_accessories",
          data?.data_technical?.list_of_accessories
        );
        setValue("phase", data?.data_technical?.electrical_source_phase);
        setValue("volt", data?.data_technical?.electrical_source_volt);
        setValue("amp", data?.data_technical?.electrical_source_amp);
        setValue("freq", data?.data_technical?.electrical_source_freq);
        setValue("volt_a", data?.data_technical?.battery_charger_volt);
        setValue("amp_a", data?.data_technical?.battery_charger_amp);
        setValue("weight", data?.data_technical?.weight);
        setValue("dimension", data?.data_technical?.dimension);
        setValue("power", data?.data_technical?.power);
        setValue("material", data?.data_technical?.material);
        setValue("shelf", data?.data_technical?.shelf_life);

        setValue("model", data?.data_model?.id);
        let valModel = [];
        valModel.push({
          value: data?.data_model?.id,
          label: data?.data_model?.model_name,
        });
        setDefModel(valModel);

        setValue("floor", data?.data_floor?.id);
        let valFloor = [];
        valFloor.push({
          value: data?.data_floor?.id,
          label: data?.data_floor?.name,
        });
        setDefFloor(valFloor);

        setValue("brand", data?.data_brand?.id);
        let valBrand = [];
        valBrand.push({
          value: data?.data_brand?.id,
          label: data?.data_brand?.brand_name,
        });
        setDefBrand(valBrand);

        setValue("department", data?.data_department?.id);
        let valDepart = [];
        valDepart.push({
          value: data?.data_department?.id,
          label: data?.data_department?.dep_name,
        });
        setDefDepart(valDepart);

        setValue("umdns", data?.data_umdns?.id);
        let valUmdns = [];
        valUmdns.push({
          value: data?.data_umdns?.id,
          label: data?.data_umdns?.name,
        });
        setDefUmdns(valUmdns);

        setValue("building", data?.data_building?.id);
        let valBuilding = [];
        valBuilding.push({
          value: data?.data_building?.id,
          label: data?.data_building?.name,
        });
        setDefBuilding(valBuilding);

        setValue("room", data?.data_room?.id);
        let valRoom = [];
        valRoom.push({
          value: data?.data_room?.id,
          label: data?.data_room?.room_name,
        });
        setDefRoom(valRoom);

        setValue("type", data?.data_type?.id);
        let valType = [];
        valType.push({
          value: data?.data_type?.id,
          label: data?.data_type?.type_name,
        });
        setDefType(valType);

        setValue("gmdn", data?.data_gmdn?.id);
        let valGmdn = [];
        valGmdn.push({
          value: data?.data_gmdn?.id,
          label: data?.data_gmdn?.name,
        });
        setDefGmdn(valGmdn);

        setValue("asset_id", data?.id);
        setValue("qty", data?.quantity);
        setValue("supplier_id", data?.data_supplier?.id);
        let valSupplier = [];
        valSupplier.push({
          value: data?.data_supplier?.id,
          label: data?.data_supplier?.supplier_name,
        });
        setDefSupplier(valSupplier);

        setValue(
          "supplier_company_name",
          data?.data_supplier?.supplier_company_name
        );
        setValue("supplier_address", data?.data_supplier?.address);
        setValue("supplier_phone", data?.data_supplier?.contact_no);
        setValue("supplier_email", data?.data_supplier?.contact_email);

        setValue("purchase_order_no", data?.data_purchasing?.order_no);
        setValue("price", data?.data_purchasing?.price);
        setValue(
          "purchase_date",
          moment(data?.data_purchasing?.date).format("YYYY-MM-DD")
        );
        setValue(
          "supplier_warranty_expiration_date",
          moment(data?.data_purchasing?.warranty_exp_date).format("YYYY-MM-DD")
        );
        setValue(
          "duration_for_spare",
          data?.data_purchasing?.duration_sparepart
        );

        setValue(
          "service_provider_company_name",
          data?.data_maintenance?.provider_name
        );
        setValue(
          "service_provider_address",
          data?.data_maintenance?.provider_address
        );
        setValue(
          "service_provider_number",
          data?.data_maintenance?.provider_number
        );
        setValue(
          "service_provider_email",
          data?.data_maintenance?.provider_email
        );
        setValue(
          "last_maintenace_date",
          moment(data?.data_maintenance?.last_maintenance_date).format(
            "YYYY-MM-DD"
          )
        );

        setValue("risk_classification", data?.data_safety?.risk_classification);
        setValue("regulatory_approval", data?.data_safety?.regulatory_approval);
        setValue(
          "international_standards",
          data?.data_safety?.international_standard
        );
        setValue("local_standards", data?.data_safety?.local_standard);
        setValue("regulation", data?.data_safety?.regulation);

        setImageDocument(data?.data_document);
        setDataSheet(data?.data_technical?.datasheet);

        let arrDataDocumentUrls = [];
        if (data?.data_document) {
          data?.data_document.forEach((i) => {
            arrDataDocumentUrls.push(i.document_url);
          });
        }
        setGetAllImageDocument(arrDataDocumentUrls);
        setPhoto(data?.data_image[0].image_url);

        let dataHospital = data?.data_hospital;
        if (dataHospital) {
          // console.log("dataHospital", dataHospital)
          setValue("asset_manager_name", dataHospital?.asset_manager_name);
          setValue("asset_manager_id", dataHospital?.asset_manager_id);
          setValue(
            "asset_manager_contact_no",
            dataHospital?.asset_manager_contact
          );

          setValue("pic_name", dataHospital?.pic_name);
          setValue("pic_id", dataHospital?.pic_id);
          setValue("pic_contact", dataHospital?.pic_contact);
        }

        // console.log("ini adalah detail", data)
      })
      .catch((err) => {
        // console.log("err", err, err.response)
      });
  }, [getImageDocument]);

  useEffect(() => {
    getDetail();
    getDataModel();
    getDataBrand();
    getDataUMDNS();
    getDataType();
    getDataGMDN();
    getDataDepartement();
    getDataBuilding();
    getDataFloor();
    getDataRoom();
    getAssetManager();
    getAssetPic();
    getDataSupplier();
  }, []);

  const onSubmit = (value, e) => {
    e.target.reset();
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
    if (value.umdns === "") {
      notifyGagal("UMDNS is required");
      return;
    }
    if (value.type === "") {
      notifyGagal("Type is required");
      return;
    }
    if (value.gmdn === "") {
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

      document_url: getAllImageDocument ? getAllImageDocument : [],

      hospital_contact_asset_manager_name: value.asset_manager_name,
      hospital_contact_asset_manager_id: value.asset_manager_id,
      hospital_contact_asset_manager_contact: value.asset_manager_contact_no,
      hospital_contact_pic_name: value.pic_name,
      hospital_contact_pic_id: value.pic_id,
      hospital_contact_pic_contact: value.pic_contact,

      image_url: [photo] ? [photo] : "",
    };
    // console.log("ini value", JSON.stringify(data))

    HttpRequestExternal.updateRegistrationDetail(router.query.id, data)
      .then((res) => {
        // console.log("berhasil update send", res)
        notify(res.data.message);

        setTimeout(() => {
          router.back();
        }, 1000);
      })
      .catch((err) => {
        notifyGagal(err.message);
        // console.log("gagal send", err)
      });
  };

  const getAssetManager = useCallback(() => {
    // let data = user.user.data.data.id
    HttpRequestExternal.getAssetManager()
      .then((res) => {
        setDataManager(res.data.data);
        let data = res.data.data;
        let looping = data.map((item, index) => {
          return {
            id: item.id,
            name: item.name,
            phone_number: item.phone_number,
          };
        });

        // setValue('asset_manager_name', looping[0].name)
        // setValue("asset_manager_id", looping[0]?.id)
        // setValue("asset_manager_contact_no", looping[0]?.phone_number)

        let dataHospital = detail?.data_hospital;
        if (dataHospital) {
          let selected = looping.find(
            (i) => i.id == dataHospital?.asset_manager_id
          );
          setValue("asset_manager_name", selected?.asset_manager_name);
          setValue("asset_manager_id", selected?.asset_manager_id);
          setValue("asset_manager_contact_no", selected?.asset_manager_contact);
        }
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
        // setValue('pic_name', looping[0].id)
        // setValue("pic_id", looping[0].id)
        // setValue("pic_contact", looping[0].phone_number)

        let dataHospital = detail?.data_hospital;
        if (dataHospital) {
          let selected = looping.find((i) => i.id == dataHospital?.pic_id);
          setValue("pic_name", selected?.pic_name);
          setValue("pic_id", selected?.pic_id);
          setValue("pic_contact", selected?.pic_contact);
        }

        // console.log("res asset pic", res)
      })
      .catch((err) => {
        // console.log("err asset Manager", err)
      });
  }, [dataPicId]);

  const getDataModel = useCallback(() => {
    HttpRequestExternal.getAssetModel()
      .then((res) => {
        let data = res.data.data;
        let looping = data.map((item, index) => {
          return {
            value: item.id,
            label: item.model_name,
          };
        });
        setDataModel(looping);
      })
      .catch((err) => {
        // console.log("data model err", err, err.response)
      });
  }, [dataModel]);

  const getDataBrand = useCallback(() => {
    HttpRequestExternal.getAssetBrand()
      .then((res) => {
        let data = res.data.data;
        let looping = data.map((item, index) => {
          return {
            value: item.id,
            label: item?.brand_name,
          };
        });
        setDataBrand(looping);
      })
      .catch((err) => {
        // console.log("data brand err", err, err.response)
      });
  }, [dataBrand]);

  const getDataDepartement = useCallback(() => {
    HttpRequestExternal.getDepartment()
      .then((res) => {
        let data = res.data.data;
        let looping = data.map((item, index) => {
          return {
            value: item.id,
            label: item.dep_name,
          };
        });
        setDataDepartement(looping);
      })
      .catch((err) => {
        // console.log("data department err", err, err.response)
      });
  }, [dataDepartement]);

  const getDataUMDNS = useCallback(() => {
    HttpRequestExternal.getUmdns()
      .then((res) => {
        let data = res.data.data;
        let looping = data.map((item, index) => {
          return {
            value: item.id,
            label: item.name,
          };
        });
        setDataUMDNS(looping);
      })
      .catch((err) => {
        // console.log("data umdns errr", err, err.response)
      });
  }, [dataUmdns]);

  const getDataType = useCallback(() => {
    HttpRequestExternal.getAssetType()
      .then((res) => {
        // // console.log("type", res)
        let data = res.data.data;
        let looping = data.map((item, index) => {
          return {
            value: item.id,
            label: item.type_name,
          };
        });
        setDataType(looping);
      })
      .catch((err) => {
        // console.log("data type errr", err, err.response)
      });
  }, [dataType]);

  const getDataGMDN = useCallback(() => {
    HttpRequestExternal.getGdmn()
      .then((res) => {
        let data = res.data.data;
        let looping = data.map((item, index) => {
          return {
            value: item.id,
            label: item.name,
          };
        });
        setDataGMDN(looping);
      })
      .catch((err) => {
        // console.log("data gmdn err", err, err.response)
      });
  }, [dataGmdn]);

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
      })
      .catch((err) => {
        // console.log("data room err", err, err.response)
      });
  }, [dataRoom]);

  const validateExstension = useCallback((arrOfExtensions, filename) => {
    let ext = filename.split(".");
    return arrOfExtensions.some(
      (i) => i.toLowerCase() === ext[ext.length - 1].toLowerCase()
    );
  });

  const onChangeDataSheet = useCallback(
    (e) => {
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
          notify("sukses upload file");
        })
        .catch((err) => {
          // console.log("upload image err", err, err.response)
          notifyGagal("Upload File");
        });
    },
    [dataSheet]
  );

  const onUploadDocument = useCallback(
    (e) => {
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

      setIsUploadingDoc(true);
      HttpRequestExternal.uploadStatisFileMutiple(e.target.files)
        .then((res) => {
          // console.log("upload file ", res)
          let data = res.data.data;

          let document_url = [];
          getImageDocument?.map((item, lama) => {
            document_url.push(item.document_url);
          });
          data.map((item, baru) => {
            document_url.push(item);
          });

          // // console.log('ini res document', document_url)
          setDocument(data);
          setIsUploadingDoc(true);
          setGetAllImageDocument(document_url);
        })
        .catch((err) => {
          // console.log("upload image err", err, err.response)
          notifyGagal("Upload File");
          setIsUploadingDoc(true);
        });
    },
    [getImageDocument]
  );

  const onPhotoUpload = useCallback(
    (e) => {
      HttpRequestExternal.uploadImage(e.target.files[0])
        .then((res) => {
          // // console.log("upload file ", res)
          notify("sukses upload file");
          setPhoto(res.data.data);
        })
        .catch((err) => {
          // console.log("upload image err", err, err.response)
          notifyGagal("Upload File");
        });
    },
    [photo]
  );

  const getDataSupplier = useCallback(() => {
    HttpRequestExternal.getSupplier()
      .then((res) => {
        // // console.log("supplier", res)
        let data = res.data.data;
        let looping = data.map((item, index) => {
          return {
            value: item.id,
            label: item.supplier_name,
          };
        });
        setDataSupplier(looping);
        setFilterSupplier(data);
      })
      .catch((err) => {
        notifyGagal("load data supplier");
      });
  }, [dataSupplier]);

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
    },
    [dataFilterSupplier]
  );

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

  let defaultImage = "https://api.ivf.aplikasitrial.com/";

  const user = store.getState().user;

  return (
    <div className="flex flex-col px-4 mb-6 sm:px-6 md:px-8 ">
      <Link href={`/registration`}>
        <a className='inline-block mb-4 font-semibold text-primary-600 hover:underline"'>
          Back to Registration List
        </a>
      </Link>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isEdit == true ? "Detail Register" : "Edit Register"}
        </h1>
      </div>

      <div>
        {isEdit == true && (
          <div className="flex flex-col px-3 space-y-4 sm:px-6 lg:space-x-6 lg:space-y-0 lg:flex-row">
            <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-900">
              <div className="flex flex-row">
                <div className="flex items-center w-auto">
                  <div className="p-3 border border-black rounded-sm ">
                    <QRCode
                      value={detail?.id}
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
                          <label htmlFor="asset_name">Asset Name : </label>
                          <div className="mt-1">
                            <Input
                              disabled={isEdit}
                              id="asset_name"
                              value={detail?.equipments_name}
                            />
                          </div>
                        </div>

                        <div className="lg:col-span-2">
                          <label htmlFor="brand">brand : </label>
                          <div className="mt-1">
                            <Input
                              disabled={isEdit}
                              id="brand"
                              value={detail?.data_brand?.brand_name}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="grid gap-3 lg:col-span-2">
                        <div>
                          <label htmlFor="model">Model : </label>
                          <div className="mt-1">
                            <Input
                              disabled={isEdit}
                              id="model"
                              value={detail?.data_model?.model_name}
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="type">Type :</label>
                          <div className="mt-1">
                            <Input
                              disabled={isEdit}
                              id="type"
                              value={detail?.data_type?.type_name}
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
                        <label className="md:text-sm" htmlFor="asset_name">
                          Asset Name:{" "}
                        </label>
                        <div className="mt-1">
                          <Input
                            disabled={isEdit}
                            id="asset_name"
                            value={detail?.equipments_name}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="md:text-sm" htmlFor="model">
                          Model:{" "}
                        </label>
                        <div className="mt-1">
                          <Input
                            disabled={isEdit}
                            id="model"
                            value={detail?.data_model?.model_name}
                          />
                        </div>
                      </div>
                      <div className="lg:col-span-2">
                        <label className="md:text-sm" htmlFor="brand">
                          brand:{" "}
                        </label>
                        <div className="mt-1">
                          <Input
                            disabled={isEdit}
                            id="brand"
                            value={detail?.data_brand?.brand_name}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="md:text-sm" htmlFor="type">
                          Type:
                        </label>
                        <div className="mt-1">
                          <Input
                            disabled={isEdit}
                            id="type"
                            value={detail?.data_type?.type_name}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-flow-row auto-rows-max">
                <div className="grid grid-flow-row-dense grid-cols-3 gap-5 py-3">
                  <div className="flex flex-col">
                    <label htmlFor="umdns">UMDNS : </label>
                    <div className="mt-1">
                      <Input
                        disabled={isEdit}
                        id="umdns"
                        value={detail?.data_umdns?.name}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="gmdn">GMDN : </label>
                    <div className="mt-1">
                      <Input
                        disabled={isEdit}
                        id="gmdn"
                        value={detail?.data_gmdn?.name}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="serial_number">Serial Number : </label>
                    <div className="mt-1">
                      <Input
                        disabled={isEdit}
                        id="serial_number"
                        value={detail?.serial_number}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-4 lg:grid-cols-4">
                  <div className="grid grid-rows-2">
                    <label className="text-sm" htmlFor="manufacturer_date">
                      Manufacturer Date :{" "}
                    </label>
                    <div>
                      <Input
                        disabled={isEdit}
                        id="manufacturer_date"
                        value={moment(detail?.manufacturing_date).format(
                          "dddd, DD-MM-YYYY"
                        )}
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
                          disabled={isEdit}
                          id="manufacturer_date"
                          value={moment(detail?.manufacturing_date).format(
                            "dddd, DD-MM-YYYY"
                          )}
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
                          disabled={isEdit}
                          id="end_date"
                          value={moment(
                            detail?.manufacturer_warranty_exp_date_end
                          ).format("dddd, DD-MM-YYYY")}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-rows-2">
                    <label
                      className="text-sm"
                      htmlFor="manufacturer_recommended_daily_use"
                    >
                      Manufacturer Recommended Daily Use (Hours):
                    </label>
                    <div>
                      <Input
                        disabled={isEdit}
                        id="manufacturer_recommended_daily_use"
                        value={detail?.manufacturer_recomend_daily_use}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-flow-row py-3 auto-rows-max sm:grid-cols-1 lg:grid-cols-2">
                  <div className="flex flex-col mr-3">
                    <label htmlFor="mobility_portability">
                      Mobility, Portability :{" "}
                    </label>
                    <Input
                      disabled={isEdit}
                      id="mobility_portability"
                      value={detail?.mobility}
                    />
                  </div>
                  <div className="flex flex-col mr-3">
                    <label htmlFor="life_expectancy">Life expectancy : </label>
                    <Input
                      disabled={isEdit}
                      id="life_expectancy"
                      value={detail?.lifetime_expectancy}
                    />
                  </div>
                  <div className="flex flex-col mr-3">
                    <label htmlFor="qty">Quantity : </label>
                    <Input
                      disabled={isEdit}
                      type="number"
                      min="0"
                      value={detail?.quantity}
                    />
                  </div>
                </div>
                <h3 className="py-2 text-xl font-bold">Asset Location</h3>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="flex flex-col">
                    <label htmlFor="department">Department : </label>
                    <Input
                      disabled={isEdit}
                      id="department"
                      value={detail?.data_department?.dep_name}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="building">Building : </label>
                    <Input
                      disabled={isEdit}
                      id="building"
                      value={detail?.data_building?.name}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="floor">Floor : </label>
                    <Input
                      disabled={isEdit}
                      id="floor"
                      value={detail?.data_floor?.name}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="room">Room : </label>
                    <Input
                      disabled={isEdit}
                      id="room"
                      value={detail?.data_room?.room_name}
                    />
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
                          disabled={isEdit}
                          id="environmental_specification"
                          value={
                            detail?.data_technical?.environmental_specification
                          }
                        />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="list_of_accessories">
                        List of Accessories :{" "}
                      </label>
                      <div className="mt-5">
                        <Input
                          disabled={isEdit}
                          id="list_of_accessories"
                          value={detail?.data_technical?.list_of_accessories}
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
                            disabled={isEdit}
                            id="phase"
                            value={
                              detail?.data_technical?.electrical_source_phase
                            }
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="md:text-xs" htmlFor="volt">
                            Volt :
                          </label>
                          <Input
                            disabled={isEdit}
                            id="volt"
                            value={
                              detail?.data_technical?.electrical_source_volt
                            }
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="md:text-xs" htmlFor="amp">
                            Amp(A):
                          </label>
                          <Input
                            disabled={isEdit}
                            id="amp"
                            value={
                              detail?.data_technical?.electrical_source_amp
                            }
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="md:text-xs" htmlFor="freq">
                            Freq(Hz):
                          </label>
                          <Input
                            disabled={isEdit}
                            id="freq"
                            value={
                              detail?.data_technical?.electrical_source_freq
                            }
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
                          disabled={isEdit}
                          id="volt_a"
                          value={detail?.data_technical?.battery_charger_volt}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm md:mt-2" htmlFor="amp_a">
                          Amp (A) :
                        </label>
                        <Input
                          disabled={isEdit}
                          id="amp_a"
                          value={detail?.data_technical?.battery_charger_amp}
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
                        disabled={isEdit}
                        id="weight"
                        value={detail?.data_technical?.weight}
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
                        disabled={isEdit}
                        id="dimension"
                        value={detail?.data_technical?.dimension}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className="md:truncate md:text-sm" htmlFor="power">
                      Power (Watt):{" "}
                    </label>
                    <div className="sm:mt-15 md:mt-4 lg:mt-8">
                      <Input
                        disabled={isEdit}
                        id="power"
                        value={detail?.data_technical?.power}
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
                        disabled={isEdit}
                        id="material"
                        value={detail?.data_technical?.material}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className="md:truncate md:text-sm" htmlFor="shelf">
                      Shelf Life (Year):{" "}
                    </label>
                    <div className="sm:mt-15 md:mt-4 lg:mt-8">
                      <Input
                        disabled={isEdit}
                        id="shelf"
                        value={detail?.data_technical?.shelf_life}
                      />
                    </div>
                  </div>
                </div>

                <h3 className="py-2 text-xl font-bold">Datasheet : </h3>
                <div className="flex sm:flex-row lg:flex-row">
                  {/* <FaDochub /> */}
                  {/* <div className="flex flex-col mr-3">
                                            <Input
                                                disabled={isEdit}
                                                id="data-sheet"
                                                type="file"
                                                accept=".doc, .docx, .pdf"
                                            // onChange={onChangeDataSheet}
                                            />
                                        </div> */}
                  <>
                    {detail?.data_technical?.datasheet && (
                      <>
                        <div className="flex flex-row flex-1">
                          <div className="flex flex-row justify-center px-4 py-2 mt-2 rounded-lg bg-primary-600">
                            <a
                              target={"_blank"}
                              href={`${process.env.NEXT_PUBLIC_API_ASSET_URL}/${detail?.data_technical?.datasheet}`}
                            >
                              {detail?.data_technical?.datasheet}
                            </a>
                          </div>
                        </div>
                        {/* <img
                                                        className="object-cover w-40 aspect-video"
                                                        src={`${process.env.NEXT_PUBLIC_API_ASSET_URL}/${detail?.data_technical?.datasheet}`}
                                                        alt="preview document"
                                                    /> */}
                      </>
                    )}
                    {detail?.data_technical?.datasheet == "" && (
                      <div>
                        <h1 className="text-xl font-bold">Tidak ada Files</h1>
                      </div>
                    )}
                  </>
                </div>
                <h3 className="py-3 text-xl font-bold">Supplier Information</h3>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="flex flex-col mr-3">
                    <label className="text-sm" htmlFor="supplier_company_name">
                      Supplier Company Name:{" "}
                    </label>
                    <div className="mt-4">
                      <Input
                        disabled={isEdit}
                        id="supplier_company_name"
                        value={detail?.data_supplier?.supplier_name}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col mr-3">
                    <label className="text-sm" htmlFor="supplier_address">
                      Supplier Address:{" "}
                    </label>
                    <div className="mt-4">
                      <Input
                        disabled={isEdit}
                        id="supplier_address"
                        value={detail?.data_supplier?.address}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col mr-3">
                    <label className="text-sm" htmlFor="supplier_phone">
                      Supplier Phone/ Fax:{" "}
                    </label>
                    <div className="mt-4">
                      <Input
                        disabled={isEdit}
                        id="supplier_phone"
                        value={detail?.data_supplier?.contact_no}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col mr-3">
                    <label className="text-sm" htmlFor="supplier_email">
                      Supplier Email:{" "}
                    </label>
                    <div className="mt-4">
                      <Input
                        disabled={isEdit}
                        id="supplier_email"
                        value={detail?.data_supplier?.contact_email}
                      />
                    </div>
                  </div>
                </div>

                <h3 className="py-3 text-xl font-bold">
                  Purchasing Information
                </h3>
                <div className="grid grid-flow-row-dense gap-5 sm:grid-cols-1 lg:grid-cols-3 grid-row-2">
                  <div className="flex flex-col mr-3">
                    <label htmlFor="purchase_order_no">
                      Supplier Purchase Order No:{" "}
                    </label>
                    <Input
                      disabled={isEdit}
                      id="purchase_order_no"
                      value={detail?.data_purchasing?.order_no}
                    />
                  </div>
                  <div className="flex flex-col mr-3">
                    <label htmlFor="price">Price: </label>
                    <Input
                      disabled={isEdit}
                      id="price"
                      value={detail?.data_purchasing?.price}
                    />
                  </div>
                  <div className="flex flex-col mr-3">
                    <label className="sm:truncate" htmlFor="purchase_date">
                      Purchase Date :{" "}
                    </label>
                    <Input
                      disabled={isEdit}
                      id="purchase_date"
                      value={moment(detail?.data_purchasing?.date).format(
                        "dddd, DD-MM-YYYY"
                      )}
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
                      disabled={isEdit}
                      id="supplier_warranty_expiration_date"
                      value={moment(
                        detail?.data_purchasing?.warranty_exp_date
                      ).format("dddd, DD-MM-YYYY")}
                    />
                  </div>
                  <div className="flex flex-col mr-3">
                    <label className="sm:truncate" htmlFor="duration_for_spare">
                      Duration for spare part availibility (Year) :{" "}
                    </label>
                    <Input
                      disabled={isEdit}
                      id="duration_for_spare"
                      value={detail?.data_purchasing?.duration_sparepart}
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
                      disabled={isEdit}
                      id="service_provider_company_name"
                      value={detail?.data_maintenance?.provider_name}
                    />
                  </div>
                  <div className="flex flex-col mr-3">
                    <label htmlFor="service_provider_address">
                      Service Provider Address:{" "}
                    </label>
                    <Input
                      disabled={isEdit}
                      id="service_provider_address"
                      value={detail?.data_maintenance?.provider_address}
                    />
                  </div>
                  <div className="flex flex-col mr-3">
                    <label htmlFor="service_provider_number">
                      Service Provider number:{" "}
                    </label>
                    <Input
                      disabled={isEdit}
                      id="service_provider_number"
                      value={detail?.data_maintenance?.provider_number}
                    />
                  </div>
                  <div className="flex flex-col mr-3">
                    <label htmlFor="service_provider_email">
                      Service Provider Email:{" "}
                    </label>
                    <Input
                      disabled={isEdit}
                      id="service_provider_email"
                      value={detail?.data_maintenance?.provider_email}
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
                      disabled={isEdit}
                      id="last_maintenace_date"
                      value={moment(
                        detail?.data_maintenance?.last_maintenance_date
                      ).format("dddd, DD-MM-YYYY")}
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
                      disabled={isEdit}
                      id="risk_classification"
                      value={detail?.data_safety?.risk_classification}
                    />
                  </div>
                  <div className="flex flex-col mr-3">
                    <label htmlFor="regulatory_approval">
                      Regulatory Approval:{" "}
                    </label>
                    <Input
                      disabled={isEdit}
                      id="regulatory_approval"
                      value={detail?.data_safety?.regulatory_approval}
                    />
                  </div>
                  <div className="flex flex-col mr-3">
                    <label htmlFor="international_standards">
                      International Standards:{" "}
                    </label>
                    <Input
                      disabled={isEdit}
                      id="international_standards"
                      value={detail?.data_safety?.international_standard}
                    />
                  </div>
                  <div className="flex flex-col mr-3">
                    <label htmlFor="local_standards">Local Standards: </label>
                    <Input
                      disabled={isEdit}
                      id="local_standards"
                      value={detail?.data_safety?.local_standard}
                    />
                  </div>
                  <div className="flex flex-col mr-3">
                    <label htmlFor="regulation">Regulation: </label>
                    <Input
                      disabled={isEdit}
                      id="regulation"
                      value={detail?.data_safety?.regulation}
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
                  {getImageDocument?.map((item, documentasi) => {
                    // // console.log("item", item)
                    let arr = item?.document_url?.split(".");
                    let extension = arr[arr?.length - 1] ?? "png";
                    let filename =
                      item?.document_url?.split("/")[
                        item?.document_url?.split("/")?.length - 1
                      ] ?? "file-name";
                    let allowImage = ["png", "jpg", "jpeg"];
                    let allowDoc = ["doc", "pdf", "docx"];
                    return (
                      <>
                        <div key={documentasi} className="flex flex-row flex-1">
                          <div className="flex flex-row justify-center px-4 py-2 my-3 rounded-lg bg-primary-600">
                            {allowDoc.some((i) => i === extension) && (
                              <a target={"_blank"} href={item?.document_url}>
                                {filename}
                              </a>
                            )}
                            {allowImage.some((i) => i === extension) && (
                              <img
                                src={item.document_url}
                                className="h-auto w-36"
                              />
                            )}
                          </div>
                          <span className="flex-1" />
                        </div>
                      </>
                    );
                  })}
                  {getImageDocument?.length === 0 && (
                    <div>
                      <h1 className="text-xl font-bold">Tidak ada Files</h1>
                    </div>
                  )}
                </div>
                <h3 className="py-2 text-xl font-bold">
                  Hospital Asset Contact Person:
                </h3>
                <div className="grid gap-5 sm:grid-cols-4 auto-rows-max ">
                  <div className="flex flex-col">
                    <label className="sm:truncate" htmlFor="asset_manager_name">
                      Asset Manager Name:{" "}
                    </label>
                    <Input
                      disabled={isEdit}
                      id="asset_manager_name"
                      value={detail?.data_hospital?.asset_manager_name}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      className="sm:truncate"
                      htmlFor="asset_manager_contact_no"
                    >
                      Asset Manager Contact No:{" "}
                    </label>
                    <Input
                      disabled={isEdit}
                      id="asset_manager_contact_no"
                      value={detail?.data_hospital?.asset_manager_contact}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="sm:truncate" htmlFor="pic_name">
                      PIC Name:{" "}
                    </label>
                    <Input
                      disabled={isEdit}
                      id="pic_name"
                      value={detail?.data_hospital?.pic_name}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="sm:truncate" htmlFor="pic_contact">
                      PIC Contact No:{" "}
                    </label>
                    <Input
                      disabled={isEdit}
                      id="pic_contact"
                      value={detail?.data_hospital?.pic_contact}
                    />
                  </div>
                </div>
                <h2 className="py-2 text-xl font-bold">Photo: </h2>
                <div className="flex flex-row">
                  {detail != null && detail?.data_image.length > 0 && (
                    <>
                      <div className="py-4">
                        {detail?.data_image.map((item, index) => {
                          return (
                            <img src={item.image_url} className="h-auto w-36" />
                          );
                        })}
                      </div>
                    </>
                  )}
                  {/* </div> */}
                </div>
              </div>

              {[
                "super-admin",
                "admin",
                "hospital-admin",
                "asset-manager",
              ].includes(user?.employee?.role?.alias) && (
                <div className="flex flex-row">
                  <div className="flex flex-1"></div>
                  <Button
                    type="button"
                    onClick={() => {
                      setEdit(false);
                    }}
                  >
                    Edit
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
        {isEdit == false && (
          <>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col px-3 space-y-4 sm:px-6 lg:space-x-6 lg:space-y-0 lg:flex-row">
                <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-900">
                  <div className="flex flex-row">
                    <div className="flex items-center w-auto">
                      <div className="p-3 border border-black rounded-sm ">
                        <QRCode
                          value={detail?.id}
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
                              <label htmlFor="asset_name">Asset Name : </label>
                              <div className="mt-1">
                                <Input
                                  defaultValue={detail?.equipments_name}
                                  onChange={(event) => {
                                    setValue("asset_name", event.target.value);
                                  }}
                                />
                              </div>
                            </div>
                            <div className="lg:col-span-2">
                              <label htmlFor="brand">brand : </label>
                              <div className="mt-1">
                                <Select
                                  id="brand"
                                  onChange={(i) => {
                                    setValue("brand", i.value);
                                  }}
                                  options={dataBrand}
                                  styles={customStyles}
                                  menuColor="black"
                                  defaultValue={defBrand[0]}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="grid gap-3 lg:col-span-2">
                            <div>
                              <label htmlFor="model">Model : </label>
                              <div className="mt-1">
                                <Select
                                  id="model"
                                  options={dataModel}
                                  onChange={(event) => {
                                    setValue("model", event.value);
                                  }}
                                  styles={customStyles}
                                  menuColor="black"
                                  defaultValue={defModel[0]}
                                />
                              </div>
                            </div>
                            <div>
                              <label htmlFor="type">Type :</label>
                              <div className="mt-1">
                                <Select
                                  id="type"
                                  onChange={(i) => {
                                    setValue("type", i.value);
                                  }}
                                  options={dataType}
                                  styles={customStyles}
                                  menuColor="black"
                                  defaultValue={defType[0]}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="md:block lg:hidden">
                    <div className="flex flex-1">
                      <div className="grid w-full grid-flow-row auto-rows-max">
                        <div className="grid grid-rows-2 gap-5 sm:grid-cols-2">
                          <div>
                            <label htmlFor="asset_name">Asset Name : </label>
                            <div className="mt-1">
                              <Input
                                defaultValue={detail?.equipments_name}
                                onChange={(event) => {
                                  setValue("asset_name", event.target.value);
                                }}
                              />
                            </div>
                          </div>
                          <div>
                            <label htmlFor="model">Model : </label>
                            <div className="mt-1">
                              <Select
                                id="model"
                                styles={customStyles}
                                menuColor="black"
                                onChange={(i) => {
                                  setValue("model", i.value);
                                }}
                                options={dataModel}
                                defaultValue={defModel[0]}
                              />
                            </div>
                          </div>
                          <div className="lg:col-span-2">
                            <label htmlFor="brand">brand : </label>
                            <div className="mt-1">
                              <Select
                                id="brand"
                                styles={customStyles}
                                menuColor="black"
                                onChange={(i) => {
                                  setValue("brand", i.value);
                                }}
                                options={dataBrand}
                                defaultValue={defBrand[0]}
                              />
                            </div>
                          </div>
                          <div>
                            <label htmlFor="type">Type :</label>
                            <div className="mt-1">
                              <Select
                                id="type"
                                styles={customStyles}
                                menuColor="black"
                                onChange={(i) => {
                                  setValue("type", i.value);
                                }}
                                options={dataType}
                                defaultValue={defType[0]}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-flow-row auto-rows-max">
                    <div className="grid grid-flow-row-dense grid-cols-3 gap-5 py-3">
                      <div className="flex flex-col">
                        <label htmlFor="umdns">UMDNS : </label>
                        <div className="mt-1">
                          <Select
                            id="umdns"
                            styles={customStyles}
                            menuColor="black"
                            onChange={(i) => {
                              setValue("umdns", i.value);
                            }}
                            options={dataUmdns}
                            defaultValue={defUmdns[0]}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor="gmdn">GMDN : </label>
                        <div className="mt-1">
                          <Select
                            id="gmdn"
                            styles={customStyles}
                            menuColor="black"
                            onChange={(i) => {
                              setValue("gmdn", i.value);
                            }}
                            options={dataGmdn}
                            defaultValue={defGmdn[0]}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor="serial_number">Serial Number : </label>
                        <div className="mt-1">
                          <Input
                            id="serial_number"
                            // errorMessage={errors?.serial_number?.message}
                            {...register("serial_number")}
                          />
                        </div>
                      </div>
                    </div>
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
                            {...register("manufacturer_date")}
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
                              errors?.manufacturer_recommended_daily_use
                                ?.message
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
                    <div className="grid grid-flow-row py-3 auto-rows-max sm:grid-cols-1 lg:grid-cols-2">
                      <div className="flex flex-col mr-3">
                        <label htmlFor="mobility_portability">
                          Mobility, Portability :{" "}
                        </label>
                        <Input
                          id="mobility_portability"
                          // errorMessage={errors?.mobility_portability?.message}
                          {...register("mobility_portability")}
                        />
                      </div>
                      <div className="flex flex-col mr-3">
                        <label htmlFor="life_expectancy">
                          Life expectancy :{" "}
                        </label>
                        <Input
                          id="life_expectancy"
                          // errorMessage={errors?.life_expectancy?.message}
                          {...register("life_expectancy")}
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
                            defaultValue={defDepart[0]}
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
                            defaultValue={defBuilding[0]}
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
                            defaultValue={defFloor[0]}
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
                            defaultValue={defRoom[0]}
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
                              {...register("environmental_specification")}
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
                              errorMessage={
                                errors?.list_of_accessories?.message
                              }
                              {...register("list_of_accessories")}
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
                                    setValue(
                                      "volt",
                                      parseToNumber(e.target.value)
                                    );
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
                                    setValue(
                                      "amp",
                                      parseToNumber(e.target.value)
                                    );
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
                                    setValue(
                                      "freq",
                                      parseToNumber(e.target.value)
                                    );
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
                                  setValue(
                                    "volt_a",
                                    parseToNumber(e.target.value)
                                  );
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
                                  setValue(
                                    "amp_a",
                                    parseToNumber(e.target.value)
                                  );
                                },
                              })}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <label
                          className="md:truncate md:text-sm"
                          htmlFor="weight"
                        >
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
                                setValue(
                                  "weight",
                                  parseToNumber(e.target.value)
                                );
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
                        <label
                          className="md:truncate md:text-sm"
                          htmlFor="power"
                        >
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
                                setValue(
                                  "power",
                                  parseToNumber(e.target.value)
                                );
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
                            // errorMessage={errors?.material?.message}
                            {...register("material")}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <label className="md:truncate" htmlFor="shelf">
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
                                setValue(
                                  "shelf",
                                  parseToNumber(e.target.value)
                                );
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
                          id="data-sheet"
                          type="file"
                          accept=".doc, .docx, .pdf"
                          onChange={onChangeDataSheet}
                        />
                        {detail?.data_technical?.datasheet && (
                          <>
                            <div className="flex flex-row flex-1">
                              <div className="flex flex-row justify-center px-4 py-2 mt-2 rounded-lg bg-primary-600">
                                <a
                                  target={"_blank"}
                                  href={`${process.env.NEXT_PUBLIC_API_ASSET_URL}/${detail?.data_technical?.datasheet}`}
                                >
                                  {detail?.data_technical?.datasheet}
                                </a>
                              </div>
                            </div>
                            {/* <img
                                                            className="object-cover w-40 aspect-video"
                                                            src={`${process.env.NEXT_PUBLIC_API_ASSET_URL}/${detail?.data_technical?.datasheet}`}
                                                            alt="preview document"
                                                        /> */}
                          </>
                        )}
                      </div>
                    </div>
                    <h3 className="py-3 text-xl font-bold">
                      Supplier Information
                    </h3>
                    <div className="grid grid-flow-row-dense grid-rows-2 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="flex flex-col mr-3">
                        <label htmlFor="supplier_company_name">
                          Supplier Company Name:{" "}
                        </label>
                        <Select
                          id="supplier_company_name"
                          onChange={(i) => {
                            setValue("supplier_company_name", i.label);
                            setValue("supplier_id", i.value);
                            filterSupplier(i.value);
                          }}
                          styles={customStyles}
                          menuColor="black"
                          options={dataSupplier}
                          defaultValue={defSupplier[0]}
                        />
                      </div>
                      <div className="flex flex-col mr-3">
                        <label htmlFor="supplier_address">
                          Supplier Address:{" "}
                        </label>
                        <Input
                          id="supplier_address"
                          // errorMessage={errors?.supplier_address?.message}
                          {...register("supplier_address")}
                        />
                      </div>
                      <div className="flex flex-col mr-3">
                        <label htmlFor="supplier_phone">
                          Supplier Phone/ Fax:{" "}
                        </label>
                        <Input
                          id="supplier_phone"
                          // errorMessage={errors?.supplier_phone?.message}
                          {...register("supplier_phone")}
                        />
                      </div>
                      <div className="flex flex-col mr-3">
                        <label htmlFor="supplier_email">Supplier Email: </label>
                        <Input
                          id="supplier_email"
                          // errorMessage={errors?.supplier_email?.message}
                          {...register("supplier_email")}
                        />
                      </div>
                    </div>

                    <h3 className="py-3 text-xl font-bold">
                      Purchasing Information
                    </h3>
                    <div className="grid grid-flow-row-dense gap-5 sm:grid-cols-1 lg:grid-cols-3 grid-row-2">
                      <div className="flex flex-col mr-3">
                        <label htmlFor="purchase_order_no">
                          Supplier Purchase Order No:{" "}
                        </label>
                        <Input
                          id="purchase_order_no"
                          // errorMessage={errors?.purchase_order_no?.message}
                          {...register("purchase_order_no")}
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
                          // errorMessage={errors?.purchase_date?.message}
                          {...register("purchase_date")}
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
                          // errorMessage={errors?.supplier_warranty_expiration_date?.message}
                          {...register("supplier_warranty_expiration_date")}
                        />
                      </div>
                      <div className="flex flex-col mr-3">
                        <label
                          className="sm:truncate"
                          htmlFor="duration_for_spare"
                        >
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
                          // errorMessage={errors?.service_provider_company_name?.message}
                          {...register("service_provider_company_name")}
                        />
                      </div>
                      <div className="flex flex-col mr-3">
                        <label htmlFor="service_provider_address">
                          Service Provider Address:{" "}
                        </label>
                        <Input
                          id="service_provider_address"
                          // errorMessage={errors?.service_provider_address?.message}
                          {...register("service_provider_address")}
                        />
                      </div>
                      <div className="flex flex-col mr-3">
                        <label htmlFor="service_provider_number">
                          Service Provider number:{" "}
                        </label>
                        <Input
                          id="service_provider_number"
                          // errorMessage={errors?.service_provider_number?.message}
                          {...register("service_provider_number")}
                        />
                      </div>
                      <div className="flex flex-col mr-3">
                        <label htmlFor="service_provider_email">
                          Service Provider Email:{" "}
                        </label>
                        <Input
                          id="service_provider_email"
                          // errorMessage={errors?.service_provider_email?.message}
                          {...register("service_provider_email")}
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
                          // errorMessage={errors?.last_maintenace_date?.message}
                          {...register("last_maintenace_date")}
                        />
                      </div>
                    </div>
                    <h3 className="py-3 text-xl font-bold">
                      Safety and Standards
                    </h3>
                    <div className="grid grid-flow-row-dense grid-rows-2 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                      <div className="flex flex-col mr-3">
                        <label htmlFor="risk_classification">
                          Risk Classification:{" "}
                        </label>
                        <Input
                          id="risk_classification"
                          // errorMessage={errors?.risk_classification?.message}
                          {...register("risk_classification")}
                        />
                      </div>
                      <div className="flex flex-col mr-3">
                        <label htmlFor="regulatory_approval">
                          Regulatory Approval:{" "}
                        </label>
                        <Input
                          id="regulatory_approval"
                          // errorMessage={errors?.regulatory_approval?.message}
                          {...register("regulatory_approval")}
                        />
                      </div>
                      <div className="flex flex-col mr-3">
                        <label htmlFor="international_standards">
                          International Standards:{" "}
                        </label>
                        <Input
                          id="international_standards"
                          // errorMessage={errors?.international_standards?.message}
                          {...register("international_standards")}
                        />
                      </div>
                      <div className="flex flex-col mr-3">
                        <label htmlFor="local_standards">
                          Local Standards:{" "}
                        </label>
                        <Input
                          id="local_standards"
                          // errorMessage={errors?.local_standards?.message}
                          {...register("local_standards")}
                        />
                      </div>
                      <div className="flex flex-col mr-3">
                        <label htmlFor="regulation">Regulation: </label>
                        <Input
                          id="regulation"
                          // errorMessage={errors?.regulation?.message}
                          {...register("regulation")}
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
                      {getImageDocument?.map((item, documentasi) => {
                        let arr = item?.document_url?.split(".");
                        let extension = arr[arr?.length - 1] ?? "png";
                        let filename =
                          item?.document_url?.split("/")[
                            item?.document_url?.split("/")?.length - 1
                          ] ?? "file-name";
                        let allowImage = ["png", "jpg", "jpeg"];
                        let allowDoc = ["doc", "pdf", "docx"];
                        return (
                          <>
                            <div
                              key={documentasi}
                              className="flex flex-row flex-1"
                            >
                              <div className="flex flex-row justify-center px-4 py-2 my-3 rounded-lg bg-primary-600">
                                {allowDoc.some((i) => i === extension) && (
                                  <a
                                    target={"_blank"}
                                    href={item?.document_url}
                                  >
                                    {filename}
                                  </a>
                                )}
                                {allowImage.some((i) => i === extension) && (
                                  <img
                                    src={item.document_url}
                                    className="h-auto w-36"
                                  />
                                )}
                                <button
                                  type="button"
                                  onClick={() => {
                                    getImageDocument.splice(documentasi, 1);
                                    setImageDocument([...getImageDocument]);
                                    let document_url = [];
                                    getImageDocument?.map((item, lama) => {
                                      document_url.push(item.document_url);
                                    });
                                    setGetAllImageDocument(document_url);
                                  }}
                                >
                                  <IoCloseOutline
                                    color={"white"}
                                    className="self-center ml-2 "
                                  />
                                </button>
                              </div>
                              <span className="flex-1" />
                            </div>
                          </>
                        );
                      })}
                      {dataDocument?.map((item, img) => {
                        let extension = item.split(".")[1] ?? ".png";
                        let allowImage = ["png", "jpeg", "jpg"];
                        let allowDoc = ["pdf", "doc", "docx"];
                        return (
                          <div key={img} className="flex flex-row flex-1">
                            <div className="flex flex-row justify-center px-4 py-2 my-3 rounded-lg bg-primary-600">
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
                    <h3 className="py-2 text-xl font-bold">
                      Hospital Asset Contact Person:
                    </h3>
                    <div className="grid grid-flow-row gap-5 sm:grid-cols-4 auto-rows-max ">
                      <div className="flex flex-col">
                        <label
                          className="sm:truncate"
                          htmlFor="asset_manager_name"
                        >
                          Asset Manager Name:{" "}
                        </label>
                        <MySelect
                          id="asset_manager_name"
                          errorMessage={errors?.asset_manager_name?.message}
                          {...register("asset_manager_name", {
                            required: "Manager Harus diisi",
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
                          errorMessage={
                            errors?.asset_manager_contact_no?.message
                          }
                          {...register("asset_manager_contact_no")}
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
                            required: "PIC Harus diisi",
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
                          {dataPicId.map((item, pic) => {
                            return (
                              <option key={pic} value={item.name}>
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
                          {...register("pic_contact")}
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
                      {detail != null && detail?.data_image.length > 0 && (
                        <>
                          <div className="py-4">
                            {detail?.data_image.map((item, index) => {
                              return (
                                <>
                                  {/* <h1 className='text-sm' >Image Sebelumnya</h1> */}
                                  <img
                                    src={item.image_url}
                                    className="h-auto w-36"
                                  />
                                </>
                              );
                            })}
                          </div>
                        </>
                      )}
                    </div>
                    <div className="flex flex-row">
                      <div className="flex flex-1"></div>
                      <Button
                        type="button"
                        onClick={() => {
                          setEdit(true);
                        }}
                      >
                        Cancel
                      </Button>
                      <span className="px-2" />
                      <Button type="submit">Save</Button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
