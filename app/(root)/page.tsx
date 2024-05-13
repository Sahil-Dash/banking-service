'use client'
import HeaderBox from '@/components/HeaderBox'
import Loader from '@/components/Loader';
// import RecentTransactions from '@/components/RecentTransactions';
import RightSidebar from '@/components/RightSidebar';
import TotalBalanceBox from '@/components/TotalBalanceBox';
import axios from 'axios';
// import { getAccount, getAccounts } from '@/lib/actions/bank.actions';
import { useSession } from 'next-auth/react';
import { useEffect,useState } from 'react';

const Home = ({ searchParams: { id, page } }: SearchParamProps) => {


  
  const {data: session, status} = useSession()
  const [user, setUser] = useState()

  useEffect(() => {
    if (session) {
      console.log("Email-",session);

      const currentUser = async (email:any) =>{
        try {
    
          let data={
            email: email
          }
          const response = await axios.post(`/api/getCurrentUser`, data);
          console.log(response.data)
          setUser(response.data.user)
        } catch (error) {
          console.log(error)
        }
      }
      currentUser(session?.user?.email)
    }
  }, [session]); // Dependency array on session



  console.log("User :- ",user)
  
  if (status === "loading") {
    return <Loader />;
  }

  
  return (
    
    <section className="home">
      <div className="home-content">
        <header className="home-header">

         {user && <HeaderBox 
            type="greeting"
            title="Welcome"
            user={user}
            subtext="Access and manage your account and transactions efficiently."
          />}

          

          <TotalBalanceBox 
            accounts={[]}
            totalBanks={1}
            totalCurrentBalance={10000}
          />
        </header>
     

        {/* <RecentTransactions 
          accounts={accountsData}
          transactions={account?.transactions}
          appwriteItemId={appwriteItemId}
          page={currentPage}
        /> */}
      </div>
      
       {user && <RightSidebar 
        user={user}
        transactions={[]}
        banks={[{currentBalance: 4000, name:"Sahil"},{ currentBalance: 6000, name:"Sunil"}]}
      />} 
      


    </section>
  )
}

export default Home