import React, { useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { crop as cropAction } from '../store/cropSlice'
import { Row, Col, Image as BootstrapImage } from 'react-bootstrap'
import Cropper from 'react-easy-crop'

const BBCropper = ({ imageSrc }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    const [croppedImage, setCroppedImage] = useState(null)
    const dispatch = useDispatch()

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    function createImage(url) {
        const image = new Image()
        image.src = url
        return image
    }

    const getCroppedImg = useCallback(
        (
            imageSrc,
            pixelCrop,
            flip = { horizontal: false, vertical: false }
        ) => {
            const image = createImage(imageSrc)
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')

            if (!ctx) {
                return null
            }

            canvas.width = image.width
            canvas.height = image.height

            // translate canvas context to a central location to allow rotating and flipping around the center
            ctx.translate(image.width / 2, image.height / 2)
            ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1)
            ctx.translate(-image.width / 2, -image.height / 2)

            // draw rotated image
            ctx.drawImage(image, 0, 0)

            // croppedAreaPixels values are bounding box relative
            // extract the cropped image using these values
            const data = ctx.getImageData(
                pixelCrop.x,
                pixelCrop.y,
                pixelCrop.width,
                pixelCrop.height
            )

            // set canvas width to final desired crop size - this will clear existing context
            canvas.width = pixelCrop.width
            canvas.height = pixelCrop.height

            // paste generated rotate image at the top left corner
            ctx.putImageData(data, 0, 0)

            // As Base64 string
            return canvas.toDataURL('image/jpeg')

            // As a blob
            // return canvas.toBlob((file) => URL.createObjectURL(file), 'image/jpeg')
        },
        []
    )

    const showCroppedImage = useCallback(() => {
        try {
            const croppedImage = getCroppedImg(imageSrc, croppedAreaPixels)
            setCroppedImage(croppedImage)
            dispatch(cropAction(croppedImage))
        } catch (e) {
            console.error(e)
        }
    }, [imageSrc, croppedAreaPixels, getCroppedImg, dispatch])

    return (
        <Row>
            <Col md={6}>
                {imageSrc && (
                    <>
                        <div
                            className='crop-wrapper'
                            onMouseUp={showCroppedImage}
                        >
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={4 / 3}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                                cropSize={{ width: 200, height: 200 }}
                            />
                        </div>
                    </>
                )}
            </Col>
            <Col md={6}>
                <BootstrapImage
                    className='cropped-candidate'
                    src={croppedImage}
                />
            </Col>
        </Row>
    )
}

export default BBCropper
