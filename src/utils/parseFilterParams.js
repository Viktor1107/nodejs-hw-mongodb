const parseType = (type) => {
	const isString = typeof type === 'string';
  
	if (!isString) return null;
  
	const allowedTypes = ['work', 'home', 'personal'];
	return allowedTypes.includes(type) ? type : null;
  };
  
  const parseBoolean = (value) => {
	if (typeof value === 'boolean') return value;
  
	if (typeof value === 'string') {
	  const lowerValue = value.toLowerCase();
	  if (lowerValue === 'true') return true;
	  if (lowerValue === 'false') return false;
	}
  
	return null;
  };
  
  export const parseFilterParams = (query) => {
	const { type, isFavourite } = query; 
  
	const parsedType = parseType(type);
	const parsedIsFavourite = parseBoolean(isFavourite);
  
	const filters = {};
	if (parsedType) filters.contactType = parsedType;
	if (parsedIsFavourite === 'boolean') filters.isFavourite = parsedIsFavourite;
  
	return filters;
  };
  