import PropTypes from 'prop-types';
import React from 'react';
import styles from './image.css';

const Image = ({
    style,
    className,
    src,
    alt,
    visible,
    height,
    width,
    newWidth,
    newHeight,
    newWidthInPercent,
    placeholderHeight,
    enableMasonry,
    specifyImageSizes,
    fixedSize,
    ...rest
}) => {
    return (
        <img
            {...rest}
            className={`${styles.image} ${className}`}
            src={visible ? src : null}
            alt={alt}
            style={{
                display: visible ? null : 'none',
                position: 'absolute',
                width: specifyImageSizes ? 'auto' : '100%',
                ...style,
            }}
            height={specifyImageSizes ? newHeight : 'auto'}
            width={specifyImageSizes ? newWidth : 'auto'}
        />
    );
};

Image.propTypes = {
    className: PropTypes.string,
    src: PropTypes.string.isRequired,
    alt: PropTypes.string,
    visible: PropTypes.bool,
};

Image.defaultProps = {
    className: '',
    alt: '',
    visible: true,
};

export default Image;
