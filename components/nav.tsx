'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/mode-toggle'
import { LogIn } from 'lucide-react'
import {
  useWalletLogin,
  useWalletLogout,
  useActiveProfile,
} from '@lens-protocol/react-web'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import Link from 'next/link'

export function Nav() {
  const { execute: login } = useWalletLogin()
  const { execute: logoutLens } = useWalletLogout()
  const { data: wallet } = useActiveProfile()
  const { address, isConnected } = useAccount()
  const { disconnectAsync } = useDisconnect()
  const { open, close } = useWeb3Modal()
  const [isClient, setIsClient] = useState(false)

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
    } catch (err) {
      console.log('error:', err)
    }
  }

  const onLoginClick = async () => {
    if (isConnected) {
      await disconnectAsync()
    }

    const { connector } = await connectAsync()

    if (connector instanceof InjectedConnector) {
      const walletClient = await connector.getWalletClient()

      await login({
        address: walletClient.account.address,
      })
    }
  }

  console.log('address: ', address)
  console.log('isConnected: ', isConnected)
  console.log('wallet: ', wallet)

  return (
    <nav className='border-b p-4 pl-10 flex sm:flex-row sm:items-center flex-col'>
      <div className='flex flex-1 flex-row'>
        <Link href='/'>
          <h1 className='text-gray'><span className='font-bold'>Lens</span> Protocol</h1>
        </Link>
        {
          isConnected && wallet && (
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
          isClient && address && !wallet && (
            <Button variant='outline' className='mr-3' onClick={onLoginClick}>
              <LogIn className='mr-2' />
              Sign in with Lens.
            </Button>
          )
        }
        {
          isConnected && wallet && (
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