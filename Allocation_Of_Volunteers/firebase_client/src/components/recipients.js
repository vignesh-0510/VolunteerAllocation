import React from 'react';
import { Link } from 'react-router-dom';
import RecipientForm from './recipient_form'
import '../App.css';


function Recipients() {
  return (
    <div className='recipient-page'>
        <Link  to='/'><button type='submit' className='btn back-button btn-dark'>Back</button></Link>
        <div className='d-flex flex-column justify-content-center align-items-center'>
          <h1 className='recipient-title m-3'>Victim's Info.</h1>
          <RecipientForm/>
        </div>
    </div>    
  );
}

export default Recipients;