'use client'

import { User } from '@/payload-types'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
import { User2 } from 'lucide-react'

const UserAccountNav = ({ user }: { user: User }) => {
  const { signOut } = useAuth()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className='overflow-visible'>
        <Button
          variant='ghost'
          size='sm'
          className='relative group'>
		<User2 className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-800" aria-hidden="true" />
		<span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
          My account
		</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className='bg-white w-60'
        align='end'>
        <div className='flex items-center justify-start gap-2 p-2'>
          <div className='flex flex-col space-y-0.5 leading-none'>
            <p className='font-medium text-sm text-black'>
              {user.email}
            </p>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href='/dashboard'>Seller Dashboard</Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={signOut}
          className='cursor-pointer'>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserAccountNav