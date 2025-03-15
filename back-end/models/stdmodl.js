const mongoose = require('mongoose');


const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password:{type:String},
  skills: { type: [String], default: [] },
  phone: {type: String,required: true}
});


const gigSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  requiredSkills: { type: [String], default: [] },
  createdBy :{ type:String,required:true},
});


const assignmentSchema = new mongoose.Schema({
  gigId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  status: { type: String, default: 'Pending' },
});


const Student = mongoose.model('Student', studentSchema);
const Gig = mongoose.model('Gig', gigSchema);
const Assignment = mongoose.model('Assignment', assignmentSchema);


module.exports = { Student, Gig, Assignment };