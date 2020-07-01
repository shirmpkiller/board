import React from 'react';
import { useSelector } from 'react-redux';
import { Avatar, Card,Row,Col,Divider } from 'antd';
import { LOAD_USER_COMMENTPOSTS_REQUEST } from '../reducers/post';
import { LOAD_USER_REQUEST } from '../reducers/user';
import PostCard from '../containers/PostCard';
import LoginForm from '../containers/LoginForm';
import UserProfile from '../containers/UserProfile';
const Usercomment = () => {
  const { commentList} = useSelector(state => state.post);
  const { me } = useSelector(state => state.user);

  return (
    <div style={{marginTop:15}}>
       <Row gutter={8} >
            <Col xs={{span:22, offset:1}} md={{span:3,offset:1}} >
           
            {me//로그인한 상황이면 userprofile을 보여주고 아니면 loginform
              ? <UserProfile />
              : <LoginForm />}
            </Col>
            <Col xs={{span:22, offset:1}} md={{span:15}} >
            <Divider orientation="left">{me.nickname}님이 댓글 단 글</Divider>
            {commentList.map(c => (
              <PostCard key={c.Post.id} post={c.Post} />
            ))}
         </Col>
          </Row>
      
     
    </div>
  );
};

Usercomment.getInitialProps = async (context) => { //getInitialProps가 서버쪽에서도 실행되고 프런트에서도 실행됨
   /*async함수라 하는데 이유 없음 context는 app.js에서 넣어주는 context.ctx //app.js에서 awiat.Component.getInitialProps(ctx)라고 돼
  있는데 여기서 Component가 index.js기 때문에 ctx넣어준게 여기서 context가 되는 것*/
  const id = parseInt(context.query.id, 10);//서버쪽에서는 처음으로 이 페이지를 불러올 때 실행됨//10왜 넣는지 설명안함
//프론트에서는 next router로 페이지 넘나들때 프론트에서 실행됨
  context.store.dispatch({//context의 키중에 store(리덕스 스토어)가 있는데 store안에는 dispatch,getstate(리덕스 스테이트를 가져올수있는)등이 있다
    type: LOAD_USER_REQUEST,
    data: id,
  });
  context.store.dispatch({
    type: LOAD_USER_COMMENTPOSTS_REQUEST,
    data: id,
  });
  return { id };
};

export default Usercomment;
