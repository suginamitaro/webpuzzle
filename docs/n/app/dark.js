let userMod = window.matchMedia('(prefers-color-scheme: dark)').matches;
let sMode = window.sessionStorage.getItem('user');
let el = document.documentElement;

if(sMode) {
  el.setAttribute('theme', sMode);
} else {
  if(userMod == true) {
    el.setAttribute('theme', 'dark');
  } else {
    el.setAttribute('theme', 'light');
  }
}

document.getElementById("changeMode").onclick = function() {
  let nowMode = el.getAttribute('theme');
  if(nowMode == 'dark') {
    el.setAttribute('theme', 'light');
    window.sessionStorage.setItem('user', 'light');
  } else {
    el.setAttribute('theme', 'dark');
    window.sessionStorage.setItem('user', 'dark');
  }
};
