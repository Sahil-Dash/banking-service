"use server"


import { encryptId, parseStringify } from "../utils";
import { CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products } from "plaid";

import { plaidClient } from '@/lib/plaid';
import { revalidatePath } from "next/cache";
import { addFundingSource } from "./dwolla.actions";
import Bank from "../mongo_models/bank.models";




export const createLinkToken = async (user: User) => {

  try {
    const tokenParams = {
      user: {
        client_user_id: user._id
      },
      client_name: `${user.firstName} ${user.lastName}`,
      products: ['auth'] as Products[],
      language: 'en',
      country_codes: ['US'] as CountryCode[],
    }

    const response = await plaidClient.linkTokenCreate(tokenParams);

    return parseStringify({ linkToken: response.data.link_token })
  } catch (error) {
    console.log(error);
  }
}





export const exchangePublicToken = async ({
  publicToken,
  user,
}: exchangePublicTokenProps) => {
  try {
    // Exchange public token for access token and item ID
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;
    
    // Get account information from Plaid using the access token
    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    const accountData = accountsResponse.data.accounts[0];

    // Create a processor token for Dwolla using the access token and account ID
    const request: ProcessorTokenCreateRequest = {
      access_token: accessToken,
      account_id: accountData.account_id,
      processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
    };

    const processorTokenResponse = await plaidClient.processorTokenCreate(request);
    const processorToken = processorTokenResponse.data.processor_token;

     // Create a funding source URL for the account using the Dwolla customer ID, processor token, and bank name
     const fundingSourceUrl = await addFundingSource({
      dwollaCustomerId: user.dwollaCustomerId,
      processorToken,
      bankName: accountData.name,
    });
    
    // If the funding source URL is not created, throw an error
    if (!fundingSourceUrl) throw Error;

    const bank = new Bank({userId: user._id,
      bankId: itemId,
      accountId:accountData.account_id,
      accessToken,
      fundingSourceUrl,
      shareableId: encryptId(accountData.account_id)})

    await bank.save()

    // Revalidate the path to reflect the changes
    revalidatePath("/");

    // Return a success message
    return parseStringify({
      publicTokenExchange: "complete",
    });
  } catch (error) {
    console.error("An error occurred while creating exchanging token:", error);
  }
}

// export const getBanks = async ({ userId }: getBanksProps) => {
//   try {
//     const { database } = await createAdminClient();

//     const banks = await database.listDocuments(
//       DATABASE_ID!,
//       BANK_COLLECTION_ID!,
//       [Query.equal('userId', [userId])]
//     )

//     return parseStringify(banks.documents);
//   } catch (error) {
//     console.log(error)
//   }
// }

// export const getBank = async ({ documentId }: getBankProps) => {
//   try {
//     const { database } = await createAdminClient();

//     const bank = await database.listDocuments(
//       DATABASE_ID!,
//       BANK_COLLECTION_ID!,
//       [Query.equal('$id', [documentId])]
//     )

//     return parseStringify(bank.documents[0]);
//   } catch (error) {
//     console.log(error)
//   }
// }

// export const getBankByAccountId = async ({ accountId }: getBankByAccountIdProps) => {
//   try {
//     const { database } = await createAdminClient();

//     const bank = await database.listDocuments(
//       DATABASE_ID!,
//       BANK_COLLECTION_ID!,
//       [Query.equal('accountId', [accountId])]
//     )

//     if(bank.total !== 1) return null;

//     return parseStringify(bank.documents[0]);
//   } catch (error) {
//     console.log(error)
//   }
// }