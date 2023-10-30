const provider = require('../Models/provider');
const crypto = require('crypto');

// Function to generate a random code
function generateRandomCode() {
    const length = 6;
    return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

// Post method - TEST CRYPTO, TEST USAGE OF PRACTICE ID, GENERATE PRACTICE ID
exports.addProvider = async (req, res) => {
    try {
        const { firstName, lastName, email, password, NPI, practiceID} = req.body;
        const providerCode = generateRandomCode();
        const data = new provider({
            firstName, lastName, email, password, NPI, practiceID, providerCode
        });

        const dataToSave = await data.save();
        res.status(200).json(dataToSave);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Get all method
exports.getAllProviders = async (req, res) => {
    try {
        const data = await provider.find();
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Get provider by email
exports.getProvider = async (req, res) => {
    try {
        const email = req.body.email.toString();
        const data = await provider.findOne({ email: email })
        if (data === null) {
            res.sendStatus(200);
        }
        else {
            res.sendStatus(201);
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Delete by ID method
exports.deleteProvider = async (req, res) => {
    try {
        const id = req.params.id;
        const providerToDelete = await provider.findById(id);
        if (!providerToDelete) {
            res.status(404).json({ message: "Provider not found" });
        }
        const firstname = providerToDelete.firstname;

        await provider.findByIdAndDelete(id);
        res.status(200).json({ message: `Document with ${firstname} has been deleted..` });
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
}

