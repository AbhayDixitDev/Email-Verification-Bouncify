export const listItemsLists = {
  style: {
    listStyleType: 'disc',
    paddingLeft: '20px',
    color: '#637381',
  },
  items: [
    'View detailed customer information, including all uploaded email lists and their statuses.',
    'Add or deduct email verification credits from customer accounts as needed.',
    'Delete specific email lists uploaded by customers if required.',
    'Monitor the progress of email lists under various statuses like Completed, Processing, Unprocessed, or Canceled.',
    'Access and download verification reports for completed email lists.',
    'Use the search bar or filters to locate specific email lists or customers quickly.',
    'Track API accounts linked to uploaded email lists for seamless integration management.',
    'Cancel email lists or resolve processing issues directly from the admin panel.',
    `The "Cancel Verification" button is available only for email lists undergoing the verification process.`,
    `Email lists cannot be deleted while under verification.`,
  ],
};
export const listItemsApi = {
  style: {
    listStyleType: 'disc',
    paddingLeft: '20px',
    color: '#637381',
  },
  items: [
    ' Manage third-party email verification APIs (e.g., MyAddr, Bouncify) used for verifying customer-uploaded email lists.',
    'Add new API accounts by providing a unique name, secret key, and setting the account status (Active/Inactive).',
    'Active accounts process verification requests, while inactive accounts remain unused until reactivated.',
    'Track the balance of each API account to ensure sufficient quota for email verifications.',
    `View the "Used Count" to monitor the number of verifications performed through each API.`,
    'Edit API details or toggle account status using the Edit option.',
    'Permanently remove API accounts using the Delete option.',
    'Quickly locate accounts using the search bar or filters (All, Active, Inactive).',
  ],
};
export const listItemsPlans = {
  style: {
    listStyleType: 'disc',
    paddingLeft: '20px',
    color: '#637381',
  },
  items: [
    'Add a new plan with a unique and descriptive name for easy identification.',
    'Define the number of email verification credits to be included in the plan.',
    'Set the price (amount in USD) at which the plan will be available to customers.',
    'Enter the unique Plan ID generated from the system for tracking and integration.',
    'Assign a Plan Code corresponding to the plan name for organization and management.',
    'Review and modify the details of existing plans, including credits and pricing.',
  ],
};
export const listItemsSMTP = {
  style: {
    listStyleType: 'disc',
    paddingLeft: '20px',
    color: '#637381',
  },
  items: [
    'The SMTP section is designed to manage the SMTP servers used for sending email notifications in the Email Verification application.',

    'To add an SMTP, the following details must be provided: SMTP provider, host address, port number, encryption method, username, and password.',

    'You can add multiple SMTP servers for redundancy and flexibility.',
    ' SMTP details can be updated as needed to reflect changes in server configuration or credentials.',

    'Each SMTP can be enabled or disabled individually, allowing for granular control over which SMTPs are active at any given time.',

    'You have the ability to delete SMTP entries if they are no longer required.',

    'Ensure accurate data entry when adding or updating SMTP details to avoid errors in email delivery.',

    'Only one SMTP  needs to be active at a time.',
  ],
};
