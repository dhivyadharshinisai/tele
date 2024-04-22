
const express = require('express');
const router = express.Router();
const cors=require('cors');
const User = require('../models/user');

router.get('/',cors(), async (req, res) => {
    try {
        const users = await User.find();
        const usersArray = users.map(user => ({
            username: user.username,
            password: user.password,
            name: user.name,
            phone: user.phone,
            profilePicURL: user.profilePicURL,
            age: user.age,
            email: user.email,
            gender: user.gender,
            job_type: user.job_type,
            experience: user.experience,
            job_description: user.job_description,
            date: user.date,
            address: user.address,
            pincode: user.pincode,
            latitude: user.latitude,
            longitude: user.longitude
        }));
        res.json(usersArray);
    } catch (error) {
        res.status(500).json({ message: error.message }); 
    }
});
// router.get('/:id',cors(), async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id);
//         res.json(user);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

router.post('/',cors(), async (req, res) => {
    const userData = req.body;

    try {
        const user = new User({
            username: userData.username,
            password: userData.password,
            name: userData.name,
            phone: userData.phone,
            profilePicURL: userData.profilePicURL,
            age: userData.age,
            email: userData.email,
            gender: userData.gender,
            job_type: userData.job_type,
            experience: userData.experience,
            job_description: userData.job_description,
            date: userData.date,
            address: userData.address,
            pincode: userData.pincode,
            latitude: userData.latitude,
            longitude: userData.longitude
        });

        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Error creating user' });
    }
})


router.put('/',cors(), async (req, res) => {
    const { id } = req.params; // Extract user ID from request parameters
    const newData = req.body; // Extract updated user data from request body

    try {
        const updatedUser = await User.findByIdAndUpdate(id, newData, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(updatedUser);
    } catch (error) {
        res.status(500).send('Error');
    }
});

router.delete('/', cors(),async (req, res) => {
    const { id } = req.params; // Extract user ID from request parameters

    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).send('Error');
    }
});

module.exports = router;
