"use server";

import { encryptId, parseStringify } from "../utils";
import {
  CountryCode,
  ProcessorTokenCreateRequest,
  ProcessorTokenCreateRequestProcessorEnum,
  Products,
} from "plaid";

import { plaidClient } from "@/lib/plaid";
import { revalidatePath } from "next/cache";
import { addFundingSource } from "./dwolla.actions";
import Bank from "../mongo_models/bank.models";

export const createLinkToken = async (user: User) => {
  try {
    const tokenParams = {
      user: {
        client_user_id: user._id,
      },
      client_name: `${user.firstName} ${user.lastName}`,
      products: ["auth"] as Products[],
      language: "en",
      country_codes: ["US"] as CountryCode[],
    };

    const response = await plaidClient.linkTokenCreate(tokenParams);

    return parseStringify({ linkToken: response.data.link_token });
  } catch (error) {
    console.log(error);
  }
};

export const exchangePublicToken = async ({
  publicToken,
  user,
}: exchangePublicTokenProps) => {
  try {
    // Exchange public token for access token and item ID
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    console.log("public token");
    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    // Get account information from Plaid using the access token
    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    console.log("accounts get");

    const accountData = accountsResponse.data.accounts[0];

    // Create a processor token for Dwolla using the access token and account ID
    const request: ProcessorTokenCreateRequest = {
      access_token: accessToken,
      account_id: accountData.account_id,
      processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
    };

    console.log(" token request ");

    const processorTokenResponse = await plaidClient.processorTokenCreate(
      request
    );
    const processorToken = processorTokenResponse.data.processor_token;

    // Create a funding source URL for the account using the Dwolla customer ID, processor token, and bank name
    const fundingSourceUrl = await addFundingSource({
      dwollaCustomerId: user.dwollaCustomerId,
      processorToken,
      bankName: accountData.name,
    });

    console.log("funding source ");

    // If the funding source URL is not created, throw an error
    if (!fundingSourceUrl) throw Error;

    console.log("creating bank");

    const bank = new Bank({
      userId: user._id,
      bankId: itemId,
      accountId: accountData.account_id,
      accessToken,
      fundingSourceUrl,
      shareableId: encryptId(accountData.account_id),
    });

    await bank.save();

    // Revalidate the path to reflect the changes
    revalidatePath("/");

    // Return a success message
    return parseStringify({
      publicTokenExchange: "complete",
    });
  } catch (error) {
    console.error("An error occurred while creating exchanging token:", error);
  }
};

export const getBanks = async ({ userId }: getBanksProps) => {
  try {
    const banks: Bank[] = await Bank.find({ userId }).lean();

    return banks;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getBank = async ({ documentId }: getBankProps) => {
  try {
    const bank = await Bank.findById({ _id: documentId }).lean();

    return bank;
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const getBankByAccountId = async ({
  accountId,
}: getBankByAccountIdProps) => {
  try {
    const bank = await Bank.findOne({ accountId: accountId }).lean();
    console.log("Bank : -", bank);
    return bank;
  } catch (error) {
    console.log(error);
    return {};
  }
};
