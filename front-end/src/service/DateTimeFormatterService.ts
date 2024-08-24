export const formatDate = (date: Date): string => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const month = date.getMonth() + 1;
    return date.getDate() + '-' +
        (month.toString().length === 1 ? '0' + month : month) + '-' +
        date.getFullYear() + ' ' +
        (hours.toString().length === 1 ? '0' + hours : hours) + ':' +
        (minutes.toString().length === 1 ? minutes + '0' : minutes);
};