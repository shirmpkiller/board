// import React, { useEffect, useCallback, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// //import Moment from 'react-moment';
// import moment from 'moment';
// import Link from 'next/link';
// import { Avatar, Button, Card, Comment, Form, Icon, Input, List, Popover, Row, Col } from 'antd';
// import { NewButton } from '../components/styles/userprofileStyle';

// import {
//   ADD_COMMENT_REQUEST,
//   REMOVE_COMMENT_REQUEST,
// } from '../reducers/post';

// const ReCommentList = () => {
//   ///  const [commentFormOpened, setCommentFormOpened] = useState(false);
//   const [commentText, setCommentText] = useState('');
//   const { me } = useSelector(state => state.user);
//   const { commentAdded, isAddingComment, singlePost } = useSelector(state => state.post);
//   const dispatch = useDispatch();
//   const onSubmitComment = useCallback(() => {
//     if (!me) {
//       return alert('로그인이 필요합니다.');
//     }
//     return dispatch({
//       type: ADD_COMMENT_REQUEST,
//       data: {
//         postId: singlePost.id,
//         content: commentText,
//       },
//     });
//   }, [me && me.id, commentText]);

//   useEffect(() => {
//     setCommentText('');
//   }, [commentAdded === true]);

//   const onChangeCommentText = useCallback((e) => {
//     setCommentText(e.target.value);
//   }, []);
//   const deleteCommentFunc = (commentId) => () => {
//     console.log(commentId);
//     return dispatch({
//       type: REMOVE_COMMENT_REQUEST,
//       data: commentId,
//     });
//   };
//   return (
//     <div>
//       <>
//         <List
//           itemLayout="horizontal"
//           dataSource={singlePost.Comments.Recommenters || []}
//           renderItem={item => (
//             <li>
//               <Row gutter={8} >
//                 <Col md={{ span: 22 }} >
//                   <Comment
//                     author={item.User.nickname}
//                     avatar={(
//                       <Link href={{ pathname: '/user', query: { id: item.User.id } }} as={`/user/${item.User.id}`}>
//                         <a><Avatar>{item.User.nickname[0]}</Avatar></a>
//                       </Link>
//                     )}
//                     datetime={moment(moment()).isBefore(moment(item.createdAt).add(1, 'days'), 'date') ? moment(item.createdAt).format('hh:mm a')
//                       : moment(item.createdAt).format('YYYY-MM-DD')}

//                     content={item.content}
//                   />
//                 </Col>
//                 <Col md={{ span: 1 }}>
//                   {me.id == item.UserId ?
//                     <div style={{ float: 'right' }}> <NewButton type='link' danger='true' onClick={deleteCommentFunc(item.id)}>삭제</NewButton></div>
//                     :
//                     null
//                   }
//                 </Col>
//               </Row>
              
//             </li>
//           )}
//         />
//       </>
//     </div>
//   );
// }

// export default ReCommentList;


