import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import Image from './Image';

import style from './details.css';

const defaultRenderer = imageProps => {
    return (
        <Fragment>
            <Image
                onClick={imageProps.onClick}
                {...imageProps}
            />
            <div
                style={{
                    backgroundColor: 'rgb(187, 189, 191)',
                    paddingTop: `${imageProps.placeholderHeight}%`,
                }}
            />
        </Fragment>
    );
};

const DETAILS_IMAGE_HEIGHT = 300;

const defaultDetailsViewRenderer = ({visible, selectedImage, gutterInPercent}) => {
    return (
        <div
            className={visible ? style.container : style['container--disable']}
            style={{
                height: visible ? DETAILS_IMAGE_HEIGHT : 0,
                visibility: visible ? 'visible' : 'hidden',
                marginBottom: visible ? `${gutterInPercent}%` : 0,
            }}
        >

            <div className={style['image-wrapper']}>
                {visible && (
                    <Image
                        style={{
                            height: DETAILS_IMAGE_HEIGHT,
                            width: selectedImage.width / selectedImage.height * DETAILS_IMAGE_HEIGHT,
                        }}
                        src={selectedImage.src}
                    />
                )}
            </div>
        </div>
    );
};

defaultDetailsViewRenderer.propTypes = {
    visible: PropTypes.bool.isRequired,
    selectedImage: PropTypes.object.isRequired,
    gutterInPercent: PropTypes.number,
};

defaultDetailsViewRenderer.defaultProps = {
    gutterInPercent: 0,
};

export {
    defaultRenderer,
    defaultDetailsViewRenderer,
};
