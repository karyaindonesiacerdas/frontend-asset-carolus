import Link from "next/link";
import { useForm } from "react-hook-form";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { HttpRequestExternal } from "../../utils/http";
import { useRouter } from "next/router";
import { useEffect, useState, useCallback } from "react";
import MySelect from "../../components/MySelect";
import toast, { Toaster } from "react-hot-toast";

const notify = (a) => toast.success("Successfully! " + a);
const notifyGagal = (a) => toast.error("Failed! " + a);

export default function App(props) {
  const [dataDetail, setDetail] = useState([]);
  const [dataRole, setDataRole] = useState([]);
  const [dataInstitution, setDataInstitution] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const createEmployee = (value) => {
    HttpRequestExternal.saveEmployee(value)
      .then((res) => {
        notify(res.data.message);
      })
      .catch((err) => {
        notifyGagal(err.response.data.message);
      });
  };

  const checkEmployee = (value) => {
    const { institution_id, user_id, role_id,  name } = value;
    HttpRequestExternal.checkEmployee(user_id, role_id).catch((err) => {
      if (role_id) {
        createEmployee({
          institution_id,
          user_id,
          profession_id: role_id,
          name
        });
      }
    });
  };

  const onSubmit = (value) => {
    HttpRequestExternal.updateUser(router.query.id, value)
      .then((res) => {
        const { id, institution_id, role_id,  name } = res.data.data;
        checkEmployee({
          institution_id,
          user_id: id,
          profession_id: role_id,
          role_id,
          name
        });

        notify(res.data.message);
        setTimeout(() => {
          router.back();
        }, 1000);
      })
      .catch((err) => {
        notifyGagal(err.response.data.message);
      });
  };

  const getDetail = useCallback(() => {
    setIsLoading(true);
    HttpRequestExternal.getDetailUser(router.query.id)
      .then((res) => {
        let data = res.data.data;
        setDetail(data);
        setValue("name", data.name);
        setValue("email", data.email);
        setValue("phone_number", data.phone_number);
        setValue("profession", data.role.alias);
        setValue("institution_id", data.institution_id);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        notifyGagal(err.message);
      });
  }, [dataDetail]);

  const getRole = useCallback(() => {
    HttpRequestExternal.getRole()
      .then((res) => {
        let data = res.data.data;
        setDataRole(data);
      })
      .catch((err) => {
        notifyGagal("Role" + err.message);
      });
  }, [dataRole]);

  const getInstitation = useCallback(() => {
    HttpRequestExternal.getInstitation()
      .then((res) => {
        let data = res.data.data;
        setDataInstitution(data);
      })
      .catch((err) => {
        notifyGagal("Insttitation" + err.response.data.message);
      });
  }, [dataInstitution]);

  useEffect(() => {
    getRole();
    getInstitation();
    getDetail();
  }, []);

  return (
    <div className="flex flex-col px-4 mb-6 sm:px-6 md:px-8 ">
      <Link href={`/user`}>
        <a className="inline-block mb-4 font-semibold text-primary-600 hover:underline">
          Back to User List
        </a>
      </Link>
      <h1 className="text-xl font-bold text-gray-900 dark:text-white">
        User | Edit
      </h1>

      <div className="p-3 my-3 bg-white">
        <div className="flex flex-row">
          <div className="flex-1 p-3">
            <form
              className="mt-8 space-y-6 accent-primary"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Name
                  </label>
                  <div className="mt-1">
                    <Input
                      errorMessage={errors?.name?.message}
                      {...register("name", { required: "required field" })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </label>
                  <div className="mt-1">
                    <Input
                      type="email"
                      errorMessage={errors?.email?.message}
                      {...register("email", { required: "required field" })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Phone
                  </label>
                  <div className="mt-1">
                    <Input
                      errorMessage={errors?.phone_number?.message}
                      {...register("phone_number", {
                        required: "required field",
                      })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Profession
                  </label>
                  <div className="mt-1">
                    <MySelect
                      id="profession"
                      errorMessage={errors?.profession?.message}
                      {...register("profession", {
                        required: "profession is required",
                      })}
                    >
                      {dataRole.map((item, role) => {
                        return (
                          <option key={role} value={item.alias}>
                            {item.name}
                          </option>
                        );
                      })}
                    </MySelect>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Institution
                  </label>
                  <div className="mt-1">
                    <MySelect
                      id="institution_id"
                      errorMessage={errors?.institution_id?.message}
                      {...register("institution_id", {
                        required: "institution is required",
                      })}
                    >
                      {dataInstitution.map((item, institution) => {
                        return (
                          <option key={institution} value={item.id}>
                            {item.name}
                          </option>
                        );
                      })}
                    </MySelect>
                  </div>
                </div>
              </div>

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
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
