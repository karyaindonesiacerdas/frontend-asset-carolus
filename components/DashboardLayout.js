import { useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState, Fragment, useCallback } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { BellIcon, MenuAlt2Icon, XIcon } from "@heroicons/react/outline";
import { useDispatch } from "react-redux";
import { setUser } from "../store/actions";
import Modal from "./Modal";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const OPEN_ALL = process.env.REACT_APP_OPEN_ALL || false;

const dashboardNavItems = [
  {
    name: "Home",
    href: "/",
    current: false,
    open: true,
  },
];

const masterDataNavItems = [
  {
    name: "Department",
    href: "/department",
    current: false,
    open: true,
  },
  {
    name: "Institution",
    href: "/institution",
    current: false,
    open: true,
  },
  {
    name: "Level",
    href: "/level",
    current: false,
    open: true,
  },
  {
    name: "Room/Location",
    href: "/room",
    current: false,
    open: true,
  },
  {
    name: "Role",
    href: "/role",
    current: false,
    open: true,
  },
  {
    name: "GMDN",
    href: "/gmdn",
    current: false,
    open: true,
  },
  {
    name: "UMDNS",
    href: "/umdns",
    current: false,
    open: true,
  },
  {
    name: "Asset Brand",
    href: "/assets-brand",
    current: false,
    open: true,
  },
  {
    name: "Asset Model",
    href: "/assets-model",
    current: false,
    open: true,
  },
  {
    name: "Asset Type",
    href: "/assets-type",
    current: false,
    open: true,
  },
  {
    name: "Building",
    href: "/building",
    current: false,
    open: true,
  },
  {
    name: "Visual Checking",
    href: "/checking-visual",
    current: false,
    open: true,
  },
  {
    name: "Supplier Asset",
    href: "/suplier-management",
    currrent: false,
    open: true,
  },
  {
    name: "Floor",
    href: "/floor",
    current: false,
    open: true,
  },
];

const userManagementNavItems = [
  {
    name: "User",
    href: "/user",
    current: false,
    open: true,
  },
];

const labelManagementNavItems = [
  {
    name: "Label Management",
    href: "/label-management",
    current: false,
    open: true,
  },
];

const assetManagementNavItems = [
  {
    name: "Registration",
    href: "/registration",
    current: false,
    open: true,
  },
  {
    name: "Mutation",
    href: "/mutation",
    current: false,
    open: true,
  },
  {
    name: "Returned Asset",
    href: "/returned-asset",
    current: false,
    open: true,
  },
];

export default function DashboardLayout({ children, href }) {
  const logo = process.env.logo ?? "/ptpi/main-logo.png";
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [logoutModal, setLogoutModal] = useState(false);

  const logout = useCallback(() => {
    setTimeout(() => {
      dispatch(setUser(null));
      window.location.reload();
    }, 1000);
  }, []);

  useEffect(() => {}, [user]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-800">
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-40 flex lg:hidden"
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="relative flex flex-col flex-1 w-full max-w-xs pt-5 pb-4 bg-white dark:bg-gray-900">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute top-0 right-0 pt-2 -mr-12">
                  <button
                    type="button"
                    className="flex items-center justify-center w-10 h-10 ml-1 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XIcon className="w-6 h-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </Transition.Child>
              <div className="flex items-center flex-shrink-0 px-4 space-x-4"></div>
              <div className="flex-1 h-0 mt-5 overflow-y-auto">
                <nav className="flex-1 px-2 space-y-1 bg-white dark:bg-gray-900">
                  <div className="flex flex-col flex-1 px-2">
                    <DashboardNav />
                    <AssetManagementNav />
                    {((user?.employee?.role &&
                      [
                        "super-admin",
                        "admin",
                        "hospital-admin",
                        "asset-manager",
                      ].includes(user?.employee?.role?.alias)) ||
                      OPEN_ALL) && (
                      <>
                        <LabelManagementNav />
                        <UserManagementNav />
                        <MasterDataNav />
                      </>
                    )}
                  </div>
                </nav>
              </div>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition.Root>

      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-[220px]">
          <div className="flex flex-col flex-grow pt-3 pb-4 overflow-y-auto bg-white border-r border-gray-200 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-center flex-shrink-0 px-4 -ml-4 space-x-4">
              <img className="w-auto h-12" src={logo} alt="IVF" />
            </div>
            <div className="flex flex-col flex-grow mt-5">
              <nav className="flex-1 px-2 space-y-1 bg-white dark:bg-gray-900">
                <DashboardNav />
                <AssetManagementNav />
                {((user?.employee?.role &&
                  [
                    "super-admin",
                    "admin",
                    "hospital-admin",
                    "asset-manager",
                  ].includes(user?.employee?.role?.alias)) ||
                  OPEN_ALL) && (
                  <>
                    <LabelManagementNav />
                    <UserManagementNav />
                    <MasterDataNav />
                  </>
                )}
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <div className="relative z-10 flex flex-shrink-0 h-16 shadow bg-primary-600">
          <button
            type="button"
            className="px-4 text-gray-500 border-r border-gray-200 dark:border-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-600 lg:hidden "
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuAlt2Icon
              className="w-6 h-6 text-white dark:text-gray-900"
              aria-hidden="true"
            />
          </button>
          <div className="flex justify-between flex-1 px-4">
            <div className="flex flex-1"> </div>
            <div className="flex items-center ml-4 space-x-3 md:ml-6">
              <button
                type="button"
                className="relative p-2 text-gray-400 transition bg-white rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-50 focus:ring-offset-primary dark:bg-gray-900 dark:hover:bg-gray-800"
              >
                <span className="sr-only">View notifications</span>
                <BellIcon
                  className="w-6 h-6 text-primary-600"
                  aria-hidden="true"
                />
                <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-secondary-500 animate-ping"></span>
                <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-secondary-500"></span>
              </button>

              <Menu as="div" className="relative ml-3">
                <div>
                  <Menu.Button className="flex items-center max-w-xs p-1 text-sm transition bg-white rounded-full dark:bg-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-50 focus:ring-offset-primary">
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="w-8 h-8 rounded-full"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt=""
                    />
                    <div className="flex flex-col items-start pl-2 pr-4">
                      <p className="font-semibold text-gray-800 dark:text-white text-sm -mt-0.5">
                        {user?.user?.data?.data?.name}
                      </p>
                      <p className="font-semibold uppercase text-gray-500 dark:text-gray-400 text-xs -mt-0.5">
                        {user?.employee?.role?.name}
                      </p>
                    </div>
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 w-48 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg dark:bg-gray-900 ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => {
                            setLogoutModal(true);
                          }}
                          className={classNames(
                            active ? "bg-gray-100 dark:bg-gray-800" : "",
                            "block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 w-full text-left dark:hover:bg-gray-800"
                          )}
                        >
                          Logout
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>

        <main className="relative flex-1 overflow-y-auto focus:outline-none">
          <div className="py-6">{children}</div>

          <Modal
            showModal={logoutModal}
            titleModal="Logout"
            actionCancel={() => {
              setLogoutModal(false);
            }}
            descriptionModal="Apakah Anda Yakin mau Logout?"
            actionTitle="Logout"
            action={() => {
              setLogoutModal(false);
              logout();
            }}
          />
        </main>
      </div>
    </div>
  );
}

const DashboardNav = () => {
  const router = useRouter();
  return (
    <>
      <span className="inline-block px-2 py-2 pt-6 text-sm font-semibold uppercase dark:text-white">
        Dashboard
      </span>
      {dashboardNavItems
        .filter((item) => item.open)
        .map((item) => (
          <Link key={item.name} href={item.href}>
            <a
              className={classNames(
                (
                  router.pathname === "/"
                    ? router.pathname === item.href
                    : router.pathname.startsWith(item.href) && item.href !== "/"
                )
                  ? "text-white bg-primary-600 dark:text-gray-900 focus:ring-offset-2"
                  : "text-gray-600 dark:text-gray-300 dark:hover:text-gray-900 hover:bg-gray-50 hover:text-gray-900",
                "group flex items-center px-4 py-2 text-sm font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-800  transition"
              )}
            >
              {item.name}
            </a>
          </Link>
        ))}
    </>
  );
};

const MasterDataNav = () => {
  const router = useRouter();
  return (
    <>
      <span className="inline-block px-2 py-2 pt-6 text-sm font-semibold uppercase dark:text-white">
        MASTER DATA
      </span>
      {masterDataNavItems
        .filter((item) => item.open)
        .map((item) => (
          <Link key={item.name} href={item.href}>
            <a
              className={classNames(
                (
                  router.pathname === "/"
                    ? router.pathname === item.href
                    : router.pathname.startsWith(item.href) && item.href !== "/"
                )
                  ? "text-white bg-primary-600 dark:text-gray-900 focus:ring-offset-2"
                  : "text-gray-600 dark:text-gray-300 dark:hover:text-gray-900 hover:bg-gray-50 hover:text-gray-900",
                "group flex items-center px-4 py-2 text-sm font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-800  transition"
              )}
            >
              {item.name}
            </a>
          </Link>
        ))}
    </>
  );
};

const UserManagementNav = () => {
  const router = useRouter();
  return (
    <>
      <span className="inline-block px-2 py-2 pt-6 text-sm font-semibold uppercase dark:text-white">
        USER MANAGEMENT
      </span>
      {userManagementNavItems
        .filter((item) => item.open)
        .map((item) => (
          <Link key={item.name} href={item.href}>
            <a
              className={classNames(
                (
                  router.pathname === "/"
                    ? router.pathname === item.href
                    : router.pathname.startsWith(item.href) && item.href !== "/"
                )
                  ? "text-white bg-primary-600 dark:text-gray-900 focus:ring-offset-2"
                  : "text-gray-600 dark:text-gray-300 dark:hover:text-gray-900 hover:bg-gray-50 hover:text-gray-900",
                "group flex items-center px-4 py-2 text-sm font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-800  transition"
              )}
            >
              {item.name}
            </a>
          </Link>
        ))}
    </>
  );
};

const LabelManagementNav = () => {
  const router = useRouter();
  return (
    <>
      <span className="inline-block px-2 py-2 pt-6 text-sm font-semibold uppercase dark:text-white">
        LABEL MANAGEMENT
      </span>
      {labelManagementNavItems
        .filter((item) => item.open)
        .map((item) => (
          <Link key={item.name} href={item.href}>
            <a
              className={classNames(
                (
                  router.pathname === "/"
                    ? router.pathname === item.href
                    : router.pathname.startsWith(item.href) && item.href !== "/"
                )
                  ? "text-white bg-primary-600 dark:text-gray-900 focus:ring-offset-2"
                  : "text-gray-600 dark:text-gray-300 dark:hover:text-gray-900 hover:bg-gray-50 hover:text-gray-900",
                "group flex items-center px-4 py-2 text-sm font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-800  transition"
              )}
            >
              {item.name}
            </a>
          </Link>
        ))}
    </>
  );
};

const AssetManagementNav = () => {
  const router = useRouter();
  return (
    <>
      <span className="inline-block px-2 py-2 pt-6 text-sm font-semibold uppercase dark:text-white">
        ASSET MANAGEMENT
      </span>
      {assetManagementNavItems
        .filter((item) => item.open)
        .map((item) => (
          <Link key={item.name} href={item.href}>
            <a
              className={classNames(
                (
                  router.pathname === "/"
                    ? router.pathname === item.href
                    : router.pathname.startsWith(item.href) && item.href !== "/"
                )
                  ? "text-white bg-primary-600 dark:text-gray-900 focus:ring-offset-2"
                  : "text-gray-600 dark:text-gray-300 dark:hover:text-gray-900 hover:bg-gray-50 hover:text-gray-900",
                "group flex items-center px-4 py-2 text-sm font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-800  transition"
              )}
            >
              {item.name}
            </a>
          </Link>
        ))}
    </>
  );
};
