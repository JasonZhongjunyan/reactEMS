function getConditionQuery(filter) {
	const hyphenateRE = /([a-z\d])([A-Z])/;
	if (filter) {
		const filterMap = filter.map((item) => {
			let key = item.key;
			const operator = item.operator;
			const val = item.val;
			hyphenateRE.test(key) && (key = `"${key}"`);
			return key + operator + val;
		});
		filter = 'where ' + filterMap.join(' and ');
	}
	return filter;
}

function getEntityMap(entity, isMap = true) {
	const hyphenateRE = /([a-z\d])([A-Z])/;
	const keys = Object.keys(entity);
	const values = keys.map((key, index) => {
		const val = entity[key];
		let finalVal = val;
		if (typeof val == 'string') {
			finalVal = `'${val}'`
		} else if (Array.isArray(val)) {
			finalVal = `array [${val.join(', ')}]`;
		}
		hyphenateRE.test(key) && (keys[index] = `"${key}"`);
		return isMap ? `${keys[index]} = ${finalVal}` : finalVal;
	});
	return isMap ? values.join(',') : {keys: keys.join(','), values: values.join(',')};
}

export {getConditionQuery, getEntityMap};