document.getElementById("main").parentNode.childNodes[0].classList.add("header_bar");
document.getElementById("main").parentNode.style = "padding: 0; margin: 0";
document.getElementById("main").parentNode.parentNode.parentNode.style = "padding: 0";

// Get references to the elements
let main = document.getElementById('main');
let main_parent = main.parentNode;
let extensions = document.getElementById('extensions');

// Add an event listener to the main element
main_parent.addEventListener('click', function(e) {
    // Check if the main element is visible
    if (main.offsetHeight > 0 && main.offsetWidth > 0) {
        extensions.style.display = 'flex';
    } else {
        extensions.style.display = 'none';
    }
});

// TESTING CODE

async function watchAndGetFirstBotMessage() {
    let lastMessageCount = 0;
  
    function stripHTMLTags(html) {
      const temporaryElement = document.createElement('div');
      temporaryElement.innerHTML = html;
      return temporaryElement.textContent || temporaryElement.innerText || '';
    }
  
    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  
    async function getFirstMessageBody() {
      const messageDivs = document.querySelectorAll('.chat .message');
      const botMessageDivs = Array.from(messageDivs).filter(messageDiv => {
        return messageDiv.querySelector('.circle-bot');
      });
      const firstBotMessageDiv = botMessageDivs[0];
  
      if (firstBotMessageDiv) {
        const messageBody = firstBotMessageDiv.querySelector('.message-body');
        let messageContent = stripHTMLTags(messageBody.innerHTML).trim();
  
        if (messageContent === 'Is typing...') {
            await sleep(50);
            getFirstMessageBody();
            return;
        }
  
        if (messageContent !== '') {
        //   console.info('Sending...', messageContent);
          window.parent.postMessage(JSON.stringify({"type": "chatResponse", "message": messageContent}), "http://localhost:9000");
        } else {
        //   console.log('Ignored message with only whitespace');
        }
      } else {
        // console.log('No message with circle-bot found');
      }
    }
  
    setInterval(() => {
      const chatDiv = document.querySelector('.chat');
      const currentMessageCount = chatDiv.querySelectorAll('.message').length;
  
      if (currentMessageCount !== lastMessageCount) {
        lastMessageCount = currentMessageCount;
        getFirstMessageBody();
      }
    }, 50);
  }
  
  // Call the watchAndGetFirstBotMessage() function to start watching the "chat" div and getting the first bot message
  watchAndGetFirstBotMessage();
  