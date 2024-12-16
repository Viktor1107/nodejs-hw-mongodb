import createHttpError from 'http-errors';


export const validateBody = (schema) => async (req, res, next) => {
	try {
	  await schema.validateAsync(req.body, { abortEarly: false });
	  next();
	} catch (err) {

	  const errorDetails = err.details.map((detail) => ({
		field: detail.path.join("."), 
		message: detail.message,     
	  }));
  
	  
	  const error = createHttpError(400, "Validation Error", {
		data: { errors: errorDetails },
	  });
  
	  next(error);
	}
  };

