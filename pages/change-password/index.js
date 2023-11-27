import { useForm } from "react-hook-form";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { HttpRequestExternal } from "../../utils/http";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { store } from "../../store";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/actions";

const notify = (a) => toast.success("Successfully! " + a);
const notifyGagal = (a) => toast.error("Failed! " + a);

export default function App(props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const router = useRouter();
  const user = store.getState().user;
  const dispatch = useDispatch();

  const onSubmit = (value) => {
    let param = {
      email: user.user.data.data.email,
      old_password: value.old_password,
      password: value.password,
    };

    HttpRequestExternal.updatePassword(param)
      .then((res) => {
        notify(res.data.message);
        setTimeout(() => {
          dispatch(setUser(null));
          window.location.reload();
        }, 1000);
      })
      .catch((err) => {
        notifyGagal(err.response.data.message);
      });
  };

  return (
    <div className="flex flex-col px-4 mb-6 sm:px-6 md:px-8 ">
      <h1 className="text-xl font-bold text-gray-900 dark:text-white">
        Change Password
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
                    Old Password
                  </label>
                  <div className="mt-1">
                    <Input
                      type="password"
                      errorMessage={errors?.old_password?.message}
                      {...register("old_password", {
                        required: "Old password is required",
                      })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <div className="mt-1">
                    <Input
                      type="password"
                      errorMessage={errors?.password?.message}
                      {...register("password", {
                        required: "Password is required",
                      })}
                    />
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
