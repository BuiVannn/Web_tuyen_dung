/**
 * Email service utility for sending notifications related to interviews
 * Note: This is a placeholder implementation. In a production environment,
 * you should integrate with an actual email service like SendGrid, Mailgun, etc.
 */

/**
 * Sends an email notification about a scheduled interview
 * @param {string} recipientEmail - The email address of the recipient
 * @param {Object} interview - The interview details
 * @returns {Promise<boolean>} - Whether the email was sent successfully
 */
export const sendInterviewEmail = async (recipientEmail, interview) => {
    try {
        // Log email details for now
        console.log('Sending interview notification email to:', recipientEmail);
        console.log('Interview details:', {
            date: interview.scheduledDate,
            time: `${interview.startTime} - ${interview.endTime}`,
            type: interview.interviewType,
            location: interview.location
        });

        // In a real implementation, you would integrate with an email service here
        // For example, with SendGrid:
        // await sendgrid.send({
        //   to: recipientEmail,
        //   from: 'your-company@example.com',
        //   subject: 'Interview Scheduled',
        //   text: `Your interview is scheduled for ${interview.scheduledDate} at ${interview.startTime}`
        // });

        return true;
    } catch (error) {
        console.error('Error sending interview email:', error);
        return false;
    }
};

/**
 * Sends an email notification about an updated interview
 * @param {string} recipientEmail - The email address of the recipient
 * @param {Object} interview - The interview details
 * @returns {Promise<boolean>} - Whether the email was sent successfully
 */
export const sendInterviewUpdateEmail = async (recipientEmail, interview) => {
    try {
        console.log('Sending interview update email to:', recipientEmail);
        console.log('Updated interview details:', {
            date: interview.scheduledDate,
            time: `${interview.startTime} - ${interview.endTime}`,
            type: interview.interviewType,
            location: interview.location,
            status: interview.status
        });

        return true;
    } catch (error) {
        console.error('Error sending interview update email:', error);
        return false;
    }
};

/**
 * Sends an email notification about a cancelled interview
 * @param {string} recipientEmail - The email address of the recipient
 * @param {Object} interview - The interview details
 * @returns {Promise<boolean>} - Whether the email was sent successfully
 */
export const sendInterviewCancellationEmail = async (recipientEmail, interview) => {
    try {
        console.log('Sending interview cancellation email to:', recipientEmail);
        console.log('Cancelled interview details:', {
            date: interview.scheduledDate,
            time: `${interview.startTime} - ${interview.endTime}`,
            reason: 'The interview has been cancelled by the recruiter.'
        });

        return true;
    } catch (error) {
        console.error('Error sending interview cancellation email:', error);
        return false;
    }
};

/**
 * Sends an email notification about a confirmed interview
 * @param {string} recipientEmail - The email address of the recipient
 * @param {Object} interview - The interview details
 * @returns {Promise<boolean>} - Whether the email was sent successfully
 */
export const sendInterviewConfirmationEmail = async (recipientEmail, interview) => {
    try {
        console.log('Sending interview confirmation email to:', recipientEmail);
        console.log('Confirmed interview details:', {
            date: interview.scheduledDate,
            time: `${interview.startTime} - ${interview.endTime}`,
            message: 'The candidate has confirmed this interview.'
        });

        return true;
    } catch (error) {
        console.error('Error sending interview confirmation email:', error);
        return false;
    }
};