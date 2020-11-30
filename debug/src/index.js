import {showContent, addBtn} from './dom';
import {getDate} from './date';

const handleClick = () => {
  import(/* webpackChunkName: "async" */"./async").then(({content}) => {
    console.log("main",getDate());
    showContent(content);
  });
};

addBtn(handleClick);