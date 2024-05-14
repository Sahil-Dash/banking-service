
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

const Footer = ({ user, type = 'desktop' }: FooterProps) => {

  return (
    <>
      {user && <footer className="footer">
        <div className={type === 'mobile' ? 'footer_name-mobile' : 'footer_name'}>
          <p className="text-xl font-bold text-blue-500">
            {user.firstName[0]}
          </p>
        </div>

        <div className={type === 'mobile' ? 'footer_email-mobile' : 'footer_email'}>
          <h1 className="text-14 truncate text-gray-700 font-semibold">
            {user.firstName}
          </h1>
          <p className="text-14 truncate font-normal text-gray-600">
            {user.email}
          </p>
        </div>

        <div className="footer_image" onClick={() => signOut()}>
          <Image src="icons/logout.svg" fill alt="jsm" />
        </div>
      </footer>}
    </>
  )
}

export default Footer