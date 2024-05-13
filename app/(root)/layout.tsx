'use client'
import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import axios from "axios";





export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const { data: session, status } = useSession()
  const [user, setUser] = useState()

  useEffect(() => {
    if (session) {
      console.log("Email-", session);

      const currentUser = async (email: any) => {
        try {

          let data = {
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



  console.log("User :- ", user)



  return (
    <main className="flex h-screen w-full font-inter">
      {status === "loading" && <Loader />}
      
      {status === "authenticated" &&
        <>
          <Sidebar user={user} />

          <div className="flex size-full flex-col">
            <div className="root-layout">
              <Image src="/icons/logo.svg" width={30} height={30} alt="logo" />
              <div>
                <MobileNav user={user} />
              </div>
            </div>
            {children}
          </div>
        </>}
    </main>
  );
}
