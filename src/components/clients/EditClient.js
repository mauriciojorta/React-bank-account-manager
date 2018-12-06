import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import Spinner from '../layout/Spinner';

import TextInputGroup from '../layout/TextInputGroup';

class EditClient extends Component {
  constructor(props) {
    super(props);

    // Create refs
    this.firstNameInput = React.createRef();
    this.lastNameInput = React.createRef();
    this.emailInput = React.createRef();
    this.phoneInput = React.createRef();
    this.balanceInput = React.createRef();
  }

  onSubmit = e => {
    e.preventDefault();

    const { client, firestore, history } = this.props;

    // Updated Client
    const updClient = {
      firstName: this.firstNameInput.current.value,
      lastName: this.lastNameInput.current.value,
      email: this.emailInput.current.value,
      phone: this.phoneInput.current.value,
      balance:
        this.balanceInput.current.value === ''
          ? 0
          : this.balanceInput.current.value
    };

    // Update client in Firestore
    firestore
      .update({ collection: 'clients', doc: client.id }, updClient)
      .then(history.push('/'));
  };

  render() {
    const { client } = this.props;

    const { disableBalanceOnEdit } = this.props.settings;

    if (client) {
      const { firstName, lastName, email, phone, balance } = client;

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
            <div className="card-header">Edit Client</div>
            <div className="card-body">
              <form onSubmit={this.onSubmit}>
                <TextInputGroup
                  label="First Name"
                  name="firstName"
                  defaultValue={firstName}
                  reference={this.firstNameInput}
                  type="text"
                  minLength="2"
                />

                <TextInputGroup
                  label="Last Name"
                  name="lastName"
                  defaultValue={lastName}
                  reference={this.lastNameInput}
                  type="text"
                  minLength="2"
                />

                <TextInputGroup
                  label="Email"
                  name="email"
                  defaultValue={email}
                  reference={this.emailInput}
                  type="email"
                />

                <TextInputGroup
                  label="Phone"
                  name="phone"
                  defaultValue={phone}
                  type="text"
                  reference={this.phoneInput}
                  minLength="10"
                />

                <TextInputGroup
                  label="Balance"
                  name="balance"
                  defaultValue={balance}
                  reference={this.balanceInput}
                  type="text"
                  disabled={disableBalanceOnEdit}
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
    } else {
      return <Spinner />;
    }
  }
}

EditClient.propTypes = {
  firestore: PropTypes.object.isRequired
};

export default compose(
  firestoreConnect(props => [
    { collection: 'clients', storeAs: 'client', doc: props.match.params.id }
  ]),
  connect(({ firestore: { ordered }, settings }, props) => ({
    client: ordered.client && ordered.client[0],
    settings
  }))
)(EditClient);
