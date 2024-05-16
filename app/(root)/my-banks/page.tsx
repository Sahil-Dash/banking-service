"use client";

import BankCard from "@/components/BankCard";
import HeaderBox from "@/components/HeaderBox";
import Loader from "@/components/Loader";
import { getAccounts } from "@/lib/actions/bank.actions";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const MyBanks = () => {
  const { data: session, status } = useSession();

  const [user, setUser] = useState();
  const [accounts, setAccounts] = useState<Accounts>({
    data: [],
    totalBanks: 0,
    totalCurrentBalance: 0,
  });
  const [account, setAccount] = useState();

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
      {" "}
      {!check ? (
        <Loader />
      ) : (
        <section className="flex">
          <div className="my-banks">
            <HeaderBox
              title="My Bank Accounts"
              subtext="Effortlessly manage your banking activites."
              user={undefined}
              type={""}
            />

            <div className="space-y-4">
              <h2 className="header-2">Your cards</h2>
              <div className="flex flex-wrap gap-6">
                {accounts &&
                  accounts.data.map((a: Account) => (
                    <BankCard
                      key={accounts.id}
                      account={a}
                      userName={user?.firstName}
                    />
                  ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default MyBanks;
