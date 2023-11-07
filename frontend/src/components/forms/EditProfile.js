import React, { Fragment, useState, useEffect } from "react";
import { Link, useMatch, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCurrentProfile } from "../../actions/profile";
import { register } from '../../actions/auth';

/*
  NOTE: declare initialState outside of component
  so that it doesn't trigger a useEffect
  we can then safely use this to construct our profileData
 */
const initialState = {
  name: "",
  email: "",
  location: "",
};

const EditProfile = ({
  profile: { profile, loading },
  register,
  getCurrentProfile,
}) => {
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    getCurrentProfile();

    setFormData({
        name: loading || !profile.name ? '' : profile.name,
        email: loading || !profile.name ? '' : profile.email,
        location: loading || !profile.name ? '' : profile.location,
    })
  }, [])

  useEffect(() => {
    // if there is no profile, attempt to fetch one
    if (!profile) getCurrentProfile();

    // if we finished loading and we do have a profile
    // then build our profileData
    if (!loading && profile) {
      const profileData = { ...initialState };
      for (const key in profile) {
        if (key in profileData) profileData[key] = profile[key];
      }
      for (const key in profile.social) {
        if (key in profileData) profileData[key] = profile.social[key];
      }
      // the skills may be an array from our API response
      if (Array.isArray(profileData.skills))
        profileData.skills = profileData.skills.join(", ");
      // set local state with the profileData
      setFormData(profileData);
    }
  }, [loading, getCurrentProfile, profile]);

  const { name, email, location } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    const editing = profile ? true : false;
    e.preventDefault();
    register(formData, editing)
  };

  return (
    <section className="container">
      <h1 className="large text-primary">
            Edit your profile
      </h1>
      <form className="form" onSubmit={onSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={name}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Location"
            name="location"
            value={location}
            onChange={(e) => onChange(e)}
          />
        </div>
        <input type="submit" className="btn btn-primary my-1" />
        <Link className="btn btn-light my-1" to="/dashboard">
          Go Back
        </Link>
      </form>
    </section>
  );
};

EditProfile.propTypes = {
  register: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  profile: state.profile,
});

export default connect(mapStateToProps, { register, getCurrentProfile })(
  EditProfile
);
