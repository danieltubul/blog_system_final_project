import React from 'react';
import axios from "axios";
import "semantic-ui-css/semantic.min.css";
import {
    BrowserRouter as Router,
    Switch,
    Route} from 'react-router-dom'

import Header from "./client/Components/Header";
import AboutMe from "./client/Pages/AboutMe";
import ContactMe from "./client/Pages/ContactMe";
import HomePage from "./client/Pages/HomePage";
import Manage from "./client/Pages/Manage";
import PostPage from "./client/Pages/PostPage";
import LoginPage from "./client/Pages/LoginPage";
import RegisterPage from "./client/Pages/RegisterPage"
import AddPost from "./client/Components/AddPost";
import EditPosts from "./client/Pages/EditPosts"
import Edit from "./client/Components/Edit";
import SearchResults from "./client/Pages/SearchResults";
import Footer from "./client/Components/Footer";
import PasswordReset from "./client/Pages/PasswordReset";
import Forgot from "./client/Pages/ForgotPassword";
import Success from "./client/Pages/Success";


class App extends React.Component {
    constructor(props){
        super(props)
        this.state ={
            user: '',
            posts: null,
            tags: null,
        }
    }

    setUser = (data) => {
        this.setState({
            user: data,
        })
    }

    setLoginToFalse =(e) =>{
        this.setState({
            user: ''
        })
    }


    componentDidMount() {
        axios.get('/user')
            .then((res) => {
                this.setUser(res.data)
                }).catch((err) => {
            });
        this.loadPosts()
        this.loadTags()
    }

    loadTags = () => {
        axios.get('/tags').then(res => {
            this.setState({
                tags: res.data,
            })
        }).catch((err) => {
        });
    }

    loadPosts = () => {
        axios.get('/posts').then(res => {
            this.setState({
                posts: res.data,
            })
        }).catch((err) => {
        });
    }

    render (){
        return (
            <div className="App">
                <Router>
                    <Header user={this.state.user}  onLogout={this.setLoginToFalse} />
                    <Switch>
                        <Route path ="/register" component={RegisterPage}/>
                        <Route path="/login" component={(props) => <LoginPage onLoginSuccess={this.setUser} {...props} user={this.state.user} />}/>
                        <Route exact path="/post/:id" render={(props) => <PostPage {...props} user={this.state.user} tags={this.state.tags} />} />
                        <Route path="/about" component={AboutMe}/>
                        <Route path="/contact" component={ContactMe}/>
                        <Route path="/manage" render={(props) => <Manage {...props}
                                                                         user={this.state.user}
                                                                         posts={this.state.posts}
                                                                         tags={this.state.tags}
                                                                         loadTags={this.loadTags}
                                                                         loadPosts={this.loadPosts}/>}/>
                        <Route path="/edit/:id" render={(props) => <Edit {...props} user={this.state.user} />}/>
                        <Route path="/add-post" render={(props) => <AddPost {...props} user={this.state.user} />}/>
                        <Route path="/edit-posts" render={(props) => <EditPosts {...props} user={this.state.user}/>}/>
                        <Route path="/SearchResults" render={(props) => <SearchResults {...props}/>} />
                        <Route path="/forgotPassword" render={(props) => <Forgot {...props}/>} />
                        <Route path="/reset/:token" component={PasswordReset}/>
                        <Route path="/success" component={Success}/>
                        <Route path="/" component={HomePage}/>
                    </Switch>
                    <Footer/>
                </Router>
            </div>
        );
    }
}

export default App;
