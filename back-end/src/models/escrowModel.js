// models/escrow_transaction.js

const mongoose = require('mongoose');

const EscrowTransactionSchema = new mongoose.Schema({
  gigId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gig', // or whatever your gig model is named
    required: true
  },
  from: { // professional
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  to: { // student
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  commission: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['held', 'released'],
    default: 'held'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('EscrowTransaction', EscrowTransactionSchema);
