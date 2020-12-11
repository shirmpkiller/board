import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
//import Moment from 'react-moment';
import moment from 'moment';
import Link from 'next/link';
import { Avatar, Button, Card, Comment, Form, Icon, Input, List, Popover, Row, Col } from 'antd';
import { NewButton } from '../components/styles/userprofileStyle';

import {
  ADD_COMMENT_REQUEST,
  REMOVE_COMMENT_REQUEST,
} from '../reducers/post';

const RecommentList = ({parentCommentId}) => {
  ///  const [commentFormOpened, setCommentFormOpened] = useState(false);
  const [commentText, setCommentText] = useState('');
  const { me } = useSelector(state => state.user);
  const { commentAdded, isAddingComment, singlePost } = useSelector(state => state.post);
  const dispatch = useDispatch();
  
  const deleteCommentFunc = (commentId) => () => {
    console.log(commentId);
    return dispatch({
      type: REMOVE_COMMENT_REQUEST,
      data: commentId,
    });
  };
useEffect(() =>{
console.log(parentCommentId);
},[parentCommentId])

  return (
    <div>
      <>
        <List
          itemLayout="horizontal"
          dataSource={singlePost.Comments || []}
          renderItem={item => (
            <li>
                {(item.parentCommentId &&(item.parentCommentId == parentCommentId)) ?
               <Row gutter={8} >
               <Col xs={{offset:3, span:20}} sm={{offset:2,  span: 20 }} >
                 <Comment
                   author={item.User.nickname}
                   avatar={(
                     <Link href={{ pathname: '/user', query: { id: item.User.id } }} as={`/user/${item.User.id}`}>
                       <a><Avatar>{item.User.nickname[0]}</Avatar></a>
                     </Link>
                   )}
                   datetime={moment(moment()).isBefore(moment(item.createdAt).add(1, 'days'), 'date') ? moment(item.createdAt).format('hh:mm a')
                     : moment(item.createdAt).format('YYYY-MM-DD')}

                   content={item.content}
                 />
               </Col>
               <Col xs={{ span: 1 }} sm={{span : 1}}>
                 {me.id == item.UserId ?
                   <div style={{ float: 'right' }}> <NewButton type='link' danger='true' onClick={deleteCommentFunc(item.id)}>삭제</NewButton></div>
                   :
                   null
                 }
               </Col>
             </Row>
               :
               null
            }
              
              
            </li>
          )}
        />
      </>
    </div>
  );
}

export default RecommentList;


