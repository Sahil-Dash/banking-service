"use client";
import HeaderBox from "@/components/HeaderBox";
import Loader from "@/components/Loader";
import RecentTransactions from "@/components/RecentTransactions";
// import RecentTransactions from '@/components/RecentTransactions';
import RightSidebar from "@/components/RightSidebar";
import TotalBalanceBox from "@/components/TotalBalanceBox";
import { getAccount, getAccounts } from "@/lib/actions/bank.actions";
import axios from "axios";
// import { getAccount, getAccounts } from '@/lib/actions/bank.actions';
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const Home = ({ searchParams: { id, page } }: SearchParamProps) => {
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

  console.log("User :- ", user);
  console.log("Account :- ", account);
  console.log("Accounts :- ", accounts);

  let check = user && accounts;

  return (
    <>
      {!check ? (
        <section className="home">
          <div className="home-content">
            <Loader />
          </div>
        </section>
      ) : (
        <section className="home">
          <div className="home-content">
            <header className="home-header">
              <HeaderBox
                type="greeting"
                title="Welcome"
                user={user}
                subtext="Access and manage your account and transactions efficiently."
              />

              <TotalBalanceBox
                accounts={accounts.data}
                totalBanks={accounts.totalBanks}
                totalCurrentBalance={accounts.totalCurrentBalance}
              />
            </header>

            {!account ? (
              <Loader />
            ) : (
              <RecentTransactions
                accounts={accounts.data}
                transactions={account?.transactions}
                bank_Id={(id as string) || accounts.data[0]?.bank_Id}
                page={currentPage}
              />
            )}
          </div>

          <RightSidebar
            user={user}
            transactions={account?.transactions}
            banks={accounts.data}
          />
        </section>
      )}
    </>
  );
};

export default Home;
