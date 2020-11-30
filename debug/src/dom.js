export const add = (a,b) => {
    return a+b;
};

export const showContent = (content) => {
    const div = document.createElement('div');
    div.innerText = content;
    document.body.appendChild(div);
  };

export const addBtn = (handleClick) => {
    const btn = document.createElement('button');
    btn.innerText='Click to load async.js';
    btn.onclick = handleClick;
    document.body.appendChild(btn);
};