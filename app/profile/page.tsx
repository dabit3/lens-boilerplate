'use client'

import {
  useActiveProfile
} from '@lens-protocol/react-web'

import { Profile } from '@lens-protocol/widgets-react'

export default function Search() {
  const { data: profile } = useActiveProfile()
  
  if (!profile) return null

  return (
    <div className="px-10 py-14 flex flex-col items-center">
      <Profile
        handle={profile.handle}
        followButtonBackgroundColor='black'
      />
    </div>
  )
}