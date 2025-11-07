import AfricasTalking from 'africastalking';

interface SMSResponse {
  success: boolean;
  message: string;
  recipients?: string[];
  failedRecipients?: {
    phone: string;
    error: string;
  }[];
}

class SMSService {
  private client: any;
  private sms: any;

  constructor() {
    // Initialize Africa's Talking
    this.client = AfricasTalking({
      apiKey: process.env.AFRICASTALKING_API_KEY || 'atsk_56c94275e81c1525e62e0be22e136d5c54d153e9a176cca97b85e3da4b30363acaba82b1',
      username: process.env.AFRICASTALKING_USERNAME || 'sandbox'
    });
    
    this.sms = this.client.SMS;
  }

  /**
   * Format phone number to international format
   * Converts 0786160692 to +250786160692
   */
  private formatPhoneNumber(phone: string): string {
    // Remove all spaces and special characters
    let cleaned = phone.replace(/[\s\-\(\)]/g, '');
    
    // If starts with 0, replace with +250
    if (cleaned.startsWith('0')) {
      cleaned = '+250' + cleaned.substring(1);
    }
    
    // If doesn't start with +, add +250
    if (!cleaned.startsWith('+')) {
      cleaned = '+250' + cleaned;
    }
    
    return cleaned;
  }

  /**
   * Send SMS to a single recipient
   */
  async sendSMS(to: string, message: string): Promise<SMSResponse> {
    try {
      const formattedPhone = this.formatPhoneNumber(to);
      
      const options = {
        to: [formattedPhone],
        message: message,
       // from: process.env.AFRICASTALKING_SENDER_ID || 'VetConnect'
      };

      const response = await this.sms.send(options);
      
      // Check if SMS was sent successfully
      if (response.SMSMessageData.Recipients.length > 0) {
        const recipient = response.SMSMessageData.Recipients[0];
        
        if (recipient.status === 'Success') {
          return {
            success: true,
            message: 'SMS sent successfully',
            recipients: [formattedPhone]
          };
        } else {
          return {
            success: false,
            message: recipient.status,
            failedRecipients: [{
              phone: formattedPhone,
              error: recipient.status
            }]
          };
        }
      }

      return {
        success: false,
        message: 'No recipients processed',
        failedRecipients: [{
          phone: formattedPhone,
          error: 'No recipients processed'
        }]
      };

    } catch (error: any) {
      console.error('SMS sending error:', error);
      return {
        success: false,
        message: error.message || 'Failed to send SMS',
        failedRecipients: [{
          phone: to,
          error: error.message || 'Unknown error'
        }]
      };
    }
  }

  /**
   * Send SMS to multiple recipients
   */
  async sendBulkSMS(recipients: string[], message: string): Promise<SMSResponse> {
    try {
      // Format all phone numbers
      const formattedPhones = recipients.map(phone => this.formatPhoneNumber(phone));
      
      const options = {
        to: formattedPhones,
        message: message,
        from: process.env.AFRICASTALKING_SENDER_ID || 'VetConnect'
      };

      const response = await this.sms.send(options);
      
      const successRecipients: string[] = [];
      const failedRecipients: { phone: string; error: string }[] = [];

      // Process each recipient
      if (response.SMSMessageData.Recipients && response.SMSMessageData.Recipients.length > 0) {
        response.SMSMessageData.Recipients.forEach((recipient: any) => {
          if (recipient.status === 'Success') {
            successRecipients.push(recipient.number);
          } else {
            failedRecipients.push({
              phone: recipient.number,
              error: recipient.status
            });
          }
        });
      }

      return {
        success: successRecipients.length > 0,
        message: `Sent to ${successRecipients.length} recipients, ${failedRecipients.length} failed`,
        recipients: successRecipients,
        failedRecipients: failedRecipients.length > 0 ? failedRecipients : undefined
      };

    } catch (error: any) {
      console.error('Bulk SMS sending error:', error);
      return {
        success: false,
        message: error.message || 'Failed to send bulk SMS',
        failedRecipients: recipients.map(phone => ({
          phone,
          error: error.message || 'Unknown error'
        }))
      };
    }
  }
}

export default new SMSService();