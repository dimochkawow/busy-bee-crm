import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'
import BBSpinner from '../components/BBSpinner'
import { EMPLOYEE_PROFILE_DOWNLOAD } from '../http/urls'
import { autocompleteSearch, clearSearchResults } from '../store/employeeSlice'

const BBAutocomplete = ({ onSelect }) => {
    const dispatch = useDispatch()
    const { searchResults, loading } = useSelector((state) => state.employee)
    const [queryString, setQueryString] = useState('')

    useEffect(() => {
        dispatch(clearSearchResults())
    }, [dispatch])

    const onTyping = (e) => {
        const query = e.target.value
        setQueryString((prev) => query)

        if (query.length > 3) {
            dispatch(autocompleteSearch(queryString))
        } else {
            dispatch(clearSearchResults())
        }
    }

    return (
        <Card
            body
            className='bb-autocomplete'
            style={{ minHeight: searchResults.length > 0 ? '10rem' : null }}
        >
            <Form.Control
                type='text'
                value={queryString}
                onChange={onTyping}
                className='autocomplete-search-input'
                placeholder='Start typing a name...'
            />
            {searchResults.length > 0 &&
                searchResults.map((employee) => {
                    return (
                        <Row
                            key={employee._id}
                            className='autocomplete-employee-row'
                            onClick={(e) =>
                                onSelect({
                                    _id: employee._id,
                                    fullName: employee.fullName,
                                    profilePicUrl: employee.profilePicUrl,
                                    email: employee.email,
                                })
                            }
                        >
                            <Col sm={1}>
                                <Image
                                    roundedCircle
                                    src={
                                        employee?.profilePicUrl
                                            ? `${EMPLOYEE_PROFILE_DOWNLOAD.replace(
                                                  ':id',
                                                  employee._id
                                              )}`
                                            : `${process.env.PUBLIC_URL}/assets/default_avatar.jpeg`
                                    }
                                />
                            </Col>
                            <Col sm={11}>
                                <span>{employee.fullName}</span>
                            </Col>
                        </Row>
                    )
                })}
            {loading && <BBSpinner />}
        </Card>
    )
}

export default BBAutocomplete
