
import axios from "axios";
import { NextResponse } from "next/server";
import { createDwollaCustomer } from "../actions/dwolla.actions";
import { extractCustomerIdFromUrl } from "../utils";




export const signUp = async ({ password, ...userData }: SignUpParams) => {

    try {
        const data = {
            email: userData.email,
            password:  password,
            firstName: userData.firstName,
            lastName: userData.lastName
        }

        console.log(userData)
        const response = await axios.post('/api/signup', data);
        console.log(response)

        if (response.data.success===false) {
            return {data: response.data}
        }

        // if (!user) throw new Error("Error creating user")

        const dwollaCustomerUrl = await createDwollaCustomer({
            ...userData,
            type: 'personal'
            })
        
            if(!dwollaCustomerUrl) throw new Error('Error creating Dwolla customer')
        
            const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);

            const dwollaData = {
                ...userData,
                userId: response.data.user._id,
                dwollaCustomerId,
                dwollaCustomerUrl
            }
        
            const dwollaRes = await axios.post('/api/dwolla-signup', dwollaData);

            console.log(dwollaRes.data)

            return {data: dwollaRes.data}



            
    } catch (error) {
        console.log(error)

    }
}



export const createBankAccount = async ({
    userId,
    bankId,
    accountId,
    accessToken,
    fundingSourceUrl,
    shareableId,
  }: createBankAccountProps) => {
    try {
      let data = {userId,bankId,accountId,accessToken,fundingSourceUrl,shareableId}
      console.log("Bank :- ", data)
      // const bankRes = await axios.post('/api/create-bank-account', data);
      // console.log(bankRes)
  
      // return {data: bankRes.data}
      
    } catch (error) {
      console.log(error);
    }
  }