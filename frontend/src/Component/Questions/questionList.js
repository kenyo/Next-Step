import React from "react"
import axios from "axios"
import DisplayAllCategories from "./displayAllCategories"
import "./categories.css"

export default class QuestionList extends React.Component {
  constructor(){
    super()
    this.state = {
      allCategories: [],
      selectedCategory: "Leadership & Decision Making",
      allQuestions: []
    }
  }

  componentDidMount = () => {
    this.getAllQuestions()
    this.getAllCategories()
  }

  getAllQuestions = () => {
    axios
    .get("/questions")
    .then(res => {
      console.log("this is ALL Questions: ", res.data.question)
      this.setState({
        allQuestions:res.data.question
      })
    })
  }

  getAllCategories = () => {
    axios
    .get("/categories")
    .then(res => {
      console.log("this is ALL Categories: ", res)
      this.setState({
        allCategories:res.data.categories
      })
    })
  }

  handleChange = (e) => {
    this.setState({
      selectedCategory: e.target.value
    })
    console.log("this is TARGET VALUE ", e.target.value)
  }

render(){
  return(

        <div className="questionList">
          <div className="questionsTitle">
              <div className="questionsTitleChild">
                <h1>Questions</h1>
              </div>
          </div>
          <div>
            <DisplayAllCategories allCategories={this.state.allCategories} selectedCategory={this.state.selectedCategory} allQuestions={this.state.allQuestions} handleChange={this.handleChange} />
          </div>
        </div>
  )
}
}

