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
    const dateString = date.toLocaleString('en-US', {
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