import React, { useCallback, useState, useEffect } from 'react';
import { Button, Checkbox, Form, Input, Row, Col } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import Router from 'next/router';
import { SIGN_UP_REQUEST } from '../reducers/user';
import useInput from '../hooks/useInput';

const Signup = () => {
  const [passwordCheck, setPasswordCheck] = useState('');
  const [term, setTerm] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [termError, setTermError] = useState(false);

  const [id, onChangeId] = useInput('');
  const [nick, onChangeNick] = useInput('');
  const [password, onChangePassword] = useInput('');
  const dispatch = useDispatch();
  const { isSigningUp, me,isSignedUp } = useSelector(state => state.user);

  useEffect(() => {
    if (me) {
      alert('로그인했으니 메인페이지로 이동합니다.');
      Router.push('/');
    }
  }, [me && me.id]);

  useEffect(() => {
    if (isSignedUp) {
      Router.replace('/');
    }
  }, [isSignedUp]);
  const onSubmit = useCallback(() => {/*
    props로 전달하는 함수들은 usecallback으로 감싸줘야함 의도치않은 re-rendering을 피하기 위해서
  */
    if (password !== passwordCheck) {//비밀번호 비교가 다르면
      return setPasswordError(true);
    }
    if (!term) {//약관동의 안하면
      return setTermError(true);
    }
    return dispatch({
      type: SIGN_UP_REQUEST,
      data: {
        userId: id,
        password,
        nickname: nick,
      },
    });
  }, [id, nick, password, passwordCheck, term]);//password, passwordCheck, term 이 바뀔 때  이벤트 리스너 함수도 다시 생성됨(살짝 이해안감)
 //useCallback하면 state들도 dependency 배열에 넣어줘야함
  const onChangePasswordCheck = useCallback((e) => {
    setPasswordError(e.target.value !== password);
    setPasswordCheck(e.target.value);
  }, [password]);

  const onChangeTerm = useCallback((e) => {//state를 쓰는 게 없으면 배열은 빈칸
    setTermError(false);
    setTerm(e.target.checked);//type이 false라서 그런지 체크박스라서 그런지?
  }, []);

  if (me) { //로그인 했으면 안보여지게
    return null;
  }

  return (
    <>
    <Row>
      <Col  xs={{ span: 24 }} md={{ span: 12, offset: 6 }}>
       <Form onFinish={onSubmit} style={{ padding: 10 }}>
        <div>
          <label htmlFor="user-id">아이디</label>
          <br />
          <Input name="user-id" value={id} required onChange={onChangeId} />
        </div>
        <div>
          <label htmlFor="user-nick">닉네임</label>
          <br />
          <Input name="user-nick" value={nick} required onChange={onChangeNick} />
        </div>
        <div>
          <label htmlFor="user-password">비밀번호</label>
          <br />
          <Input name="user-password" type="password" value={password} required onChange={onChangePassword} />
        </div>
        <div>
          <label htmlFor="user-password-check">비밀번호체크</label>
          <br />
          <Input
            name="user-password-check"
            type="password"
            value={passwordCheck}
            required
            onChange={onChangePasswordCheck}
          />
          {passwordError && <div style={{ color: 'red' }}>비밀번호가 일치하지 않습니다.</div>}
        </div>
        <div>
          <Checkbox name="user-term" checked={term} onChange={onChangeTerm}>약관에 동의합니다.</Checkbox>
          {termError && <div style={{ color: 'red' }}>약관에 동의하셔야 합니다.</div>}
        </div>
        <div style={{ marginTop: 10 }}>
          <Button type="primary" htmlType="submit" loading={isSigningUp}
          /*html에 있는 타입프롭을 쓰려면 htmlType 원래는 button type='submit' */>가입하기</Button>
        </div>
      </Form>
      </Col>
    </Row>
    </>
  );
};

export default Signup;
