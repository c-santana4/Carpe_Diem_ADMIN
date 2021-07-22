import Image from 'next/image'
import { motion } from 'framer-motion'

import trashSVG from '../../images/trash.svg'
import { Question } from '../../@types/Activity'

import { SelectButton } from '../SelectButton'

import styles from './styles.module.scss'

interface QuestionItemProps{
  question: Question;
  handleSelect: ( question: Question ) => void
}

export function QuestionItem({ question, handleSelect }: QuestionItemProps){

  return(
    <motion.div  
      className={styles.container}
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}  
    >
      <h2>{question.body}</h2>

      <div className={styles.category_container}>
        <SelectButton title={question.category.name} isActive/>
      </div>

      <button 
        type="button" 
        className={styles.delete_button} 
        onClick={() => handleSelect(question)}
      >
        <Image src={trashSVG} alt="Deletar pergunta"/>
      </button>
    </motion.div>
  )
}