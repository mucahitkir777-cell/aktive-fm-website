declare module "sib-api-v3-sdk" {
  interface BrevoAuthentication {
    apiKey: string;
  }

  interface BrevoApiClient {
    authentications: {
      "api-key": BrevoAuthentication;
    };
  }

  interface BrevoEmailAddress {
    email: string;
    name?: string;
  }

  interface BrevoTransactionalEmail {
    sender: BrevoEmailAddress;
    to: BrevoEmailAddress[];
    subject: string;
    textContent?: string;
    htmlContent: string;
  }

  class TransactionalEmailsApi {
    sendTransacEmail(email: BrevoTransactionalEmail): Promise<unknown>;
  }

  const SibApiV3Sdk: {
    ApiClient: {
      instance: BrevoApiClient;
    };
    TransactionalEmailsApi: typeof TransactionalEmailsApi;
  };

  export default SibApiV3Sdk;
}
