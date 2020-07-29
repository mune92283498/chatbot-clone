import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Harinezumi from '../assets/img/hedgehog.jpg';
import Pengin from '../assets/img/animal_penguin.png';

const Chat = (props) => {
  // ()をつけて条件式にして変数に代入すると、真偽値となる
  const isQuestion = (props.type === 'question');
  const classes = isQuestion ? 'p-chat__row' : 'p-chat__reverse';

  return (
    <ListItem className={classes}>
      <ListItemAvatar>
        {isQuestion ? (
          <Avatar alt="icon" src={Harinezumi} />
        ) : (
            <Avatar alt="icon" src={Pengin} />
        )}
      </ListItemAvatar>
      <div className="p-chat__bubble">{props.text}</div>
    </ListItem>
  )
}
export default Chat;