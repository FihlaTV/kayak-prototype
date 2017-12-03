// Export Constants
export const UPDATE_FORMTYPEHEADER = 'UPDATE_FORMTYPEHEADER';
export const SIGNUP_SUCCESS = 'SIGNUP_SUCCESS';
export const SIGNIN_SUCCESS = 'SIGNIN_SUCCESS';
export const EDIT_PROFILE_SUCCESS = 'EDIT_PROFILE_SUCCESS';
export const EDIT_CARD_SUCCESS = 'EDIT_CARD_SUCCESS';

import callApi from '../../util/apiCaller';
import {Router, browserHistory, Route} from 'react-router';

const api = 'http://localhost:8000/api'

const headers = {
  'Accept': 'application/json'
};
// Export Actions
export function changeFormDisplay(displayForm) {
  console.log("this is changeform display" );    
  return {
   type : UPDATE_FORMTYPEHEADER,
   displayForm                                // this is same as newItem : newItem in ES6
  }        
}


export function changeType(name) {
  
  return dispatch => {
    dispatch(changeFormDisplay(name));
  
   }
}

export function accountPage() {
  browserHistory.push('/account');
}

export function deleteProfileSuccess(data) {
  
 browserHistory.push('/');
}

export function editProfileSuccess(data) {
  console.log("this is in handle");
  return {
  type : EDIT_PROFILE_SUCCESS,
  data
  }
}

export function deleteAccount(email) {
  return (dispatch) => {
    return callApi('user/email', 'delete', req).then(res => dispatch(deleteProfileSuccess(res)));
  };
}

export function handleEditProfile(data) {
  console.log("in handleEditprofile actions");
  let req = {};
  console.log("this is in action signup"+ data.firstName);
  req.firstName = data.firstName;
  req.lastName = data.lastName;
  req.picture = data.picture;
  req.hobbies = data.hobbies;
  req.phone = data.phone;
  req.address = data.address;
  let userEmail = data.email;
  return (dispatch) => {
    return callApi('user/userEmail', 'patch', req).then(res => dispatch(editProfileSuccess(res)));
  };
 
}



export function signinSuccess(data) {
  console.log("this is in signinsuccess");
  localStorage.setItem('token', data.token);
  let email1 = data.id;
  console.log("this is emain in signin success" + emai11);
  return {
  type : SIGNIN_SUCCESS,
  email1
  }
}

export function signupSuccess(data) {
  console.log("this is in signupSuccess");
  console.log(data);
  console.log(data.token);
  localStorage.setItem('token', data.token);

  let email = data.id;
  return {
  type : SIGNUP_SUCCESS,
  email
  }
}

export function editCardSuccess(data) {
  console.log("this is in editCardSuccess");
  
  return {
  type : EDIT_CARD_SUCCESS,
  data
  }
}

export function handleEditCard(data) {
  console.log("in actions handle card");
  let req = {};
  let userEmail = data.email;
  req.cardNumber = data.cardNumber;
  req.cardName = data.cardName;
  req.exp_year = data.exp_year;
  req.secureCode = data.secureCode;
  return (dispatch) => {
    return callApi('user/userEmail', 'patch', req).then(res => dispatch(editCardSuccess(res)));
  };
 
}

export function signUpvalidation(data) {
  let req = {};
  console.log("this is in action signup"+ data.email);
  req.email = data.email;
  req.password = data.password;
  req.firstName = data.firstName;
  req.lastName = data.lastName;
  return (dispatch) => {
    return callApi('user/signup', 'post', req).then(res => dispatch(signupSuccess(res)));
  };
}

export function signInvalidation(data) {
  let req = {};
  console.log("this is in action signin"+ data.email);
  req.email = data.email;
  req.password = data.password;
  return (dispatch) => {
    return callApi('user/signin', 'post', req).then(res => dispatch(signinSuccess(res)));
  };
}
/*
*   {
*    "email" : email, 
*    "password" : password
*   }
*/



