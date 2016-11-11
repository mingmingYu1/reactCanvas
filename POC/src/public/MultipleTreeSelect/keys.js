function searchNode(id, array, name) {
	let str = JSON.stringify(array),
		newId = typeof id == 'string' ? ('"' + (name || 'value') + '":' + '"' + id + '"') : ('"' + (name || 'value') + '":' + id);
	str = str.substring(0, str.indexOf(newId)) + newId;
	const bracketsArr = getBrackets(str);
	for (let i = bracketsArr.length - 1; i >= 0; i--) {
		switch (bracketsArr[i]) {
			case '[':
				str += ']';
				break;
			case '{':
				str += '}';
				break;
		}
	}
	str = JSON.parse(str);
	return (function(str, array) {
		let a = [];
		(function tt(str, array) {
			const len = str.length;
			if (array[len - 1] && array[len - 1].children && array[len - 1][name || 'value'] != id) {
				a.push(array[len - 1])
				tt(str[len - 1].children, array[len - 1].children);
			} else if (array[len - 1]) {
				a.push(array[len - 1])
				return a
			}
		})(str, array);
		return a;
	})(str, array);
}
function getBrackets(str) {
	let brackets = [],
		braNnum = 0;
	for (let i = 0, len = str.length; i < len; i++) {
		switch (str.charAt(i)) {
			case '[':
				brackets.push('[');
				braNnum++;
				break;
			case ']':
				brackets[braNnum - 1] == '[' && (brackets.pop(), braNnum--);
				break;
			case '{':
				brackets.push('{');
				braNnum++;
				break;
			case '}':
				brackets[braNnum - 1] == '{' && (brackets.pop(), braNnum--);
				break;
		}
	}
	return brackets
}
export default searchNode