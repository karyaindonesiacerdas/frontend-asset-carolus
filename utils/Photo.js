const ASSET_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_ASSET_URL;
export default {
    get(image) { 
        let result = image
        if (image?.includes("http") || image?.includes("https")) {
            return result
        } else {
            if (image == "") {
                return ASSET_BASE_URL + "/empty_img_square.jpg"
            } else {
                return ASSET_BASE_URL + "/" + image
            }
        }
    }
}