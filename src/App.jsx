import React from 'react';
import './assets/styles/style.css';
import defaultDataset from './dataset';
import { AnswersList, Chats } from './components/index';
import FormDialog from './components/Forms/FormDialog';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      answers: [],
      chats: [],
      currentId: 'init',
      dataset: defaultDataset,
      open: false,
    };
    this.selectAnswer = this.selectAnswer.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  displayNextQuestion = (nextQuestionId) => {
    const chats = this.state.chats;
    chats.push({
      text: this.state.dataset[nextQuestionId].question,
      type: 'question'
    })

    this.setState({
      answers: this.state.dataset[nextQuestionId].answers,
      chats: chats,
      currentId: nextQuestionId
    })
  }

  selectAnswer = (selectedAnswer, nextQuestionId) => {
    switch (true) {
      case (nextQuestionId === 'init'):
        setTimeout(() => this.displayNextQuestion(nextQuestionId),500);
        break;
      
      case (nextQuestionId === 'contact'):
        this.handleClickOpen();
        break;
      
      case (/^https:*/.test(nextQuestionId)):
        // 「a」タグのDOM要素を生成し、変数に格納する
        const a = document.createElement('a');
        a.href = nextQuestionId;
        // 別タブで表示する
        a.target = '_blank';
        a.click();
        break;
      
      default:
        const chats = this.state.chats;
        chats.push({
          text: selectedAnswer,
          type: 'answer'
        })

        this.setState({
          chats: chats
        })
        // 応答時間を遅延させることでチャットっぽい挙動に見せる
        setTimeout(() => this.displayNextQuestion(nextQuestionId), 1000);
        break;
        
    }

  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  componentDidMount() {
    const initAnswer = "";
    this.selectAnswer(initAnswer, this.state.currentId);
  }

  // 最新のチャットが見えるようにスクロール位置の頂点（最新のチャット）をスクロール領域の最下部に設定する
  componentDidUpdate() {
    const scrollArea = document.getElementById('scroll-area');
    if (scrollArea) {
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }

  render(){
    return (
      <section className="c-section">
        <div className="c-box">
          <Chats chats={this.state.chats} />
          <AnswersList answers={this.state.answers} select={this.selectAnswer} />
          < FormDialog open={this.state.open} handleClose={this.handleClose} />
        </div>
      </section>
    );
  }
}
