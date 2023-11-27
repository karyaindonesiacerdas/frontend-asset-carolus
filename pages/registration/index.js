import React, { useEffect, useState, useMemo, useCallback } from "react";
import { PaginationTable } from "../../components/table/PaginationTable";
import { PlusIcon } from "@heroicons/react/outline";
import Link from "next/link";
import { HttpRequest, HttpRequestExternal } from "../../utils/http";
import moment from "moment";
import Button from "../../components/Button";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
import ModalDelete from "../../components/ModalDelete";
import { store } from "../../store";

const notifyDel = () => toast.success("Successfully Delete!");
const notifyDelDel = (a) => toast.error("Failed! " + a);

export default function App(props) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [listData, setListData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);

  const user = store.getState().user;

  const loadData = useCallback(() => {
    setIsLoading(true);
    HttpRequestExternal.getRegisteredAssets()
      .then((response) => {
        setListData(response.data.data);
        // console.log("data list registerd", response.data.data)
        setIsLoading(false);
      })
      .catch((error) => {
        // console.log(error, error.response);
        setIsLoading(false);
        setListData([]);
      });
  }, [listData]);

  const deleteData = useCallback((id) => {
    setIsLoadingDelete(true);
    HttpRequestExternal.deleteRegisteredAsset(id)
      .then((response) => {
        refreshData();
        notifyDel();
        setIsLoadingDelete(false);
        setModalDelete(false);
        // console.log("sukses", response)
      })
      .catch((error) => {
        notifyDelDel(error.response.data.message);
        setIsLoadingDelete(false);
        setModalDelete(false);
        // console.log(error, error.response);
      });
  }, []);

  const refreshData = useCallback(() => {
    router.replace(router.asPath);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: "Name Equipment",
        accessor: "Name Equipment",
        accessor: "equipments_name",
      },
      {
        Header: "Serial Number",
        Footer: "Serial Number",
        accessor: "serial_number",
      },
      {
        Header: "Model",
        Footer: "Model",
        accessor: "data_model.model_name",
      },
      {
        Header: "Brand",
        Footer: "Brand",
        accessor: "data_brand.brand_name",
      },
      {
        Header: "Quantity",
        Footer: "Quantity",
        accessor: "quantity",
      },
      {
        Header: "Manufactur Date",
        Footer: "Manufactur Date",
        accessor: "manufacturing_date_format",
        Cell: ({ value }) => {
          return value ? value : "";
        },
      },
      {
        Header: "Action",
        accessor: "action",
        Cell: (data) => (
          <div className="flex flex-row">
            <Button
              onClick={() => {
                // // console.log('data', data)
                router.push({
                  pathname: "/registration/detail",
                  query: {
                    id: data.row.original.id,
                  },
                });
              }}
            >
              Open
            </Button>

            {[
              "super-admin",
              "admin",
              "hospital-admin",
              "asset-manager",
            ].includes(user?.employee?.role?.alias) && (
              <>
                <span className="px-2" />
                <Button
                  variant="danger"
                  className="bg-red-600 hover:bg-red-300"
                  onClick={() => {
                    setModalDelete(true);
                    setSelected(data.row.original.id);
                  }}
                >
                  Delete
                </Button>
              </>
            )}
          </div>
        ),
      },
    ],
    []
  );

  return (
    <>
      <div className="flex items-center justify-between px-3 mb-6 sm:px-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Registration
          </h1>
        </div>
      </div>
      <ModalDelete
        open={modalDelete}
        title="Delete Asset Registration"
        setOpen={() => setModalDelete(false)}
        isLoading={isLoadingDelete}
        action={() => {
          deleteData(selected);
        }}
      />
      <div className="flex items-center justify-between px-3 mb-6 sm:px-6">
        <span className="flex flex-1" />
        {["super-admin", "admin", "hospital-admin", "asset-manager"].includes(
          user?.employee?.role?.alias
        ) && (
          <div className="flex items-center space-x-6">
            <Link href="/registration/create">
              <a className="secondary-action-button">
                <span>Add Asset Registration</span>
              </a>
            </Link>
          </div>
        )}

        {/* <div className='flex items-center spacex-6'>
                    <Link href="/registration/newCreate">
                        <a>
                            <span>Add New Registration</span>
                        </a>
                    </Link>
                </div> */}
      </div>
      <div className="px-3 sm:px-6">
        {/* <ServerPagination
                    currentPage={1}
                    firstPage={1}
                    lastPage={1}
                    totalPage={1}
                    isFetching={isFetching}
                    isLoading={isLoading}
                    isRefetching={isRefetching}
                    refetch={refetch}
                    limit={limit}
                    setLimit={setLimit}
                    page={page}
                    setPage={setPage}
                /> */}
        <div className="overflow-hidden">
          <PaginationTable
            isLoading={isLoading}
            // isFetching={isFetching}
            skeletonCols={7}
            showFooter={false}
            data={listData}
            columns={columns}
            searchable={true}
            pagination={true}
            extraPaddingBottom={false}
          />
        </div>
      </div>
    </>
  );
}
