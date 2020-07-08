import React from 'react'

export function ErrorPath(props){
    const messages = {
        'notfound': 'File not found', 
        'logout': 'Logout failed. Please try again.'
    };

    const message = messages[props.error] || 'Unknown error: '+props.error;

    return (
        <>
            <h1>Error</h1>
            <h2>{ message }</h2>
        </>
    );
}
