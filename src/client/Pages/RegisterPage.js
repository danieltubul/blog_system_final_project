import React from 'react';
import axios from "axios";
import {Container, Form, Button, Checkbox, Segment, Grid, Tab, Message} from "semantic-ui-react";
import _ from 'lodash';
import validator from 'validator';



class RegisterPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            first_name: null,
            last_name: null,
            email: '',
            username: null,
            password: '',
            confirm_password: null,
            img_src: null,
            errors: {},
            resp: null
        }
    }

    handleFirstNameChange = (e) => {
        this.setState({
            first_name: e.target.value,
        })
    }
    handleLastNameChange = (e) => {
        this.setState({
            last_name: e.target.value,
        })
    }
    handleEmailChange = (e) => {
        this.setState({
            email: e.target.value,
        })
    }
    handleUserNameChange = (e) => {
        this.setState({
            username: e.target.value,
        })
    }
    handleImageSourceChange = (e) => {
        this.setState({
            img_src: e.target.value,
        })
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

    doRegistration = (e) => {
        this.setState({
            errors: {}
        })
        const errors = {}
        if (!this.state.first_name) {
            errors.first_name = 'Please enter your first name'
        }
        if (!this.state.last_name) {
            errors.last_name = 'Please enter your last name'
        }
        if (!this.state.username) {
            errors.username = 'Please enter a username'
        }
        if (!this.state.password) {
            errors.password = 'Please enter a password'
        }
        if(this.state.password.length < 6){
            errors.password = 'Password length is minimum of 6 characters'
        }
        if (this.state.password != this.state.confirm_password) {
            errors.confirm_password = 'Passwords doesnt match'
        }
        if (!validator.isEmail(this.state.email)) {
            errors.email = 'Please enter a valid email address'
        }

        this.setState({
            errors: errors,
        })
        if(!_.isEmpty(errors)) return
        const data = {
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            email: this.state.email,
            username: this.state.username,
            img_src: this.state.img_src,
            password: this.state.password,
        }
        const url = "/register";
        axios.post(url, data)
            .then((res) => {
                this.setState({
                    first_name: '',
                    last_name: '',
                    email: '',
                    username: '',
                    password: '',
                    img_src: '',
                    resp: "Success: user registered.",
                });
                alert(this.state.resp)
                this.props.history.push('/login')
            })
            .catch((err) => {
                this.setState({
                    errors: err.response.data,
                });
            });

    }


    render() {
        return (
            <Grid celled padded={"false"}>
                <Grid.Column width={1} style={{background: '#fafafa'}}></Grid.Column>
                <Grid.Column width={14}>
                    <Container>
                        <Message
                            attached
                            header='Welcome to my blog!'
                            content='Fill out the form below to sign-up for a new account'
                        />

                        <Form className='attached fluid segment'>
                            <Form.Field width={6}>
                                <Form.Input label='First Name' maxLength="20" error={this.state.errors.first_name && {
                                    content: this.state.errors.first_name,
                                }} placeholder='First Name' value={this.state.first_name}
                                            onChange={this.handleFirstNameChange}/>
                            </Form.Field>
                            <Form.Field width={6}>
                                <Form.Input label="Last Name" maxLength="20" error={this.state.errors.last_name && {
                                    content: this.state.errors.last_name,
                                }} placeholder='Last Name' value={this.state.last_name}
                                            onChange={this.handleLastNameChange}/>
                            </Form.Field>
                            <Form.Field width={6}>
                                <Form.Input label="Email" maxLength="40" error={this.state.errors.email && {
                                    content: this.state.errors.email,
                                }} placeholder='Email' value={this.state.email} onChange={this.handleEmailChange}/>
                            </Form.Field>
                            <Form.Field width={6}>
                                <Form.Input label="Username" maxLength="15" error={this.state.errors.username && {
                                    content: this.state.errors.username,
                                }} placeholder='Username' value={this.state.username}
                                            onChange={this.handleUserNameChange}/>
                            </Form.Field>
                            <Form.Field width={6}>
                                <Form.Input label="Image (link)" placeholder='Image Source Link' value={this.state.img_src}
                                       onChange={this.handleImageSourceChange}/>
                            </Form.Field>
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
                            <Button type='submit' onClick={this.doRegistration}>Register</Button>
                        </Form>
                    </Container>
                </Grid.Column>
                <Grid.Column width={1} style={{background: '#fafafa'}}></Grid.Column>
            </Grid>


        )
    }
}
export default RegisterPage;

