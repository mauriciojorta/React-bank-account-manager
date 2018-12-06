import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import TextInputGroup from '../layout/TextInputGroup';

class AddClient extends Component {
  state = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    balance: ''
  };

  onSubmit = e => {
    e.preventDefault();

    const newClient = this.state;

    const { firestore, history } = this.props;

    // If no balance, make zero

    if (newClient.balance === '') {
      newClient.balance = 0;
    }

    firestore
      .add({ collection: 'clients' }, newClient)
      .then(() => history.push('/'));
  };

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  render() {
    const { firstName, lastName, email, phone, balance } = this.state;

    const { disableBalanceOnAdd } = this.props.settings;

    return (
      <div>
        <div className="row">
          <div className="col-md-6">
            <Link to="/" className="btn btn-link">
              <i className="fas fa-arrow-circle-left" /> Back to Dashboard
            </Link>
          </div>
        </div>

        <div className="card">
          <div className="card-header">Add Client</div>
          <div className="card-body">
            <form onSubmit={this.onSubmit}>
              <TextInputGroup
                label="First Name"
                name="firstName"
                value={firstName}
                type="text"
                placeholder="Enter first name"
                onChange={this.onChange}
                minLength="2"
                required={true}
              />

              <TextInputGroup
                label="Last Name"
                name="lastName"
                value={lastName}
                type="text"
                placeholder="Enter last name"
                onChange={this.onChange}
                minLength="2"
                required={true}
              />

              <TextInputGroup
                label="Email"
                name="email"
                value={email}
                type="email"
                placeholder="Enter email"
                onChange={this.onChange}
              />

              <TextInputGroup
                label="Phone"
                name="phone"
                value={phone}
                type="text"
                placeholder="Enter phone"
                onChange={this.onChange}
                minLength="10"
                required={true}
              />

              <TextInputGroup
                label="Balance"
                name="balance"
                value={balance}
                type="text"
                placeholder="Enter balance"
                onChange={this.onChange}
                disabled={disableBalanceOnAdd}
              />

              <input
                type="submit"
                value="Submit"
                className="btn btn-primary btn-block"
              />
            </form>
          </div>
        </div>
      </div>
    );
  }
}

AddClient.propTypes = {
  firestore: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired
};

export default compose(
  firestoreConnect(),
  connect((state, props) => ({
    settings: state.settings
  }))
)(AddClient);
