import {showContent, addBtn} from './dom';
import {log} from './log';
const handleClick = () => {
  import(/* webpackChunkName: "async" */"./async").then(({content}) => {
    log("main");
    showContent(content);
  });
};

addBtn(handleClick);