import React from 'react';
import axios from 'axios'
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import '../App.css';

const animatedComponents = makeAnimated();

const emailRegex = RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)

const formValid = (name,email,formErrors) => {
  let valid = true
  if(name==='' || email===''){
    return false
  }
  Object.values(formErrors).forEach(val => {
    val.length > 0 && (valid = false)
  });
  return valid
}


class VounteerForm extends React.Component {
    state = {
      name: '',
      email: '',
      skills: [],
      naive_skills: '',
      peoples_to_serve: '1',
      formErrors: {
        name: '',
        email: ''
      },
      options: []
    }
        
    componentDidMount(){
      axios.get('https://ask-foundation.herokuapp.com/get-volunteer-labels')
      .then(res => {
        var labels = []
        for(var i=0;i<res.data.length;i++){
          labels.push({label:res.data[i].label,value:res.data[i].label})
        }
        this.setState({options:labels})
      })
      .catch(err => console.log(err))
    }

    handleSubmit = (e) => {
      e.preventDefault()
      if(formValid(this.state.name,this.state.email,this.state.formErrors)){
          if(this.state.skills.length===0){
            window.alert('Select atleast one of the several skills mentioned in the dropdown input of skills!!!')
          }
          else{
            const label = []
            for(var i=0;i<this.state.skills.length;i++){
              label.push(this.state.skills[i].label)
            }
            const messageData = {
              name: this.state.name,
              email: this.state.email,
              label: label,
              naive_skills: this.state.naive_skills,
              peoples_to_serve: this.state.peoples_to_serve
            }
            console.log(messageData)
            const url='https://ask-foundation.herokuapp.com/register-volunteer'
            axios.post(url,messageData)
              .then(res=>console.log(res))
              .catch(err=>console.log(err.data))
            window.alert('Message Sent!')
          }
      }
      else{
          window.alert(`--submitting--
          name: ${this.state.formErrors.name.length > 0 ? this.state.formErrors.name : this.state.name || 'empty input'}
          email: ${this.state.formErrors.email.length > 0 ? this.state.formErrors.email : this.state.email || 'empty input'}
          `)
      }
    }
  
    handleChange = (e) => {
      e.preventDefault()
      const {name, value} = e.target;
      let formErrors = this.state.formErrors

      switch(name){
        case 'name':
          formErrors.name = value.length > 3 ? '' : 'invalid name'
          break
        case 'email':
          formErrors.email = (emailRegex.test(value)) ? '' : 'invalid email address'
          break
        default:
          break
      }
      this.setState({formErrors, [name]: value})
    }

    render(){

      const { formErrors } = this.state

        return (
            <form className='p-3 m-3 form d-flex flex-column justify-content-around align-items-center' onSubmit={this.handleSubmit}>
              <div className='entry'>
                <p className='label'>Name<sup>*</sup></p>
                <input onChange={this.handleChange} value={this.state.name} name='name' type='text' className='form-control input' placeholder='E.g, Anamika'/>
              </div>
              {formErrors.name.length > 0 && (<div className='errorMessage col'><span>{formErrors.name}</span></div>)}
              <div className='entry'>
                <p className='label'>Email<sup>*</sup></p>
                <input onChange={this.handleChange} value={this.state.email} name='email' type='text' className='form-control input' placeholder='E.g, klaus_123@gmail.com'/>
              </div>
              {formErrors.email.length > 0 && (<div className='errorMessage col'><span>{formErrors.email}</span></div>)}
              <div className='entry'>
                <p className='label'>Excellent skills<sup>*</sup></p>
                <div className='input'>
                  <Select
                    menuPlacement="auto"
                    menuPosition="fixed"                 
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    isMulti
                    options={this.state.options}
                    onChange={(selectedOption)=>{
                      this.setState({skills:selectedOption})
                    }}
                  />
                </div>
              </div>
              <div className='entry'>
                <p className='label'>Naive skills</p>
                <input onChange={this.handleChange} value={this.state.naive_skills} name='naive_skills' type='text' className='form-control input' placeholder='E.g, leadership-driving-etc.'/>
              </div>
              <div className='entry'>
                <p className='label'>Peoples to serve</p>
                <input onChange={this.handleChange} value={this.state.peoples_to_serve} name='peoples_to_serve' type='text' className='form-control input' placeholder='E.g, 3'/>
              </div>
              <button type='submit' className='btn submit-button btn-dark mt-3'>Submit!</button>
            </form>
        )
    }
}

export default VounteerForm