"use client";

import HeaderBox from "@/components/HeaderBox";
// import { Pagination } from '@/components/Pagination';
import TransactionsTable from "@/components/TransactionsTable";
import { getAccount, getAccounts } from "@/lib/actions/bank.actions";
// import { getLoggedInUser } from '@/lib/actions/user.actions';
import { formatAmount } from "@/lib/utils";
import React from "react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "@/components/Loader";

const TransactionHistory = ({
  searchParams: { id, page },
}: SearchParamProps) => {
  const currentPage = Number(page as string) || 1;

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
        console.log("Prams :- ", id);
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
          const bank_Id = (id as string) || accounts.data[0]?.bank_Id;
          const account = await getAccount({
            bankId: bank_Id,
          });
          setAccount(account);
        } catch (error) {
          console.log(error);
        }
      };
      currentUser(session?.user?.email);
    }
  }, [session, id]); // Dependency array on session

  if (status === "loading" && user === undefined) {
    return <Loader />;
  }

  let check = account;

  return (
    <>
      {!check ? (
        <Loader />
      ) : (
        <div className="transactions">
          <div className="transactions-header">
            <HeaderBox
              title="Transaction History"
              subtext="See your bank details and transactions."
              user={user}
              type={""}
            />
          </div>

          <div className="space-y-6">
            <div className="transactions-account">
              <div className="flex flex-col gap-2">
                <h2 className="text-18 font-bold text-white">
                  {account?.data.name}
                </h2>
                <p className="text-14 text-blue-25">
                  {account?.data.officialName}
                </p>
                <p className="text-14 font-semibold tracking-[1.1px] text-white">
                  ●●●● ●●●● ●●●● {account?.data.mask}
                </p>
              </div>

              <div className="transactions-account-balance">
                <p className="text-14">Current balance</p>
                <p className="text-24 text-center font-bold">
                  {formatAmount(account?.data.currentBalance)}
                </p>
              </div>
            </div>

            <section className="flex w-full flex-col gap-6">
              <TransactionsTable transactions={account?.transactions} />
              {/* {totalPages > 1 && (
              <div className="my-4 w-full">
                <Pagination totalPages={totalPages} page={currentPage} />
              </div>
            )} */}
            </section>
          </div>
        </div>
      )}
    </>
  );
};

export default TransactionHistory;
