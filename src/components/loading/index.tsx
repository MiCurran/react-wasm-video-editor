import React from 'react';

export default function Loading() {
    return (
         <div
        style={{
          width: '95vw',
          height: '70vh',
          border: '1px solid #ccc',
          backgroundColor: 'black',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <p>Loading...</p>
      </div>
    )
}