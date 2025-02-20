import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { useAuth } from '../contexts/AuthContext'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'
import { Typography } from '@mui/material'

export default function ProfileMenu() {
  const { user } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
        <span className="sr-only">Open user menu</span>
        <div className="MuiAvatar-root MuiAvatar-circular MuiAvatar-colorDefault css-3ge787-MuiAvatar-root">
          {user ? user.email?.charAt(0).toUpperCase() : 'HR'}
        </div>
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2.5 w-48 origin-top-right rounded-lg bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
          {user ? (
            <>
              <div className="px-4 py-2 text-sm text-gray-500 border-b">
                {user.email}
              </div>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-gray-50' : ''
                    } block px-4 py-2 text-sm text-gray-700 w-full text-left`}
                    onClick={() => router.push('/profile')}
                  >
                    Your Profile
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-gray-50' : ''
                    } block px-4 py-2 text-sm text-gray-700 w-full text-left`}
                    onClick={() => router.push('/settings')}
                  >
                    Settings
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-gray-50' : ''
                    } block px-4 py-2 text-sm text-gray-700 w-full text-left border-t`}
                    onClick={handleLogout}
                  >
                    Sign out
                  </button>
                )}
              </Menu.Item>
            </>
          ) : (
            <>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-gray-50' : ''
                    } block px-4 py-2 text-sm text-gray-700 w-full text-left`}
                    onClick={() => router.push('/login')}
                  >
                    Sign in
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-gray-50' : ''
                    } block px-4 py-2 text-sm text-gray-700 w-full text-left`}
                    onClick={() => router.push('/register')}
                  >
                    Create account
                  </button>
                )}
              </Menu.Item>
            </>
          )}
        </Menu.Items>
      </Transition>
    </Menu>
  )
} 