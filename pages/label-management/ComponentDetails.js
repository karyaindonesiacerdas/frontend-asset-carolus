import { useCallback, useEffect, useState } from "react"
import { QRCode } from 'react-qrcode-logo'
import { HttpRequestExternal } from "../../utils/http"

export default function ComponentDetails(props) {
    return (
        <div>
            <table border="1px" color="#000" style={{borderCollapse:'collapse'}}>
                <tr>
                    <td rowSpan={2} style={{padding: 5}}>
                        <img src={"https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=" + props?.id} />
                    </td>
                    <td style={{padding: 5}}>
                        {props?.id}
                    </td>
                </tr>
                <tr>
                    <td style={{padding: 5}}>
                        <span>{props?.detail?.equipments_name ?? "-"}</span> <br />
                        <span>{props?.detail?.data_brand?.brand_name ?? "-"}</span>
                    </td>
                </tr>
            </table>
        </div>
    )
}