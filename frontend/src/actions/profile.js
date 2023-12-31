import axios from "axios";

import { setAlert } from "./alert";

import { GET_PROFILE , PROFILE_ERROR } from "./types";


// Get the current user profile

export const getCurrentProfile = () =>  async dispatch => {
    try {
        const res = await axios.get('/api/auth');

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type:PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status}
        })
    }
}

export const createProfile = (formData, edit = false) => async (dispatch) => {
    try {
      const res = await axios.post('/profile', formData);

      dispatch({
        type: GET_PROFILE,
        payload: res.data
      });

      dispatch(
        setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success')
      );
    } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
      }

      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  };