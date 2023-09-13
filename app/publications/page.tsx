'use client'

import {
  useExplorePublications, PublicationSortCriteria, PublicationTypes, PublicationMainFocus
} from '@lens-protocol/react-web'

import { Publication } from '@lens-protocol/widgets-react'

export default function Search() {
  const { data: publications, loading } = useExplorePublications({
    sortCriteria: PublicationSortCriteria.CuratedProfiles,
    publicationTypes: [PublicationTypes.Post],
    metadataFilter: {
      restrictPublicationMainFocusTo: [PublicationMainFocus.Image]
    },
    limit: 25
  })
  console.log('publications:', publications)
  
  return (
    <div className="px-10 py-14 flex flex-col items-center">
      { loading && <p>Loading ...</p> }
      {
        publications?.map(publication => (
          <Publication
            publicationId={publication.id}
            key={publication.id}
          />
        ))
      }
    </div>
  )
}