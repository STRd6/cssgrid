style = document.createElement "style"
style.innerText = require "./style"
document.head.appendChild style

document.body.appendChild require('./layout')()
