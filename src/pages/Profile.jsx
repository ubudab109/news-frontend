/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, Col, Form, Image, Row } from "react-bootstrap";
import { useState } from "react";
import PreferenceData from "components/PreferenceData";
import PreferenceSelect from "components/PreferenceSelect";
import http from "services/protected-request";
import { updateUserData } from "store/reducer";
import { filterArray, notifAlert } from "utils/helper";
import { useEffect } from "react";

const Profile = () => {

	// DISPATCH FUNCTION
	const dispatch = useDispatch();

	/**
	 * GET PREFERENCES DATA FROM USER DATA IN REDUX
	 */
	const userData = useSelector(state => state.app.userData);
	const sources = userData.preferences.filter(val => val.type === 'source')[0] ?? [];
	const authors = userData.preferences.filter(val => val.type === 'authors')[0] ?? [];
	const categories = userData.preferences.filter(val => val.type === 'categories')[0] ?? [];

	/**
	 * DATA SOURCES AND PREFERENCES
	 */
	const sourcesData = useSelector(state => state.app.sources);
	const authorsData = useSelector(state => state.app.authors);
	const categoriesData = useSelector(state => state.app.categories);

	/**
	 * USER DATA SETTING
	 */
	const [userSetting, setUserSetting] = useState({
		email: userData.email,
		name: userData.name,
	});

	/**
	 * DATA PREFERENCES STATE
	 */
	const [dataPref, setDataPref] = useState({
		sources: sources.data_options ?? [],
		authors: authors.data_options ?? [],
		categories: categories.data_options ?? [],
	});

	/**
	 * SELECT OPTION AUTHORS AND CATEGORIES BASED ON SELECTED SOURCES
	 */
	const [optionPref, setOptionPref] = useState({
		authors: [],
		categories: [],
	});

	/**
	 * CONDITION FOR EDITING DATA PREFERENCES, SOURCES AND USER SETTING
	 */
	const [isEditing, setIsEditing] = useState(false);
	const [isEditingSource, setIsEditingSource] = useState(false);
	const [isEditingUser, setIsEditingUser] = useState(false);

	/**
	 * Error validation for user
	 */
	const [isError, setIsError] = useState(false);
	const [validation, setValidation] = useState([]);

	/**
	 * CONDITION FOR SAVING PREFERENCES DATA AND SOURCE
	 */
	const [isSaving, setIsSaving] = useState(false);

	/**
	 * Handler multiple select preferences change
	 * @param {Event} e 
	 * @param {String} type - Type of state (sources, authors, categories)
	 */
	const onChangePref = (e, type) => {
		setDataPref({
			...dataPref,
			[type]: e
		});
	};

	/**
	 * Handler on click edit or cancel editing sources
	 */
	const onClickEditSource = () => {
		if (isEditingSource) {
			setDataPref({
				...dataPref,
				sources: sources.data_options ?? [],
			});
			setIsEditingSource(false)
		} else {
			setIsEditingSource(true)
		}
	};

	/**
	 * Handler on click edit or cancel editing preferences
	 */
	const onClickEdit = () => {
		if (isEditing) {
			setDataPref({
				...dataPref,
				authors: authors.data_options ?? [],
				categories: categories.data_options ?? [],
			});
			setIsEditing(false);
		} else {
			setIsEditing(true);
		}
	};

	/**
	 * Handler on click edit or cancel editing preferences
	 */
	const onClickEditUser = () => {
		if (isEditingUser) {
			setUserSetting({
				email: userData.email,
				name: userData.name,
			});
			setIsEditingUser(false);
		} else {
			setIsEditingUser(true);
		}
	}

	/**
	 * Submit saving preferences to API
	 * @param {Event} e 
	 */
	const onSavePreferences = async (e) => {
		e.preventDefault();
		setIsSaving(true);
		let formData = new FormData();
		let reqParams = Object.values(dataPref);
		reqParams.forEach((item, key) => {
			let type;
			if (key === 0) {
				type = 'source';
			} else if (key === 1) {
				type = 'authors';
			} else {
				type = 'categories';
			}
			if (item.length > 0) {
				formData.append(`type[${key}]`, type);
				item.forEach(data => {
					formData.append(`data[${key}][]`, data.value);
				});
			}
		});
		await http.post('api/save-preference', formData)
			.then(res => {
				const data = res.data.data;
				const message = res.data.message;
				dispatch(updateUserData(data));
				notifAlert('Success', message, 'success');
				filterCategoriesAndAuthorsData();
				setIsEditing(false);
				setIsEditingSource(false);
				setIsSaving(false);

			}).catch(err => {
				const { response } = err;
				const data = response.data;
				if (response.status === 401) {
					notifAlert(data.errors, data.message, 'error');
				} else if (response.status === 400) {
					notifAlert(data.errors, data.message, 'error');
				} else {
					notifAlert('Failed', 'Internal Server Error', 'error');
				}
				setIsSaving(false);
			})
	};

	/**
	 * Submit update user data
	 * @param {Event} e 
	 */
	const onSubmitUpdateUser = async (e) => {
		e.preventDefault();
		setIsSaving(true);
		const req = {
			email: userSetting.email,
			name: userSetting.name,
		};
		await http.put(`${process.env.REACT_APP_BACKEND_URL}api/user-update`, req)
			.then(res => {
				const data = res.data.data;
				dispatch(updateUserData(data));
				setIsSaving(false);
				notifAlert('Success', res.data.message, 'success');
				setIsEditingUser(false);
				setIsError(false);
				setValidation([]);
			})
			.catch(err => {
				const { response } = err;
				const data = response.data;
				if (response.status === 401) {
					notifAlert(data.errors, data.message, 'error');
					window.location.reload();
				} else if (response.status === 400) {
					let result = data.errors;
					setIsError(true);
					setValidation(Object.values(result));
				} else {
					notifAlert('Failed', 'Internal Server Error', 'error');
				}
				setIsEditingUser(true);
			});
	};

	/**
	 * Filter categories and authors option based on selected source
	 * Then append to state option pref
	 */
	const filterCategoriesAndAuthorsData = () => {
		let authors = [];
		let categories = [];
		// Means that user already set the sources preference
		if (dataPref.sources.length > 0) {
			dataPref.sources.forEach(item => {
				let authorsOption = filterArray(authorsData, 'source_id', parseInt(item.value));
				authorsOption.forEach(author => {
					authors.push({
						label: author.name,
						value: author.name,
					});
				});

				let categoriesOption = filterArray(categoriesData, 'source_id', parseInt(item.value));
				categoriesOption.forEach(category => {
					categories.push({
						value: category.external_id,
						label: category.label,
					});
				});
			});
			setOptionPref({
				authors: authors,
				categories: categories,
			});
		}
	};

	/**
	 * Handler input user data edit
	 * @param {Event} e 
	 */
	const onChangeInputUserData = (e) => {
		setUserSetting({
			...userSetting,
			[e.target.name]: e.target.value,
		});
	}

	/**
	 * Component Did Mount
	 */
	useEffect(() => {
		filterCategoriesAndAuthorsData()
	}, [])

	return (
		<Fragment>
			<Row className="mt-5">
				<Col xl="12">
					<Card>
						<Card.Header>User Data</Card.Header>
						<Card.Body>
							<Col className="text-center">
								<Image
									width={300}
									src="https://www.transparentpng.com/thumb/user/gray-user-profile-icon-png-fP8Q1P.png"
									className="text-center"
								/>
								{
									isError ? (
										<ul style={{listStyle: 'none'}}>
											{
												validation.map((value, key) => (
													<li key={key} style={{ color: 'red' }}>{value}</li>
												))
											}
										</ul>
									) : null
								}
								<Form.Group
									className="mb-3"
									controlId="formBasicEmail"
								>
									<Form.Label className="text-center">
										Fullname
									</Form.Label>
									<Form.Control
										type="text"
										name="name"
										onChange={e => onChangeInputUserData(e)}
										disabled={!isEditingUser}
										value={isEditingUser ? userSetting.name : userData.name}
									/>
								</Form.Group>
								<Form.Group
									className="mb-3"
									controlId="formBasicEmail"
								>
									<Form.Label className="text-center">
										Email address
									</Form.Label>
									<Form.Control
										type="email"
										name="email"
										onChange={e => onChangeInputUserData(e)}
										disabled={!isEditingUser}
										value={isEditingUser ? userSetting.email : userData.email}
									/>
								</Form.Group>
							</Col>
						</Card.Body>
						<Card.Footer>
							<Button className="mx-3" variant="warning" color="white" onClick={() => onClickEditUser()}>{isEditingUser ? 'Cancel' : 'Edit'}</Button>
							{
								isEditingUser ? (
									<Button disabled={isSaving && isEditingUser} onClick={e => onSubmitUpdateUser(e)} variant="primary" color="white">{isSaving && isEditingUser ? 'Saving...' : 'Submit'}</Button>
								) : null
							}
						</Card.Footer>
					</Card>
				</Col>

				<Col xl="12" className="mt-3">
					<Card>
						<Card.Header>Sources</Card.Header>
						<Card.Body>
							{
								isEditingSource ? (
									<PreferenceSelect onChangeSelect={e => onChangePref(e, 'sources')} defaultData={dataPref.sources} selectData={sourcesData} name="Sources" />
								) : (
									<PreferenceData name="Sources" data={sources.data_label ?? []} />
								)
							}
						</Card.Body>
						<Card.Footer>
							<Button className="mx-3" variant="warning" color="white" onClick={() => onClickEditSource()}>{isEditingSource ? 'Cancel' : 'Edit'}</Button>
							{
								isEditingSource ? (
									<Button disabled={isSaving && isEditingSource} onClick={e => onSavePreferences(e)} variant="primary" color="white">{isSaving && isEditingSource ? 'Saving...' : 'Submit'}</Button>
								) : null
							}
						</Card.Footer>
					</Card>
				</Col>

				<Col xl="12" className="mt-3">
					<Card>
						<Card.Header>Preferences {dataPref.sources.length < 1 ? '(Select Sources to set the Authors and Categories Preference)' : ''}</Card.Header>
						<Card.Body>
							{
								isEditing ? (
									<>
										<PreferenceSelect disabled={dataPref.sources.length < 1} onChangeSelect={e => onChangePref(e, 'authors')} defaultData={dataPref.authors} selectData={optionPref.authors} name="Authors" />
										<PreferenceSelect disabled={dataPref.sources.length < 1} onChangeSelect={e => onChangePref(e, 'categories')} defaultData={dataPref.categories} selectData={optionPref.categories} name="Categories" />
									</>
								) : (
									<>
										<PreferenceData name="Authors" data={authors.data_label ?? []} />
										<PreferenceData name="Categories" data={categories.data_label ?? []} />
									</>
								)
							}
						</Card.Body>
						<Card.Footer>
							<Button className="mx-3" variant="warning" color="white" onClick={() => onClickEdit()}>{isEditing ? 'Cancel' : 'Edit'}</Button>
							{
								isEditing ? (
									<Button disabled={isSaving && isEditing} onClick={e => onSavePreferences(e)} variant="primary" color="white">{isSaving && isEditing ? 'Saving...' : 'Submit'}</Button>
								) : null
							}
						</Card.Footer>
					</Card>
				</Col>
			</Row>
		</Fragment>
	);
};

export default Profile;
