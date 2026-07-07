import { IoTimeOutline, IoCheckmarkOutline, IoCheckmarkDoneOutline, IoAlertCircleOutline } from 'react-icons/io5';

export default function MessageStatus({ status }) {
  const size = 12;
  
  switch (status) {
    case 'sending':
      return <IoTimeOutline size={size} color="var(--color-on-surface-variant)" />;
    case 'sent':
      return <IoCheckmarkOutline size={size} color="var(--color-on-surface-variant)" />;
    case 'delivered':
      return <IoCheckmarkDoneOutline size={size} color="var(--color-on-surface-variant)" />;
    case 'read':
      return <IoCheckmarkDoneOutline size={size} color="var(--color-secondary)" />;
    case 'failed':
      return <IoAlertCircleOutline size={size} color="var(--color-error)" />;
    default:
      return null;
  }
}
