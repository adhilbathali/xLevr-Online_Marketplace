function getRemainingDays(deadline) {
    const deadlineDate = new Date(deadline); // Convert deadline string to Date object
    const currentDate = new Date(); // Get today's date

    const timeDifference = deadlineDate - currentDate; // Difference in milliseconds
    const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // Convert to days

    return daysRemaining > 0 ? daysRemaining : 0; // Return 0 if deadline has passed
}

module.exports = getRemainingDays;