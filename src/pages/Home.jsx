/* eslint-disable react-hooks/exhaustive-deps */
import ArticleCard from "components/ArticleCard";
import MultiSelect from "components/MultiSelect";
import React, {
	Fragment,
	useState,
	useCallback,
	useEffect,
} from "react";
import {
	Button,
	Card,
	Col,
	Form,
	Row
} from "react-bootstrap";
import { PaginationControl } from "react-bootstrap-pagination-control";
import { useSelector } from "react-redux";
import http from "services/protected-request";
import { notifAlert } from "utils/helper";

const Home = () => {
	/**
	 * DATA SOURCES AND PREFERENCES
	 */
	const [sourcesData] = useState(useSelector(state => state.app.sources));
	const [categoriesData, setCategoriesData] = useState(useSelector(state => state.app.categories));

	const [filter, setFilter] = useState({
		keyword: "",
		date: "",
		sources: [],
		categories: [],
		isParam: 0,
	});
	const [dataArticles, setDataArticles] = useState([]);
	const [pagination, setPagination] = useState({
		page: 1,
		total: 0,
		lastPage: 1,
	});
	const [isFetching, setIsFetching] = useState(false);

	/**
	 * Request get articles data
	 * @param {String} keyword - Any string keyword to search article
	 * @param {String} date - Date filter YYYY-MM-DD
	 * @param {Array} sources - List of sources <int, string>
	 * @param {Array} categories - List of categories <int, string>
	 * @param {Number} page - Current page of list
	 * @returns {Promies}
	 */
	const requestGetArticles = async (
		keyword,
		date,
		sources,
		categories,
		page,
		isParam,
	) => {
		return await http.get(
			`${process.env.REACT_APP_BACKEND_URL}api/article`,
			{
				params: {
					keyword,
					date,
					sources,
					categories,
					page,
					isParam
				},
			}
		);
	};

	/**
	 * Callback request get articles from filter
	 */
	const fetchArticles = useCallback(() => {
		const keyword = filter.keyword;
		const date = filter.date;
		let sources = [];
		let categories = [];
		if (filter.sources.length > 0) {
			filter.sources.forEach(item => {
				sources.push(parseInt(item.value));
			});
		}
		if (filter.categories.length > 0) {
			filter.categories.forEach(item => {
				categories.push(item.value);
			});
		}
		const page = pagination.page;
		const isParam = filter.isParam;
		return requestGetArticles(keyword, date, sources, categories, page, isParam);
	}, [filter, pagination]);

	/**
	 * Calling the callback when first time loaded
	 */
	const init = () => {
		setIsFetching(true);
		fetchArticles()
			.then((res) => {
				const data = res.data.data;
				const paginationData = data.pagination;
				setPagination({
					page: pagination.page,
					lastPage: paginationData.last_page,
					total: paginationData.total,
				});
				setDataArticles(data.data);
				setIsFetching(false);
			})
			.catch(() => {
				notifAlert(
					"Failed",
					"Failed when fetching articles Data. Please try again",
					"error"
				);
				setIsFetching(false);
			});
	};

	/**
	 * Handler change search keyword and date
	 * @param {Event} e 
	 */
	const onChangeKeywordDate = (e) => {
		setFilter({
			...filter,
			isParam: 1,
			[e.target.name]: e.target.value,
		})
	};

	/**
	 * Handle multi select
	 * @param {Event} e 
	 * @param {String} type - Type of select in sources or categories
	 */
	const onChangeMultiSelect = (e, type) => {	
		setFilter({
			...filter,
			isParam: 1,
			[type]: e,
		});
	};

	/**
	 * Formatting categories select option that support to multiselect
	 */
	const formatCategories = () => {
		const options = categoriesData;
		let data = [];
		options.forEach(val => {
			data.push({
				value: val.label,
				label: val.label,
			});
		});
		setCategoriesData(data);
	};

	/**
	 * Submit filter to get data
	 * @param {Event} e 
	 */
	const submitFilter = (e) => {
		e.preventDefault();
		if(pagination.page > 1) {
			setPagination({...pagination, page: 1});
		} else {
			init();
		}
	};

	/**
	 * Clear filter then re-fetch data
	 */
	const clearFilter = (e) => {
		setFilter({
			keyword: "",
			date: "",
			sources: [],
			categories: [],
			isParam: 0,
		});
		setPagination({
			...pagination,
			page: 1,
		});
	};

	/**
	 * Component Did Mount
	 */
	useEffect(() => {
		init();
		formatCategories();
	}, [pagination.page]);

	return (
		<Fragment>
			<Row className="mt-5">
				<Col xl="12">
					<Card>
						<Card.Header>Search and Filter</Card.Header>
						<Card.Body>
							<Form onSubmit={e => submitFilter(e)}>
								<Form.Group className="mb-3" controlId="keyword">
									<Form.Label className="text-center">
										Keyword
									</Form.Label>
									<Form.Control
										onChange={e => onChangeKeywordDate(e)}
										value={filter.keyword}
										type="text"
										placeholder="Ex: Technology"
										name="keyword"
									/>
								</Form.Group>
								{/* FILTER SOURCES, CATEGORY and DATE */}
								<Row className="g-2">
									<Col md>
										<Form.Group className="mb-3" controlId="keyword">
											<Form.Label className="text-center">
												Sources
											</Form.Label>
											<MultiSelect
												inputName="sources"
												defaultData={filter.sources}
												selectData={sourcesData}
												onChangeSelect={e => onChangeMultiSelect(e, 'sources')}
											/>
										</Form.Group>
									</Col>
									<Col md>
										<Form.Group className="mb-3" controlId="keyword">
											<Form.Label className="text-center">
												Categories
											</Form.Label>
											<MultiSelect
												inputName="categories"
												defaultData={filter.categories}
												selectData={categoriesData}
												onChangeSelect={e => onChangeMultiSelect(e, 'categories')}
											/>
										</Form.Group>
									</Col>
									<Col md>
										<Form.Group className="mb-3" controlId="keyword">
											<Form.Label className="text-center">
												Date
											</Form.Label>
											<Form.Control
												onChange={e => onChangeKeywordDate(e)}
												value={filter.date}
												type="date"
												name="date"
											/>
										</Form.Group>
									</Col>
								</Row>
								
								<Row className="g-2">
									<Col md>
										<Button variant="primary" type="submit">Filter</Button>
										<Button variant="warning" className="mx-2" onClick={e => clearFilter(e)} type="button">Clear Filter</Button>
									</Col>
								</Row>
							</Form>
						</Card.Body>
					</Card>
				</Col>
				<Col xl="12">
					<Row className="mt-5">
						{
							isFetching ?
								<div>Loading...</div>
								:
								dataArticles.map((val) => (
									<ArticleCard
										key={val.id}
										authors={val.author}
										categories={val.category}
										description={val.content}
										thumbnail={val.thumbnail}
										title={val.title}
										url={val.url}
										publishedDate={val.published_date}
									/>
								))
						}
					</Row>
					<Row className="mt-5 justify-center">
						<PaginationControl
							page={pagination.page}
							total={pagination.lastPage}
							last={true}
							limit={1}
							changePage={(page) => {
								setPagination({ ...pagination, page: page });
							}}
							ellipsis={1}
						/>
					</Row>
				</Col>
			</Row>
		</Fragment>
	);
};

export default Home;
