// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { HttpRequestExternal } from "../../utils/http"

export default function handler(req, res) {
	HttpRequestExternal.postRegisteredAssets(req.body).then(response => {
		res.status(200).json(response.data);
	}).catch((error) => {
		res.status(500).json(error.response);
	});
}
