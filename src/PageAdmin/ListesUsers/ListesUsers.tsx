import React from 'react'
import SidBar from '../../SidBar/SidBar'
import ComListesUsers from '../../Components/ComPages/ComListesUsers/ComListesUsers'

const ListesUsers = () => {
  return (
    <>
        <div className="container">
            <SidBar/>
            <ComListesUsers/>            
        </div>
    </>
  )
}

export default ListesUsers