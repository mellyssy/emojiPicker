const block = document.querySelector('.emoji-block');
const txtarea = document.querySelector('.chat_txtarea');
const placeholder = document.querySelector('.chat_placeholder');
const chatEmojiBtn = document.querySelector('.chat_emoji-btn');
const container = document.querySelector('.emoji-block_container');
const allBtn = block.querySelector('#all');
const recentBtn = block.querySelector('#recent');

const data = [];
const getEmoji = async () => {
  await fetch('./sections.json')
  .then((resp) => resp.json())
  .then((sections) => {
    data.push(...sections);
  });
};

getEmoji();

let recentEmojis = window.localStorage.getItem('recent') ? JSON.parse(window.localStorage.getItem('recent')) : [];

const insertTextAtCursor = (e) => {
  let node = document.createTextNode(e);
  let selection = window.getSelection();
  let range = selection.getRangeAt(0);
  if (range.endContainer.parentNode.className !== 'chat_txtarea') {
    placeholder.classList.add('chat_placeholder__none');
    txtarea.textContent += e;
    range.deleteContents();
    return;
  }
  range.deleteContents();
  range.insertNode(node);
  selection.modify("move", "right", "character");
}

const onEmojiClick = ({ target }) => {
  const emoji = target.textContent;
  if (!recentEmojis.includes(emoji)) {
    if (recentEmojis.length >= 25) {
      recentEmojis = [emoji, ...recentEmojis.slice(0, 24)];
    } else {
      recentEmojis = [emoji, ...recentEmojis];
    }
    localStorage.setItem('recent', JSON.stringify(recentEmojis));
  }

  insertTextAtCursor(emoji);
};

const template = (title, items) => {
  const section = document.createElement('div');
  section.classList.add('emoji-block_section');
  const sectionTitle = document.createElement('p');
  sectionTitle.textContent = title;
  sectionTitle.classList.add('emoji-block_section-title');
  section.append(sectionTitle);

  const itemsContainer = document.createElement('div');
  itemsContainer.classList.add('emoji-block_section-container');
  const itemsEls = items.map((item) => {
      const btn = document.createElement('button');
      btn.setAttribute('type', 'button');
      btn.textContent = item;
      btn.classList.add('emoji-btn');
      btn.addEventListener('click', onEmojiClick);

      return btn;
  });
  itemsContainer.append(...itemsEls);
  section.append(itemsContainer);
  return section;
};

const renderAll = () => {
  if (container.hasChildNodes()) {
    container.innerHTML = '';
  }
  const sections = data.map(({ title, items }) => template(title, items));
  container.append(...sections);
};

const renderRecent = () => {
  if (container.hasChildNodes()) {
    container.innerHTML = '';
  }

  const section = template('Часто используемые', recentEmojis);
  container.append(section);
}


chatEmojiBtn.addEventListener('click', () => {
  block.classList.toggle('emoji-block__open');
  renderAll();
});

recentBtn.addEventListener('click', () => {
  allBtn.classList.remove('emoji-block_tab__active');
  recentBtn.classList.
  add('emoji-block_tab__active');
  renderRecent(container);
})

allBtn.addEventListener('click', () => {
  recentBtn.classList.remove('emoji-block_tab__active');
  allBtn.classList.add('emoji-block_tab__active');
  renderAll();
});

txtarea.addEventListener('focusin', () => {
  placeholder.classList.add('chat_placeholder__none');
});

txtarea.addEventListener('focusout', ({ target }) => {
  if (!target.textContent.length) {
    placeholder.classList.remove('chat_placeholder__none');
  }
});
