import React, { useState } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Row, Col, Card, Image } from 'react-bootstrap'
import BBAutocomplete from '../components/BBAutocomplete'
import { EMPLOYEE_PROFILE_DOWNLOAD } from '../http/urls'

const SearchEmployee = () => {
    const [selectedEmployee, setSelectedEmployee] = useState(null)

    const onSelectEmployee = (employee) => {
        setSelectedEmployee(employee)
    }

    return (
        <>
            <h2 className='mb-5'>Employee Search</h2>

            <Row className='employee-search-page'>
                <Col md={4} sm={5} lg={4}>
                    <BBAutocomplete onSelect={onSelectEmployee} />
                </Col>
                {selectedEmployee && (
                    <Col md={8}>
                        <Card body>
                            <Row>
                                <Col md={3}>
                                    <Image
                                        thumbnail
                                        src={
                                            selectedEmployee?.profilePicUrl
                                                ? `${EMPLOYEE_PROFILE_DOWNLOAD.replace(
                                                      ':id',
                                                      selectedEmployee?._id
                                                  )}`
                                                : `${process.env.PUBLIC_URL}/assets/default_avatar.jpeg`
                                        }
                                        className='profile-pic'
                                    />
                                </Col>
                                <Col md={8} className='employee-info'>
                                    <Row className='attribute-entry'>
                                        <Col md={12}>
                                            <span className='attribute-label'>
                                                ID:{' '}
                                            </span>
                                            <span className='attribute-value'>
                                                {selectedEmployee?._id}
                                            </span>
                                        </Col>
                                    </Row>
                                    <Row className='attribute-entry'>
                                        <Col md={12}>
                                            <span className='attribute-label'>
                                                E-mail:{' '}
                                            </span>
                                            <span className='attribute-value'>
                                                {selectedEmployee?.email}
                                            </span>
                                        </Col>
                                    </Row>
                                    <Row className='attribute-entry'>
                                        <Col md={12}>
                                            <span className='attribute-label'>
                                                Full name:{' '}
                                            </span>
                                            <span className='attribute-value'>
                                                {selectedEmployee?.fullName}
                                            </span>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col md={1} className='actions-container'>
                                    <LinkContainer
                                        to={`/employees/${selectedEmployee?._id}/profile`}
                                    >
                                        <i className='fa-sharp fa-solid fa-arrow-up-right-from-square open-profile-icon'></i>
                                    </LinkContainer>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                )}
            </Row>
        </>
    )
}

export default SearchEmployee
