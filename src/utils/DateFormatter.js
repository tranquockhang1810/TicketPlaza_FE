import dayjs from 'dayjs';

export const formatDate = (date, format) => {
  return dayjs(date).format(format);
};

export const formatRangeDate = ( item, record) => {
  if(record?.durationDate !== 0) {
    const endDate = dayjs(record?.date).add(record?.durationDate, 'day');
    return `${formatDate(record?.date, DateFormat)} - ${formatDate(endDate, DateFormat)}`
  };
  return formatDate(record?.date, DateTimeFormat)
}

export const dateWithUct = (date, dataType) => {
  if(dataType === 'range') {
    const formattedDate = dayjs(date).startOf('day');
    return formattedDate.format('YYYY-MM-DDTHH:mm:ss.SSSZ');
  }
  if(Array.isArray(date)) {
    const formattedDate = dayjs(date[0]).startOf('day');
    return formattedDate.format('YYYY-MM-DDTHH:mm:ss.SSSZ');
  }
  return dayjs(date).format('YYYY-MM-DDTHH:mm:ss.SSSZ')
};

export const getDiffDate = (start, end) => {
  const startDate = dayjs(start).startOf('day');
  const endDate = dayjs(end).startOf('day'); 
  return endDate.diff(startDate, 'day');
}

export const DateTimeFormat = "DD/MM/YYYY | HH:mm";

export const DateFormat = 'DD/MM/YYYY';

export const MonthFormat = 'MM/YYYY';

export const YearFormat = 'YYYY';

