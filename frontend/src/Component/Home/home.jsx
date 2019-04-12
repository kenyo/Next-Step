import React, { Component } from 'react'
import Progress from '../Progress/progress'
import LandingPage from "../LandingPage/landingPage.js"
import NavBar2 from "../Navbar/navBarContainer.js"
import { Switch, Route } from 'react-router-dom'
import SideNav from "../SideNav/sideNav"

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
        console.log(this.state)
        return (
            <div>
                <NavBar2 logoutUser={this.props.logout_user} />
                <SideNav toggleSideNav={this.toggleSideNav}/>
                    <div className={ expanded ? 'expanded' : 'unexpanded' }>
                        <Switch>
                            <Route exact path='/' render={() => {
                                return (
                                <Progress/>)
                            }}/>
                        </Switch>
                    </div>
            </div>
        )
}


}

export default Home
