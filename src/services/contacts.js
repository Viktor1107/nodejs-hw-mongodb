import { ContactsCollection } from "../db/models/contacts.js"



export const getAllContacts = async() => {
	try {
	const contacts = await ContactsCollection.find();
	return contacts;
} catch (error){
	console.error('Error in getAllContacts', error);
	  throw error;
}
};

// export const getContactById = async (contactId) => {
// 	if (!mongoose.Types.ObjectId.isValid(contactId)) {
// 	  throw new Error('Invalid contact ID');
// 	}
  
// 	return await ContactsCollection.findById(contactId);
//   };


export const getContactById = async (contactId) => {
	try {
	  const contact = await ContactsCollection.findById(contactId);
	  return contact;
	} catch (error) {
	  console.error('Error in getContactById:', error);
	  throw error;
	}
  };