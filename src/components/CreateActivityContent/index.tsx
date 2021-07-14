import { FormEvent, useEffect, useState } from 'react'
import Image from 'next/image'

import saveSVG from '../../images/save.svg'
import plusSVG from '../../images/plus.svg'

import { HeaderContent } from '../HeaderContent'
import { InputCreate } from '../InputCreate'
import { SelectButton } from '../SelectButton'
import { DetailArchiveModal } from '../DetailArchiveModal'

import { useModal } from '../../hooks/useModal'
import { api } from '../../services/api'

import styles from './styles.module.scss'
import { useCreateActivity } from '../../hooks/useCreateActivity'
import { useActivity } from '../../hooks/useActivity'

interface FileProps{
  id: string;
  name: string;
  format: string;
  duration: number;
  url: string;
  author: string;
}
interface ArchiveSelected{
  file: FileProps;
  index: number
}

interface Activity{
  id: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  body: string;
  category: string;
  files: FileProps[]
}

export function CreateActivityContent(){
  const [ isFilled, setIsFilled ] = useState(false)
  const { handleAddActivity } = useActivity()
  const [ isDetailArchiveVisible, setIsDetailArchiveVisible ] = useState<boolean>(false)
  const [ archiveSelected, setArchiveSelected ] = useState<ArchiveSelected>()
  const { 
    category,
    archives,
    title,
    description,
    handleSetDescription,
    handleSetSubTitle,
    handleSetTitle,
    subTitle,
    handleRemoveArchive
  } = useCreateActivity()
  const { handleModalCategory, handleModalArchives } = useModal()

  useEffect(() => {
    title && subTitle && description && category ? setIsFilled(true) : setIsFilled(false)
  },[ title, subTitle, description, category ])

  function handleDetailArchive(archive: FileProps, index: number){
    setArchiveSelected({ file: archive, index })
    setIsDetailArchiveVisible(!isDetailArchiveVisible)
  }
  function handleCloseModal(){ setIsDetailArchiveVisible(!isDetailArchiveVisible) }

  async function handleSumbit(event: FormEvent){
    event.preventDefault()

    title.trim()
    subTitle.trim()
    description.trim()

    const newActivity = await api.post('/activity/new', {
      title,
      description: subTitle,
      body: description,
      category: category?.id
    })

    archives.forEach(async (file) => {
      await api.post('/archive-activity/new', {
        activity: newActivity.data.id,
        archive: file.id
      })
    })

    // const Activity = {
    //   id: newActivity.data.id,
    //   title: newActivity.data.title,
    //   created_at: newActivity.data.created_at,
    //   updated_at: newActivity.data.updated_at,
    //   description: newActivity.data.description,
    //   body: newActivity.data.body,
    //   category: newActivity.data.body,
    //   files: 
    // } as Activity

    // handleAddActivity(Activity)
  }

  return(
    <div className={styles.container}>
      <HeaderContent title="Criar Atividade"/>

      { isDetailArchiveVisible && (
        <DetailArchiveModal 
          handleCloseModal={handleCloseModal}
          handleRemoveArchive={handleRemoveArchive}
          file={archiveSelected}
        />
      ) }

        <main>
          {/* <span className={styles.created_at}>Criado em: 08/07/2021 ás 15: 32</span> */}
          <form onSubmit={handleSumbit}>
            <InputCreate title="Título:" type="text" setValue={handleSetTitle} value={title}/>
            <InputCreate title="Subtítulo:" type="text" setValue={handleSetSubTitle} value={subTitle}/>
            <InputCreate title="Descrição:" type="textarea" setValue={handleSetDescription} value={description}/>

            <div className={`${styles.select_container} ${ category && styles.active}`}>
              <span>Categoria:</span>
              <SelectButton isActive={category ? true : false} title={category?.name || 'Selecione'} onClick={handleModalCategory}/>
            </div>

            <div className={`${styles.select_container} ${ archives.length !== 0  && styles.active}`}>
              <span>Arquivos:</span>

              <div className={styles.archives_list}>
                {
                  archives.map((item, index) => (
                    <SelectButton 
                      key={item.id}
                      isActive={archives ? true : false} 
                      title={item.name || ''}
                      onClick={() => {handleDetailArchive(item, index); }}
                    />
                  ))
                }

                <button type="button" className={styles.add_file} onClick={handleModalArchives}>
                  <Image src={plusSVG} alt="Icone de adicionar"/>
                </button>

              </div>
            </div>

            <button 
              type="submit" 
              className={styles.submit_button}
              disabled={!isFilled}
            >
              <Image src={saveSVG} alt="Icone de salvar"/>
              Salvar
            </button>
          </form>
        </main>
    </div>
  )
}