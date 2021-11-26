import React from 'react';
import Link from "next/link";

const Form =(props) => {
  return(
    <div>
      Testing
      <Link href={{
        pathname:'/',
        query:{context:props.context}
      }}>Back</Link>
    </div>
  )
}

export default Form;