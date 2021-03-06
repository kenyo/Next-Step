import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'


//Import Redux Containers
import NavBar2 from "../Navbar/navBarContainer.js"

//Import Components
import LandingPage from "../LandingPage/landingPage.js"
import SideNav from "../SideNav/sideNav"
import Progress from '../Progress/progress'
import QuestionList from "../Questions/questionList"
import Question from "../Question/question.js"

import Dashboard from '../Dashboard/dashboardContainer'
import Search from '../Search/searchContainer'
import About from '../About/about';
import Tips from "../Tips/tips"
import AnswerFeed from '../Answers/answerFeedContainer'


//CSS
import './home.css'

class Home extends Component {
    constructor () {
        super ()
        this.state = {
            expanded: false
        }
    }

    toggleSideNav = () => {
        this.setState({
            expanded: !this.state.expanded
        })
    }

    render () {
        const { expanded } = this.state

        return (
            <div>
                <NavBar2 logoutUser={this.props.logout_user} />
                <SideNav toggleSideNav={this.toggleSideNav}/>
                    <div className={ expanded ? 'expanded home' : 'unexpanded home' }>
                        <Switch>
                            <Route exact path='/' render={() => {
                                return (
                                <Dashboard/>)
                            }}/>

                            <Route exact path='/questions' render={() => {
                                return (
                                <QuestionList/>)
                                }}/>
                            <Route exact path='/about' render={() => {
                                return (
                                    <About/>
                                )
                            }}/>

                            <Route exact path='/advice' render={() => {
                                return (
                                    <Tips/>
                                )
                            }}/>

                            <Route exact path ="/questions/:id" render = {()=>{
                                return (
                                    <Question/>
                                )
                            }}/>
                          <Route path = '/search/:search/:filter'
                              render={(props) => <Search{...props} />}
                              />
                          <Route path='/answers' render={() => <AnswerFeed />}/>
                        </Switch>
                    </div>
            </div>
        )
}


}

export default Home
