module.exports = timeString => {
    const date = new Date(timeString)

    const options = {
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: 'numeric',
        hour12: false,
    }

    return new Intl.DateTimeFormat('ru-RU', options).format(date)
}