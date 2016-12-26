function formatFormErrorMessage(err) {
	var formattedError = {};
	for (var key in err.errors) {
	    if (err.errors.hasOwnProperty(key)) {
	        formattedError[key] = err.errors[key].message;
	    }
	}
	return formattedError;
}

module.exports = formatFormErrorMessage;