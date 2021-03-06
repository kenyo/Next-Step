import { connect } from "react-redux";
import { QuestionList } from "./QuestionList";
import { fetchCategories, fetchQuestionsByCategory } from "../Questions/questionList"

const mapStateToProps = state => {

  return {
    categories: Object.values(state.categories)
  };
};

const mapDispatchToProps = dispatch => {

  return {
    fetchCategories: () => dispatch(fetchCategories())
  };
};

export default connect (
  mapStateToProps,
  mapDispatchToProps
) (QuestionList);
