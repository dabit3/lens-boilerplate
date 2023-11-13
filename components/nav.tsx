'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/mode-toggle'
import { LogIn } from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
  useLogin,
  useLogout,
  useProfiles,
  useSession
} from '@lens-protocol/react-web'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import Link from 'next/link'

export function Nav() {
  const { execute: logoutLens } = useLogout()
  const { address, isConnected } = useAccount()
  const { disconnectAsync } = useDisconnect()
  const { open, close } = useWeb3Modal()
  const [isClient, setIsClient] = useState(false)
  const { execute: login, data } = useLogin()
  const { data: session } = useSession()
  const router = useRouter()

  const { data: profiles } = useProfiles({
    where: {
      ownedBy: [address || ''],
    }
  })

  useEffect(() => {
    setIsClient(true)
  }, [])

  const { connectAsync } = useConnect({
    connector: new InjectedConnector(),
  })

  async function connectWallet() {
    try {
      open()
    } catch (err) {
      console.log('error:', err)
      close()
    }
  }

  async function logout() {
    try {
      await logoutLens()
      await disconnectAsync()
      router.push('/')
    } catch (err) {
      console.log('error:', err)
    }
  }

  let profile = profiles?.length ? profiles[profiles?.length - 1] : null

  const onLoginClick = async () => {
    if (!profile) return
    if (isConnected) {
      await disconnectAsync()
    }

    const { connector } = await connectAsync()
    if (connector instanceof InjectedConnector) {
      const walletClient = await connector.getWalletClient()
      await login({
        address: walletClient.account.address,
        profileId: profile.id
      })
    }
  }

  return (
    <nav className='border-b p-4 pl-10 flex sm:flex-row sm:items-center flex-col'>
      <div className='flex flex-1 flex-row'>
        <Link href='/'>
          <h1 className='text-gray'><span className='font-bold'>Lens</span> Protocol</h1>
        </Link>
        {
         isClient && isConnected && session && session.type === "WITH_PROFILE" && (
            <Link href='/profile'>
              <p className='ml-4 text-muted-foreground'>Profile</p>
            </Link>
          )
        }
        <Link href='/publications'>
          <p className='ml-4 text-muted-foreground'>Publications</p>
        </Link>
      </div>
      <div className='sm:hidden mt-3'>
        {
          isClient && !address && (
            <Button variant='outline' className='mr-3' onClick={connectWallet}>
              <LogIn className='mr-2' />
              Connect Wallet
            </Button>
          ) 
        }
        <ModeToggle />
      </div>
      <div className='mr-4 sm:flex items-center hidden '>
        {
           isClient && !address && (
            <Button variant='outline' className='mr-3' onClick={connectWallet}>
              <LogIn className='mr-2' />
              Connect Wallet
            </Button>
          ) 
        }
        {
          isClient && session && session.type !== "WITH_PROFILE" && address && (
            <Button variant='outline' className='mr-3' onClick={onLoginClick}>
            <LogIn className='mr-2' />
            Sign in with Lens.
          </Button>
          )
        }
        {
          isClient && session && session.type === "WITH_PROFILE" &&  isConnected && (
            <Button variant='outline' className='mr-3' onClick={logout}>
              <LogIn className='mr-2' />
              Sign Out.
            </Button>
          )
        }
        <ModeToggle />
      </div>
    </nav>
  )
}
