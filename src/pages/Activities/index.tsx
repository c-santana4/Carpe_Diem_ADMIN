import { GetServerSideProps } from 'next'
import { parseCookies } from 'nookies'

import { InformationBar } from '../../components/InformationBar'
import { ActivityContent } from '../../components/ActivityContent'
import { CreateActivityContent } from '../../components/CreateActivityContent'
import { UpdateActivityContent } from '../../components/UpdateActivityContent'

import { usePage } from '../../hooks/usePage'
import { ActivityProvider } from '../../contexts/ActivityContext'

export default function Activities(){
  const { page } = usePage()
  
  return(
    <div className="home_page" style={{ display: 'flex' }}> 
      <div className="content">
        
        { page === "ActivityDetails" && ( <ActivityContent/> )}
        { page === "ActivityCreate" && ( <CreateActivityContent/> )}
        { page === "ActivityUpdate" && ( <UpdateActivityContent/> )}
        
      </div>
      <InformationBar/>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ['@CarpeDiem-Token'] : token } = parseCookies(ctx)

  if(!token){
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }
  return{
    props: {

    }
  }
}