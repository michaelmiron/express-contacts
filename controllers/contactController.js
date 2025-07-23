const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");
//@desc Get all contacts
//@route GET /api/contacts
//@access private
const getContacts = asyncHandler(async (req, res) => {
    const contacts = await Contact.find({user_id:req.user.id});
    res.status(200).json(contacts);
});

//@desc Create contact
//@route POST /api/contacts
//@access private
const createContact = asyncHandler(async (req, res) => {
    console.log("The request body is:", req.body);
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
        res.status(400);
        throw new Error("all fields are mandatory!");
    }
    const contact = await Contact.create({
        name,
        email,
        phone,
    
    });
    res.status(201).json(contact);
});

//@desc Get contact by ID
//@route GET /api/contacts/:id
//@access private
const getContact = asyncHandler(async (req, res) => {
    const contact =await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("contact no found")
    }
    res.status(200).json(contact);
});

//@desc Update contact by ID
//@route PUT /api/contacts/:id
//@access private
const updateContact = asyncHandler(async (req, res) => {
    const contact =await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("contact no found")
    }
    if(contact.user_id.toString()!== req.user.id){
        res.status(403);
        throw new Error("User wont have premissions to update other user contacts")
    }
    const updateContact =await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true}
    );
    res.status(200).json(updateContact);
});

//@desc Delete contact by ID
//@route DELETE /api/contacts/:id
//@access private
const deleteContact = asyncHandler(async (req, res) => {
     const contact =await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("contact no found")
    }
    if(contact.user_id.toString()!== req.user.id){
        res.status(403);
        throw new Error("User dont have premissions to delete other user contacts")
    }
    
    await Contact.remove();
    res.status(200).json(contact);
});

module.exports = {
    getContacts,
    createContact,
    getContact,
    updateContact,
    deleteContact
};