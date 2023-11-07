import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { QRCode } from 'react-qrcode-logo';
import { useReactToPrint } from 'react-to-print';
import { PrinterIcon } from '@heroicons/react/outline';
import Spinner from './Spinner';
import { HttpRequestExternal } from '../utils/http';

const PrintLabelModal = ({ isOpen, setIsOpen, dataId }) => {
  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [labelDetails, setLabelDetails] = useState(null);

  const getDetailLabel = useCallback(async () => {
    setIsLoading(true);
    try {
      let res = await HttpRequestExternal.getDetailLabelManagement(dataId);
      // console.log("data", res?.data?.data)
      setLabelDetails(res?.data?.data);
      setIsLoading(false);
    } catch (error) {
      // console.log("err", error)
      setIsLoading(false);
    }
  });

  useEffect(() => {
    if (isOpen) {
      getDetailLabel();
    }
  }, [isOpen, dataId]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as='div'
        className='fixed inset-0 z-10 overflow-y-auto'
        onClose={() => setIsOpen(false)}
      >
        <div className='min-h-screen px-4 text-center'>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Dialog.Overlay className='fixed inset-0 bg-black/50' />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className='inline-block h-screen align-middle'
            aria-hidden='true'
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0 scale-95'
            enterTo='opacity-100 scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 scale-100'
            leaveTo='opacity-0 scale-95'
          >
            <div className='inline-block w-full max-w-xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl'>
              <Dialog.Title
                as='h3'
                className='text-lg font-medium leading-6 text-gray-900'
              >
                Print Label
              </Dialog.Title>
              {isLoading ? (
                <div className='flex items-center justify-center h-60'>
                  <Spinner className='w-20 h-20 animate-spin text-primary-600' />
                </div>
              ) : (
                <div className='mt-4 space-y-4'>
                  <div
                    ref={componentRef}
                    className='flex w-auto border-4 rounded-md border-primary-600 print:m-4'
                  >
                    <QRCode
                      value={dataId || ''}
                      //logoImage='/ptpi/mini-logo.jpg'
                      size={160}
                      logoWidth={40}
                    />
                    <div className='px-6 py-4'>
                      <dl className='space-y-1'>
                        <div>
                          <dt className='text-sm text-gray-600'>Asset Name</dt>
                          <dd className='-mt-0.5 font-semibold text-gray-900'>
                            {labelDetails?.equipments_name || '-'}
                          </dd>
                        </div>
                        <div>
                          <dt className='text-sm text-gray-600'>
                            Serial Number
                          </dt>
                          <dd className='-mt-0.5 font-semibold text-gray-900'>
                            {labelDetails?.serial_number || '-'}
                          </dd>
                        </div>
                        <div>
                          <dt className='text-sm text-gray-600'>Brand Name</dt>
                          <dd className='-mt-0.5 font-semibold text-gray-900'>
                            {labelDetails?.data_brand?.brand_name || '-'}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                  <div className='flex justify-end mt-4 space-x-4'>
                    <button
                      onClick={() => setIsOpen(false)}
                      className='px-6 shadow py-1.5 rounded-full bg-white text-sm font-semibold text-gray-700 hover:bg-gray-100   transition flex items-center space-x-2'
                    >
                      Close
                    </button>
                    <button
                      onClick={handlePrint}
                      className='pl-3 pr-4 shadow py-1.5 rounded-full bg-primary-300 text-sm font-semibold text-gray-700 hover:bg-primary-600 hover:text-white transition flex items-center space-x-2'
                    >
                      <PrinterIcon className='w-5 h-5' />
                      <span>Print</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PrintLabelModal;
