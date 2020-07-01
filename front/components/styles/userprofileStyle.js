import styled from 'styled-components';
import {List,Button} from 'antd';

export const NewList = styled(List)`
&  ul {padding-inline-start: 0;
    margin-bottom: 0px;}
`;

export const NewTable = styled.table`
border: 1px solid black;

& tr,td {  border: 1px solid black;}
`;

export const NewButton = styled(Button)`
 & {border-radius :0px;}
}`;