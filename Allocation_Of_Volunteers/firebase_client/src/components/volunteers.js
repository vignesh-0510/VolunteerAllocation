import React from 'react';
import { Link } from 'react-router-dom';
import VolunteerForm from './volunteer_form'
import '../App.css';


class Volunteers extends React.Component {  
  render(){
    return (
      <div className='volunteer-page'>
          <Link  to='/'><button type='submit' className='btn back-button btn-dark'>Back</button></Link>
          <div className='d-flex flex-column justify-content-center align-items-center'>
            <h1 className='volunteer-title m-3'>volunteer's Info.</h1>
            <VolunteerForm/>
          </div>
      </div>    
    );
  }
}

export default Volunteers;