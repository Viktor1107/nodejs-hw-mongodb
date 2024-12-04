import express from 'express';
import pino from 'pino-http';
import mongoose from 'mongoose';
import cors from 'cors';
import { getEnvVar } from './utils/getEnvVar.js';
import { getAllContacts, getContactById } from './services/contacts.js';



const PORT = Number(getEnvVar('PORT', '3000'));

export function setupServer(){
const app = express();
app.use(express.json());
app.use(cors());

app.use(
	pino({
	  transport: {
		target: 'pino-pretty',
	  },
	}),
  );

  app.get('/contacts', async (req, res) => {
      const contacts = await getAllContacts();

	  res.status(200).json({
		status: 200,
		message: "Successfully found contacts!",
		data: contacts
	  })
  });


  
  app.get('/contacts/:contactId', async (req, res, next) => {
	const{contactId} = req.params;
	

	// if (!mongoose.Types.ObjectId.isValid(contactId)) {
	// 	return res.status(400).json({
	// 	  message: 'Invalid contact ID format',
	// 	});
	//   }
	  try {
		const contact = await getContactById(contactId)

	if(!contact){
		res.status(404).json({
			message: 'Contacts not found'	
		});
		return;
	}
	res.status(200).json({
		status: 200,
		message: "Successfully found contact with id {contactId}!",
		data: contact
	})
 } catch (err){
		next(err)
	}

  });


app.use((req, res, next)=>{
	console.log(`Time: ${new Date().toLocaleString()}`);
  next();
}
);

app.get('/',(req, res)=>{
	res.json({
		message: 'Hello world!'
	})
});

app.use('*', (req, res, next) => {
	res.status(404).json({
	  message: 'not found',
	});
  })

app.use((err, req, res, next) => {
	console.error('Unhandled error:', err);
	res.status(500).json({
	  message: 'Something went wrong'|| 'Internal Server Error',
	});
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
}

