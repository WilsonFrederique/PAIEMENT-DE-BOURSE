import React from 'react'
import SidBar from '../../SidBar/SidBar'
import ComEtudiants from '../../Components/ComPages/ComEtudiants/ComEtudiants'

const Etudiant = () => {
  return (
    <>
        <div className="container">
            <SidBar/>
            <ComEtudiants/>            
        </div>
    </>
  )
}

export default Etudiant