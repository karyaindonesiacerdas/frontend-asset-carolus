import React from 'react';
import PDFLayout from '../../components/PDFLayout';
import pdfHelper from '../../lib/pdfHelper';
import { HttpRequestExternal } from '../../utils/http';
import ComponentDetails from './ComponentDetails';

class Print extends React.Component {
    static async getInitialProps({ req, res, query }) {
        // // console.log("query", query)

        let resDetail = await HttpRequestExternal.getDetailLabelManagement(query?.id)
        // // console.log("data", resDetail)

        const buffer = await pdfHelper.componentToPDFBuffer(
            <PDFLayout>
                <ComponentDetails
                    id={query?.id}
                    detail={resDetail.data.data}
                />
            </PDFLayout>
        );

        // with this header, your browser will prompt you to download the file
        // without this header, your browse will open the pdf directly
        // res.setHeader('Content-disposition', 'attachment; filename="article.pdf');

        // set content type
        res.setHeader('Content-Type', 'application/pdf');

        // output the pdf buffer. once res.end is triggered, it won't trigger the render method
        res.end(buffer);

        return {};
    }

    render() {
        return (
            <div>Print Page</div>
        )
    }
}

export default Print;