export const date = (value: Date) => {
  const date1 = new Date(value)
  const date2 = new Date();
  // @ts-ignore
  const result = (date2 - date1);
  const seconds = Math.floor((result + 2000) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  return days > 0 ? days + '일 전' : hours > 0 ? hours + '시간 전' : minutes > 0 ? minutes + '분 전' : seconds + '초 전';
}

export const formatDate = (value: Date) => {
  const date = new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

export const formatDateExcludeTime= (value: Date) => {
  const date = new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export const currentDate = () => {
  return new Date().toLocaleString()
}

export const dateDifferenceInMinutes = (dateInitial, dateFinal) =>
  (dateFinal - dateInitial) / 60_000;