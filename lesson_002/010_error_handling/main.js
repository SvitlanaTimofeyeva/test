// Когда экземпляр EventEmitter встречает любую ошибку, он генерирует событие 'error'  

// в nodejs принято устанавливать обработчик на событие error,
// так как необработанные ошибки прекращают выполнение node приложения 
emitter.on('error', (err) => {
    console.log(err.message) // вывод текста ошибки на экран
});


// генерация события ошибки
emitter.emit('error', new Error('Something went wrong!'));

