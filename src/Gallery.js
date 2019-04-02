import PropTypes from 'prop-types';
import React, {Component} from 'react';
import equal from 'fast-deep-equal';
import Engine, {
    COLUMN_MAX_HEIGHT,
    COLUMN_MAX_WIDTH,
    COLUMNS_MAX_COUNT,
    GUTTER_IN_PERCENT,
    DEFAULT_FIXED_SIZE,
    DEFAULT_FIXED_BOTTOM,
    DEFAULT_FIXED_GUTTER,
} from './Engine';
import {defaultRenderer, defaultDetailsViewRenderer} from './Renderer';
import ViewMonitor from './ViewMonitor';
import style from './gallery.css';

class Gallery extends Component {

    constructor(props) {
        super(props);
        this.engine = new Engine();
    }

    static propTypes = {
        imageRenderer: PropTypes.func,
        images: PropTypes.array.isRequired,
        columnsMaxCount: PropTypes.number,
        columnMaxWidth: PropTypes.number,
        columnMaxHeight: PropTypes.number,
        gutterInPercent: PropTypes.number,
        className: PropTypes.string,
        columnClassName: PropTypes.string,
        rowClassName: PropTypes.string,
        enableMasonry: PropTypes.bool,
        disableObserver: PropTypes.bool,
        disableActualImage: PropTypes.bool,
        enableFixed: PropTypes.bool,
        fixedSize: PropTypes.number,
        fixedBottom: PropTypes.number,
        fixedGutter: PropTypes.number,
        enableDetailView: PropTypes.bool,
        detailsViewRenderer: PropTypes.func,
    };

    static defaultProps = {
        imageRenderer: defaultRenderer,
        columnsMaxCount: COLUMNS_MAX_COUNT,
        columnMaxWidth: COLUMN_MAX_WIDTH,
        columnMaxHeight: COLUMN_MAX_HEIGHT,
        gutterInPercent: GUTTER_IN_PERCENT,
        className: '',
        columnClassName: '',
        rowClassName: '',
        enableMasonry: false,
        disableObserver: false,
        disableActualImage: false,
        enableFixed: false,
        fixedSize: DEFAULT_FIXED_SIZE,
        fixedBottom: DEFAULT_FIXED_BOTTOM,
        fixedGutter: DEFAULT_FIXED_GUTTER,
        enableDetailView: false,
        detailsViewRenderer: defaultDetailsViewRenderer,
    };

    state = {
        columns: [],
        rows: [],
        selectedImageRow: null,
        selectedImageId: null,
        selectedImageRowPrev: null,
        selectedImageIdPrev: null,
        selectedImage: null,
        selectedRowHeight: 0,
        selectedImageProps: {},
    };

    componentWillMount() {
        const {
            images,
            columnsMaxCount,
            columnMaxWidth,
            columnMaxHeight,
            gutterInPercent,
            enableMasonry,
            disableObserver,
            disableActualImage,
            className,
            columnClassName,
            rowClassName,
            enableFixed,
            fixedSize,
            fixedBottom,
            fixedGutter,
            enableDetailView,
        } = this.props;

        this.engine
            .setImages(images)
            .setMaxColumnsCount(columnsMaxCount)
            .setColumnMaxWidth(columnMaxWidth)
            .setColumnMaxHeight(columnMaxHeight)
            .setGutterInPercent(gutterInPercent);

        this.setState({
            columns: this.engine.buildColumns(),
            rows: this.engine.buildRows(),
            columnsMaxCount,
            columnMaxWidth,
            columnMaxHeight,
            gutterInPercent,
            enableMasonry,
            disableObserver,
            disableActualImage,
            className,
            columnClassName,
            rowClassName,
            enableFixed,
            fixedSize,
            fixedBottom,
            fixedGutter,
            enableDetailView,
        });
    }

    componentWillReceiveProps(nextProps) {
        if (!equal(this.props, nextProps)) {

            this.engine
                .setImages(nextProps.images)
                .setMaxColumnsCount(nextProps.columnsMaxCount)
                .setColumnMaxWidth(nextProps.columnMaxWidth)
                .setColumnMaxHeight(nextProps.columnMaxHeight)
                .setGutterInPercent(nextProps.gutterInPercent);

            this.setState({
                columns: this.engine.buildColumns(),
                rows: this.engine.buildRows(),
                columnsMaxCount: nextProps.columnsMaxCount,
                columnMaxWidth: nextProps.columnMaxWidth,
                columnMaxHeight: nextProps.columnMaxHeight,
                gutterInPercent: nextProps.gutterInPercent,
                enableMasonry: nextProps.enableMasonry,
                disableObserver: nextProps.disableObserver,
                disableActualImage: nextProps.disableActualImage,
                className: nextProps.className,
                columnClassName: nextProps.columnClassName,
                rowClassName: nextProps.rowClassName,
                enableFixed: nextProps.enableFixed,
                fixedSize: nextProps.fixedSize,
                fixedBottom: nextProps.fixedBottom,
                fixedGutter: nextProps.fixedGutter,
                enableDetailView: nextProps.enableDetailView,
            });
        }
    }

    renderMasonryGallery({
        className, columnClassName, imageRenderer, disableObserver, disableActualImage, columns,
    }) {
        return (
            <div
                className={`${style.container} ${className}`}
            >
                {columns.map((item, columnIndex) => (
                    <div
                        /* eslint-disable-next-line react/no-array-index-key */
                        key={`column-${columnIndex}`}
                        className={`${style.item} ${columnClassName}`}
                        style={{
                            width: `${100 / this.engine.getMaxColumnsCount() - this.engine.getGutterInPercent()}%`,
                            maxWidth: 'auto',
                            margin: `0 ${this.engine.getGutterInPercent()}% 0 0`,
                        }}
                    >
                        {
                            item.images.map((image, imageIndex) => {
                                const placeholderHeight = 100 * image.height / image.width;
                                return (
                                    <div
                                        /* eslint-disable-next-line react/no-array-index-key */
                                        key={`image-${image.src}-${columnIndex}-${imageIndex}`}
                                        style={{
                                            margin: `0 0 ${
                                                this.engine.getGutterInPercent() * this.engine.getMaxColumnsCount()
                                            }% 0`,
                                        }}
                                    >
                                        <ViewMonitor
                                            disableObserver={disableObserver}
                                        >
                                            {isViewable => imageRenderer({
                                                ...image,
                                                placeholderHeight,
                                                visible: !disableActualImage && isViewable,
                                                enableMasonry: true,
                                            })}
                                        </ViewMonitor>
                                    </div>
                                );
                            })
                        }
                    </div>
                ))}
            </div>
        );
    }

    renderGallery({
        className, rows, rowClassName, columnClassName, imageRenderer, disableObserver, disableActualImage,
        enableDetailView, detailsViewRenderer,
    }) {
        const {
            selectedImageRow, selectedImage, selectedRowHeight, selectedImageId, selectedImageProps,
        } = this.state;
        return (
            <div
                className={`${style.container} ${className}`}
            >
                {rows.map((el, rowIndex) => {
                    const row = el.row;
                    return (
                        /* eslint-disable-next-line react/no-array-index-key */
                        <React.Fragment key={`row-${rowIndex}`}>
                            <div className={rowClassName}>
                                {row.map((column, columnIndex) => {
                                    const newWidth = this.engine.calculateWidth(
                                        column, row, el.isIncomplete
                                    );
                                    const newHeight = this.engine.calculateHeight(
                                        column, row, el.isIncomplete
                                    );
                                    const newWidthInPercent = 100 * newWidth / (this.engine.getMaxColumnsCount()
                                    * this.engine.getColumnsMaxWidth());
                                    const placeholderHeight = 100 * newHeight / newWidth;
                                    return (
                                        <div
                                        /* eslint-disable-next-line react/no-array-index-key */
                                            key={`column-${column.src}-${rowIndex}-${columnIndex}`}
                                            className={`${style.item} ${columnClassName}`}
                                            style={{
                                                width: el.isIncomplete
                                                    ? `${newWidth}px`
                                                    : `${newWidthInPercent}%`,
                                                maxWidth: el.isIncomplete
                                                    ? `${newWidthInPercent}%`
                                                    : 'auto',
                                                margin: row.length === columnIndex + 1
                                                    ? `0 0 ${this.engine.getGutterInPercent()}% 0`
                                                    : `0 ${
                                                        this.engine.getGutterInPercent()
                                                    }% ${this.engine.getGutterInPercent()}% 0`,

                                            }}
                                        >
                                            <ViewMonitor disableObserver={disableObserver}>
                                                {isViewable => imageRenderer({
                                                    ...column,
                                                    newWidth,
                                                    newHeight,
                                                    newWidthInPercent,
                                                    placeholderHeight,
                                                    visible: !disableActualImage && isViewable,
                                                    enableMasonry: false,
                                                    onClick: () => this.handleSelectImage({
                                                        selectedImageRow: rowIndex,
                                                        selectedImage: column,
                                                        selectedRowHeight: newHeight,
                                                        // eslint-disable-next-line
                                                        selectedImageId: `column-${column.src}-${rowIndex}-${columnIndex}`,
                                                        selectedImageProps: {
                                                            placeholderHeight,
                                                            newWidthInPercent,
                                                            newWidth,
                                                            newHeight,
                                                        },
                                                    }),
                                                })}
                                            </ViewMonitor>
                                        </div>
                                    );
                                })}
                            </div>
                            <div>
                                {enableDetailView && detailsViewRenderer({
                                    ...row,
                                    visible: rowIndex === selectedImageRow,
                                    selectedImage,
                                    rowHeight: selectedRowHeight,
                                    gutter: this.engine.getGutterInPercent(),
                                    isGutterUnitsInPercent: true,
                                    selectedImageId,
                                    selectedImageProps,
                                })}
                            </div>
                        </React.Fragment>
                    );
                })}
            </div>
        );
    }

    handleSelectImage = ({
        selectedImageRow,
        selectedImageId,
        selectedRowHeight,
        selectedImage,
        selectedImageProps,
    }) => {
        const {selectedImageRowPrev, selectedImageIdPrev} = this.state;
        if (selectedImageRowPrev !== selectedImageRow
            || selectedImageId !== selectedImageIdPrev) {
            this.setState({
                selectedImageRow,
                selectedImageRowPrev: selectedImageRow,
                selectedImage,
                selectedRowHeight,
                selectedImageId,
                selectedImageIdPrev: selectedImageId,
                selectedImageProps,
            });
        } else {
            this.setState({
                selectedImageRow: null,
                selectedImageRowPrev: null,
                selectedImage: null,
                selectedRowHeight: 0,
                selectedImageId: null,
                selectedImageIdPrev: null,
                selectedImageProps: {},
            });
        }
    };

    renderFixedGallery({
        className, rows, rowClassName, columnClassName, imageRenderer, disableObserver, disableActualImage,
        fixedGutter, columnsMaxCount, fixedSize, fixedBottom, enableDetailView, detailsViewRenderer,
    }) {
        const {
            selectedImageRow, selectedImage, selectedRowHeight, selectedImageId, selectedImageProps,
        } = this.state;
        return (
            <div
                className={`${style.container} ${className}`}
                style={{
                    width: columnsMaxCount * fixedSize + columnsMaxCount * fixedGutter - fixedGutter,
                }}
            >
                {rows.map((el, rowIndex) => {
                    const row = el.row;
                    return (
                        <React.Fragment
                            /* eslint-disable-next-line react/no-array-index-key */
                            key={`row-${rowIndex}`}
                        >
                            <div
                                className={rowClassName}
                            >
                                {row.map((column, columnIndex) => {
                                    const columnAfterResize = this.engine.resizeColumnByFixedSize(
                                        column, row, fixedSize, fixedBottom
                                    );
                                    const placeholderHeight = 100 * columnAfterResize.height / columnAfterResize.width;
                                    return (
                                        <React.Fragment
                                            /* eslint-disable-next-line react/no-array-index-key */
                                            key={`column-${column.src}-${rowIndex}-${columnIndex}`}
                                        >
                                            <div
                                            /* eslint-disable-next-line react/no-array-index-key */
                                                key={`column-${column.src}-${rowIndex}-${columnIndex}`}
                                                className={`${style['item--fixed']} ${columnClassName}`}
                                                style={{
                                                    width: fixedSize,
                                                    height: fixedSize,
                                                    margin: row.length === columnIndex + 1
                                                        ? `0 0 ${fixedGutter}px 0`
                                                        : `0 ${fixedGutter}px ${fixedGutter}px 0`,
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: columnAfterResize.width,
                                                        height: columnAfterResize.height,
                                                        margin: 'auto',
                                                        // eslint-disable-next-line
                                                        marginTop: `${fixedSize - columnAfterResize.height - fixedBottom}px`,
                                                    }}
                                                >
                                                    <ViewMonitor disableObserver={disableObserver}>
                                                        {isViewable => imageRenderer({
                                                            ...columnAfterResize,
                                                            placeholderHeight,
                                                            visible: !disableActualImage && isViewable,
                                                            onClick: () => this.handleSelectImage({
                                                                selectedImageRow: rowIndex,
                                                                selectedImage: columnAfterResize,
                                                                selectedRowHeight: columnAfterResize.height,
                                                                // eslint-disable-next-line
                                                                selectedImageId: `column-${column.src}-${rowIndex}-${columnIndex}`,
                                                                selectedImageProps: {
                                                                    placeholderHeight,
                                                                    newWidthInPercent: fixedSize,
                                                                    newWidth: columnAfterResize.width,
                                                                    newHeight: columnAfterResize.height,
                                                                },
                                                            }),
                                                            specifyImageSizes: true,
                                                            newWidth: columnAfterResize.width,
                                                            newHeight: columnAfterResize.height,
                                                            fixedSize,
                                                        })}
                                                    </ViewMonitor>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                            <div>
                                {enableDetailView && detailsViewRenderer({
                                    ...row,
                                    visible: rowIndex === selectedImageRow,
                                    selectedImage,
                                    rowHeight: selectedRowHeight,
                                    gutter: fixedGutter,
                                    isGutterUnitsInPercent: false,
                                    selectedImageId,
                                    selectedImageProps,
                                })}
                            </div>
                        </React.Fragment>
                    );
                })}
            </div>
        );
    }

    render() {
        const {imageRenderer, detailsViewRenderer} = this.props;
        const {enableMasonry, enableFixed, ...rest} = this.state;
        if (enableMasonry) {
            return this.renderMasonryGallery({...rest, imageRenderer});
        }
        if (enableFixed) {
            return this.renderFixedGallery({...rest, imageRenderer, detailsViewRenderer});
        }
        return this.renderGallery({...rest, imageRenderer, detailsViewRenderer});
    }
}

export default Gallery;
