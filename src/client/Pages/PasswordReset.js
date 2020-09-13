import React from 'react';
import axios from "axios";
import {Button, Container, Form, Grid, Message, Tab} from "semantic-ui-react";
import validator from "validator";
import _ from "lodash";

class PasswordReset extends React.Component {
    state = {
        password: '',
        confirm_password: '',
        username:'',
        isValidated: false,
        errors: {},
    }


    handlePasswordChange = (e) => {
        this.setState({
            password: e.target.value,
        })
    }

    handleConfirmPasswordChange = (e) => {
        this.setState({
            confirm_password: e.target.value,
        })
    }

    async componentDidMount() {
        const token = this.props.match.params.token;
        axios.get(`/reset/${token}`).then(res => {
            this.setState({
                isValidated: true,
                username: res.data,
            });
        }).catch(err => {
            this.setState({
                error: err.response.data,
            })
        })
    }


    resetPassword = () => {
        this.setState({
            errors: {}
        })
        const errors = {};
        if(this.state.password.length < 6){
            errors.password = 'Password length is minimum of 6 characters'
        }
        if (this.state.password != this.state.confirm_password) {
            errors.confirm_password = 'Passwords doesnt match'
        }
        this.setState({
            errors: errors,
        })
        if(!_.isEmpty(errors)) return

        const data = {
            username: this.state.username,
            password: this.state.password,
        }
        axios.put('/password', data).then(res => {
            this.props.history.push('/success')
        })
    }

    render() {
        return (
        <Grid celled padded={"false"}>
            <Grid.Column width ={1} style={{background: '#fafafa'}}></Grid.Column>
            <Grid.Column width={14} >
                <Container>
                    {this.state.isValidated ?
                    <Container  text style={styles.container}>
                        <Message
                            attached
                            header='Password Reset Form'
                            content='Enter your new password below'
                        />

                        <Form className='attached fluid segment'>
                        <Form.Field width={6}>
                            <Form.Input label="Password" maxLength="20" type={"password"} error={this.state.errors.password && {
                                content: this.state.errors.password,
                            }} placeholder='Password' value={this.state.password}
                                        onChange={this.handlePasswordChange}/>
                        </Form.Field>
                        <Form.Field width={6}>
                            <Form.Input label="Repeat Password" maxLength="20" type={"password"} error={this.state.errors.confirm_password && {
                                content: this.state.errors.confirm_password,
                            }} placeholder='Repeat Password'
                                        value={this.state.confirm_password} onChange={this.handleConfirmPasswordChange}/>
                        </Form.Field>
                        <Button type='submit' onClick={this.resetPassword}>Reset</Button>
                    </Form>
                    </Container>
                    :
                        <div>
                            <Container style={styles.container}>

                            {this.state.error ? this.state.error : <div className="ui active centered inline loader"></div>}
                            </Container>

                        </div>
                    }
                </Container>
            </Grid.Column>
            <Grid.Column width={1} style={{background: '#fafafa'}}></Grid.Column>
        </Grid>
        )
    }
}

const styles = {
    container: {
        paddingTop: "20vh",
        paddingBottom: "20vh",
        paddingRight: "10vw",
        paddingLeft: "10vw"
    }
}

export default PasswordReset;