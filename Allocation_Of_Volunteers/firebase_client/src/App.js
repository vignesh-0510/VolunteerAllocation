import React from 'react';
import Volunteers from './components/volunteers'
import Recipients from './components/recipients'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import './App.css';


function App() {
  return (
    <Router>
      <div className="App mt-0">
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/volunteers' exact component={Volunteers} />
          <Route path='/recipients' exact component={Recipients} />
        </Switch>
      </div>
    </Router>
  );
}

const Home = () => (
  <div className="home">
    <div className='d-flex flex-column justify-content-between'
    style={{height:'100vh'}}>
      <h1 className='title mt-5'>
        <span>ASK Foundation</span>
      </h1>
      <div className='m-5 d-flex flex-row justify-content-center'>
        <Link to='/volunteers'><button type='submit' className='button btn btn-dark m-5'>Volunteers</button></Link>
        <Link to='/recipients'><button type='submit' className='button btn btn-dark m-5'>Victims</button></Link>
      </div>
      <h1 className='sub-title m-3'>
        <span>- provides a platform for the victims to ask for the help and the volunteers to be someone's help ...</span>
      </h1>
    </div>
  </div>
)

export default App;