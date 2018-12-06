import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';
import { notifyUser } from '../../actions/notifyActions';
import { Redirect } from 'react-router-dom';

import TextInputGroup from '../layout/TextInputGroup';
import Alert from '../layout/Alert';

class Register extends Component {
  state = {
    email: '',
    password: '',
    confirmPassword: ''
  };

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  onSubmit = e => {
    e.preventDefault();

    const { email, password, confirmPassword } = this.state;

    const { firebase, notifyUser } = this.props;

    if (password === confirmPassword) {
      // Register with firebase
      firebase
        .createUser({ email, password })
        .catch(err => notifyUser(err.message, 'error'));
    } else {
      notifyUser("The passwords don't match", 'error');
    }
  };

  render() {
    // If registration is disabled, redirect to homepage
    if (!this.props.settings.allowRegistration) {
      return <Redirect to="/" />;
    }

    const { email, password, confirmPassword } = this.state;
    const { message, messageType } = this.props.notify;

    return (
      <div className="row">
        <div className="col-md-6 mx-auto">
          <div className="card">
            <div className="card-body">
              {message ? (
                <Alert message={message} messageType={messageType} />
              ) : null}
              <h1 className="text-center pb-4 pt-3">
                <span className="text-primary">
                  <i className="fas fa-lock" /> Register{' '}
                </span>
              </h1>
              <form onSubmit={this.onSubmit}>
                <TextInputGroup
                  label="Email"
                  name="email"
                  value={email}
                  type="email"
                  placeholder="Enter email"
                  onChange={this.onChange}
                />

                <TextInputGroup
                  label="Password"
                  name="password"
                  value={password}
                  type="password"
                  placeholder="Enter password"
                  onChange={this.onChange}
                />

                <TextInputGroup
                  name="confirmPassword"
                  value={confirmPassword}
                  type="password"
                  placeholder="Confirm password"
                  onChange={this.onChange}
                />
                <input
                  type="submit"
                  value="Register"
                  className="btn btn-primary btn-block"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Register.propTypes = {
  firebase: PropTypes.object.isRequired,
  notify: PropTypes.object.isRequired,
  notifyUser: PropTypes.func.isRequired
};

export default compose(
  firebaseConnect(),
  connect(
    (state, props) => ({
      notify: state.notify,
      settings: state.settings
    }),
    { notifyUser }
  )
)(Register);
