import { useActivity } from '../../hooks/useActivity'
import { ConfigButton } from '../ConfigButton'
import { HeaderContent } from '../HeaderContent'
import { Player } from '../Player'

import styles from './styles.module.scss'

export function ActivityContent(){
  const { activity } = useActivity()

  return(
    <div className={styles.container}>
      <HeaderContent/>
      {
        activity && (
          <>
          <main>
          <div className={styles.title_subtitle}>
            <h1>{activity?.title}</h1>
            <span className={styles.subtitle}>{activity?.description}</span>
            <span className={styles.created_at}>Criado em: 08/07/2021 ás 15: 32</span>
          </div>
  
          <div className={styles.description} dangerouslySetInnerHTML={{ __html: activity?.body as string}}>
          </div>
  
           <div className={styles.files}>
            <span>Arquivos: {activity?.files.length}</span>
  
            {
              activity?.files.map(item => {
                if(item.format === "mp4"){ 
                  return (
                    <>
                    <video controls className={styles.video}>
                      <source src={item.url} type="video/mp4"/>
                      Your browser does not support the video tag.
                    </video>
                    </>
                  )
                }
                return (
                  <div className={styles.audio_files} key={item.id}>
                    <Player 
                      name={item.name || ''}
                      format={item.format || ''}
                      url={item.url || ''}
                      duration={item.duration || 0}
                      category={item.category || ''}
                    />
                  </div>
                )
              })
            }
  
          </div>      
        </main>
  
        <ConfigButton/>
        </>
        )
      }
    </div>
  )
}