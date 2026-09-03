export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value || 0);
}

export function formatDateBR(dateString: string): string {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  if (!year || !month || !day) return dateString;
  return `${day}/${month}/${year}`;
}

export function formatDateLongBR(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString + 'T00:00:00');
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

export function getDaysRemaining(dueDateStr: string): { days: number; text: string; isOverdue: boolean } {
  if (!dueDateStr) return { days: 0, text: '', isOverdue: false };
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDateStr + 'T00:00:00');
  
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return { days: 0, text: 'Vence Hoje', isOverdue: false };
  } else if (diffDays < 0) {
    return { days: Math.abs(diffDays), text: `Vencido há ${Math.abs(diffDays)} dia(s)`, isOverdue: true };
  } else {
    return { days: diffDays, text: `Vence em ${diffDays} dia(s)`, isOverdue: false };
  }
}
