import React, { Component } from 'react';
import axios from 'axios';
import {Container, Grid, Tab} from "semantic-ui-react";
import {Link} from "react-router-dom";

class ForgotPassword extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            showError: false,
            messageFromServer: '',
            showNullError: false,
            loading: false,
        };
    }

    handleChange = (e) => {
        this.setState({
            email: e.target.value,
        });
    };

    sendEmail = async () => {
        this.setState({
            loading: true,
        })
        const email = {email: this.state.email};
        if (this.state.email == '') {
            this.setState({
                showError: false,
                messageFromServer: '',
                showNullError: true,
                loading: false,
            });
            return
        }
        else {
                axios.post('/forgotPassword', email)
                    .then((res) => {
                        this.setState({
                            email: '',
                            showError: false,
                            messageFromServer: 'recovery email sent',
                            showNullError: false,
                            loading: false,
                        });
                    })
                    .catch((err) => {
                        this.setState({
                            email:'',
                            showError: true,
                            messageFromServer: '',
                            showNullError: false,
                            loading: false,
                        });
                    });
            }
    };

    render() {
        const {
            email, messageFromServer, showNullError, showError
        } = this.state;

        return (
            <Grid celled padded={"false"}>
                <Grid.Column width ={1} style={{background: '#fafafa'}}></Grid.Column>
                <Grid.Column width={14} >
                    <Container>
                        <div>
                            <Container textAlign={"center"} text style={styles.container}>
                                Enter your email below and check your mail for password reset link
                                <div className="ui equal width form">
                                    <div className="fields">
                                        <div className="field">
                                            <input type="text" value={this.state.email} onChange={this.handleChange}></input>
                                        </div>
                                    </div>

                                    <div className="ui blue submit button" onClick={this.sendEmail}>Send link</div>

                                </div>
                                <br/>
                                {this.state.loading ? <div className="ui active centered inline loader"></div> :
                                    <div>
                                        {showNullError && (
                                            <div>
                                                <br/>
                                                Please enter your email.
                                            </div>
                                        )}
                                        {showError && (
                                            <div>
                                                <br/>
                                                That email address isn&apos;t recognized. Please try again or
                                                register for a new account.

                                                <Link to="/register"> Sign up </Link>
                                            </div>
                                        )}
                                        {messageFromServer === 'recovery email sent' && (
                                            <div>
                                                <br/>
                                                <h3>Password Reset Email Sent Successfully!</h3>
                                            </div>
                                        )}
                                    </div>
                                }

                            </Container>
                        </div>
                    </Container>
                </Grid.Column>
                <Grid.Column width={1} style={{background: '#fafafa'}}></Grid.Column>
            </Grid>

        );
    }

}


const styles = {
    container: {
        paddingTop: "30vh",
        paddingBottom: "30vh",
        paddingRight: "10vw",
        paddingLeft: "10vw"
    }
}
export default ForgotPassword;