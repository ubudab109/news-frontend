import Swal from "sweetalert2";

/**
 * Get storage data by key
 * @param {Any} key 
 * @returns {Any}
 */
export const getStorage = key => {
	return window.localStorage.getItem(key);
};

/**
 * Set storage item by key and value
 * @param {Any} key 
 * @param {Any} value 
 * @returns 
 */
export const setStorage = (key, content) => {
	return window.localStorage.setItem(key, content)
};

/**
 * Clear storage application
 * @returns 
 */
export const clearStorage = () => {
	return window.localStorage.clear();
}

/**
 * Alert Alert Notif
 * @param {String} title 
 * @param {String} text
 * @param {String} type - error or success
 */
export const notifAlert = (title, text, type) => {
	return Swal.fire(title, text, type);
};

/**
 * Filtering array based on key and value
 * @param {Array} array 
 * @param {Any} key 
 * @param {Any} value 
 * @returns {Any}
 */
export const filterArray = (array, key, value) => {
	return array.filter(item => item[key] === value);
};

/**
 * Formatting array to string	
 * @param {Array} array 
 * @returns {String}
 */
export const formatArrString = (array) => {
	return array.join(', ')
};

/**
 * Formatting string in array if there's a some character at there
 * @param {Array} array 
 * @returns {String}
 */
export const formatStringTag = (array) => {
	let data = [];
	array.forEach(val => {
		if (val.includes('/')) {
			let splittedString = val.split('/');
			let lastIndex = splittedString[splittedString.length - 1];
			data.push(lastIndex);
		} else {
			data.push(val);
		}
	});
	return data;
};

export const formatPublished = (dateString) => {
	let date = new Date(dateString);
	return date.toLocaleDateString()
}
