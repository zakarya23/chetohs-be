//////////////////////////////
// Author(s): Zakarya Butt, Nicholas Ang
// Date Made: 09/09/2021
//////////////////////////////

const userRouter = require('express').Router();
const Customer = require('../models/customer');
const Company = require('../models/company'); 
const { ObjectId } = require('mongodb');


const searchAndFilter = async (filters, search) => {
	customers = []
	sort = false; 
	filter = filters.new || filters.conclude || filters.invite ||filters.met || filters.negotiation || filters.high || filters.medium || filters.low; 
	if (filters.alpha) {
		if (!filter) {
			c = await Customer.find({"$expr": {"$regexMatch": {"input": { "$concat": ["$firstName", " ", "$familyName"] },"regex": search.words,  "options": "i"}}}).sort({firstName: 1})
			addFiltered(customers, c);
		}
		sort = true; 
	}

	if (filters.new) {
		c = sort == false ? await Customer.find({"$expr": {"$regexMatch": {"input": { "$concat": ["$firstName", " ", "$familyName"]},"regex": search.words, "options": "i"}}, "progress": "New"}): await Customer.find({"$expr": {"$regexMatch": {"input": { "$concat": ["$firstName", " ", "$familyName"]},"regex": search.words, "options": "i"}}, "progress": "New" }.sort({firstName: 1})) ;
		addFiltered(customers, c);
	}
	if (filters.conclude) {
		c = sort == false ? await Customer.find({"$expr": {"$regexMatch": {"input": { "$concat": ["$firstName", " ", "$familyName"]},"regex": search.words, "options": "i"}}, "progress": "Conclude"}) : await Customer.find({"$expr": {"$regexMatch": {"input": { "$concat": ["$firstName", " ", "$familyName"]},"regex": search.words, "options": "i"}}, "progress": "Conclude"}.sort({firstName: 1}))
		addFiltered(customers, c);
	}	
	if (filters.invited) {
		c = sort == false ? await Customer.find({"$expr": {"$regexMatch": {"input": { "$concat": ["$firstName", " ", "$familyName"]},"regex": search.words, "options": "i"}}, "progress": "Invited"}) : await Customer.find({"$expr": {"$regexMatch": {"input": { "$concat": ["$firstName", " ", "$familyName"]},"regex": search.words, "options": "i"}}, "progress": "Invited"}.sort({firstName: 1}))
		addFiltered(customers, c);
	}	
	if (filters.met) {
		c = sort == false ? await Customer.find({"$expr": {"$regexMatch": {"input": { "$concat": ["$firstName", " ", "$familyName"]},"regex": search.words, "options": "i"}}, "progress": "Met"}): await Customer.find({"$expr": {"$regexMatch": {"input": { "$concat": ["$firstName", " ", "$familyName"]},"regex": search.words, "options": "i"}}, "progress": "Met"}.sort({firstName: 1}))
		addFiltered(customers, c);
	}	
	if (filters.negotiation) {
		c = sort == false ? await Customer.find({"$expr": {"$regexMatch": {"input": { "$concat": ["$firstName", " ", "$familyName"]},"regex": search.words, "options": "i"}}, "progress": "Negotiation"}): await Customer.find({"$expr": {"$regexMatch": {"input": { "$concat": ["$firstName", " ", "$familyName"]},"regex": search.words, "options": "i"}}, "progress": "Negotiation"}.sort({firstName: 1}))
		addFiltered(customers, c);
	}	
	if (filters.high) {
		c = sort == false ? await Customer.find({"$expr": {"$regexMatch": {"input": { "$concat": ["$firstName", " ", "$familyName"]},"regex": search.words, "options": "i"}}, "priority":"High"}): await Customer.find({"$expr": {"$regexMatch": {"input": { "$concat": ["$firstName", " ", "$familyName"]},"regex": search.words, "options": "i"}}, "priority":"High"}.sort({firstName: 1}))
		addFiltered(customers, c);
	}	
	if (filters.medium) {
		c = sort == false ? await Customer.find({"$expr": {"$regexMatch": {"input": { "$concat": ["$firstName", " ", "$familyName"]},"regex": search.words, "options": "i"}}, "priority":"Medium"}): await Customer.find({"$expr": {"$regexMatch": {"input": { "$concat": ["$firstName", " ", "$familyName"]},"regex": search.words, "options": "i"}}, "priority":"Medium"}.sort({firstName: 1}))
		addFiltered(customers, c);
	}	
	if (filters.low) {
		c = sort == false ? await Customer.find({"$expr": {"$regexMatch": {"input": { "$concat": ["$firstName", " ", "$familyName"]},"regex": search.words, "options": "i"}}, "priority":"Low"}): await Customer.find({"$expr": {"$regexMatch": {"input": { "$concat": ["$firstName", " ", "$familyName"]},"regex": search.words, "options": "i"}}, "priority":"Low"}.sort({firstName: 1}))
		addFiltered(customers, c);
	}	
	return customers; 
}

userRouter.post('/searchFilter', async (req, res) => {
    var search = req.body; 
	var filters = search.filters;  
	var customers = [] ; 
	customers = await searchAndFilter(filters, search); 		  
	customers = removeDuplicates(customers);  
    res.json({"customers": customers});
})


userRouter.post('/search', async (req, res) => {
    var search = req.body;   
	var customers = [] ; 
	customers = await justSearch(search);
	customers = removeDuplicates(customers);  
    res.json({"customers": customers});
})

const justSearch = async (search) => {
	customers = [] 
	c = search.alpha ? await Customer.find({"$expr": {"$regexMatch": {"input": { "$concat": ["$firstName", " ", "$familyName"] },"regex": search.words,  "options": "i"}}}): await Customer.find({"$expr": {"$regexMatch": {"input": { "$concat": ["$firstName", " ", "$familyName"] },"regex": search.words,  "options": "i"}}}).sort(); 
	addFiltered(customers, c); 
	return customers;
}

userRouter.get('/customers', async (req, res) => {
    var customers = await Customer.find().lean();  
    res.json({"customers": customers}); 
})

var addFiltered = (customers, c) => {
	for (var i = 0 ; i < c.length; i++) {
		if (!customers.includes(c[i])) {
			customers.push(c[i]); 
		}	
  	} 
}

// Removes duplicates from the array.
const removeDuplicates = (arr) => [...new Set(
	arr.map(el => JSON.stringify(el))
)].map(e => JSON.parse(e));


const justFilter = async (filters) => {
	customers = [] 
	sort = false; 
	filter = filters.new || filters.conclude || filters.invite ||filters.met || filters.negotiation || filters.high || filters.medium || filters.low; 
	
	if (filters.alpha) {
		if (!filter) {
			c = await Customer.find().sort({firstName: 1});
			addFiltered(customers, c);
		}
		sort = true; 
	}
	if (filters.new) {
		c = sort == false ? await Customer.find({"progress":"New"}): await Customer.find({"progress":"New"}).sort({firstName: 1}); 
		addFiltered(customers, c); 
	}
	if (filters.conclude) {
		c = sort == false ? await Customer.find({"progress":"Conclude"}) : await Customer.find({"progress":"Conclude"}).sort({firstName: 1}); 
		addFiltered(customers, c);
	}
	if (filters.invite) {
		c = sort == false ? await Customer.find({"progress":"Invited"}) : await Customer.find({"progress":"Invited"}).sort({firstName: 1}); 
		addFiltered(customers, c);
	}
	if (filters.met) {
		c = sort == false ? await Customer.find({"progress":"Met"}) : await Customer.find({"progress":"Met"}).sort({firstName: 1}); 
		addFiltered(customers, c);
	}
	if (filters.negotiation) {
		c = sort == false ? await Customer.find({"progress":"Negotiation"}) : await Customer.find({"progress":"Negotiation"}).sort({firstName: 1}); 
		addFiltered(customers, c);
	}
	if (filters.high) {
		c = sort == false ? await Customer.find({"priority":"High"}) : await Customer.find({"priority":"High"}).sort({firstName: 1}); 
		addFiltered(customers, c);
	}
	if (filters.medium) {
		c = sort == false ? await Customer.find({"priority":"Medium"}) : await Customer.find({"priority":"Medium"}).sort({firstName: 1}); 
		addFiltered(customers, c);
	}
	if (filters.low) {
		c = sort == false ? await Customer.find({"priority":"Low"}) : await Customer.find({"priority":"Low"}).sort({firstName: 1}); 
		addFiltered(customers, c);
	}
	return customers; 
}

userRouter.post('/filter', async (req, res) => {
	var search = req.body; 
	var filters = search.filters;  
	var customers = [] ; 
	customers = await justFilter(filters);
	customers = removeDuplicates(customers); 
	res.json({"customers":customers});  
})

userRouter.post('/profile/:id', async (req, res) => {
    var customer = await Customer.findById(req.params.id).lean();  
    var company = await Company.findById(customer.companyInfo);
    res.json({"customer": customer, "company": company});
})

userRouter.post('/addCustomer', async (req, res) => {
	var client = req.body.client; 
	var company = req.body.company; 
	const newCompany = await Company.create({
		name:company.name,
		department: company.department,
		location: company.location,
		position: company.position
	})
	
	await newCompany.save(); 

	var comp = await Company.findOne({name:company.name, department: company.department,location: company.location, position: company.position});
	var compId = comp._id; 
	var customer = await Customer.create({
		firstName: client.firstName, 
		familyName: client.familyName, 
		dob: client.dob, 
		gender: client.gender, 
		phoneNumber: client.number, 
		email: client.email, 
		companyInfo: ObjectId(compId), 
		priority: company.priority,
		progress: company.status
	})



	await customer.save(); 
	res.json({status:true});
})

userRouter.post('/meeting/:id', async (req, res) => {
	await Customer.findByIdAndUpdate(req.params.id, {"meeting": req.body.meeting});
	res.json({"status":true}); 
})

userRouter.post('/lastContact/:id', async (req, res) => {
	await Customer.findByIdAndUpdate(req.params.id, {"lastContact": req.body.lastContact});
	res.json({"status":true}); 
})

userRouter.post('/progress/:id', async (req, res) => {
	var customer = await Customer.findById(req.params.id);
	customer.progress =  req.body.progress; 
	await customer.save(); 
	res.sendStatus(200); 
})

userRouter.post('/priority/:id', async (req, res) => {
	var customer = await Customer.findById(req.params.id);
	customer.priority =  req.body.priority; 
	await customer.save(); 
	res.sendStatus(200); 
})

userRouter.post('/notes/:id', async (req, res) => {
	var customer = await Customer.findById(req.params.id);
	customer.notes =  req.body.notes; 
	await customer.save(); 
	res.sendStatus(200); 
})

userRouter.post('/description/:id', async (req, res) => {
	var customer = await Customer.findById(req.params.id);
	customer.description =  req.body.description; 
	await customer.save(); 
	res.sendStatus(200); 
})

userRouter.post('/timeline/:id', async (req, res) => {
	var customer = await Customer.findById(req.params.id);
	customer.timeline =  req.body.timeline; 
	await customer.save(); 
	res.sendStatus(200); 
})

userRouter.post('/number/:id', async (req, res) => {
	var customer = await Customer.findById(req.params.id);
	customer.phoneNumber =  req.body.number; 
	await customer.save(); 
	res.sendStatus(200); 
})

userRouter.post('/email/:id', async (req, res) => {
	var customer = await Customer.findById(req.params.id);
	customer.email =  req.body.email; 
	await customer.save(); 
	res.sendStatus(200); 
})

userRouter.post('/name/:id', async (req, res) => {
	var customer = await Customer.findById(req.params.id).lean();
	var company = await Company.findById(customer.companyId);
	company.name =  req.body.name; 
	await company.save(); 
	res.sendStatus(200); 
})

userRouter.post('/location/:id', async (req, res) => {
	var customer = await Customer.findById(req.params.id).lean();
	var company = await Company.findById(customer.companyId);
	company.location =  req.body.location; 
	await company.save(); 
	res.sendStatus(200); 
})


userRouter.post('/position/:id', async (req, res) => {
	var customer = await Customer.findById(req.params.id).lean();
	var company = await Company.findById(customer.companyId);
	company.position =  req.body.position; 
	await company.save(); 
	res.sendStatus(200); 
})


userRouter.post('/department/:id', async (req, res) => {
	var customer = await Customer.findById(req.params.id).lean();
	var company = await Company.findById(customer.companyId);
	company.department =  req.body.department; 
	await company.save(); 
	res.sendStatus(200); 
})

module.exports = userRouter; 

