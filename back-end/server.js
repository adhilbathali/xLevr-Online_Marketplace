const mongoose = require('mongoose');
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const { Student, Gig, Assignment } = require("./models/stdmodl");

const app = express();
const PORT = 5001; // Choose an unused port

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB!'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Student login
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    UserModel.findOne({ email: email })
        .then(user => {
            if (user) {
                if (user.password === password) {
                    res.json('success');
                } else {
                    res.json({ status: 'error', message: 'The password is incorrect' });
                }
            } else {
                res.json({ status: 'error', message: 'Record not found' });
            }
        })
        .catch(err => {
            res.status(500).json({ status: 'error', message: 'Server error', error: err });
        });
});

// Student Registration
app.post('/register', async (req, res) => {
    const { name, email, password, skills } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newStudent = await Student.create({
            name,
            email,
            password: hashedPassword,
            skills,
        });

        res.status(201).json({ status: 'success', message: 'Student registered', student: newStudent });
    } catch (err) {
        if (err.code === 11000) {
            res.status(400).json({ status: 'error', message: 'Email already exists' });
        } else {
            res.status(500).json({ status: 'error', message: 'Error registering student', error: err });
        }
    }
});

// Create a Gig
app.post('/gigs', async (req, res) => {
    const { title, description, requiredSkills, createdBy } = req.body;

    try {
        const student = await Student.findById(createdBy);

        if (!student) {
            return res.status(404).json({ status: 'error', message: 'Student not found' });
        }

        const newGig = await Gig.create({
            title,
            description,
            requiredSkills,
            createdBy,
        });

        res.status(201).json({ status: 'success', message: 'Gig created', gig: newGig });
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Error creating gig', error: err });
    }
});

// Fetch All Gigs
app.get('/gigs', async (req, res) => {
    try {
        const gigs = await Gig.find().populate('createdBy', 'name email');
        res.json({ status: 'success', gigs });
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Error fetching gigs', error: err });
    }
});

// Match Students to a Gig
app.get('/gigs/:gigId/matches', async (req, res) => {
    const { gigId } = req.params;

    try {
        const gig = await Gig.findById(gigId);

        if (!gig) {
            return res.status(404).json({ status: 'error', message: 'Gig not found' });
        }

        const students = await Student.find({
            skills: { $in: gig.requiredSkills },
        });

        const rankedStudents = students.map((student) => ({
            ...student._doc,
            matchedSkills: student.skills.filter((skill) => gig.requiredSkills.includes(skill)).length,
        })).sort((a, b) => b.matchedSkills - a.matchedSkills);

        res.json({ status: 'success', matches: rankedStudents });
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Error matching students', error: err });
    }
});

// Start the server (ONLY ONCE)
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});

