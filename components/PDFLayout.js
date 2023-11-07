import React from 'react';
import PropTypes from 'prop-types';

const PDFLayout = ({ children }) => (
    <html>
        <head>
            <meta charSet="utf8" />
        </head>
        <body>
            {children}
        </body>
    </html>
);

PDFLayout.propTypes = {
    children: PropTypes.node,
};

export default PDFLayout;
