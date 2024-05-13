import { logoutAccount } from '@/lib/actions/user.actions'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

const Footer = ({ user, type = 'desktop' }: FooterProps) => {

  return (
    <footer className="footer">
      <div className={type === 'mobile' ? 'footer_name-mobile' : 'footer_name'}>
        <p className="text-xl font-bold text-blue-500">
          {"S"}
        </p>
      </div>

      <div className={type === 'mobile' ? 'footer_email-mobile' : 'footer_email'}>
          <h1 className="text-14 truncate text-gray-700 font-semibold">
            {"Sahil"}
          </h1>
          <p className="text-14 truncate font-normal text-gray-600">
            {"Sahil123@gmail.com"}
          </p>
      </div>

      <div className="footer_image" onClick={()=>signOut()}>
        <Image src="icons/logout.svg" fill alt="jsm" />
      </div>
    </footer>
  )
}

export default Footer