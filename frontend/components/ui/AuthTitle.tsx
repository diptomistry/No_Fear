import React from 'react'

const AuthTitle = ({text1, text2}:{text1: string,text2: string;}) => {
  return (
    <div>
         <h1 className="heading">
     <span className='text-gray-600'>{text1}</span><span className="text-purple"> {text2}</span>
      </h1>
    </div>
  )
}

export default AuthTitle