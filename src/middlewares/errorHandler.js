import { HttpError } from 'http-errors';


export const errorHandler = (err, req, res, next) => {
	console.error('Error:', err);
	if (err instanceof HttpError) {
	  res.status(err.status||500).json({
		status: err.status||500,
		message: err.message||'Unknown error',
		data: err.data || null,
	  });
	  return;
	}

	res.status(500).json({
	 status: 500,
    message: 'Something went wrong',
    data: err.message||500,
	});
  }