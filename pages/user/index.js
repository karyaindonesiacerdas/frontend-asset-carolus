import Link from "next/link";
import Button from "../../components/Button";
import { HttpRequestExternal } from "../../utils/http";
import { PaginationTable } from "../../components/table/PaginationTable";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
import ModalDelete from "../../components/ModalDelete";

const notifyDel = () => toast.success("Successfully Delete!");
const notifyDelDel = (a) => toast.error("Failed! " + a);

export default function App(props) {
  const [listData, setListData] = useState([]);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);

  const getData = useCallback(() => {
    setIsLoading(true);
    HttpRequestExternal.getListUser()
      .then((res) => {
        const data = [];
        for (const item of res.data.data) {
          const status = item.status === 3 ? "Active" : "Inactive";
          data.push({
            ...item,
            status,
          });
        }

        setListData(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        setListData([]);
        notifyDelDel("Load Data");
      });
  }, [listData]);

  useEffect(() => {
    getData();
  }, []);

  const refreshData = useCallback(() => {
    router.replace(router.asPath);
    setIsLoading(true);
  }, []);

  const deleteData = useCallback(
    (id) => {
      setIsLoadingDelete(true);
      HttpRequestExternal.deleteUser(id)
        .then((response) => {
          refreshData();
          notifyDel();
          setIsLoadingDelete(false);
          setModalDelete(false);
        })
        .catch((error) => {
          notifyDelDel(error.response.data.message);
          setIsLoadingDelete(false);
          setModalDelete(false);
        });
    },
    [listData]
  );

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        Footer: "Name",
        accessor: "name",
      },
      {
        Header: "Email",
        Footer: "Email",
        accessor: "email",
      },
      {
        Header: "Phone",
        Footer: "Phone",
        accessor: "phone_number",
      },
      {
        Header: "Role",
        Footer: "Role",
        accessor: "role.alias",
      },
      {
        Header: "Status",
        Footer: "Status",
        accessor: "status",
      },
      {
        Header: "Action",
        Footer: "Action",
        accessor: "action",
        Cell: (data) => (
          <div className="flex flex-row">
            <Button
              onClick={() => {
                router.push({
                  pathname: "/user/detail",
                  query: {
                    id: data.row.original.id,
                  },
                });
              }}
            >
              edit
            </Button>
            <span className="px-2" />
            <Button
              variant="danger"
              className="bg-red-600 hover:bg-red-300"
              onClick={() => {
                setSelected(data.row.original.id);
                setModalDelete(true);
              }}
            >
              Delete
            </Button>
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
            User
          </h1>
        </div>
        <ModalDelete
          open={modalDelete}
          title="Delete Asset User"
          setOpen={() => setModalDelete(false)}
          isLoading={isLoadingDelete}
          action={() => {
            deleteData(selected);
          }}
        />
        <div className="flex items-center space-x-6">
          <Link href="/user/create">
            <a className="secondary-action-button">
              <span>Add User</span>
            </a>
          </Link>
        </div>
      </div>
      <div className="px-3 sm:px-6">
        <div className="overflow-hidden">
          <PaginationTable
            isLoading={isLoading}
            skeletonCols={5}
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
