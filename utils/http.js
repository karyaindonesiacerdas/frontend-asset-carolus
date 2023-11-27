import axios from "axios";
// import FormData from "form-data";
import qs from "qs";
import { store } from "../store";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const ASSET_BASE_URL = process.env.NEXT_PUBLIC_API_ASSET_URL;

axios.defaults.xsrfCookieName = "OTHERCOOKIE";
axios.defaults.xsrfHeaderName = "X-OTHERNAME";
axios.defaults.withCredentials = false;

const request = () => {
  return axios.create({
    timeout: 30000,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
};

const requestApi = () => {
  return axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
};

const requestAsset = () => {
  let user = store.getState().user;
  return axios.create({
    baseURL: ASSET_BASE_URL,
    timeout: 30000,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${user?.token}`,
    },
  });
};

const requestStatis = () => {
  return axios.create({
    baseURL: ASSET_BASE_URL,
    timeout: 30000,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
};

const requestWithAuth = (useFormData = false) => {
  let user = store.getState().user;
  // console.log("Token", user.key);

  return axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
    headers: {
      Accept: "application/json",
      "Content-Type": useFormData
        ? "application/x-www-form-urlencoded"
        : "application/json",
      Authorization: "token " + user.key,
    },
  });
};

const requestWithCookies = () => {
  let user = store.getState().user;

  return axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.token}`,
    },
  });
};

export const HttpRequest = {
  login(data) {
    return request().post("/api/login/", data);
  },

  postRegisteredAssets(data) {
    return request().post("/api/registered-assets/", data);
  },
};

export const HttpRequestExternal = {
  login(data) {
    return requestApi().post("/auth/login/", data);
  },

  getPatient() {
    return requestWithCookies().get(
      "/patient/patient?sort_unix_created_at=asc&limit=5&page=1"
    );
  },
  getInstitation() {
    return requestWithCookies().get("/institution/institution");
  },

  getRole(data) {
    return requestWithCookies().get("/user/role");
  },

  getUserAll() {
    return requestWithCookies().get(
      "/user/user?limit=100&page=1&sort_unix_created_at=desc"
    );
  },

  me() {
    return requestWithCookies().get(
      "/user/user/token?column=id,name,phone_number,email,approved,institution_id"
    );
  },

  getPICID(id) {
    return requestWithCookies().get(
      "/user/user?limit=10&page=1&sort_unix_created_at=desc&filter_users_role_id=3f6121cb-0b7c-4607-9033-d48fd4b7fede"
    );
  },

  getAssetManager(id) {
    return requestWithCookies().get(
      "/user/user?limit=10&page=1&sort_unix_created_at=desc&filter_users_role_id=987cad58-e9d4-490f-804c-6b25fc9ba47c"
    );
  },

  uploadFile(data) {
    return requestAsset().post("/v1/upload/", data);
  },

  uploadMutipleFile(data) {
    return requestAsset().post("/v1/upload-multiple", data);
  },

  uploadImage(data) {
    let form = new FormData();
    form.append("file", data);
    return requestAsset().post("/v1/file/upload-image", form);
  },

  uploadImageMutiple(data) {
    return requestAsset().post("/v1/file/upload-image-multiple", data);
  },

  uploadStatisFile(data) {
    let form = new FormData();
    form.append("file", data);
    return requestAsset().post("/v1/file/upload-document", form);
  },

  uploadStatisFileMutiple(data) {
    let form = new FormData();
    for (let i = 0; i < data.length; i++) {
      form.append("file", data[i]);
    }
    return requestAsset().post("/v1/file/upload-document-multiple", form);
  },

  generateId() {
    return requestAsset().get("/v1/component/generate-id");
  },

  getAssets() {
    return requestAsset().get("/v1/asset/");
  },

  getRegisteredAssets() {
    return requestAsset().get("/v1/asset-registration");
  },
  postRegisteredAssets(data) {
    return requestAsset().post("/v1/asset-registration/create", data);
  },

  getDetailRegestrationDetail(id) {
    return requestAsset().get("/v1/asset-registration/detail/" + id);
  },

  updateRegistrationDetail(id, data) {
    return requestAsset().post("/v1/asset-registration/update/" + id, data);
  },

  getDepartment() {
    return requestAsset().get("/v1/department");
  },
  getDetailDepartment(id) {
    return requestAsset().get("/v1/department/detail/" + id);
  },
  saveDepartment(data) {
    return requestAsset().post("/v1/department/create/", data);
  },
  updateDepartment(id, data) {
    return requestAsset().post("/v1/department/update/" + id, data);
  },
  deleteDepartment(id) {
    return requestAsset().get("/v1/department/delete/" + id);
  },

  getAssetModel() {
    return requestAsset().get("/v1/asset-model");
  },
  getAssetModelDetail(id) {
    return requestAsset().get("/v1/asset-model/detail/" + id);
  },
  getAssetBrand() {
    return requestAsset().get("/v1/asset-brand");
  },
  updateAssetModel(id, data) {
    return requestAsset().post("/v1/asset-model/update/" + id, data);
  },
  saveAssetModel(data) {
    return requestAsset().post("/v1/asset-model/create", data);
  },
  saveAssetBrand(data) {
    return requestAsset().post("/v1/asset-brand/create", data);
  },
  updateAssetBrand(id, data) {
    return requestAsset().post("/v1/asset-brand/update/" + id, data);
  },
  deleteAssetBrand(id) {
    return requestAsset().get("/v1/asset-brand/delete/" + id);
  },
  deleteAssetModel(id) {
    return requestAsset().get("/v1/asset-model/delete/" + id);
  },
  getAssetBrandDetail(id) {
    return requestAsset().get("/v1/asset-brand/detail/" + id);
  },
  getUmdns() {
    return requestAsset().get("/v1/master-umdns");
  },
  getUmdnsDetail(id) {
    return requestAsset().get("/v1/master-umdns/detail/" + id);
  },
  updateUmdns(id, data) {
    return requestAsset().post("/v1/master-umdns/update/" + id, data);
  },
  saveUmdns(data) {
    return requestAsset().post("/v1/master-umdns/create", data);
  },

  getGdmn() {
    return requestAsset().get("/v1/master-gmdn");
  },
  saveGdmn(data) {
    return requestAsset().post("/v1/master-gmdn/create", data);
  },
  getGdmnDetail(id) {
    return requestAsset().get("/v1/master-gmdn/detail/" + id);
  },
  updateGdmn(id, data) {
    return requestAsset().post("/v1/master-gmdn/update/" + id, data);
  },
  deleteGdmn(id) {
    return requestAsset().get("/v1/master-gmdn/delete/" + id);
  },

  getBuilding() {
    return requestAsset().get("/v1/building");
  },
  saveBuilding(data) {
    return requestAsset().post("/v1/building/create", data);
  },
  getBuildingDetail(id) {
    return requestAsset().get("/v1/building/detail/" + id);
  },
  updateBuilding(id, data) {
    return requestAsset().post("/v1/building/update/" + id, data);
  },
  deleteBuilding(id) {
    return requestAsset().get("/v1/building/delete/" + id);
  },

  getFloor() {
    return requestAsset().get("/v1/floor");
  },
  saveFloor(data) {
    return requestAsset().post("/v1/floor/create", data);
  },
  getFloorDetail(id) {
    return requestAsset().get("/v1/floor/detail/" + id);
  },

  getRoom() {
    return requestAsset().get("/v1/room");
  },
  saveRoom(data) {
    return requestAsset().post("/v1/room/create", data);
  },
  getRoomDetail(id) {
    return requestAsset().get("/v1/room/detail/" + id);
  },
  updateRoom(id, data) {
    return requestAsset().post("/v1/room/update/" + id, data);
  },
  deleteRoom(id) {
    return requestAsset().get("/v1/room/delete/" + id);
  },

  getAssetType() {
    return requestAsset().get("/v1/asset-type/");
  },
  saveAssetType(data) {
    return requestAsset().post("/v1/asset-type/create", data);
  },
  getAssetTypeDetail(id) {
    return requestAsset().get("/v1/asset-type/detail/" + id);
  },
  updateAssetType(id, data) {
    return requestAsset().post("/v1/asset-type/update/" + id, data);
  },
  deleteAssetType(id) {
    return requestAsset().get("/v1/asset-type/delete/" + id);
  },

  deleteUmdns(id) {
    return requestAsset().get("/v1/master-umdns/delete/" + id);
  },
  deleteRegisteredAsset(id) {
    return requestAsset().get("/v1/asset-registration/delete/" + id);
  },

  scanAsset(id) {
    return requestAsset().get("/v1/asset-registration/detail/" + id);
  },

  listBooking(limit, page) {
    return requestAsset().get("/v1/asset-booking", limit, page);
  },

  listUnit() {
    return requestAsset().get("/v1/unit");
  },

  saveUnit(data) {
    return requestAsset().post("/v1//unit/create", data);
  },

  getDetailUnit(id) {
    return requestAsset().get("/v1/unit/detail/" + id);
  },

  updateUnit(id, data) {
    return requestAsset().post("/v1/unit/update/" + id, data);
  },

  deleteUnit(id) {
    return requestAsset().get("/v1/unit/delete/" + id);
  },

  requestBooking(data) {
    return requestAsset().post("/v1/asset-booking/request-booking", data);
  },

  getDetailBooking(id) {
    return requestAsset().get("/v1/asset-booking/detail-booking/" + id);
  },

  approveBooking(id, data) {
    return requestAsset().post("/v1/asset-booking/approve-booking/" + id, data);
  },

  getAssetBooking(id) {
    return requestAsset().get("/v1/asset-return/get-booking/" + id);
  },

  returnAssetBooking(id, data) {
    return requestAsset().post("/v1/asset-return/request-return/" + id, data);
  },
  getAssetReturn() {
    return requestAsset().get("/v1/asset-return");
  },
  dashboardStatistic(data) {
    return requestAsset().post("/v1/dashboard/statistik", data);
  },

  getReturnAssetDetail(id) {
    return requestAsset().get("/v1/asset-return/get-booking-byid/" + id);
  },

  getCheckingPoint() {
    return requestAsset().get("/v1/asset-return/data-checking-point");
  },

  checkingReturnAsset(id, data) {
    return requestAsset().post("/v1/asset-return/checking-asset/" + id, data);
  },

  getListAssetBooking() {
    return requestAsset().get("/v1/asset-return/get-list-booking");
  },

  getListStatisAssetBooking() {
    return requestStatis().get("/v1/asset-return/get-list-booking");
  },

  getLabelManagement() {
    return requestAsset().get("/v1/label-management");
  },
  getDetailLabelManagement(id) {
    return requestAsset().get("/v1/label-management/detail/" + id);
  },
  getDashboardHome() {
    return requestWithCookies().get(
      "/patient/patient/hospital?filter_member_institution_id=04317e23-8882-408b-9b19-563c8b8f967e"
    );
  },
  getIncomeHome() {
    return requestWithCookies().get("/payment/order/total-income");
  },

  getSupplier() {
    return requestAsset().get("/v1/supplier");
  },
  getDetailSupplier(id) {
    return requestAsset().get("/v1/supplier/detail/" + id);
  },
  getVendor() {
    return requestWithCookies().get(
      "/patient/patient/hospital?filter_member_institution_id=04317e23-8882-408b-9b19-563c8b8f967e"
    );
  },

  deleteSupplier(id) {
    return requestAsset().get("/v1/supplier/delete/" + id);
  },

  updateSuplier(id, data) {
    return requestAsset().post("/v1/supplier/update/" + id, data);
  },

  saveSupplier(data) {
    return requestAsset().post("/v1/supplier/create", data);
  },

  getListChecking() {
    return requestAsset().get("/v1/master-checking-point");
  },

  detailChecking(id) {
    return requestAsset().get("/v1/master-checking-point/detail/" + id);
  },

  updateChecking(id, data) {
    return requestAsset().post("/v1/master-checking-point/update/" + id, data);
  },

  saveChecking(data) {
    return requestAsset().post("/v1/master-checking-point/create", data);
  },

  deleteChecking(id) {
    return requestAsset().get("/v1/master-checking-point/delete/" + id);
  },

  getListBooking() {
    return requestAsset().get("/v1/asset-booking/get-list-asset");
  },

  getEmploye() {
    return requestWithCookies().get("/human-capital/employee?page=1000");
  },
  getDetailEmploye(id) {
    return requestWithCookies().get("/human-capital/employee/" + id);
  },

  //for all data asset
  getListAssetBox() {
    return requestAsset().get("/v1/asset-return/get-list-asset/");
  },
  //for select tanggal
  getDetailListAssetBox(id) {
    return requestAsset().get("/v1/asset-return/get-list-booking/" + id);
  },
  //for detail box
  getAssetBookingById(id) {
    return requestAsset().get("/v1/asset-return/get-booking-byid/" + id);
  },

  getDetailFloor(id) {
    return requestAsset().get("/v1/floor/detail/" + id);
  },
  updateFloor(id, data) {
    return requestAsset().post("/v1/floor/update/" + id, data);
  },
  deleteFloor(id) {
    return requestAsset().get("/v1/floor/delete/" + id);
  },

  getListLevel() {
    return requestAsset().get("/v1/level");
  },
  saveLevel(data) {
    return requestAsset().post("/v1/level/create", data);
  },
  getDetailLevel(id) {
    return requestAsset().get("/v1/level/detail/" + id);
  },
  updateLevel(id, data) {
    return requestAsset().post("/v1/level/update/" + id, data);
  },
  deleteLevel(id) {
    return requestAsset().get("/v1/level/delete/" + id);
  },

  getListUser() {
    return requestWithCookies().get("/user/user");
  },
  saveUser(data) {
    return requestWithCookies().post("/user/user/create-from-admin", data);
  },
  getDetailUser(id) {
    return requestWithCookies().get("/user/user/id/" + id);
  },
  updateUser(id, data) {
    return requestWithCookies().put("/user/user/update-from-admin/" + id, data);
  },
  updatePassword(data) {
    return requestWithCookies().put("/user/user/update-password-from-admin/", data);
  },
  deleteUser(id) {
    return requestWithCookies().delete("/user/user/delete-from-admin/" + id);
  },

  checkEmployee(user_id, role_id) {
    return requestWithCookies().get(
      `employee?filter_employee_user_id=${user_id}&filter_role_id=${role_id}`
    );
  },
  saveEmployee(data) {
    return requestWithCookies().post("/human-capital/employee", data);
  },
};

export const FormDataConverter = {
  convert(data) {
    let form_data = new FormData();

    for (let key in data) {
      form_data.append(key, data[key]);
    }

    return form_data;
  },
};

export const HttpUtils = {
  normalizeUrl(url) {
    if (url != null) {
      return url.substr(0, url.indexOf("?"));
    }
    return null;
  },
};

export const HttpResponse = {
  processMessage(msg, alternateMessage = "Error processing data") {
    if (msg) {
      let data = msg.data;
      let messages = [];
      Object.keys(data).forEach((key) => {
        let arr = data[key];
        if (Array.isArray(arr)) {
          messages.push(key + " - " + arr.join(" "));
        } else {
          messages.push(key + " - " + arr);
        }
      });
      if (messages.length == 0) {
        return alternateMessage;
      }
      return messages.join(" ");
    }
    return alternateMessage;
  },
};
