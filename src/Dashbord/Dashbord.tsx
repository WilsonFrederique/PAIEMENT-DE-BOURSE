import React from 'react'
import SidBar from '../SidBar/SidBar'
import ComDashbord from '../Components/ComDashbord/ComDashbord'

const Dashbord = () => {
  return (
    <>
        <div className="container">
            <SidBar/>
            <ComDashbord/>            
        </div>
    </>
  )
}

export default Dashbord