import twilio from 'twilio';

interface SMSResponse {
  success: boolean;
  message: string;
  recipients?: string[];
  failedRecipients?: {
    phone: string;
    error: string;
  }[];
}

class TwilioService {
  private client: any;
  private fromNumber: string;

  constructor() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER || '';

    console.log('\n📱 Initializing Twilio SMS Service...');
    console.log(`   Account SID: ${accountSid?.substring(0, 10)}...`);
    console.log(`   From Number: ${this.fromNumber}`);

    if (!accountSid || !authToken || !this.fromNumber) {
      throw new Error('❌ Twilio credentials missing in .env file!');
    }

    this.client = twilio(accountSid, authToken);
    console.log('✅ Twilio SMS Service Ready\n');
  }

  private formatPhoneNumber(phone: string): string {
    let cleaned = phone.replace(/[\s\-\(\)]/g, '');
    
    if (cleaned.startsWith('0')) {
      cleaned = '+250' + cleaned.substring(1);
    }
    
    if (!cleaned.startsWith('+')) {
      cleaned = '+250' + cleaned;
    }
    
    return cleaned;
  }

  async sendSMS(to: string, message: string): Promise<SMSResponse> {
    try {
      const formattedPhone = this.formatPhoneNumber(to);
      
      console.log(`\n📤 Sending SMS via Twilio...`);
      console.log(`   From: ${this.fromNumber}`);
      console.log(`   To: ${formattedPhone}`);
      console.log(`   Message Length: ${message.length} characters`);
      
      const twilioMessage = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: formattedPhone
      });

      console.log('\n📡 Twilio Response:');
      console.log(`   Message SID: ${twilioMessage.sid}`);
      console.log(`   Status: ${twilioMessage.status}`);
      console.log(`   Direction: ${twilioMessage.direction}`);

      if (twilioMessage.status === 'queued' || twilioMessage.status === 'sent' || twilioMessage.status === 'delivered') {
        console.log(`✅ SMS sent successfully to ${formattedPhone}!\n`);
        return {
          success: true,
          message: 'SMS sent successfully',
          recipients: [formattedPhone]
        };
      } else {
        console.error(`❌ SMS failed with status: ${twilioMessage.status}\n`);
        return {
          success: false,
          message: twilioMessage.errorMessage || 'Failed to send SMS',
          failedRecipients: [{
            phone: formattedPhone,
            error: twilioMessage.errorMessage || twilioMessage.status
          }]
        };
      }

    } catch (error: any) {
      console.error('\n❌ Twilio SMS Error:');
      console.error(`   Message: ${error.message}`);
      console.error(`   Code: ${error.code}`);
      
      if (error.code === 21211) {
        console.error('   💡 Fix: Invalid phone number format');
      } else if (error.code === 21408) {
        console.error('   💡 Fix: Unverified number on trial account');
        console.error('   → Verify at: https://console.twilio.com/us1/develop/phone-numbers/manage/verified');
      } else if (error.code === 20003) {
        console.error('   💡 Fix: Check TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN');
      }
      console.error('');
      
      return {
        success: false,
        message: error.message || 'Failed to send SMS',
        failedRecipients: [{
          phone: to,
          error: error.message
        }]
      };
    }
  }

  async sendBulkSMS(recipients: string[], message: string): Promise<SMSResponse> {
    const successRecipients: string[] = [];
    const failedRecipients: { phone: string; error: string }[] = [];

    console.log(`\n📤 Bulk SMS: Sending to ${recipients.length} recipient(s)...\n`);

    for (const phone of recipients) {
      try {
        const result = await this.sendSMS(phone, message);
        
        if (result.success) {
          successRecipients.push(phone);
        } else {
          failedRecipients.push({
            phone,
            error: result.message
          });
        }

        if (recipients.length > 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

      } catch (error: any) {
        failedRecipients.push({
          phone,
          error: error.message
        });
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('📊 BULK SMS SUMMARY');
    console.log('='.repeat(50));
    console.log(`Total Recipients: ${recipients.length}`);
    console.log(`✅ Successful: ${successRecipients.length}`);
    console.log(`❌ Failed: ${failedRecipients.length}`);
    console.log('='.repeat(50) + '\n');

    return {
      success: successRecipients.length > 0,
      message: `Sent to ${successRecipients.length}/${recipients.length} recipients`,
      recipients: successRecipients,
      failedRecipients: failedRecipients.length > 0 ? failedRecipients : undefined
    };
  }
}

const twilioService = new TwilioService();

export const sendSMS = (to: string, message: string) => twilioService.sendSMS(to, message);
export const sendBulkSMS = (recipients: string[], message: string) => twilioService.sendBulkSMS(recipients, message);

export default twilioService;