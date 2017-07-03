const TelegramBot = require('node-telegram-bot-api');
const emoji = require('node-emoji').get;
const token = '***';
const authorChat = 173295753;

const startMenu = JSON.stringify({
  inline_keyboard: [
    [{ text: 'Информация', callback_data:'information' }],
    [{ text: 'Системы счисления', callback_data:'number' }],
    [{ text: 'Логика', callback_data:'logic' }],
    [{ text: 'Пользовательский курс', callback_data:'userCourse' }],
    [{ text: 'Алгоритмизация и программирование', callback_data:'programming' }],
    [{ text: 'Программирование (продвинутый курс)', callback_data: 'expertProgramming' }],
    [{ text: 'Задать вопрос', callback_data: 'question' }]
  ]
});

const information = JSON.stringify({
  inline_keyboard: [
    [{ text: 'Неравномерный двоичный код.', callback_data: 'presentation1.pdf' }],
    [{ text: 'Кодирование графической и звуковой информации.', callback_data: 'presentation2.pdf' }],
    [{ text: 'Кодирование. Комбинаторика.', callback_data: 'presentation3.pdf' }],
    [{ text: 'Скорость передачи информации.', callback_data: 'presentation4.pdf' }],
    [{ text: 'Определение количества информации.', callback_data: 'presentation5.pdf' }]
  ]
});

const number = JSON.stringify({
  inline_keyboard: [
    [{ text: 'Позиционные системы счисления.', callback_data: 'presentation6.pdf' }],
    [{ text: 'Перевод между системами счисления.', callback_data: 'presentation7.pdf' }],
    [{ text: 'Арифметические операции в позиционных системах счисления.', callback_data: 'presentation8.pdf' }],
    [{ text: 'Арифметика в двоичных числах', callback_data: 'presentation9.pdf' }],
    [{ text: 'Уравнения в системах счисления.', callback_data: 'presentation28.pdf' }]
  ]
});

const logic = JSON.stringify({
  inline_keyboard: [
    [{ text: 'Алгебра логики. Логические операции.', callback_data: 'presentation10.pdf' }],
    [{ text: 'Таблицы истинности.', callback_data: 'presentation11.pdf' }],
    [{ text: 'Преобразование логических выражений.', callback_data: 'presentation12.pdf' }],
    [{ text: 'Задания на тождественную истинность/ложность.', callback_data: 'presentation13.pdf' }],
    [{ text: 'Логические уравнения (объяснение).', callback_data: 'presentation14.pdf' }],
    [{ text: 'Системы лог. уравнений (задания).', callback_data: 'presentation15.pdf' }]
  ]
});

const userCourse = JSON.stringify({
  inline_keyboard: [
    [{ text: 'Операции с множествами.', callback_data: 'presentation16.pdf' }],
    [{ text: 'Поиск файлов.', callback_data: 'presentation17.pdf' }],
    [{ text: 'Базы данных.', callback_data: 'presentation18.pdf' }],
    [{ text: 'Работа с таблицами.', callback_data: 'presentation19.pdf' }],
    [{ text: 'IP адреса.', callback_data: 'presentation20.pdf' }],
    [{ text: 'Графы.', callback_data: 'presentation21.pdf' }],
  ]
});

const programming = JSON.stringify({
  inline_keyboard: [
    [{ text: 'Python 3. Цикл while', callback_data: 'presentation22.pdf' }],
    [{ text: 'Рекурсивные алгоритмы.', callback_data: 'presentation23.pdf' }],
    [{ text: 'Массивы.', callback_data: 'presentation24.pdf' }],
    [{ text: 'Исполнители.', callback_data: 'presentation26.pdf' }],
    [{ text: 'Алгоритмы для исполнителей.', callback_data: 'presentation27.pdf' }],
    [{ text: 'Угадай алгоритм.', callback_data: 'presentation29.pdf' }],
    [{ text: 'Обработка массивов.', callback_data: 'presentation30.pdf' }],
    [{ text: 'Функции.', callback_data: 'presentation31.pdf' }],
  ]
});

const expertProgramming = JSON.stringify({
  inline_keyboard: [
    [{ text: 'Поиск ошибок.', callback_data: 'presentation32.pdf' }],
    [{ text: 'Алгоритмы обработки массивов.', callback_data: 'presentation25.pdf' }],
    [{ text: 'Эффективные программы.', callback_data: 'presentation33.pdf' }],
  ]
});

const bot = new TelegramBot(token,{polling:true});

bot.on('message',msg => {
  if (/^\/(start|menu)$/.test(msg.text)) bot.sendMessage(msg.chat.id, 'Что тебе нужно'+emoji(':question:'), {reply_markup: startMenu});
  else sendToTeacher(msg.chat.id,msg.message_id);
})

bot.on('callback_query',cbQuery => {
  const data = cbQuery.data;
  const chatId = cbQuery.message.chat.id;
  const msgId = cbQuery.message.message_id;
  if (data=='information') sendPresentationList(chatId,msgId,information);
  if (data=='number') sendPresentationList(chatId,msgId,number);
  if (data=='logic') sendPresentationList(chatId,msgId,logic);
  if (data=='userCourse') sendPresentationList(chatId,msgId,userCourse);
  if (data=='programming') sendPresentationList(chatId,msgId,programming);
  if (data=='expertProgramming') sendPresentationList(chatId,msgId,expertProgramming);
  if (data=='question') bot.sendMessage(chatId,'Чтобы задать вопрос, просто напиши его здесь и я перешлю его преподавателю. Я передам всё, включая файлы и стикеры '+emoji(':blush:'));
  if(/presentation\d/.test(data)) sendPresentation(chatId,data);
  bot.answerCallbackQuery(cbQuery.id,'',false);
});

function sendPresentationList(chatId,msgId,markup) {
  bot.editMessageText(emoji(':ok_hand:')+', вот список доступных презентаций, просто выбери нужную:', {chat_id:chatId,message_id:msgId})
    .then(() =>bot.editMessageReplyMarkup(markup,{chat_id:chatId,message_id:msgId}));
}

function sendPresentation(chatId, name) {
  const path=__dirname+'/./presentations/'+name;
  bot.sendDocument(chatId,path);
  
}
function sendToTeacher(chatId, msgId) {
  bot.forwardMessage(authorChat,chatId,msgId)
    .then(() => bot.sendMessage(chatId,'Всё отлично, осталось дождаться ответа '+emoji(':smile:')));
}