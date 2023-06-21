import React from "react";
import PropTypes from "prop-types";
import {
	faCalendarAlt,
	faTags,
	faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Row } from "react-bootstrap";
import { formatArrString, formatPublished, formatStringTag } from "utils/helper";

/**
 * Article footer information
 * @param {FontAwesomeIcon} icon 
 * @param {Any} data 
 * @returns {Node}
 */
const ArticleInformation = ({ icon, data }) => (
	<Row className="mb-2">
		<Col xl="1" className="text-sm">
			<FontAwesomeIcon icon={icon} />
		</Col>
		<Col xl="11" className="text-sm">
			{
				Array.isArray(data) ?
					formatArrString(formatStringTag(data))
					: data
			}
		</Col>
	</Row>
);

/**
 * Article Card for List artcile
 * @returns {Node}
 */
const ArticleCard = ({
	thumbnail,
	title,
	url,
	description,
	publishedDate,
	authors,
	categories,
}) => (
	<Col
		xl={4}
		md={6}
		lg={4}
		className="mt-5"
		style={{
			visibility: "visible",
			animationDelay: "0.2s",
			animationName: "fadeInUp",
		}}
	>
		<div className="blog-grid">
			<div className="blog-grid-img position-relative">
				<img
					style={{ width: "100%", height: "200px" }}
					alt="img"
					src={thumbnail}
				/>
			</div>
			<div className="blog-grid-text p-4">
				<h3 className="h5 mb-3">
					<a href={url} target="_blank" rel="noreferrer">
						{title}
					</a>
				</h3>
				<div
					className="display-30"
					dangerouslySetInnerHTML={{ __html: description }}
				/>
				<div className="meta meta-style2">
					<ArticleInformation
						icon={faCalendarAlt}
						data={formatPublished(publishedDate)}
					/>
					<ArticleInformation
						icon={faUser}
						data={JSON.parse(authors)}
					/>
					<ArticleInformation
						icon={faTags}
						data={JSON.parse(categories)}
					/>
				</div>
			</div>
		</div>
	</Col>
);

ArticleCard.propTypes = {
	thumbnail: PropTypes.string,
	title: PropTypes.string.isRequired,
	url: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	publishedDate: PropTypes.string.isRequired,
	authors: PropTypes.string,
	categories: PropTypes.string,
};

ArticleCard.defaultProps = {
	thumbnail:
		"https://e7.pngegg.com/pngimages/709/358/png-clipart-price-toyservice-soil-business-no-till-farming-no-rectangle-pie.png",
	authors: "",
	categories: "",
};

export default ArticleCard;
