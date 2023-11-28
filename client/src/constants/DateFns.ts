import i18n from "../i18n";
export const convertToDataString = (timeValue: String) => {

    const year = Number('20' + timeValue.slice(0, 2));
    const month = Number(timeValue.slice(2, 4));
    const day = Number(timeValue.slice(4, 6));
    const hour = Number(timeValue.slice(6, 8));
    const minute = Number(timeValue.slice(8, 10));
    const second = Number(timeValue.slice(10));

    // Create a Date object using the extracted values
    const date = new Date(year, month - 1, day, hour, minute, second);

    // Format the date as 'MMM DD, YYYY, h:mm:ss A'
    const localeString = i18n.resolvedLanguage === 'ko' ? 'ko-KR' : 'en-US';
    const dateString = date.toLocaleString(localeString, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
    });

    return dateString;
}

export const getDateStringForTable = (timeValue: Date) => {
    const yearString = timeValue.getFullYear().toString().slice(2, 4);
    const month = timeValue.getMonth() + 1;
    const monthString = month < 10 ? '0' + month.toString() : month.toString();
    const date = timeValue.getDate();
    const dateString = date < 10 ? '0' + date.toString() : date.toString();
    const hour = timeValue.getHours();
    const hourString = hour < 10 ? '0' + hour.toString() : hour.toString();
    const minute = timeValue.getMinutes();
    const minuteString = minute < 10 ? '0' + minute.toString() : minute.toString();
    const second = timeValue.getSeconds();
    const secondString = second < 10 ? '0' + second.toString() : second.toString();
    const output = yearString + monthString + monthString + dateString + hourString + minuteString + secondString;
    return output;
}
export const getDateNumberForTable = (timeValue: Date) => {
    const yearValue = timeValue.getFullYear();
    const year = yearValue - Math.floor(yearValue/100)*100;
    const month = timeValue.getMonth() + 1;
    const date = timeValue.getDate();
    const hour = timeValue.getHours();
    const minute = timeValue.getMinutes();
    const second = timeValue.getSeconds();
    const output = second + minute*1e2 + hour*1e4 + date*1e6 + month*1e8 + year*1e10;
    return output;
}