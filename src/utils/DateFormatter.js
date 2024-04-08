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

export const dateWithUct = (date) => {
  return dayjs(date).format('YYYY-MM-DDTHH:mm:ss.SSSZ')
};

export const DateTimeFormat = "DD/MM/YYYY | HH:mm";

export const DateFormat = 'DD/MM/YYYY';

