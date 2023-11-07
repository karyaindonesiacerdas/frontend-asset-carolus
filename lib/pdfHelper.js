import { renderToStaticMarkup } from 'react-dom/server';
import pdf from 'html-pdf';

const componentToPDFBuffer = (component) => {
    return new Promise((resolve, reject) => {
        const html = renderToStaticMarkup(component);

        const options = {
            // format: 'A4',
            // border: '10mm',
            height: "6cm",        // allowed units: mm, cm, in, px
            width: "10cm",            // allowed units: mm, cm, in, px
            orientation: 'landscape',
            type: 'pdf',
            timeout: 30000,
        };

        const buffer = pdf?.create(html, options).toBuffer((err, buffer) => {
            if (err) {
                return reject(err);
            }

            return resolve(buffer);
        });
    });
}

export default {
    componentToPDFBuffer
}