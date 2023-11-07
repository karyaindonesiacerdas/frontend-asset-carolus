import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { QRCode } from 'react-qrcode-logo';
import { FaDochub, FaUpload } from 'react-icons/fa';
import { SubmitHandler, useForm } from 'react-hook-form';
import Button from '../../components/Button';
import format from 'date-fns/format';

import Input from '../../components/Input';
import { HttpRequest, HttpRequestExternal } from '../../utils/http';
import MySelect from '../../components/MySelect';

const App = () => {
  const [dataModel, setDataModel] = useState([]);
  const [dataBrand, setDataBrand] = useState([]);
  const [dataDepartement, setDataDepartement] = useState([]);
  const [dataUmdns, setDataUMDNS] = useState([]);
  const [dataGmdn, setDataGMDN] = useState([]);
  const [generateId, setGenerateID] = useState('');

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

      technical_datasheet: 'aaa',

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

      document_url: ['1212', '1123'],

      hospital_contact_asset_manager_name: value.asset_manager_name,
      hospital_contact_asset_manager_id: value.asset_manager_id,
      hospital_contact_asset_manager_contact: value.asset_manager_contact_no,
      hospital_contact_pic_name: value.pic_name,
      hospital_contact_pic_id: value.pic_id,
      hospital_contact_pic_contact: value.pic_contact,

      image_url: ['1212', '1123'],
    };

    // console.log(JSON.stringify(data))

    try {
      HttpRequestExternal.postRegisteredAssets(data)
        .then((res) => {
          // console.log("berhasil send", res)
        })
        .catch((err) => {
          // console.log("gagal send", err, err.response)
        });
      // console.log(data)
    } catch (error) {
      // console.log(error)
      alert('err', error);
    }
  };

  useEffect(() => {
    getDataModel();
    getDataBrand();
    getDataUMDNS();
    getDataDepartement();
    getDataGMDN();
    getGenerateID();
  }, []);

  const getDataModel = useCallback(() => {
    HttpRequestExternal.getAssetModel()
      .then((res) => {
        // console.log("model", res)
        setDataModel(res.data.data);
      })
      .catch((err) => {
        // console.log("data model err", err, err.response)
      });
  }, [dataModel]);

  const getDataBrand = useCallback(() => {
    HttpRequestExternal.getAssetBrand()
      .then((res) => {
        // console.log("brand", res)
        setDataBrand(res.data.data);
      })
      .catch((err) => {
        // console.log("data brand err", err, err.response)
      });
  }, [dataBrand]);

  const getDataDepartement = useCallback(() => {
    HttpRequestExternal.getDepartment()
      .then((res) => {
        // console.log("departemen", res)
        setDataDepartement(res.data.data);
      })
      .catch((err) => {
        // console.log("data department err", err, err.response)
      });
  }, [dataDepartement]);

  const getDataUMDNS = useCallback(() => {
    HttpRequestExternal.getUmdns()
      .then((res) => {
        // console.log("umdns", res)
        setDataUMDNS(res.data.data);
      })
      .catch((err) => {
        // console.log("data umdns errr", err, err.response)
      });
  }, [dataUmdns]);

  const getDataGMDN = useCallback(() => {
    HttpRequestExternal.getGdmn()
      .then((res) => {
        // console.log('GMDN', res.data.data)
        setDataGMDN(res.data.data);
      })
      .catch((err) => {
        // console.log("data gmdn err", err, err.response)
      });
  }, [dataGmdn]);

  const getGenerateID = useCallback(() => {
    HttpRequestExternal.generateId()
      .then((res) => {
        // console.log("id", res.data)
        setGenerateID(res.data);
      })
      .catch((err) => {
        // console.log("data generateid", err, err.response)
      });
  }, [generateId]);

  return (
    <div className='px-3 sm:px-6'>
      <Link href={`#`}>
        <a className='inline-block mb-4 font-semibold text-primary-600 hover:underline'>
          Back to Registration List
        </a>
      </Link>
      <div className='mb-4'>
        <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
          Register Asset
        </h1>
      </div>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='flex flex-col px-3 space-y-4 sm:px-6 lg:space-x-6 lg:space-y-0 lg:flex-row'>
            <div className='p-6 bg-white rounded-lg shadow-lg dark:bg-gray-900'>
              <div className='flex flex-row'>
                <div className='p-5 border border-black rounded-sm'>
                  <QRCode
                    value={'aaaa'}
                    //logoImage='/ptpi/mini-logo.jpg'
                    logoWidth={40}
                    size={200}
                  />
                </div>
                <div className='flex flex-1 px-4'>
                  <div className='grid w-full grid-flow-row auto-rows-max'>
                    <div className='grid grid-rows-2 gap-5 sm:grid-cols-1 lg:grid-cols-3'>
                      <div className='flex flex-col'>
                        <label htmlFor='asset_name'>Asset Name : </label>
                        <div className='mt-1'>
                          <Input
                            id='asset_name'
                            errorMessage={errors?.asset_name?.message}
                            {...register('asset_name', {
                              required: 'Required',
                            })}
                          />
                        </div>
                      </div>
                      <div className='flex flex-col'>
                        <label htmlFor='asset_id'>Asset id : </label>
                        <div className='mt-1'>
                          <Input
                            id='asset_id'
                            errorMessage={errors?.asset_id?.message}
                            {...register('asset_id', { required: 'Required' })}
                          />
                        </div>
                      </div>
                      <div className='flex flex-col'>
                        <label htmlFor='model'>Model : </label>
                        <div className='mt-1'>
                          <MySelect
                            id='model'
                            errorMessage={errors?.model?.message}
                            {...register('model', { required: 'Required' })}
                          >
                            {dataModel.map((item, index) => {
                              return (
                                <option key={index} value={item.id}>
                                  {item.model_name}
                                </option>
                              );
                            })}
                          </MySelect>
                        </div>
                      </div>
                      <div className='flex flex-col col-span-2'>
                        <label htmlFor='brand'>brand : </label>
                        <div className='mt-1'>
                          <MySelect
                            id='brand'
                            errorMessage={errors?.brand?.message}
                            {...register('brand', { required: 'Required' })}
                          >
                            {dataBrand.map((item, index) => {
                              return (
                                <option key={index} value={item.id}>
                                  {item.brand_name}
                                </option>
                              );
                            })}
                          </MySelect>
                        </div>
                      </div>
                      <div className='flex flex-col'>
                        <label htmlFor='type'>Type :</label>
                        <div className='mt-1'>
                          <Input
                            id='type'
                            errorMessage={errors?.type?.message}
                            {...register('type', { required: 'Required' })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='grid grid-flow-row auto-rows-max'>
                <div className='grid grid-flow-row-dense grid-cols-3 gap-5 py-3'>
                  <div className='flex flex-col'>
                    <label htmlFor='umdns'>UMDNS : </label>
                    <div className='mt-1'>
                      <Input
                        id='umdns'
                        errorMessage={errors?.umdns?.message}
                        {...register('umdns', { required: 'Required' })}
                      />
                    </div>
                  </div>
                  <div className='flex flex-col'>
                    <label htmlFor='gmdn'>GMDN : </label>
                    <div className='mt-1'>
                      <Input
                        id='gmdn'
                        errorMessage={errors?.gmdn?.message}
                        {...register('gmdn', { required: 'Required' })}
                      />
                    </div>
                  </div>
                  <div className='flex flex-col'>
                    <label htmlFor='serial_number'>Serial Number : </label>
                    <div className='mt-1'>
                      <Input
                        id='serial_number'
                        errorMessage={errors?.serial_number?.message}
                        {...register('serial_number', { required: 'Required' })}
                      />
                    </div>
                  </div>
                </div>
                <div className='flex py-2 sm:flex-row'>
                  <div className='grid gap-4 sm:grid-cols-1 lg:grid-cols-3'>
                    <div className='flex flex-col flex-1'>
                      <label htmlFor='manufacturer_date'>
                        Manufacturer Date :{' '}
                      </label>
                      <div className='mt-5'>
                        <Input
                          id='manufacturer_date'
                          type='date'
                          // defaultValue="2022-01-01T12:30"
                          defaultValue={format(new Date(), 'yyyy-MM-dd hh:mm')
                            .split(' ')
                            .join('T')}
                          errorMessage={errors?.manufacturer_date?.message}
                          {...register('manufacturer_date')}
                        />
                      </div>
                    </div>
                    <div className='grid sm:grid-cols-1 grid-row-2'>
                      <label htmlFor='manufacturer'>
                        Manufacturer Warranty Expiration Date :{' '}
                      </label>
                      <div className='grid grid-flow-row-dense gap-5 sm:grid-cols-1 lg:grid-cols-2'>
                        <div className='flex flex-col'>
                          <label className='sm:truncate' htmlFor='start_date'>
                            Sart :{' '}
                          </label>
                          <Input
                            id='start_date'
                            type='date'
                            // defaultValue="2022-01-01T12:30"
                            defaultValue={format(new Date(), 'yyyy-MM-dd hh:mm')
                              .split(' ')
                              .join('T')}
                            errorMessage={errors?.start_date?.message}
                            {...register('start_date')}
                          />
                        </div>
                        <div className='flex flex-col'>
                          <label className='sm:truncate' htmlFor='end_date'>
                            End :{' '}
                          </label>
                          <Input
                            id='end_date'
                            type='date'
                            // defaultValue="2022-01-01T12:30"
                            defaultValue={format(new Date(), 'yyyy-MM-dd hh:mm')
                              .split(' ')
                              .join('T')}
                            errorMessage={errors?.end_date?.message}
                            {...register('end_date')}
                          />
                        </div>
                      </div>
                    </div>
                    <div className='flex flex-col'>
                      <label htmlFor='manufacturer_recommended_daily_use'>
                        Manufacturer Recommended Daily Use (Hours) :{' '}
                      </label>
                      <div className='mt-5'>
                        <Input
                          id='manufacturer_recommended_daily_use'
                          type='number'
                          errorMessage={
                            errors?.manufacturer_recommended_daily_use?.message
                          }
                          {...register('manufacturer_recommended_daily_use')}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className='grid grid-flow-row py-3 auto-rows-max sm:grid-cols-1 lg:grid-cols-2'>
                  <div className='flex flex-col mr-3'>
                    <label htmlFor='mobility_portability'>
                      Mobility, Portability :{' '}
                    </label>
                    <Input
                      id='mobility_portability'
                      errorMessage={errors?.mobility_portability?.message}
                      {...register('mobility_portability', {
                        required: 'Required',
                      })}
                    />
                  </div>
                  <div className='flex flex-col mr-3'>
                    <label htmlFor='life_expectancy'>Life expectancy : </label>
                    <Input
                      id='life_expectancy'
                      errorMessage={errors?.life_expectancy?.message}
                      {...register('life_expectancy', { required: 'Required' })}
                    />
                  </div>
                </div>
                <h3 className='py-2 text-xl font-bold'>Asset Location</h3>
                <div className='grid grid-flow-row-dense grid-rows-2 gap-5 sm:grid-cols-2 lg:grid-cols-4'>
                  <div className='flex flex-col'>
                    <label htmlFor='department'>Department : </label>
                    <Input
                      id='department'
                      errorMessage={errors?.department?.message}
                      {...register('department', { required: 'Required' })}
                    />
                  </div>
                  <div className='flex flex-col'>
                    <label htmlFor='building'>Building : </label>
                    <Input
                      id='building'
                      errorMessage={errors?.building?.message}
                      {...register('building', { required: 'Required' })}
                    />
                  </div>
                  <div className='flex flex-col'>
                    <label htmlFor='floor'>Floor : </label>
                    <Input
                      id='floor'
                      errorMessage={errors?.floor?.message}
                      {...register('floor', { required: 'Required' })}
                    />
                  </div>
                  <div className='flex flex-col'>
                    <label htmlFor='room'>Room : </label>
                    <Input
                      id='room'
                      errorMessage={errors?.room?.message}
                      {...register('room', { required: 'Required' })}
                    />
                  </div>
                </div>
                <h3 className='py-4 text-xl font-bold'>
                  Technical Characteristic
                </h3>
                <div className='flex sm:flex-row'>
                  <div className='grid grid-flow-row-dense gap-5 py-2 md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
                    <div className='flex flex-col'>
                      <label htmlFor='environmental_specification'>
                        Environmental Specification :{' '}
                      </label>
                      <div className='mt-5'>
                        <Input
                          id='environmental_specification'
                          errorMessage={
                            errors?.environmental_specification?.message
                          }
                          {...register('environmental_specification', {
                            required: 'Required',
                          })}
                        />
                      </div>
                    </div>
                    <div className='flex flex-col'>
                      <label htmlFor='list_of_accessories'>
                        List of Accessories :{' '}
                      </label>
                      <div className='mt-5'>
                        <Input
                          id='list_of_accessories'
                          errorMessage={errors?.list_of_accessories?.message}
                          {...register('list_of_accessories', {
                            required: 'Required',
                          })}
                        />
                      </div>
                    </div>
                    <div className='flex sm:flex-col lg:flex-col'>
                      <h2 className='text-sm'>
                        Electrical Source Requirement:{' '}
                      </h2>
                      <div className='grid grid-flow-row-dense gap-5 md:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4'>
                        <div className='flex flex-col'>
                          <label className='md:truncate' htmlFor='phase'>
                            Phase :{' '}
                          </label>
                          <Input
                            id='phase'
                            type='number'
                            errorMessage={errors?.phase?.message}
                            {...register('phase', { required: 'Required' })}
                          />
                        </div>
                        <div className='flex flex-col'>
                          <label className='md:truncate' htmlFor='volt'>
                            Volt :{' '}
                          </label>
                          <Input
                            id='volt'
                            type='number'
                            errorMessage={errors?.volt?.message}
                            {...register('volt', { required: 'Required' })}
                          />
                        </div>
                        <div className='flex flex-col'>
                          <label className='md:truncate' htmlFor='amp'>
                            Amp (A) :{' '}
                          </label>
                          <Input
                            id='amp'
                            type='number'
                            errorMessage={errors?.amp?.message}
                            {...register('amp', { required: 'Required' })}
                          />
                        </div>
                        <div className='flex flex-col'>
                          <label className='md:truncate' htmlFor='freq'>
                            Freq (Hz) :{' '}
                          </label>
                          <Input
                            id='freq'
                            type='number'
                            errorMessage={errors?.freq?.message}
                            {...register('freq', { required: 'Required' })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='grid grid-flow-row-dense gap-5 py-3 sm:grid-cols-1 lg:grid-cols-6'>
                  <div className='flex flex-col'>
                    <h2 className='text-sm'>
                      Battery Charger Characteristics:{' '}
                    </h2>
                    <div className='grid grid-flow-row-dense gap-5 py-2 sm:grid-cols-1 lg:grid-cols-2'>
                      <div className='flex flex-col'>
                        <label htmlFor='volt_a'>Volt: </label>
                        <Input
                          id='volt_a'
                          type='number'
                          errorMessage={errors?.volt_a?.message}
                          {...register('volt_a', { required: 'Required' })}
                        />
                      </div>
                      <div className='flex flex-col'>
                        <label htmlFor='amp_a'>Amp (A) : </label>
                        <Input
                          id='amp_a'
                          type='number'
                          errorMessage={errors?.amp_a?.message}
                          {...register('amp_a', { required: 'Required' })}
                        />
                      </div>
                    </div>
                  </div>
                  <div className='flex flex-col'>
                    <label className='md:truncate' htmlFor='weight'>
                      Weight (KG):{' '}
                    </label>
                    <div className='sm:mt-15 md:mt-13 lg:mt-8'>
                      <Input
                        id='weight'
                        type='number'
                        errorMessage={errors?.weight?.message}
                        {...register('weight', { required: 'Required' })}
                      />
                    </div>
                  </div>
                  <div className='flex flex-col'>
                    <label className='md:truncate' htmlFor='dimension'>
                      Dimension (W x H x L) (mm):{' '}
                    </label>
                    <div className='sm:mt-15 md:mt-13 lg:mt-8'>
                      <Input
                        id='dimension'
                        type='number'
                        errorMessage={errors?.dimension?.message}
                        {...register('dimension', { required: 'Required' })}
                      />
                    </div>
                  </div>
                  <div className='flex flex-col'>
                    <label className='md:truncate' htmlFor='power'>
                      Power (Watt):{' '}
                    </label>
                    <div className='sm:mt-15 md:mt-13 lg:mt-8'>
                      <Input
                        id='power'
                        type='number'
                        errorMessage={errors?.power?.message}
                        {...register('power', { required: 'Required' })}
                      />
                    </div>
                  </div>
                  <div className='flex flex-col'>
                    <label className='md:truncate' htmlFor='material'>
                      Material:{' '}
                    </label>
                    <div className='sm:mt-15 md:mt-13 lg:mt-8'>
                      <Input
                        id='material'
                        errorMessage={errors?.material?.message}
                        {...register('material', { required: 'Required' })}
                      />
                    </div>
                  </div>
                  <div className='flex flex-col'>
                    <label className='md:truncate' htmlFor='shelf'>
                      Shelf Life (Year):{' '}
                    </label>
                    <div className='sm:mt-15 md:mt-13 lg:mt-8'>
                      <Input
                        id='shelf'
                        type='number'
                        errorMessage={errors?.shelf?.message}
                        {...register('shelf', { required: 'Required' })}
                      />
                    </div>
                  </div>
                </div>

                <h3 className='py-2 text-xl font-bold'>Datasheet : </h3>
                <div className='flex sm:flex-row lg:flex-row'>
                  {/* <FaDochub /> */}
                  <div className='flex flex-col mr-3'>
                    <Input
                      id='identity-card-image'
                      type='file'
                      accept='image/png, image/jpeg'
                      // onChange={onImageIdentityCardChange}
                    />
                  </div>
                </div>
                <h3 className='py-3 text-xl font-bold'>Supplier Information</h3>
                <div className='grid grid-flow-row-dense grid-rows-2 gap-5 sm:grid-cols-2 lg:grid-cols-4'>
                  <div className='flex flex-col mr-3'>
                    <label htmlFor='supplier_company_name'>
                      Supplier Company Name:{' '}
                    </label>
                    <Input
                      id='supplier_company_name'
                      errorMessage={errors?.supplier_company_name?.message}
                      {...register('supplier_company_name', {
                        required: 'Required',
                      })}
                    />
                  </div>
                  <div className='flex flex-col mr-3'>
                    <label htmlFor='supplier_address'>Supplier Address: </label>
                    <Input
                      id='supplier_address'
                      errorMessage={errors?.supplier_address?.message}
                      {...register('supplier_address', {
                        required: 'Required',
                      })}
                    />
                  </div>
                  <div className='flex flex-col mr-3'>
                    <label htmlFor='supplier_phone'>
                      Supplier Phone/ Fax:{' '}
                    </label>
                    <Input
                      id='supplier_phone'
                      errorMessage={errors?.supplier_phone?.message}
                      {...register('supplier_phone', { required: 'Required' })}
                    />
                  </div>
                  <div className='flex flex-col mr-3'>
                    <label htmlFor='supplier_email'>Supplier Email: </label>
                    <Input
                      id='supplier_email'
                      errorMessage={errors?.supplier_email?.message}
                      {...register('supplier_email', { required: 'Required' })}
                    />
                  </div>
                </div>

                <h3 className='py-3 text-xl font-bold'>
                  Purchasing Information
                </h3>
                <div className='grid grid-flow-row-dense gap-5 sm:grid-cols-1 lg:grid-cols-3 grid-row-2'>
                  <div className='flex flex-col mr-3'>
                    <label htmlFor='purchase_order_no'>
                      Supplier Purchase Order No:{' '}
                    </label>
                    <Input
                      id='purchase_order_no'
                      errorMessage={errors?.purchase_order_no?.message}
                      {...register('purchase_order_no', {
                        required: 'Required',
                      })}
                    />
                  </div>
                  <div className='flex flex-col mr-3'>
                    <label htmlFor='price'>Price: </label>
                    <Input
                      id='price'
                      type='number'
                      errorMessage={errors?.price?.message}
                      {...register('price', { required: 'Required' })}
                    />
                  </div>
                  <div className='flex flex-col mr-3'>
                    <label className='sm:truncate' htmlFor='purchase_date'>
                      Purchase Date :{' '}
                    </label>
                    <Input
                      id='purchase_date'
                      type='date'
                      // defaultValue="2022-01-01T12:30"
                      defaultValue={format(new Date(), 'yyyy-MM-dd hh:mm')
                        .split(' ')
                        .join('T')}
                      errorMessage={errors?.purchase_date?.message}
                      {...register('purchase_date')}
                    />
                  </div>
                  <div className='flex flex-col mr-3'>
                    <label
                      className='sm:truncate'
                      htmlFor='supplier_warranty_expiration_date'
                    >
                      Supplier Warranty Expiration Date :{' '}
                    </label>
                    <Input
                      id='supplier_warranty_expiration_date'
                      type='date'
                      // defaultValue="2022-01-01T12:30"
                      defaultValue={format(new Date(), 'yyyy-MM-dd hh:mm')
                        .split(' ')
                        .join('T')}
                      errorMessage={
                        errors?.supplier_warranty_expiration_date?.message
                      }
                      {...register('supplier_warranty_expiration_date')}
                    />
                  </div>
                  <div className='flex flex-col mr-3'>
                    <label className='sm:truncate' htmlFor='duration_for_spare'>
                      Duration for spare part availibility (Year) :{' '}
                    </label>
                    <Input
                      id='duration_for_spare'
                      type='number'
                      errorMessage={errors?.duration_for_spare?.message}
                      {...register('duration_for_spare')}
                    />
                  </div>
                </div>

                <h3 className='py-3 text-xl font-bold'>
                  Maintenance Information
                </h3>
                <div className='grid grid-flow-row-dense grid-rows-2 gap-5 sm:grid-cols-2 lg:grid-cols-4'>
                  <div className='flex flex-col mr-3'>
                    <label htmlFor='service_provider_company_name'>
                      Service Provider Company Name:{' '}
                    </label>
                    <Input
                      id='service_provider_company_name'
                      errorMessage={
                        errors?.service_provider_company_name?.message
                      }
                      {...register('service_provider_company_name', {
                        required: 'Required',
                      })}
                    />
                  </div>
                  <div className='flex flex-col mr-3'>
                    <label htmlFor='service_provider_address'>
                      Service Provider Address:{' '}
                    </label>
                    <Input
                      id='service_provider_address'
                      errorMessage={errors?.service_provider_address?.message}
                      {...register('service_provider_address', {
                        required: 'Required',
                      })}
                    />
                  </div>
                  <div className='flex flex-col mr-3'>
                    <label htmlFor='service_provider_number'>
                      Service Provider number:{' '}
                    </label>
                    <Input
                      id='service_provider_number'
                      errorMessage={errors?.service_provider_number?.message}
                      {...register('service_provider_number', {
                        required: 'Required',
                      })}
                    />
                  </div>
                  <div className='flex flex-col mr-3'>
                    <label htmlFor='service_provider_email'>
                      Service Provider Email:{' '}
                    </label>
                    <Input
                      id='service_provider_email'
                      errorMessage={errors?.service_provider_email?.message}
                      {...register('service_provider_email', {
                        required: 'Required',
                      })}
                    />
                  </div>
                  <div className='flex flex-col mr-3 col-h2-2'>
                    <label
                      className='sm:truncate'
                      htmlFor='last_maintenace_date'
                    >
                      Last Maintenace Date:{' '}
                    </label>
                    <Input
                      id='last_maintenace_date'
                      type='date'
                      // defaultValue="2022-01-01T12:30"
                      defaultValue={format(new Date(), 'yyyy-MM-dd hh:mm')
                        .split(' ')
                        .join('T')}
                      errorMessage={errors?.last_maintenace_date?.message}
                      {...register('last_maintenace_date')}
                    />
                  </div>
                </div>
                <h3 className='py-3 text-xl font-bold'>Safety and Standards</h3>
                <div className='grid grid-flow-row-dense grid-rows-2 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
                  <div className='flex flex-col mr-3'>
                    <label htmlFor='risk_classification'>
                      Risk Classification:{' '}
                    </label>
                    <Input
                      id='risk_classification'
                      errorMessage={errors?.risk_classification?.message}
                      {...register('risk_classification', {
                        required: 'Required',
                      })}
                    />
                  </div>
                  <div className='flex flex-col mr-3'>
                    <label htmlFor='regulatory_approval'>
                      Risk Classification:{' '}
                    </label>
                    <Input
                      id='regulatory_approval'
                      errorMessage={errors?.regulatory_approval?.message}
                      {...register('regulatory_approval', {
                        required: 'Required',
                      })}
                    />
                  </div>
                  <div className='flex flex-col mr-3'>
                    <label htmlFor='international_standards'>
                      International Standards:{' '}
                    </label>
                    <Input
                      id='international_standards'
                      errorMessage={errors?.international_standards?.message}
                      {...register('international_standards', {
                        required: 'Required',
                      })}
                    />
                  </div>
                  <div className='flex flex-col mr-3'>
                    <label htmlFor='local_standards'>Local Standards: </label>
                    <Input
                      id='local_standards'
                      errorMessage={errors?.local_standards?.message}
                      {...register('local_standards', { required: 'Required' })}
                    />
                  </div>
                  <div className='flex flex-col mr-3'>
                    <label htmlFor='regulation'>Regulation: </label>
                    <Input
                      id='regulation'
                      errorMessage={errors?.regulation?.message}
                      {...register('regulation', { required: 'Required' })}
                    />
                  </div>
                </div>
                <h3 className='py-3 text-xl font-bold'>Documentation</h3>
                <p className='py-2'>
                  Upload related documents of the asset (e.g service manual,
                  operation manual, routine maintenance manual, disposal
                  procedure etc):
                </p>
                <Input
                  id='photo-image'
                  type='file'
                  multiple={true}
                  accept='image/png, image/jpeg'
                  // onChange={onImageIdentityCardChange}
                />
                <h3 className='py-2 text-xl font-bold'>
                  Hospital Asset Contact Person:
                </h3>
                <div className='grid grid-flow-row gap-5 sm:grid-cols-4 lg:grid-cols-6 auto-rows-max '>
                  <div className='flex flex-col'>
                    <label className='sm:truncate' htmlFor='asset_manager_name'>
                      Asset Manager Name:{' '}
                    </label>
                    <Input
                      id='asset_manager_name'
                      errorMessage={errors?.asset_manager_name?.message}
                      {...register('asset_manager_name', {
                        required: 'Required',
                      })}
                    />
                  </div>
                  <div className='flex flex-col'>
                    <label className='sm:truncate' htmlFor='asset_manager_id'>
                      Asset Manager ID:{' '}
                    </label>
                    <Input
                      id='asset_manager_id'
                      errorMessage={errors?.asset_manager_id?.message}
                      {...register('asset_manager_id', {
                        required: 'Required',
                      })}
                    />
                  </div>
                  <div className='flex flex-col'>
                    <label
                      className='sm:truncate'
                      htmlFor='asset_manager_contact_no'
                    >
                      Asset Manager Contact No:{' '}
                    </label>
                    <Input
                      id='asset_manager_contact_no'
                      errorMessage={errors?.asset_manager_contact_no?.message}
                      {...register('asset_manager_contact_no', {
                        required: 'Required',
                      })}
                    />
                  </div>
                  <div className='flex flex-col'>
                    <label className='sm:truncate' htmlFor='pic_name'>
                      PIC Name:{' '}
                    </label>
                    <Input
                      id='pic_name'
                      errorMessage={errors?.pic_name?.message}
                      {...register('pic_name', { required: 'Required' })}
                    />
                  </div>
                  <div className='flex flex-col'>
                    <label className='sm:truncate' htmlFor='pic_id'>
                      PIC Id:{' '}
                    </label>
                    <Input
                      id='pic_id'
                      errorMessage={errors?.pic_id?.message}
                      {...register('pic_id', { required: 'Required' })}
                    />
                  </div>
                  <div className='flex flex-col'>
                    <label className='sm:truncate' htmlFor='pic_contact'>
                      PIC Contact No:{' '}
                    </label>
                    <Input
                      id='pic_contact'
                      errorMessage={errors?.pic_contact?.message}
                      {...register('pic_contact', { required: 'Required' })}
                    />
                  </div>
                </div>
                <h2 className='py-2 text-xl font-bold'>Photo: </h2>
                <div>
                  <Input
                    id='photo-image'
                    type='file'
                    accept='image/png, image/jpeg'
                    // onChange={onImageIdentityCardChange}
                  />
                </div>
                <div className='flex flex-row'>
                  <div className='flex flex-1'></div>
                  <Button
                    type='submit'
                    isLoading={isSubmitting}
                    // disabled={!confirmIdentity || !confirmSignature}
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
