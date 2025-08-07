import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import env from "./constants";

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": env.PLAID_CLIENT_ID,
      "PLAID-SECRET": env.PLAID_SECRET,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

export default plaidClient;
