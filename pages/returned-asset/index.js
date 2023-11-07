import { useSelector } from "react-redux";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { PaginationTable } from "../../components/table/PaginationTable";
import { PlusIcon } from "@heroicons/react/outline";
import Link from "next/link";
import { HttpRequest, HttpRequestExternal } from "../../utils/http";
import moment from "moment";
import Button from "../../components/Button";
import { useRouter } from "next/router";

export default function App(props) {
  const user = useSelector((state) => state.user);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [listData, setListData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const loadData = useCallback(() => {
    setIsLoading(true);
    HttpRequestExternal.getAssetReturn()
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

  useEffect(() => {
    loadData();
  }, []);

  const data = [
    {
      Header: "User Name",
      Footer: "User Name",
      accessor: "user_name",
    },
    {
      Header: "Asset Name",
      Footer: "Asset Name",
      accessor: "data_asset.equipments_name",
    },
    {
      Header: "Status",
      Footer: "Status",
      accessor: "status_booking_name",
    },
    {
      Header: "Quantity",
      Footer: "Quantity",
      accessor: "quantity",
    },
    {
      Header: "Date Return",
      Footer: "Date Return",
      accessor: "request_return_date_format",
    },
    {
      Header: "Action",
      Footer: "Action",
      accessor: "action",
      Cell: (data) => (
        <Button
          onClick={() => {
            router.push({
              pathname: "/returned-asset/detail",
              query: {
                id: data.row.original.id,
              },
            });
          }}
        >
          Open
        </Button>
      ),
    },
  ];

  const columns = useMemo(() => {
    if (
      user?.employee?.role &&
      !["super-admin", "admin", "hospital-admin", "asset-manager"].includes(
        user?.employee?.role?.alias
      )
    ) {
      data.pop();
    }

    return data;
  }, []);

  return (
    <>
      <div className="flex items-center justify-between px-3 mb-6 sm:px-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Returned Asset
          </h1>
        </div>
      </div>
      <div className="flex items-center justify-between px-3 mb-6 sm:px-6">
        <span className="flex flex-1" />
        {user?.employee?.role &&
          ["super-admin", "admin", "hospital-admin", "asset-manager"].includes(
            user?.employee?.role?.alias
          ) && (
            <div className="flex items-center space-x-6">
              <button
                onClick={() => {
                  router.push({
                    pathname: "/returned-asset/request",
                  });
                }}
              >
                <a className="secondary-action-button">
                  <span>Request Return Asset</span>
                </a>
              </button>
            </div>
          )}
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

        <PaginationTable
          isLoading={isLoading}
          // isFetching={isFetching}
          skeletonCols={6}
          showFooter={false}
          data={listData}
          columns={columns}
          searchable={true}
          pagination={true}
          extraPaddingBottom={false}
        />
      </div>
    </>
  );
}
