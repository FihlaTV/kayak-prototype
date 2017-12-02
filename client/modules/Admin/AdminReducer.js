// Import Actions
import { CREATE_FLIGHT, ADMIN_SIGNIN, ADMIN_SIGNOUT, CREATE_HOTEL, CREATE_CAR } from './AdminActions';

const initialState = {
  carList: [],
    flightList: [],
  hotelList: []};

const AdminReducer = (state = initialState, action) => {
  switch (action.type) {

    case CREATE_FLIGHT:
      return {
        ...state,
        flightList: action.flights,
        "msg": action.msg
      };
    case CREATE_CAR:
      return {
        ...state,
        carList: action.cars,
        "msg": action.msg
      };

    case CREATE_HOTEL:
      return {
        ...state,
        hotelList: action.hotels,
        "msg": action.msg
      };

    case ADMIN_SIGNIN:
      console.log("staus : ", action.data)
      if(action.status === 200) {
        return {
            ...state,
            isLoggedIn: true,
            "msg": action.msg
        };
      }
      else {
        if(action.data.error !== undefined) {
          return {
            ...state,
            "msg": action.data.error.message
          } 
        } else {
          return {
            ...state,
            isLoggedIn: true
          } 
        }
        
      }   

    case ADMIN_SIGNOUT:
                  return {
                    ...state,
                    "isLoggedIn": false
                  };
   

    default:
      return state;
  }
};

export default AdminReducer;
