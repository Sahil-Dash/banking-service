"use client";
import HeaderBox from "@/components/HeaderBox";
import PaymentTransferForm from "@/components/PaymentTransferForm";
import Loader from "@/components/Loader";
import { getAccounts } from "@/lib/actions/bank.actions";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const Transfer = () => {
  const { data: session, status } = useSession();

  const [user, setUser] = useState();
  const [accounts, setAccounts] = useState<Accounts>({
    data: [],
    totalBanks: 0,
    totalCurrentBalance: 0,
  });

  useEffect(() => {
    if (session) {
      const currentUser = async (email: any) => {
        try {
          let data = {
            email: email,
          };
          const response = await axios.post(`/api/getCurrentUser`, data);
          console.log(response.data);
          setUser(response.data.user);

          const accounts = await getAccounts({
            userId: response.data.user._id,
          });
          setAccounts(accounts);
        } catch (error) {
          console.log(error);
        }
      };
      currentUser(session?.user?.email);
    }
  }, [session]); // Dependency array on session

  if (status === "loading" && user === undefined) {
    return <Loader />;
  }

  let check = accounts && user;

  return (
    <>
      <section className="payment-transfer">
        <HeaderBox
          title="Payment Transfer"
          subtext="Please provide any specific details or notes related to the payment transfer"
          user={undefined}
          type={""}
        />
        {!check ? (
          <Loader />
        ) : (
          <section className="size-full pt-5">
            <PaymentTransferForm accounts={accounts.data} />
          </section>
        )}
      </section>
    </>
  );
};

export default Transfer;
