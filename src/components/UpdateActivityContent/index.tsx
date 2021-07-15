import { FormEvent, useEffect, useState } from 'react'
import Image from 'next/image'
import Loading from 'react-loading'

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
import { FileProps } from '../../@types/Activity'
import { format } from 'date-fns'
import { usePage } from '../../hooks/usePage'

interface ArchiveSelected{
  file: FileProps;
  index: number
}

export function UpdateActivityContent(){
  const [ title, setTitle ] = useState<string | undefined>('')
  const [ subTitle, setSubTitle ] = useState<string | undefined>('')
  const [ description, setDescription ] = useState<string | undefined>('')

  const [ isFilled, setIsFilled ] = useState(false)
  const [ isLoading, setIsLoading ] = useState(false)
  const [ archiveSelected, setArchiveSelected ] = useState<ArchiveSelected>()
  const [ isDetailArchiveVisible, setIsDetailArchiveVisible ] = useState<boolean>(false)

  const { handleModalCategory, handleModalArchives } = useModal()
  const { activity } = useActivity()
  const { handleSetPage } = usePage()
  const { 
    category,
    archives,
    handleClearInputs,
    handleSetCategory,
    handleSetArchive,
    handleRemoveArchive
  } = useCreateActivity()

  useEffect(() => {
    setTitle(activity?.title)
    activity?.category && handleSetCategory(activity?.category)
    setSubTitle(activity?.description)
    setDescription(activity?.body)
    handleSetArchives()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[activity])

  useEffect(() => {
    title && subTitle && description && category ? setIsFilled(true) : setIsFilled(false)
  },[ title, subTitle, description, category ])

  function handleSetTitle(value: string){ setTitle(value) }
  function handleSetSubTitle(value: string){ setSubTitle(value) }
  function handleSetDescription(value: string){ setDescription(value) }

  function handleSetArchives(){
    activity?.files.forEach(item => {
      handleSetArchive(item)
    })
  } 

  const created_at = Date.parse(String(activity?.created_at)) || new Date()
  const updated_at = Date.parse(String(activity?.created_at)) || new Date()
  const formattedCreatedAt = format(created_at, "dd/MM/yyyy 'às' HH:mm")
  const formattedUpdatedAt = format(updated_at, "dd/MM/yyyy 'às' HH:mm")

  function handleDetailArchive(archive: FileProps, index: number){
    setArchiveSelected({ file: archive, index })
    setIsDetailArchiveVisible(!isDetailArchiveVisible)
  }
  function handleCloseModal(){ setIsDetailArchiveVisible(!isDetailArchiveVisible) }

  async function handleSumbit(event: FormEvent){
    event.preventDefault()
    if(!title || !subTitle || !description){ return }

    setIsLoading(true)

    title.trim()
    subTitle.trim()
    description.trim()

    function breakLines(string: string){
      return string.replace(/(?:\r\n|\r|\n)/g, '<hr>');
    }

    const descriptionFormatted = breakLines(description) 

    const newActivity = await api.patch(`/activity/update/${activity?.id}`, {
      title,
      description: subTitle,
      body: descriptionFormatted,
      category: category?.id
    })
    activity?.files.forEach(async (item) => {
      await api.delete(`/archive-activity/delete/${item.id}`)
    })

    archives.forEach(async (file) => {
      await api.post('/archive-activity/new', {
        activity: newActivity.data.id,
        archive: file.id
      })
    })
    setIsLoading(false)
    handleSetPage('ActivityDetails')
    handleClearInputs()
  }

  return(
    <div className={styles.container}>
      <HeaderContent title="Alterar Atividade"/>

      { isDetailArchiveVisible && (
        <DetailArchiveModal 
          handleCloseModal={handleCloseModal}
          handleRemoveArchive={handleRemoveArchive}
          file={archiveSelected}
        />
      ) }

      <main>
        <span className={styles.created_at}>Criado em: {formattedUpdatedAt}</span>
        <span className={styles.created_at}>Atualizado em: {formattedCreatedAt}</span>
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
            disabled={isLoading || !isFilled}
          >
            {
              isLoading ? (
                <Loading type="spin" width={32} height={32} color="#fff"/>
              ) : (
                <>
                  <Image src={saveSVG} alt="Icone de salvar"/>
                  Salvar
                </>
              )
            }
           
          </button>
        </form>
      </main>
    </div>
  )
}