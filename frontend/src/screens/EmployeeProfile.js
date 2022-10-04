import React, { useEffect, useState, useRef } from 'react'
import axios from '../http/client'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Image, Button } from 'react-bootstrap'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import BBModal from '../components/BBModal'
import BBCropper from '../components/BBCropper'
import BBSpinner from '../components/BBSpinner'
import { EMPLOYEE_PROFILE_DOWNLOAD, EMPLOYEE_PROFILE } from '../http/urls'
import {
    uploadProfileImage,
    updateEmployee,
    removeEmployee as removeEmployeeAction,
    changePassword as changePasswordAction,
} from '../store/employeeSlice'
import { show } from '../store/notificationSlice'

const EmployeeProfile = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { id } = useParams()
    const [imageSrc, setImageSrc] = useState(null)
    const [showCropper, setShowCropper] = useState(false)
    const fileUploadRef = useRef()
    const { base64Image, imageFile } = useSelector((state) => state.crop)
    const { currentUser } = useSelector((state) => state.auth)
    const { employeeProfile, loading: updateLoading } = useSelector(
        (state) => state.employee
    )
    const [uploadImageName, setUploadImageName] = useState('')
    const [employee, setEmployee] = useState(null)
    const [fullNameTitle, setFullNameTitle] = useState('')
    const [loading, setLoading] = useState(false)
    const [showRemoveDialog, setShowRemoveDialog] = useState(false)
    const [changePasswordPayload, setChangePasswordPayload] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    })

    useEffect(() => {
        if (employeeProfile) {
            setEmployee(employeeProfile)
            setFullNameTitle(employeeProfile.fullName)
        }
    }, [employeeProfile])

    useEffect(() => {
        setLoading(true)

        const fetchData = async () => {
            try {
                const profileUrl = EMPLOYEE_PROFILE.replace(':id', id)
                const response = await axios.get(profileUrl)
                setEmployee(response.data)
                setFullNameTitle(response.data.fullName)
                setLoading(false)
            } catch (e) {
                setLoading(false)
                dispatch(
                    show({
                        type: 'error',
                        text: e.response.data.detail,
                    })
                )
                navigate('/')
            }
        }

        fetchData()
    }, [id, dispatch, navigate])

    const readFile = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader()
            reader.addEventListener('load', () => resolve(reader.result), false)
            reader.readAsDataURL(file)
        })
    }

    const onCropComplete = async () => {
        setShowCropper(false)
        dispatch(uploadProfileImage({ id, imageFile }))
    }

    const onCropCancel = () => {
        setShowCropper(false)
        fileUploadRef.current.value = null
        setUploadImageName('')
    }

    const onFileChange = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]
            let imageDataUrl = await readFile(file)
            setImageSrc(imageDataUrl)
            setUploadImageName(file.name)
            setShowCropper(true)
        }
    }

    const onChoosePicture = () => {
        fileUploadRef.current?.click()
    }

    const saveChanges = () => {
        dispatch(updateEmployee(employee))
    }

    const removeEmployee = () => {
        setShowRemoveDialog(false)
        dispatch(removeEmployeeAction(id))
        navigate('/')
    }

    const changePassword = () => {
        dispatch(
            changePasswordAction({
                id: id,
                ...changePasswordPayload,
            })
        )
    }

    return (
        <>
            <BBModal
                title='Choose area to crop'
                show={showCropper}
                onCancel={onCropCancel}
                onSave={onCropComplete}
            >
                <BBCropper imageSrc={imageSrc} fileName={uploadImageName} />
            </BBModal>
            <BBModal
                title='Are you sure?'
                show={showRemoveDialog}
                onCancel={(e) => setShowRemoveDialog(false)}
                onSave={removeEmployee}
                className='employee-remove-dialog'
            >
                {employee?.fullName} is about to be removed but will sit in
                Ledger for 30 days.
            </BBModal>
            {(loading || updateLoading) && <BBSpinner />}
            <h2 className='mb-5'>{fullNameTitle}</h2>
            <Row className='employee-profile-page'>
                <Col md={4}>
                    <Image
                        thumbnail
                        src={
                            base64Image ||
                            (employee?.profilePicUrl
                                ? `${EMPLOYEE_PROFILE_DOWNLOAD.replace(
                                      ':id',
                                      employee?._id
                                  )}`
                                : `${process.env.PUBLIC_URL}/assets/default_avatar.jpeg`)
                        }
                        className='profile-pic'
                    />
                    <Form className='employee-profile-pic-upload'>
                        <Form.Control
                            type='file'
                            accept='image/*'
                            onChange={onFileChange}
                            ref={fileUploadRef}
                            className='d-none'
                        />
                        <Button onClick={onChoosePicture}>{`${
                            uploadImageName
                                ? uploadImageName
                                : `Choose profile picture`
                        }`}</Button>
                    </Form>
                    <Button
                        onClick={saveChanges}
                        variant='success'
                        className='action-button'
                        as='div'
                    >
                        Save
                    </Button>

                    {currentUser?.isAdmin && (
                        <Button
                            onClick={(e) => setShowRemoveDialog(true)}
                            variant='danger'
                            as='div'
                            className='action-button'
                        >
                            Remove employee
                        </Button>
                    )}
                </Col>
                <Col md={6}>
                    <Card body className='employee-profile-form'>
                        <Form.Group as={Row} className='mb-3' controlId='id'>
                            <Form.Label column sm={3}>
                                ID
                            </Form.Label>
                            <Col sm={9}>
                                <Form.Control
                                    type='text'
                                    value={employee?._id}
                                    readOnly
                                    disabled
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className='mb-3' controlId='email'>
                            <Form.Label column sm={3}>
                                E-mail
                            </Form.Label>
                            <Col sm={9}>
                                <Form.Control
                                    type='text'
                                    value={employee?.email}
                                    readOnly
                                    disabled
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group
                            as={Row}
                            className='mb-3'
                            controlId='fullName'
                        >
                            <Form.Label column sm={3}>
                                Full name
                            </Form.Label>
                            <Col sm={9}>
                                <Form.Control
                                    type='text'
                                    value={employee?.fullName}
                                    onChange={(e) =>
                                        setEmployee((emp) => ({
                                            ...emp,
                                            fullName: e.target.value,
                                        }))
                                    }
                                />
                            </Col>
                        </Form.Group>
                        {currentUser?.isAdmin && (
                            <>
                                <Form.Group
                                    as={Row}
                                    className='mb-3'
                                    controlId='isAdmin'
                                >
                                    <Form.Label column sm={3}>
                                        Is admin?
                                    </Form.Label>
                                    <Form.Check
                                        className='col-sm-9'
                                        type='switch'
                                        defaultChecked={employee?.isAdmin}
                                        onChange={(e) =>
                                            setEmployee((emp) => ({
                                                ...emp,
                                                isAdmin: !emp.isAdmin,
                                            }))
                                        }
                                    ></Form.Check>
                                </Form.Group>
                                <Form.Group
                                    as={Row}
                                    className='mb-3'
                                    controlId='isActive'
                                >
                                    <Form.Label column sm={3}>
                                        Is active?
                                    </Form.Label>
                                    <Form.Check
                                        className='col-sm-9'
                                        type='switch'
                                        defaultChecked={employee?.isActive}
                                        onChange={(e) =>
                                            setEmployee((emp) => ({
                                                ...emp,
                                                isActive: !emp.isActive,
                                            }))
                                        }
                                    ></Form.Check>
                                </Form.Group>
                            </>
                        )}
                    </Card>
                    <Card body className='mt-3 employee-profile-form'>
                        <h3 className='mb-3'>Password change</h3>
                        <Form.Group
                            as={Row}
                            className='mb-3'
                            controlId='password'
                        >
                            <Form.Label column sm={3}>
                                Old password
                            </Form.Label>
                            <Col sm={9}>
                                <Form.Control
                                    type='password'
                                    onChange={(e) =>
                                        setChangePasswordPayload((payload) => ({
                                            ...payload,
                                            oldPassword: e.target.value,
                                        }))
                                    }
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group
                            as={Row}
                            className='mb-3'
                            controlId='newPassword'
                        >
                            <Form.Label column sm={3}>
                                New password
                            </Form.Label>
                            <Col sm={9}>
                                <Form.Control
                                    type='password'
                                    onChange={(e) =>
                                        setChangePasswordPayload((payload) => ({
                                            ...payload,
                                            newPassword: e.target.value,
                                        }))
                                    }
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId='confirmPassword'>
                            <Form.Label column sm={3}>
                                Confirm password
                            </Form.Label>
                            <Col sm={9}>
                                <Form.Control
                                    type='password'
                                    onChange={(e) =>
                                        setChangePasswordPayload((payload) => ({
                                            ...payload,
                                            confirmPassword: e.target.value,
                                        }))
                                    }
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Button
                                className='change-password-btn'
                                onClick={changePassword}
                            >
                                Change password
                            </Button>
                        </Form.Group>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default EmployeeProfile
