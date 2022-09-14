import { Fragment } from 'react'
import { useParams } from 'react-router-dom'
import Team from '../components/Team/Team'

const TeamPage = () => {
  console.log('team page')
  const params = useParams()
  const { resourceId } = params

  return (
    <Fragment>
      <Team qpath={resourceId} />
    </Fragment>
  )
}

export default TeamPage
