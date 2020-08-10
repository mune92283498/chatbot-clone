import React, {useState, useEffect, useCallback} from 'react';
import './assets/styles/style.css';
import { AnswersList, Chats } from './components/index';
import FormDialog from './components/Forms/FormDialog';
import { db } from './firebase/index';

const App = () => {
  // answerのuseStateには初期値がセットされるので、空の配列にする
  const [answers, setAnswers] = useState([]);
  const [chats, setChats] = useState([]);
  const [currentId, setCurrentId] = useState("init");
  const [dataset, setDataset] = useState({});
  const [open, setOpen] = useState(false);

  // 「handleClickOpen」は子コンポーネントにpropsを渡していないため、useCallbackは不要
  const handleClickOpen = () => {
    setOpen(true)
  };

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [setOpen]);

  const addChats = (chat) => {
    // setStateで作成した配列やオブジェクトは、「前回のstate」を引数として受け取ることができる
    setChats(prevChats => {
      return [...prevChats, chat]
    })
  }

 const displayNextQuestion = (nextQuestionId, nextDataset) => {
    addChats({
      text: nextDataset.question,
      type: 'question'
    })

    setAnswers(nextDataset.answers)
    setCurrentId(nextQuestionId)
  }

 const selectAnswer = (selectedAnswer, nextQuestionId) => {
    switch (true) {
      case (nextQuestionId === 'contact'):
        handleClickOpen();
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
        addChats({
          text: selectedAnswer,
          type: 'answer'
        })

        // 応答時間を遅延させることでチャットっぽい挙動に見せる
        setTimeout(() => displayNextQuestion(nextQuestionId, dataset[nextQuestionId]), 500);
        break;
    }

 }
  
  useEffect(() => {
    (async () => {
      const initDataset = {};
      // 非同期処理
      await db.collection('questions').get().then(snapshots => {
        snapshots.forEach(doc => {
          const id = doc.id
          const data = doc.data()
          initDataset[id] = data
        })
      })
      
      setDataset(initDataset)
      displayNextQuestion(currentId, initDataset[currentId])
    })()
  }, [])

  // 最新のチャットが見えるようにスクロール位置の頂点（最新のチャット）をスクロール領域の最下部に設定する
  useEffect(()=>{
    const scrollArea = document.getElementById('scroll-area');
    if (scrollArea) {
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  })

  return (
    <section className="c-section">
      <div className="c-box">
        <Chats chats={chats} />
        <AnswersList answers={answers} select={selectAnswer} />
        < FormDialog open={open} handleClose={handleClose} />
      </div>
    </section>
  );
}

export default App;